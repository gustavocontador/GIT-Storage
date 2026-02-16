#!/usr/bin/env python3
"""
AIOS Updater v1.1 - Deterministic update script for AIOS components.

Usage:
    aios-update.py scan          <package_path>
    aios-update.py diff          <package_path> <target_path>
    aios-update.py backup        <target_path> <backup_dir>
    aios-update.py apply         <package_path> <target_path>
    aios-update.py extract       <zip_path> [--dest <dir>]
    aios-update.py update        <package_path> [--target <feature>] [--dry-run] [--force-wrappers] [--aios-root <path>]
    aios-update.py batch-update  <pkg1> <pkg2> ... [--dry-run] [--force-wrappers] [--aios-root <path>]
    aios-update.py rollback      [component] [--restore <number>] [--aios-root <path>]

Commands:
    scan         - Detect package type, version, and contents
    diff         - Compare package against installed target (hash-based)
    backup       - Create timestamped backup of target directory
    apply        - Copy new/modified files from package to target
    extract      - Extract a .zip package to .claude/inbox/
    update       - Full pipeline: scan + diff + backup + apply + wrappers + report
    batch-update - Run update pipeline for multiple packages
    rollback     - List available backups or restore from one
"""

import argparse
import hashlib
import json
import os
import re
import shutil
import sys
import zipfile
from datetime import datetime
from pathlib import Path

VERSION = "1.1.0"

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

DANGEROUS_PATHS = [
    "/", "/etc", "/usr", "/bin", "/sbin", "/var", "/tmp",
    "/System", "/Library", "/Applications",
    "C:\\Windows", "C:\\Program Files", "C:\\Program Files (x86)",
]

MANIFEST_PRIORITY = [
    "manifest.json",
    "config.yaml",
    "squad.yaml",
    "package.json",
    "version.txt",
]

COMPONENT_TYPES = {
    "squad": "squads/{name}",
    "skill": ".claude/skills/{name}",
    "expansion-pack": ".claude/expansion-packs/{name}",
    "core": ".aios-core",
    "agents": ".claude/commands/AIOS/agents",
    "orchestrator": ".claude/orchestrator",
}

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def sha256_file(filepath: Path) -> str:
    """Compute SHA-256 hash of a file."""
    h = hashlib.sha256()
    with open(filepath, "rb") as f:
        for chunk in iter(lambda: f.read(8192), b""):
            h.update(chunk)
    return h.hexdigest()


def is_dangerous_path(path: str) -> bool:
    """Check if path is a system-critical directory."""
    resolved = str(Path(path).resolve()).replace("\\", "/")
    for dp in DANGEROUS_PATHS:
        normalized = dp.replace("\\", "/")
        if resolved == normalized or resolved.startswith(normalized + "/"):
            # P2 AN-RP-01: Require depth >= 3 from dangerous root to be considered safe
            # depth 0: C:\Program Files (dangerous)
            # depth 1: C:\Program Files\SomeApp (still dangerous)
            # depth 2: C:\Program Files\SomeApp\subdir (still dangerous)
            # depth 3+: C:\Program Files\SomeApp\project\squads (safe enough)
            depth = resolved[len(normalized):].count("/")
            if depth < 3:
                return True
    # Also reject home root
    home = str(Path.home().resolve()).replace("\\", "/")
    if resolved == home:
        return True
    return False


def read_json(filepath: Path) -> dict:
    """Read and parse a JSON file."""
    with open(filepath, "r", encoding="utf-8") as f:
        return json.load(f)


def read_yaml_version(filepath: Path) -> str | None:
    """Extract version from a YAML file (simple regex, no dependency)."""
    try:
        text = filepath.read_text(encoding="utf-8")
        match = re.search(r'^version:\s*["\']?([^\s"\']+)', text, re.MULTILINE)
        if match:
            return match.group(1)
        # Also check for nested version
        match = re.search(r'^\s+version:\s*["\']?([^\s"\']+)', text, re.MULTILINE)
        if match:
            return match.group(1)
    except Exception:
        pass
    return None


def read_skillmd_version(filepath: Path) -> str | None:
    """Extract version from SKILL.md YAML front-matter."""
    try:
        text = filepath.read_text(encoding="utf-8")
        if text.startswith("---"):
            end = text.index("---", 3)
            front = text[3:end]
            match = re.search(r'^version:\s*["\']?([^\s"\']+)', front, re.MULTILINE)
            if match:
                return match.group(1)
    except Exception:
        pass
    return None


def parse_semver(version_str: str) -> tuple:
    """Parse semver string into comparable tuple. Returns (major, minor, patch, pre)."""
    if not version_str:
        return (0, 0, 0, "unknown")
    clean = version_str.lstrip("v").strip()
    match = re.match(r"(\d+)\.(\d+)\.(\d+)(?:-(.+))?", clean)
    if match:
        return (int(match.group(1)), int(match.group(2)), int(match.group(3)),
                match.group(4) or "")
    # Try partial versions
    match = re.match(r"(\d+)\.(\d+)", clean)
    if match:
        return (int(match.group(1)), int(match.group(2)), 0, "")
    match = re.match(r"(\d+)", clean)
    if match:
        return (int(match.group(1)), 0, 0, "")
    return (0, 0, 0, clean)


def compare_versions(pkg_ver: str, inst_ver: str) -> str:
    """Compare two version strings. Returns 'upgrade', 'same', or 'downgrade'."""
    p = parse_semver(pkg_ver)
    i = parse_semver(inst_ver)
    if p[:3] > i[:3]:
        return "upgrade"
    elif p[:3] == i[:3]:
        return "same"
    else:
        return "downgrade"


def check_aios_compatible(required: str, current_version: str = VERSION) -> bool:
    """P2 PV-002: Check if current AIOS version satisfies the compatibility requirement.

    Supports: '>=X.Y.Z', '>X.Y.Z', '=X.Y.Z', 'X.Y.Z' (treated as >=).
    """
    req = required.strip()
    if req.startswith(">="):
        min_ver = parse_semver(req[2:].strip())
        cur = parse_semver(current_version)
        return cur[:3] >= min_ver[:3]
    elif req.startswith(">"):
        min_ver = parse_semver(req[1:].strip())
        cur = parse_semver(current_version)
        return cur[:3] > min_ver[:3]
    elif req.startswith("="):
        exact = parse_semver(req[1:].strip())
        cur = parse_semver(current_version)
        return cur[:3] == exact[:3]
    else:
        # Bare version treated as >=
        min_ver = parse_semver(req)
        cur = parse_semver(current_version)
        return cur[:3] >= min_ver[:3]


def count_files(directory: Path) -> int:
    """Count all files recursively in a directory."""
    if not directory.is_dir():
        return 0
    return sum(1 for _ in directory.rglob("*") if _.is_file())


def collect_file_hashes(directory: Path) -> dict[str, str]:
    """Collect relative_path -> sha256 for all files in directory."""
    result = {}
    if not directory.is_dir():
        return result
    for fp in directory.rglob("*"):
        if fp.is_file():
            rel = str(fp.relative_to(directory)).replace("\\", "/")
            result[rel] = sha256_file(fp)
    return result


# ---------------------------------------------------------------------------
# Commands
# ---------------------------------------------------------------------------

def cmd_extract(zip_path: str, dest_dir: str | None = None) -> dict:
    """Extract a .zip package to a directory, returning the extraction path."""
    zp = Path(zip_path).resolve()
    if not zp.exists() or not zp.suffix.lower() == ".zip":
        print(f"ERROR: Not a valid .zip file: {zp}")
        sys.exit(1)

    if not zipfile.is_zipfile(str(zp)):
        print(f"ERROR: File is not a valid zip archive: {zp}")
        sys.exit(1)

    # Default destination: .claude/inbox/{stem}/
    if dest_dir:
        dest = Path(dest_dir).resolve()
    else:
        inbox = zp.parent
        # Try .claude/inbox/ if we're in a project
        claude_inbox = Path.cwd() / ".claude" / "inbox"
        if claude_inbox.is_dir() or (Path.cwd() / ".claude").is_dir():
            inbox = claude_inbox
        dest = inbox / zp.stem

    dest.mkdir(parents=True, exist_ok=True)

    with zipfile.ZipFile(str(zp), "r") as zf:
        zf.extractall(str(dest))

    file_count = count_files(dest)
    result = {
        "zip_path": str(zp),
        "extracted_to": str(dest),
        "file_count": file_count,
    }
    print(f"Extracted: {zp.name} -> {dest} ({file_count} files)")
    return result


def _unwrap_nested_dir(pkg: Path) -> Path:
    """Detect and unwrap nested directories (e.g., zip extracts name/name/)."""
    entries = [e for e in pkg.iterdir() if not e.name.startswith(".")]
    if len(entries) == 1 and entries[0].is_dir():
        inner = entries[0]
        # Check if inner dir has the actual content (agents, SKILL.md, squad.yaml, etc.)
        content_markers = ["squad.yaml", "config.yaml", "SKILL.md", "manifest.json",
                           "agents", "package.json"]
        inner_has_content = any((inner / m).exists() for m in content_markers)
        outer_has_content = any((pkg / m).exists() for m in content_markers)
        if inner_has_content and not outer_has_content:
            print(f"NOTE: Unwrapping nested directory: {pkg.name}/{inner.name}/")
            return inner
    return pkg


def cmd_scan(package_path: str) -> dict:
    """Scan a package and detect its type, version, and contents."""
    pkg = Path(package_path).resolve()

    if not pkg.is_dir():
        print(f"ERROR: Not a directory: {pkg}")
        sys.exit(1)

    if is_dangerous_path(str(pkg)):
        print(f"ERROR: Dangerous path rejected: {pkg}")
        sys.exit(1)

    # Unwrap nested directories (common with zip extraction)
    pkg = _unwrap_nested_dir(pkg)

    result = {
        "path": str(pkg),
        "name": pkg.name,
        "type": None,
        "version": "0.0.0-unknown",
        "manifest_source": None,
        "file_count": count_files(pkg),
        "has_manifest": False,
    }

    # 1. Check manifest.json
    manifest_path = pkg / "manifest.json"
    if manifest_path.exists():
        try:
            data = read_json(manifest_path)
            result["has_manifest"] = True
            result["manifest_source"] = "manifest.json"
            result["name"] = data.get("name") or data.get("pack", {}).get("id") or pkg.name
            result["version"] = data.get("version") or data.get("pack", {}).get("version") or "0.0.0-unknown"
            result["type"] = data.get("type")
            if not result["type"] and "pack" in data:
                result["type"] = "expansion-pack"
            if data.get("target_path"):
                result["target_path"] = data["target_path"]
            if data.get("remove"):
                result["removals"] = data["remove"]
            if data.get("wrappers"):
                result["wrappers"] = data["wrappers"]
            if data.get("post_checks"):
                result["post_checks"] = data["post_checks"]
            if data.get("aios_compatible"):
                result["aios_compatible"] = data["aios_compatible"]
            if data.get("files"):
                result["manifest_files"] = data["files"]
        except Exception as e:
            print(f"WARNING: Failed to parse manifest.json: {e}")

    # 2. Check config.yaml / squad.yaml
    for cfg_name in ["squad.yaml", "config.yaml"]:
        cfg_path = pkg / cfg_name
        if cfg_path.exists():
            ver = read_yaml_version(cfg_path)
            if ver and result["version"] == "0.0.0-unknown":
                result["version"] = ver
                result["manifest_source"] = result["manifest_source"] or cfg_name
            if not result["type"]:
                result["type"] = "squad"
            break

    # 3. Check package.json
    pkg_json = pkg / "package.json"
    if pkg_json.exists() and result["version"] == "0.0.0-unknown":
        try:
            data = read_json(pkg_json)
            result["version"] = data.get("version", "0.0.0-unknown")
            result["manifest_source"] = result["manifest_source"] or "package.json"
        except Exception:
            pass

    # 4. Check version.txt
    ver_txt = pkg / "version.txt"
    if ver_txt.exists() and result["version"] == "0.0.0-unknown":
        try:
            result["version"] = ver_txt.read_text(encoding="utf-8").strip()
            result["manifest_source"] = result["manifest_source"] or "version.txt"
        except Exception:
            pass

    # 5. Check SKILL.md
    skill_md = pkg / "SKILL.md"
    if skill_md.exists():
        if not result["type"]:
            result["type"] = "skill"
        ver = read_skillmd_version(skill_md)
        if ver and result["version"] == "0.0.0-unknown":
            result["version"] = ver
            result["manifest_source"] = result["manifest_source"] or "SKILL.md"

    # 6. Inference if type still unknown
    if not result["type"]:
        agents_dir = pkg / "agents"
        has_agents = agents_dir.is_dir() and any(agents_dir.glob("*.md"))
        has_squad_cfg = (pkg / "squad.yaml").exists() or (pkg / "config.yaml").exists()
        has_aios_core = (pkg / ".aios-core").is_dir() or any(pkg.glob("development/*"))
        has_orchestrator = (pkg / "orchestrator").is_dir()

        if has_agents and has_squad_cfg:
            result["type"] = "squad"
        elif skill_md.exists():
            result["type"] = "skill"
        elif has_aios_core:
            result["type"] = "core"
        elif has_orchestrator:
            result["type"] = "orchestrator"
        elif has_agents:
            result["type"] = "agents"
        else:
            result["type"] = "unknown"

    # Infer name from directory if it looks like "feature-name v4 date"
    if result["name"] and result["version"] == "0.0.0-unknown":
        match = re.search(r"v(\d+(?:\.\d+)*)", result["name"], re.IGNORECASE)
        if match:
            result["version"] = match.group(1)
            clean_name = re.sub(r"\s*v\d+(?:\.\d+)*\s*\d*", "", result["name"]).strip()
            if clean_name:
                result["name"] = clean_name

    return result


def cmd_diff(package_path: str, target_path: str) -> dict:
    """Compare package files against target using SHA-256 hashes."""
    pkg = Path(package_path).resolve()
    tgt = Path(target_path).resolve()

    pkg_hashes = collect_file_hashes(pkg)
    tgt_hashes = collect_file_hashes(tgt)

    new_files = []
    modified_files = []
    unchanged_files = []
    removal_candidates = []

    for rel, h in sorted(pkg_hashes.items()):
        if rel in tgt_hashes:
            if h != tgt_hashes[rel]:
                modified_files.append(rel)
            else:
                unchanged_files.append(rel)
        else:
            new_files.append(rel)

    for rel in sorted(tgt_hashes.keys()):
        if rel not in pkg_hashes:
            removal_candidates.append(rel)

    result = {
        "new": len(new_files),
        "modified": len(modified_files),
        "unchanged": len(unchanged_files),
        "candidates_for_removal": len(removal_candidates),
        "new_files": new_files,
        "modified_files": modified_files,
        "removal_candidates": removal_candidates,
    }

    return result


def cmd_backup(target_path: str, backup_dir: str) -> dict:
    """Create a timestamped backup of the target directory."""
    tgt = Path(target_path).resolve()
    bak_base = Path(backup_dir).resolve()

    if not tgt.is_dir():
        print(f"ERROR: Target directory not found: {tgt}")
        sys.exit(1)

    timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    component_name = tgt.name
    backup_path = bak_base / f"{component_name}-{timestamp}"

    backup_path.parent.mkdir(parents=True, exist_ok=True)
    shutil.copytree(tgt, backup_path)

    src_count = count_files(tgt)
    bak_count = count_files(backup_path)

    # P2 AN-CO-01: SHA-256 verify backup consistency (sample up to 10 files)
    sha_mismatches = []
    if src_count == bak_count:
        src_files = sorted(f for f in tgt.rglob("*") if f.is_file())
        sample = src_files[:10] if len(src_files) <= 10 else [src_files[i] for i in range(0, len(src_files), max(1, len(src_files) // 10))][:10]
        for sf in sample:
            rel = sf.relative_to(tgt)
            bf = backup_path / rel
            if bf.exists():
                if sha256_file(sf) != sha256_file(bf):
                    sha_mismatches.append(str(rel))

    # P0-1: Store backup metadata for reliable rollback target resolution
    meta = {
        "component": component_name,
        "target_path": str(tgt),
        "timestamp": timestamp,
        "source_files": src_count,
    }
    meta_path = backup_path / ".backup-meta.json"
    try:
        meta_path.write_text(json.dumps(meta, indent=2, ensure_ascii=False), encoding="utf-8")
    except Exception:
        pass  # Non-critical: metadata is a convenience, not a requirement

    result = {
        "backup_path": str(backup_path),
        "target_path": str(tgt),
        "source_files": src_count,
        "backup_files": bak_count,
        "integrity": "MISMATCH" if src_count != bak_count else ("SHA_MISMATCH" if sha_mismatches else "OK"),
        "sha_mismatches": sha_mismatches,
    }

    return result


def cmd_apply(package_path: str, target_path: str, cached_diff: dict | None = None) -> dict:
    """Copy new and modified files from package to target.

    Args:
        cached_diff: Pre-computed diff result to avoid double hash computation (P2-9).
    """
    pkg = Path(package_path).resolve()
    tgt = Path(target_path).resolve()

    if not pkg.is_dir():
        print(f"ERROR: Package not found: {pkg}")
        sys.exit(1)

    tgt.mkdir(parents=True, exist_ok=True)

    diff = cached_diff if cached_diff else cmd_diff(str(pkg), str(tgt))
    files_to_copy = diff["new_files"] + diff["modified_files"]

    copied = []
    errors = []

    verify_failures = []

    for rel in files_to_copy:
        src = pkg / rel
        dst = tgt / rel
        try:
            dst.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(src, dst)
            # P1-5: SHA-256 verify post-copy
            src_hash = sha256_file(src)
            dst_hash = sha256_file(dst)
            if src_hash != dst_hash:
                verify_failures.append({"file": rel, "src_hash": src_hash[:12], "dst_hash": dst_hash[:12]})
            copied.append(rel)
        except Exception as e:
            errors.append({"file": rel, "error": str(e)})

    return {
        "copied": len(copied),
        "errors": len(errors),
        "verify_failures": len(verify_failures),
        "copied_files": copied,
        "error_details": errors,
        "verify_failure_details": verify_failures,
    }


def _full_restore(backup_path: str, target_path: str) -> dict:
    """Restore target from backup using full directory copy (not diff-based).

    P0-1: Replaces the old diff-based cmd_apply rollback which could leave
    files in inconsistent state after partial failures.
    """
    bak = Path(backup_path).resolve()
    tgt = Path(target_path).resolve()

    if not bak.is_dir():
        return {"success": False, "error": f"Backup not found: {bak}"}

    try:
        # Remove current target contents (but keep the directory)
        if tgt.is_dir():
            shutil.rmtree(tgt)
        # Copy entire backup to target
        shutil.copytree(bak, tgt, ignore=shutil.ignore_patterns(".backup-meta.json"))
        restored_count = count_files(tgt)
        return {"success": True, "restored": restored_count, "error": None}
    except Exception as e:
        return {"success": False, "restored": 0, "error": str(e)}


def _render_wrapper_template(aios_root: Path, squad_name: str, agent_id: str, rel_path: str) -> str:
    """Render wrapper content from external template or fallback to built-in (P2-10)."""
    template_path = aios_root / ".claude" / "skills" / "aios-update" / "references" / "wrapper-template.md"
    if template_path.exists():
        try:
            tpl = template_path.read_text(encoding="utf-8")
            return (tpl
                    .replace("{{squad_name}}", squad_name)
                    .replace("{{agent_id}}", agent_id)
                    .replace("{{rel_path}}", rel_path))
        except Exception:
            pass
    # Fallback: built-in template
    return (
        f"<!-- {squad_name} Agent Wrapper -->\n"
        f"<!-- Invocation: /AIOS:agents:{agent_id} -->\n\n"
        f"Load and activate the agent defined in `{rel_path}`.\n\n"
        f"Read the COMPLETE file and follow ALL activation-instructions exactly as written.\n\n"
        f"ARGUMENTS: $ARGUMENTS\n"
    )


def _register_squad_in_claude_md(aios_root: Path, scan: dict, wrappers_result: dict | None):
    """Append a registration block for a new squad in CLAUDE.md if not already present."""
    claude_md = aios_root / ".claude" / "CLAUDE.md"
    if not claude_md.exists():
        print("CLAUDE.md not found, skipping auto-register.")
        return

    content = claude_md.read_text(encoding="utf-8")
    squad_name = scan["name"]

    # PV-R2-03: Robust registration detection using multiple patterns
    registration_patterns = [
        f"squads/{squad_name}/",                          # Path reference
        f"AIOS-AUTO-REGISTERED: {squad_name}",            # Auto-registration marker
        re.compile(rf'\|\s*\**{re.escape(squad_name)}\**\s*\|'),  # Markdown table entry
    ]
    for pattern in registration_patterns:
        if isinstance(pattern, str):
            if pattern in content:
                print(f"CLAUDE.md: '{squad_name}' already registered (skipped).")
                return
        else:
            if pattern.search(content):
                print(f"CLAUDE.md: '{squad_name}' already registered (skipped).")
                return

    # Build registration block
    agents = []
    if wrappers_result:
        if isinstance(wrappers_result, dict):
            agent_list = wrappers_result.get("generated", [])
            if not agent_list and wrappers_result.get("copied_files"):
                agent_list = [Path(f).stem for f in wrappers_result.get("copied_files", [])]
            agents = agent_list

    agent_count = len(agents) if agents else "?"
    version = scan.get("version", "?")

    block = (
        f"\n<!-- AIOS-AUTO-REGISTERED: {squad_name} -->\n"
        f"<!-- Added by aios-update on {datetime.now().strftime('%Y-%m-%d %H:%M')} -->\n"
        f"<!-- Squad: {squad_name} v{version} | {agent_count} agents -->\n"
        f"<!-- Config: squads/{squad_name}/squad.yaml -->\n"
        f"<!-- Agents: {', '.join(f'/AIOS:agents:{a}' for a in agents) if agents else 'see squad config'} -->\n"
        f"<!-- END AIOS-AUTO-REGISTERED: {squad_name} -->\n"
    )

    # Insert before the Resources section or at end
    marker = "## Resources"
    if marker in content:
        content = content.replace(marker, block + "\n" + marker, 1)
    else:
        content += block

    claude_md.write_text(content, encoding="utf-8")
    print(f"CLAUDE.md: registered '{squad_name}' ({agent_count} agents)")


def cmd_rollback(args) -> dict:
    """List available backups and optionally restore one."""
    aios_root = Path(args.aios_root).resolve() if args.aios_root else Path.cwd()
    backup_base = aios_root / ".claude" / "backups"
    component = getattr(args, "component", None)

    if not backup_base.is_dir():
        print("No backups directory found.")
        return {"backups": []}

    # Collect backups
    backups = []
    for d in sorted(backup_base.iterdir(), reverse=True):
        if d.is_dir() and not d.name.startswith("."):
            # Parse name: {component}-{YYYYMMDD-HHMMSS}
            match = re.match(r"^(.+)-(\d{8}-\d{6})$", d.name)
            if match:
                comp_name = match.group(1)
                timestamp = match.group(2)
                if component and comp_name != component:
                    continue
                backups.append({
                    "name": d.name,
                    "component": comp_name,
                    "timestamp": timestamp,
                    "path": str(d),
                    "file_count": count_files(d),
                })

    if not backups:
        filter_msg = f" for '{component}'" if component else ""
        print(f"No backups found{filter_msg}.")
        return {"backups": []}

    # List mode (no --restore flag)
    restore_target = getattr(args, "restore", None)
    # P1-6: --latest shortcut restores the most recent backup
    if restore_target == "latest":
        restore_target = "1"  # backups are sorted reverse chronologically, [0] is newest
    if not restore_target:
        print(f"Available backups ({len(backups)}):\n")
        for i, b in enumerate(backups):
            ts = b["timestamp"]
            formatted = f"{ts[:4]}-{ts[4:6]}-{ts[6:8]} {ts[9:11]}:{ts[11:13]}:{ts[13:15]}"
            print(f"  [{i+1}] {b['component']}  ({formatted})  {b['file_count']} files")
        print(f"\nTo restore: aios-update.py rollback [component] --restore <number|latest>")
        return {"backups": backups}

    # Restore mode
    idx = int(restore_target) - 1
    if idx < 0 or idx >= len(backups):
        print(f"ERROR: Invalid backup number. Choose 1-{len(backups)}.")
        sys.exit(1)

    selected = backups[idx]
    comp_name = selected["component"]

    # P0-1: Read target path from backup metadata if available
    target = None
    meta_path = Path(selected["path"]) / ".backup-meta.json"
    if meta_path.exists():
        try:
            meta = json.loads(meta_path.read_text(encoding="utf-8"))
            if meta.get("target_path"):
                target = Path(meta["target_path"])
                print(f"Target (from backup metadata): {target}")
        except Exception:
            pass

    # Fallback: determine target from component type
    if not target:
        for comp_type, template in COMPONENT_TYPES.items():
            candidate = aios_root / template.format(name=comp_name)
            if candidate.is_dir():
                target = candidate
                break
        if not target:
            target = aios_root / "squads" / comp_name

    print(f"Restoring: {selected['name']}")
    print(f"Target:    {target}")

    # Backup current state before restoring (safety net)
    if target.is_dir():
        safety_backup = cmd_backup(str(target), str(backup_base))
        print(f"Safety backup: {safety_backup['backup_path']}")

    # P0-1: Full restore (not diff-based)
    restore_result = _full_restore(selected["path"], str(target))
    if restore_result["success"]:
        print(f"Restored:  {restore_result['restored']} files")
    else:
        print(f"ERROR:     {restore_result['error']}")

    return {
        "restored_from": selected["name"],
        "target": str(target),
        "result": restore_result,
    }


def _make_batch_args(package_path: str, parent_args) -> object:
    """AN-R2-03: Create args object for a single package within a batch run."""
    class _BatchArgs:
        pass
    ba = _BatchArgs()
    ba.package_path = package_path
    ba.target = None
    ba.dry_run = parent_args.dry_run
    ba.force_wrappers = getattr(parent_args, "force_wrappers", False)
    ba.aios_root = parent_args.aios_root
    return ba


def _print_banner():
    """Print CLI greeting banner."""
    print(f"\n{'=' * 46}")
    print(f"  AIOS Updater v{VERSION}")
    print(f"  Deterministic update pipeline for AIOS")
    print(f"{'=' * 46}")


def cmd_update(args, _skip_banner: bool = False) -> dict:
    """Full update pipeline."""
    if not _skip_banner:
        _print_banner()
    dry_run = args.dry_run
    force_wrappers = getattr(args, "force_wrappers", False)
    aios_root = Path(args.aios_root).resolve() if args.aios_root else Path.cwd()
    target_feature = args.target

    # Phase 0: Auto-extract .zip if needed
    input_path = Path(args.package_path).resolve()
    if input_path.is_file() and input_path.suffix.lower() == ".zip":
        print(f"\n--- Phase 0: Auto-Extract ---")
        extract_result = cmd_extract(str(input_path))
        raw_package_path = extract_result["extracted_to"]
    else:
        raw_package_path = args.package_path

    # Phase 1: Scan (may unwrap nested dirs)
    scan = cmd_scan(raw_package_path)
    package_path = scan["path"]  # Use resolved path (after unwrap)
    print(f"\n--- Phase 1: Package Detection ---")
    print(f"Name:     {scan['name']}")
    print(f"Type:     {scan['type']}")
    print(f"Version:  {scan['version']}")
    print(f"Source:   {scan.get('manifest_source', 'inference')}")
    print(f"Files:    {scan['file_count']}")

    if scan["type"] == "unknown":
        print("\nERROR: Could not detect component type. Use --target to specify.")
        sys.exit(1)

    # P2 PV-002: Validate aios_compatible requirement from manifest
    if scan.get("aios_compatible"):
        compat_req = scan["aios_compatible"]
        if not check_aios_compatible(compat_req):
            print(f"\nABORT: Package requires AIOS {compat_req} but current updater is v{VERSION}.")
            print(f"  Upgrade the AIOS Updater skill before applying this package.")
            sys.exit(1)
        print(f"Compat:   AIOS {compat_req} (OK, current: v{VERSION})")

    # Determine target path
    if target_feature:
        # Manual target override
        comp_type = scan["type"]
        if comp_type in COMPONENT_TYPES:
            target = aios_root / COMPONENT_TYPES[comp_type].format(name=target_feature)
        else:
            target = aios_root / target_feature
    elif scan.get("target_path"):
        target = aios_root / scan["target_path"]
    else:
        comp_type = scan["type"]
        if comp_type in COMPONENT_TYPES:
            target = aios_root / COMPONENT_TYPES[comp_type].format(name=scan["name"])
        else:
            print(f"\nERROR: Cannot determine target path for type '{comp_type}'")
            sys.exit(1)

    # P2 AN-RP-01: Validate target path is not a system-critical directory
    if is_dangerous_path(str(target)):
        print(f"\nERROR: Target path is a system-critical directory: {target}")
        print("  Refusing to write to this location.")
        sys.exit(1)

    print(f"Target:   {target}")

    # Phase 2: Version comparison
    installed_version = "0.0.0-not-installed"
    if target.is_dir():
        for cfg_name in ["manifest.json", "squad.yaml", "config.yaml", "package.json", "version.txt"]:
            cfg = target / cfg_name
            if cfg.exists():
                if cfg_name == "manifest.json":
                    try:
                        d = read_json(cfg)
                        installed_version = d.get("version") or d.get("pack", {}).get("version") or installed_version
                    except Exception:
                        pass
                elif cfg_name in ("squad.yaml", "config.yaml"):
                    v = read_yaml_version(cfg)
                    if v:
                        installed_version = v
                elif cfg_name == "package.json":
                    try:
                        d = read_json(cfg)
                        installed_version = d.get("version", installed_version)
                    except Exception:
                        pass
                elif cfg_name == "version.txt":
                    try:
                        installed_version = cfg.read_text(encoding="utf-8").strip()
                    except Exception:
                        pass
                break
        # Also check SKILL.md
        skill_file = target / "SKILL.md"
        if skill_file.exists() and installed_version == "0.0.0-not-installed":
            v = read_skillmd_version(skill_file)
            if v:
                installed_version = v

    comparison = compare_versions(scan["version"], installed_version)

    print(f"\n--- Phase 2: Version Comparison ---")
    print(f"Installed: {installed_version}")
    print(f"Package:   {scan['version']}")
    print(f"Action:    {comparison.upper()}")

    if comparison == "downgrade":
        print("\nABORT: Package version is OLDER than installed (downgrade).")
        print(f"  Installed: {installed_version}")
        print(f"  Package:   {scan['version']}")
        print("  To force a downgrade, use --target to explicitly confirm.")
        sys.exit(1)

    # Phase 3: Diff
    print(f"\n--- Phase 3: Diff Analysis ---")
    if target.is_dir():
        diff = cmd_diff(package_path, str(target))
    else:
        # Collect all files in package for new install
        pkg_files = [
            str(f.relative_to(Path(package_path).resolve())).replace("\\", "/")
            for f in Path(package_path).resolve().rglob("*")
            if f.is_file()
        ]
        diff = {
            "new": len(pkg_files),
            "modified": 0,
            "unchanged": 0,
            "candidates_for_removal": 0,
            "new_files": pkg_files,
            "modified_files": [],
            "removal_candidates": [],
        }

    # P2 PV-003: Filter diff to only manifest-declared files when available
    if scan.get("manifest_files"):
        allowed = set(f.replace("\\", "/") for f in scan["manifest_files"])
        filtered_new = [f for f in diff["new_files"] if f in allowed]
        filtered_mod = [f for f in diff["modified_files"] if f in allowed]
        skipped = (len(diff["new_files"]) - len(filtered_new)) + (len(diff["modified_files"]) - len(filtered_mod))
        diff["new_files"] = filtered_new
        diff["modified_files"] = filtered_mod
        diff["new"] = len(filtered_new)
        diff["modified"] = len(filtered_mod)
        if skipped > 0:
            print(f"Manifest:  {len(allowed)} declared files, {skipped} undeclared skipped")

    print(f"New:       +{diff['new']}")
    print(f"Modified:  ~{diff['modified']}")
    print(f"Unchanged: ={diff['unchanged']}")
    print(f"Removable: ?{diff['candidates_for_removal']}")

    if diff["new_files"]:
        print(f"\nNew files:")
        for f in diff["new_files"][:20]:
            print(f"  + {f}")
        if len(diff["new_files"]) > 20:
            print(f"  ... and {len(diff['new_files']) - 20} more")

    if diff["modified_files"]:
        print(f"\nModified files:")
        for f in diff["modified_files"][:20]:
            print(f"  ~ {f}")
        if len(diff["modified_files"]) > 20:
            print(f"  ... and {len(diff['modified_files']) - 20} more")

    # P0-2: Abort if zero changes detected (no new or modified files)
    if target.is_dir() and diff["new"] == 0 and diff["modified"] == 0:
        print("\nABORT: No changes detected. Package is identical to installed version.")
        print("  Nothing to update. Skipping backup and apply.")
        print("  If you need to force reinstall, delete the target directory first.")
        sys.exit(0)

    if dry_run:
        # Preview wrappers that would be created
        wrapper_preview = []
        if scan["type"] == "squad":
            pkg_agents_dir = Path(package_path) / "agents"
            if pkg_agents_dir.is_dir():
                wrapper_dst = aios_root / ".claude" / "commands" / "AIOS" / "agents"
                for af in sorted(pkg_agents_dir.glob("*.md")):
                    agent_id = af.stem
                    wrapper_path = wrapper_dst / f"{agent_id}.md"
                    exists = wrapper_path.exists()
                    if not exists or force_wrappers:
                        action = "overwrite" if exists else "create"
                        wrapper_preview.append({"agent": agent_id, "action": action})
        if wrapper_preview:
            print(f"\nWrappers ({len(wrapper_preview)} planned):")
            for wp in wrapper_preview:
                symbol = "~" if wp["action"] == "overwrite" else "+"
                print(f"  {symbol} {wp['agent']}.md ({wp['action']})")
        elif scan["type"] == "squad":
            print(f"\nWrappers: all already exist (no changes)")

        print(f"\n--- DRY RUN: No changes applied ---")
        return {
            "status": "DRY_RUN",
            "scan": scan,
            "diff": diff,
            "comparison": comparison,
            "target": str(target),
            "wrapper_preview": wrapper_preview,
        }

    # Phase 4: Backup
    print(f"\n--- Phase 4: Backup ---")
    backup_base = aios_root / ".claude" / "backups"
    if target.is_dir():
        backup = cmd_backup(str(target), str(backup_base))
        print(f"Backup:    {backup['backup_path']}")
        print(f"Integrity: {backup['integrity']}")
        # P0-3: Abort if backup integrity check fails
        if backup["integrity"] != "OK":
            print(f"\nABORT: Backup integrity MISMATCH ({backup['source_files']} source vs {backup['backup_files']} backup files).")
            print("  Cannot proceed without a reliable safety net.")
            print(f"  Check disk space and permissions, then retry.")
            print(f"  Backup location: {backup['backup_path']}")
            sys.exit(1)
    else:
        backup = {"backup_path": "N/A (new install)", "integrity": "N/A"}
        print("Skipped (new install, no existing files)")

    # Phase 5: Apply (P2-9: pass cached diff to avoid double hash computation)
    print(f"\n--- Phase 5: Apply Update ---")
    apply_result = cmd_apply(package_path, str(target), cached_diff=diff)
    print(f"Copied:    {apply_result['copied']}")
    print(f"Errors:    {apply_result['errors']}")
    if apply_result.get("verify_failures", 0) > 0:
        print(f"Verify:    {apply_result['verify_failures']} file(s) failed SHA-256 post-copy check")
        for vf in apply_result.get("verify_failure_details", []):
            print(f"  VERIFY FAIL: {vf['file']} (src={vf['src_hash']}... dst={vf['dst_hash']}...)")

    if apply_result["errors"]:
        for err in apply_result["error_details"]:
            print(f"  ERROR: {err['file']} - {err['error']}")

    # P0-1: Auto-rollback on PARTIAL apply failure (full copy, not diff-based)
    total_failures = apply_result["errors"] + apply_result.get("verify_failures", 0)
    if total_failures > 0 and backup.get("backup_path") and backup["backup_path"] != "N/A (new install)":
        print(f"\n  AUTO-ROLLBACK: {total_failures} failure(s) detected. Full restore from backup...")
        restore = _full_restore(backup["backup_path"], str(target))
        if restore["success"]:
            print(f"  Restored:  {restore['restored']} files from backup")
            print(f"  Target restored to pre-update state.")
        else:
            print(f"  CRITICAL: Auto-rollback failed: {restore['error']}")
            print(f"  Manual restore needed from: {backup['backup_path']}")

    # Handle wrappers
    wrappers_result = None
    if scan.get("wrappers"):
        # P2 PV-015: Fix wrappers path resolution.
        # manifest.wrappers.source_path = subfolder in package containing wrapper files (default: "wrappers")
        # manifest.wrappers.path = destination path (kept for backward compat but NOT used as source)
        wrapper_info = scan["wrappers"]
        wrapper_src_name = wrapper_info.get("source_path", "wrappers")
        wrapper_src = Path(package_path).resolve() / wrapper_src_name
        wrapper_dst = aios_root / ".claude" / "commands" / "AIOS" / "agents"
        if wrapper_src.is_dir():
            wrappers_result = cmd_apply(str(wrapper_src), str(wrapper_dst))
            print(f"Wrappers:  {wrappers_result['copied']} updated (from {wrapper_src_name}/)")
        else:
            # Fallback: try individual files listed in wrappers.files from package root
            if wrapper_info.get("files"):
                wrapper_dst.mkdir(parents=True, exist_ok=True)
                copied = 0
                pkg_root = Path(package_path).resolve()
                for wf in wrapper_info["files"]:
                    src_file = pkg_root / wf
                    if not src_file.exists():
                        # Try in agents/ subfolder
                        src_file = pkg_root / "agents" / wf
                    if src_file.exists():
                        shutil.copy2(src_file, wrapper_dst / Path(wf).name)
                        copied += 1
                if copied:
                    wrappers_result = {"copied": copied}
                    print(f"Wrappers:  {copied} copied from manifest files list")
    elif scan["type"] == "squad":
        # Auto-generate wrappers for squad agents
        agents_dir = target / "agents"
        if agents_dir.is_dir():
            wrapper_dst = aios_root / ".claude" / "commands" / "AIOS" / "agents"
            wrapper_dst.mkdir(parents=True, exist_ok=True)
            squad_name = scan["name"]
            agent_files = sorted(agents_dir.glob("*.md"))
            generated = []
            for af in agent_files:
                agent_id = af.stem
                wrapper_path = wrapper_dst / f"{agent_id}.md"
                if not wrapper_path.exists() or force_wrappers:
                    rel_path = f"squads/{squad_name}/agents/{af.name}"
                    wrapper_content = _render_wrapper_template(
                        aios_root, squad_name, agent_id, rel_path
                    )
                    wrapper_path.write_text(wrapper_content, encoding="utf-8")
                    generated.append(agent_id)
            if generated:
                wrappers_result = {"generated": generated, "count": len(generated)}
                print(f"Wrappers:  {len(generated)} auto-generated ({', '.join(generated)})")
            else:
                print(f"Wrappers:  all already exist (skipped)")

    # Phase 6: Validation
    print(f"\n--- Phase 6: Post-Update Validation ---")
    warnings = []

    # For squads, either squad.yaml OR config.yaml is valid
    key_files_any = {
        "squad": ["squad.yaml", "config.yaml"],
    }
    key_files_all = {
        "skill": ["SKILL.md"],
        "expansion-pack": ["manifest.json"],
    }

    # "any" check: at least one must exist
    any_expected = key_files_any.get(scan["type"], [])
    if any_expected and not any((target / kf).exists() for kf in any_expected):
        warnings.append(f"Missing key file: need at least one of {', '.join(any_expected)}")

    # "all" check: every file must exist
    all_expected = key_files_all.get(scan["type"], [])
    for kf in all_expected:
        if not (target / kf).exists():
            warnings.append(f"Missing key file: {kf}")

    # AN-R2-01: Detect orphan wrappers (wrapper exists but agent definition was removed)
    if scan["type"] == "squad":
        wrapper_dir = aios_root / ".claude" / "commands" / "AIOS" / "agents"
        agents_dir = target / "agents"
        if wrapper_dir.is_dir() and agents_dir.is_dir():
            agent_ids = {af.stem for af in agents_dir.glob("*.md")}
            orphans = []
            for wf in wrapper_dir.glob("*.md"):
                # Check if wrapper references this squad
                try:
                    content = wf.read_text(encoding="utf-8")
                    if f"squads/{scan['name']}/" in content and wf.stem not in agent_ids:
                        orphans.append(wf.stem)
                except Exception:
                    pass
            if orphans:
                warnings.append(f"Orphan wrappers (no matching agent): {', '.join(orphans)}")

    if scan.get("post_checks"):
        print("Post-checks (run manually):")
        for pc in scan["post_checks"]:
            print(f"  $ {pc}")

    if warnings:
        for w in warnings:
            print(f"  WARNING: {w}")
    else:
        print("  All checks passed.")

    # Phase 7: Report
    total_failures = apply_result["errors"] + apply_result.get("verify_failures", 0)
    if total_failures == 0:
        status = "SUCCESS"
    elif backup.get("backup_path") and backup["backup_path"] != "N/A (new install)":
        status = "ROLLED_BACK"
    else:
        status = "PARTIAL"
    removals = scan.get("removals", [])

    print(f"\n{'='*46}")
    print(f"  AIOS Updater v{VERSION} — Update Report")
    print(f"{'='*46}")
    print(f"Component: {scan['name']}")
    print(f"Type:      {scan['type']}")
    print(f"Version:   {installed_version} -> {scan['version']}")
    print(f"Backup:    {backup['backup_path']}")
    print(f"Files:     +{diff['new']} ~{diff['modified']} ={diff['unchanged']} -{len(removals)}")
    print(f"Status:    {status}")
    if warnings:
        print(f"Warnings:  {'; '.join(warnings)}")
    if removals:
        print(f"Pending:   {len(removals)} file(s) marked for removal (requires confirmation)")
    print(f"{'='*46}")

    # Build result dict
    result = {
        "status": status,
        "scan": scan,
        "diff": diff,
        "backup": backup,
        "apply": apply_result,
        "wrappers": wrappers_result,
        "warnings": warnings,
        "target": str(target),
        "timestamp": datetime.now().isoformat(),
    }

    # Phase 8: Save report to update-history (#3)
    history_dir = aios_root / ".claude" / "update-history"
    history_dir.mkdir(parents=True, exist_ok=True)
    ts = datetime.now().strftime("%Y%m%d-%H%M%S")
    report_path = history_dir / f"{ts}-{scan['name']}.json"
    try:
        with open(report_path, "w", encoding="utf-8") as f:
            json.dump(result, f, indent=2, ensure_ascii=False, default=str)
        print(f"\nReport saved: {report_path}")
    except Exception as e:
        print(f"\nWARNING: Could not save report: {e}")

    # Phase 9: CLAUDE.md auto-register (#2)
    if status == "SUCCESS" and scan["type"] == "squad":
        _register_squad_in_claude_md(aios_root, scan, wrappers_result)

    return result


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(description="AIOS Updater")
    subparsers = parser.add_subparsers(dest="command", help="Command to execute")

    # scan
    p_scan = subparsers.add_parser("scan", help="Detect package type and contents")
    p_scan.add_argument("package_path", help="Path to extracted update package")

    # diff
    p_diff = subparsers.add_parser("diff", help="Compare package vs target")
    p_diff.add_argument("package_path", help="Path to update package")
    p_diff.add_argument("target_path", help="Path to installed component")

    # backup
    p_backup = subparsers.add_parser("backup", help="Create backup of target")
    p_backup.add_argument("target_path", help="Path to directory to backup")
    p_backup.add_argument("backup_dir", help="Backup destination directory")

    # apply
    p_apply = subparsers.add_parser("apply", help="Copy files from package to target")
    p_apply.add_argument("package_path", help="Path to update package")
    p_apply.add_argument("target_path", help="Path to install destination")
    p_apply.add_argument("--no-backup", action="store_true", help="Skip auto-backup before apply (dangerous)")

    # extract
    p_extract = subparsers.add_parser("extract", help="Extract a .zip package")
    p_extract.add_argument("zip_path", help="Path to .zip file")
    p_extract.add_argument("--dest", dest="dest_dir", help="Extraction destination (default: .claude/inbox/)")

    # update (full pipeline)
    p_update = subparsers.add_parser("update", help="Full update pipeline")
    p_update.add_argument("package_path", help="Path to update package (.zip or directory)")
    p_update.add_argument("--target", dest="target", help="Target feature name")
    p_update.add_argument("--dry-run", dest="dry_run", action="store_true", help="Plan only, no changes")
    p_update.add_argument("--force-wrappers", dest="force_wrappers", action="store_true", help="Overwrite existing agent wrappers")
    p_update.add_argument("--aios-root", dest="aios_root", help="AIOS project root (default: cwd)")

    # batch-update
    p_batch = subparsers.add_parser("batch-update", help="Update multiple packages at once")
    p_batch.add_argument("package_paths", nargs="+", help="Paths to update packages (.zip or directories)")
    p_batch.add_argument("--dry-run", dest="dry_run", action="store_true", help="Plan only, no changes")
    p_batch.add_argument("--force-wrappers", dest="force_wrappers", action="store_true", help="Overwrite existing agent wrappers")
    p_batch.add_argument("--aios-root", dest="aios_root", help="AIOS project root (default: cwd)")

    # rollback
    p_rollback = subparsers.add_parser("rollback", help="List or restore from backups")
    p_rollback.add_argument("component", nargs="?", help="Component name to filter (optional)")
    p_rollback.add_argument("--restore", dest="restore", help="Backup number to restore (from list)")
    p_rollback.add_argument("--aios-root", dest="aios_root", help="AIOS project root (default: cwd)")

    args = parser.parse_args()

    if not args.command:
        parser.print_help()
        sys.exit(1)

    if args.command == "scan":
        result = cmd_scan(args.package_path)
        print(json.dumps(result, indent=2, ensure_ascii=False))

    elif args.command == "diff":
        result = cmd_diff(args.package_path, args.target_path)
        print(json.dumps({
            "new": result["new"],
            "modified": result["modified"],
            "unchanged": result["unchanged"],
            "candidates_for_removal": result["candidates_for_removal"],
            "new_files": result["new_files"],
            "modified_files": result["modified_files"],
        }, indent=2, ensure_ascii=False))

    elif args.command == "backup":
        result = cmd_backup(args.target_path, args.backup_dir)
        print(json.dumps(result, indent=2, ensure_ascii=False))

    elif args.command == "apply":
        # P0-2: Auto-backup before standalone apply (safety guard)
        tgt = Path(args.target_path).resolve()
        if tgt.is_dir() and not getattr(args, "no_backup", False):
            backup_base = Path.cwd() / ".claude" / "backups"
            print(f"Auto-backup: creating safety backup before apply...")
            bk = cmd_backup(args.target_path, str(backup_base))
            print(f"Auto-backup: {bk['backup_path']} ({bk['integrity']})")
            if bk["integrity"] != "OK":
                print(f"ERROR: Backup integrity check failed. Aborting apply.")
                sys.exit(1)
        result = cmd_apply(args.package_path, args.target_path)
        print(json.dumps(result, indent=2, ensure_ascii=False))

    elif args.command == "extract":
        result = cmd_extract(args.zip_path, getattr(args, "dest_dir", None))
        print(json.dumps(result, indent=2, ensure_ascii=False))

    elif args.command == "update":
        cmd_update(args)

    elif args.command == "batch-update":
        _print_banner()
        # PV-R2-02: Warn if batch is large (>10 packages)
        pkg_count = len(args.package_paths)
        if pkg_count > 10:
            print(f"\nWARNING: Large batch detected ({pkg_count} packages).")
            print(f"  Consider using --dry-run first to preview all changes.")
        results = []
        for i, pkg_path in enumerate(args.package_paths):
            print(f"\n{'#'*50}")
            print(f"  Batch [{i+1}/{pkg_count}]: {Path(pkg_path).name}")
            print(f"{'#'*50}")
            # AN-R2-03: Use _make_batch_args helper instead of inline class
            ba = _make_batch_args(pkg_path, args)
            try:
                r = cmd_update(ba, _skip_banner=True)
                results.append({"package": pkg_path, "status": r.get("status", "UNKNOWN")})
            except SystemExit as e:
                # PV-R2-01: Capture exit code for better error reporting
                results.append({"package": pkg_path, "status": "FAILED", "exit_code": e.code})
                print(f"  FAILED: pipeline aborted (exit code: {e.code})")
            except Exception as e:
                results.append({"package": pkg_path, "status": "ERROR", "error": str(e)})
                print(f"  ERROR: {e}")

        print(f"\n{'='*50}")
        print(f"  Batch Update Summary ({len(results)} packages)")
        print(f"{'='*50}")
        for r in results:
            detail = ""
            if r.get("exit_code"):
                detail = f"  (exit: {r['exit_code']})"
            elif r.get("error"):
                detail = f"  ({r['error'][:50]})"
            print(f"  {r['status']:12s}  {Path(r['package']).name}{detail}")
        success = sum(1 for r in results if r["status"] == "SUCCESS")
        failed = sum(1 for r in results if r["status"] in ("FAILED", "ERROR"))
        print(f"\n  {success}/{len(results)} succeeded", end="")
        if failed:
            print(f", {failed} failed")
        else:
            print()

    elif args.command == "rollback":
        cmd_rollback(args)


if __name__ == "__main__":
    main()
