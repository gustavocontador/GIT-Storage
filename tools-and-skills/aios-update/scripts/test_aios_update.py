#!/usr/bin/env python3
"""
Tests for aios-update.py - Core functionality validation.

Run: python -m pytest test_aios_update.py -v
  or: python test_aios_update.py
"""

import os
import sys
import shutil
import tempfile
import unittest
from pathlib import Path

# Import the module under test
sys.path.insert(0, str(Path(__file__).parent))
import importlib
mod = importlib.import_module("aios-update")


class TestSha256(unittest.TestCase):
    """Test SHA-256 hashing."""

    def test_hash_deterministic(self):
        with tempfile.NamedTemporaryFile(mode="w", suffix=".txt", delete=False) as f:
            f.write("hello world")
            f.flush()
            h1 = mod.sha256_file(Path(f.name))
            h2 = mod.sha256_file(Path(f.name))
        os.unlink(f.name)
        self.assertEqual(h1, h2)
        self.assertEqual(len(h1), 64)  # SHA-256 hex digest length

    def test_different_content_different_hash(self):
        files = []
        for content in ["aaa", "bbb"]:
            f = tempfile.NamedTemporaryFile(mode="w", suffix=".txt", delete=False)
            f.write(content)
            f.close()
            files.append(f.name)
        h1 = mod.sha256_file(Path(files[0]))
        h2 = mod.sha256_file(Path(files[1]))
        for f in files:
            os.unlink(f)
        self.assertNotEqual(h1, h2)


class TestDangerousPath(unittest.TestCase):
    """Test dangerous path detection."""

    @unittest.skipIf(sys.platform == "win32", "Unix paths don't resolve on Windows")
    def test_root_is_dangerous(self):
        self.assertTrue(mod.is_dangerous_path("/"))

    @unittest.skipIf(sys.platform == "win32", "Unix paths don't resolve on Windows")
    def test_etc_is_dangerous(self):
        self.assertTrue(mod.is_dangerous_path("/etc"))

    @unittest.skipIf(sys.platform == "win32", "Unix paths don't resolve on Windows")
    def test_usr_is_dangerous(self):
        self.assertTrue(mod.is_dangerous_path("/usr"))

    @unittest.skipIf(sys.platform != "win32", "Windows-only test")
    def test_windows_system_is_dangerous(self):
        self.assertTrue(mod.is_dangerous_path("C:\\Windows"))

    def test_home_root_is_dangerous(self):
        self.assertTrue(mod.is_dangerous_path(str(Path.home())))

    def test_project_path_is_safe(self):
        with tempfile.TemporaryDirectory() as td:
            safe = Path(td) / "my-project" / "squads" / "core-squad"
            safe.mkdir(parents=True)
            self.assertFalse(mod.is_dangerous_path(str(safe)))

    def test_deep_path_is_safe(self):
        with tempfile.TemporaryDirectory() as td:
            safe = Path(td) / "a" / "b" / "c" / "d"
            safe.mkdir(parents=True)
            self.assertFalse(mod.is_dangerous_path(str(safe)))


class TestScan(unittest.TestCase):
    """Test package scanning."""

    def test_scan_squad(self):
        with tempfile.TemporaryDirectory() as td:
            pkg = Path(td) / "test-squad"
            pkg.mkdir()
            (pkg / "squad.yaml").write_text("name: test-squad\nversion: 1.0.0\n")
            agents = pkg / "agents"
            agents.mkdir()
            (agents / "agent1.md").write_text("# Agent 1")
            result = mod.cmd_scan(str(pkg))
            self.assertEqual(result["type"], "squad")
            self.assertEqual(result["name"], "test-squad")
            self.assertGreaterEqual(result["file_count"], 2)

    def test_scan_skill(self):
        with tempfile.TemporaryDirectory() as td:
            pkg = Path(td) / "my-skill"
            pkg.mkdir()
            (pkg / "SKILL.md").write_text("# My Skill\nversion: 2.0.0\n")
            result = mod.cmd_scan(str(pkg))
            self.assertEqual(result["type"], "skill")

    def test_scan_with_manifest(self):
        with tempfile.TemporaryDirectory() as td:
            pkg = Path(td) / "my-pkg"
            pkg.mkdir()
            import json
            manifest = {"name": "manifest-pkg", "version": "3.0.0", "type": "expansion-pack"}
            (pkg / "manifest.json").write_text(json.dumps(manifest))
            result = mod.cmd_scan(str(pkg))
            self.assertEqual(result["name"], "manifest-pkg")
            self.assertEqual(result["version"], "3.0.0")
            self.assertEqual(result["type"], "expansion-pack")


class TestDiff(unittest.TestCase):
    """Test diff computation."""

    def test_new_files_detected(self):
        with tempfile.TemporaryDirectory() as td:
            pkg = Path(td) / "pkg"
            tgt = Path(td) / "tgt"
            pkg.mkdir()
            tgt.mkdir()
            (pkg / "new.txt").write_text("new content")
            result = mod.cmd_diff(str(pkg), str(tgt))
            self.assertIn("new.txt", result["new_files"])
            self.assertEqual(len(result["modified_files"]), 0)

    def test_modified_files_detected(self):
        with tempfile.TemporaryDirectory() as td:
            pkg = Path(td) / "pkg"
            tgt = Path(td) / "tgt"
            pkg.mkdir()
            tgt.mkdir()
            (pkg / "file.txt").write_text("v2")
            (tgt / "file.txt").write_text("v1")
            result = mod.cmd_diff(str(pkg), str(tgt))
            self.assertIn("file.txt", result["modified_files"])
            self.assertEqual(len(result["new_files"]), 0)

    def test_unchanged_files_detected(self):
        with tempfile.TemporaryDirectory() as td:
            pkg = Path(td) / "pkg"
            tgt = Path(td) / "tgt"
            pkg.mkdir()
            tgt.mkdir()
            (pkg / "same.txt").write_text("same")
            (tgt / "same.txt").write_text("same")
            result = mod.cmd_diff(str(pkg), str(tgt))
            self.assertEqual(result["unchanged"], 1)
            self.assertEqual(len(result["new_files"]), 0)
            self.assertEqual(len(result["modified_files"]), 0)

    def test_subdirectory_files(self):
        with tempfile.TemporaryDirectory() as td:
            pkg = Path(td) / "pkg"
            tgt = Path(td) / "tgt"
            (pkg / "sub").mkdir(parents=True)
            tgt.mkdir()
            (pkg / "sub" / "deep.txt").write_text("deep")
            result = mod.cmd_diff(str(pkg), str(tgt))
            # Normalize path separators
            new_files_normalized = [f.replace("\\", "/") for f in result["new_files"]]
            self.assertIn("sub/deep.txt", new_files_normalized)


class TestBackup(unittest.TestCase):
    """Test backup functionality."""

    def test_backup_integrity(self):
        with tempfile.TemporaryDirectory() as td:
            src = Path(td) / "source"
            src.mkdir()
            (src / "a.txt").write_text("alpha")
            sub = src / "nested"
            sub.mkdir()
            (sub / "b.txt").write_text("beta")
            backup_dir = Path(td) / "backups"
            result = mod.cmd_backup(str(src), str(backup_dir))
            self.assertEqual(result["integrity"], "OK")
            self.assertEqual(result["source_files"], 2)
            # Verify files actually exist in backup
            bp = Path(result["backup_path"])
            self.assertTrue((bp / "a.txt").exists())
            self.assertTrue((bp / "nested" / "b.txt").exists())


class TestApply(unittest.TestCase):
    """Test file application."""

    def test_apply_new_files(self):
        with tempfile.TemporaryDirectory() as td:
            pkg = Path(td) / "pkg"
            tgt = Path(td) / "tgt"
            pkg.mkdir()
            tgt.mkdir()
            (pkg / "new.txt").write_text("new content")
            result = mod.cmd_apply(str(pkg), str(tgt))
            self.assertEqual(result["copied"], 1)
            self.assertEqual(result["errors"], 0)
            self.assertTrue((tgt / "new.txt").exists())
            self.assertEqual((tgt / "new.txt").read_text(), "new content")

    def test_apply_preserves_subdirs(self):
        with tempfile.TemporaryDirectory() as td:
            pkg = Path(td) / "pkg"
            tgt = Path(td) / "tgt"
            (pkg / "sub").mkdir(parents=True)
            tgt.mkdir()
            (pkg / "sub" / "file.txt").write_text("nested")
            result = mod.cmd_apply(str(pkg), str(tgt))
            self.assertTrue((tgt / "sub" / "file.txt").exists())

    def test_apply_with_cached_diff(self):
        """P2-9: Verify cached_diff parameter works."""
        with tempfile.TemporaryDirectory() as td:
            pkg = Path(td) / "pkg"
            tgt = Path(td) / "tgt"
            pkg.mkdir()
            tgt.mkdir()
            (pkg / "a.txt").write_text("aaa")
            (pkg / "b.txt").write_text("bbb")
            # Pre-compute diff
            diff = mod.cmd_diff(str(pkg), str(tgt))
            # Apply with cached diff
            result = mod.cmd_apply(str(pkg), str(tgt), cached_diff=diff)
            self.assertEqual(result["copied"], 2)
            self.assertTrue((tgt / "a.txt").exists())
            self.assertTrue((tgt / "b.txt").exists())


class TestExtract(unittest.TestCase):
    """Test zip extraction."""

    def test_extract_zip(self):
        import zipfile
        with tempfile.TemporaryDirectory() as td:
            # Create a zip
            zip_path = Path(td) / "test.zip"
            with zipfile.ZipFile(zip_path, "w") as zf:
                zf.writestr("inner/file.txt", "zip content")
            inbox = Path(td) / "inbox"
            result = mod.cmd_extract(str(zip_path), str(inbox))
            self.assertIn("extracted_to", result)
            self.assertTrue(Path(result["extracted_to"]).exists())

    def test_extract_nonzip_fails(self):
        with tempfile.TemporaryDirectory() as td:
            fake = Path(td) / "not-a-zip.zip"
            fake.write_text("not a zip")
            inbox = Path(td) / "inbox"
            with self.assertRaises(SystemExit):
                mod.cmd_extract(str(fake), str(inbox))


class TestRenderWrapperTemplate(unittest.TestCase):
    """Test P2-10: wrapper template rendering."""

    def test_fallback_template(self):
        """When no external template exists, use built-in."""
        with tempfile.TemporaryDirectory() as td:
            aios_root = Path(td)
            result = mod._render_wrapper_template(aios_root, "core-squad", "tech-lead", "squads/core-squad/agents/tech-lead.md")
            self.assertIn("core-squad", result)
            self.assertIn("tech-lead", result)
            self.assertIn("ARGUMENTS: $ARGUMENTS", result)

    def test_external_template(self):
        """When external template exists, use it with variable substitution."""
        with tempfile.TemporaryDirectory() as td:
            aios_root = Path(td)
            tpl_dir = aios_root / ".claude" / "skills" / "aios-update" / "references"
            tpl_dir.mkdir(parents=True)
            (tpl_dir / "wrapper-template.md").write_text(
                "CUSTOM: {{squad_name}} / {{agent_id}} / {{rel_path}}"
            )
            result = mod._render_wrapper_template(aios_root, "my-squad", "my-agent", "squads/my-squad/agents/my-agent.md")
            self.assertEqual(result, "CUSTOM: my-squad / my-agent / squads/my-squad/agents/my-agent.md")


class TestFullRestore(unittest.TestCase):
    """P0-1: Test _full_restore (full copy, not diff-based)."""

    def test_restore_replaces_target_completely(self):
        """Full restore should replace ALL target contents with backup."""
        with tempfile.TemporaryDirectory() as td:
            backup = Path(td) / "backup"
            target = Path(td) / "target"
            backup.mkdir()
            target.mkdir()
            # Backup has original files
            (backup / "original.txt").write_text("original")
            (backup / "sub").mkdir()
            (backup / "sub" / "deep.txt").write_text("deep original")
            # Target has corrupted/partial state
            (target / "original.txt").write_text("CORRUPTED")
            (target / "unwanted.txt").write_text("should be removed")
            result = mod._full_restore(str(backup), str(target))
            self.assertTrue(result["success"])
            self.assertEqual(result["restored"], 2)
            # Verify target matches backup exactly
            self.assertEqual((target / "original.txt").read_text(), "original")
            self.assertEqual((target / "sub" / "deep.txt").read_text(), "deep original")
            # Unwanted file should be gone
            self.assertFalse((target / "unwanted.txt").exists())

    def test_restore_excludes_backup_meta(self):
        """Full restore should NOT copy .backup-meta.json to target."""
        with tempfile.TemporaryDirectory() as td:
            backup = Path(td) / "backup"
            target = Path(td) / "target"
            backup.mkdir()
            (backup / "file.txt").write_text("content")
            (backup / ".backup-meta.json").write_text('{"component": "test"}')
            result = mod._full_restore(str(backup), str(target))
            self.assertTrue(result["success"])
            self.assertTrue((target / "file.txt").exists())
            self.assertFalse((target / ".backup-meta.json").exists())

    def test_restore_missing_backup_fails(self):
        """Full restore should fail gracefully if backup doesn't exist."""
        with tempfile.TemporaryDirectory() as td:
            result = mod._full_restore(str(Path(td) / "nonexistent"), str(Path(td) / "target"))
            self.assertFalse(result["success"])
            self.assertIn("not found", result["error"])

    def test_restore_to_nonexistent_target(self):
        """Full restore should create target if it doesn't exist."""
        with tempfile.TemporaryDirectory() as td:
            backup = Path(td) / "backup"
            target = Path(td) / "new-target"
            backup.mkdir()
            (backup / "file.txt").write_text("content")
            result = mod._full_restore(str(backup), str(target))
            self.assertTrue(result["success"])
            self.assertTrue((target / "file.txt").exists())


class TestBackupMetadata(unittest.TestCase):
    """P0-1: Test .backup-meta.json creation during backup."""

    def test_backup_creates_metadata(self):
        """cmd_backup should create .backup-meta.json with target_path."""
        with tempfile.TemporaryDirectory() as td:
            src = Path(td) / "source"
            src.mkdir()
            (src / "file.txt").write_text("content")
            backup_dir = Path(td) / "backups"
            result = mod.cmd_backup(str(src), str(backup_dir))
            meta_path = Path(result["backup_path"]) / ".backup-meta.json"
            self.assertTrue(meta_path.exists())
            import json
            meta = json.loads(meta_path.read_text(encoding="utf-8"))
            self.assertEqual(meta["target_path"], str(src.resolve()))
            self.assertIn("timestamp", meta)
            self.assertIn("source_files", meta)


class TestUpdatePipeline(unittest.TestCase):
    """P0-3/PV-016: Integration tests for cmd_update pipeline."""

    def _make_squad_package(self, root, name="test-squad", version="2.0.0"):
        """Helper: create a minimal squad package."""
        pkg = root / name
        pkg.mkdir(parents=True, exist_ok=True)
        (pkg / "squad.yaml").write_text(f"name: {name}\nversion: {version}\n")
        agents = pkg / "agents"
        agents.mkdir(exist_ok=True)
        (agents / "agent-a.md").write_text("# Agent A v2")
        (agents / "agent-b.md").write_text("# Agent B v2")
        return pkg

    def _make_installed_squad(self, root, name="test-squad", version="1.0.0"):
        """Helper: create a minimal installed squad."""
        tgt = root / "squads" / name
        tgt.mkdir(parents=True, exist_ok=True)
        (tgt / "squad.yaml").write_text(f"name: {name}\nversion: {version}\n")
        agents = tgt / "agents"
        agents.mkdir(exist_ok=True)
        (agents / "agent-a.md").write_text("# Agent A v1")
        return tgt

    def _make_args(self, package_path, aios_root, dry_run=False, force_wrappers=False, target=None):
        """Helper: create a mock args object for cmd_update."""
        class Args:
            pass
        a = Args()
        a.package_path = str(package_path)
        a.aios_root = str(aios_root)
        a.dry_run = dry_run
        a.force_wrappers = force_wrappers
        a.target = target
        return a

    def test_update_success_new_install(self):
        """Update a squad that doesn't exist yet (fresh install)."""
        with tempfile.TemporaryDirectory() as td:
            root = Path(td)
            pkg = self._make_squad_package(root / "packages")
            args = self._make_args(pkg, root)
            result = mod.cmd_update(args, _skip_banner=True)
            self.assertEqual(result["status"], "SUCCESS")
            # Squad should be installed
            installed = root / "squads" / "test-squad"
            self.assertTrue(installed.exists())
            self.assertTrue((installed / "squad.yaml").exists())
            self.assertTrue((installed / "agents" / "agent-a.md").exists())
            self.assertTrue((installed / "agents" / "agent-b.md").exists())

    def test_update_success_upgrade(self):
        """Update an existing squad from v1 to v2."""
        with tempfile.TemporaryDirectory() as td:
            root = Path(td)
            self._make_installed_squad(root, version="1.0.0")
            pkg = self._make_squad_package(root / "packages", version="2.0.0")
            args = self._make_args(pkg, root)
            result = mod.cmd_update(args, _skip_banner=True)
            self.assertEqual(result["status"], "SUCCESS")
            # agent-b should now exist (new file in v2)
            self.assertTrue((root / "squads" / "test-squad" / "agents" / "agent-b.md").exists())
            # agent-a should be updated
            content = (root / "squads" / "test-squad" / "agents" / "agent-a.md").read_text()
            self.assertIn("v2", content)

    def test_update_dry_run(self):
        """Dry run should NOT modify any files."""
        with tempfile.TemporaryDirectory() as td:
            root = Path(td)
            installed = self._make_installed_squad(root, version="1.0.0")
            old_content = (installed / "agents" / "agent-a.md").read_text()
            pkg = self._make_squad_package(root / "packages", version="2.0.0")
            args = self._make_args(pkg, root, dry_run=True)
            result = mod.cmd_update(args, _skip_banner=True)
            self.assertEqual(result["status"], "DRY_RUN")
            # Files should NOT be changed
            self.assertEqual((installed / "agents" / "agent-a.md").read_text(), old_content)
            # agent-b should NOT exist
            self.assertFalse((installed / "agents" / "agent-b.md").exists())

    def test_update_creates_backup(self):
        """Update should create a backup before applying changes."""
        with tempfile.TemporaryDirectory() as td:
            root = Path(td)
            self._make_installed_squad(root, version="1.0.0")
            pkg = self._make_squad_package(root / "packages", version="2.0.0")
            args = self._make_args(pkg, root)
            result = mod.cmd_update(args, _skip_banner=True)
            self.assertEqual(result["status"], "SUCCESS")
            # Backup should exist
            backup_path = result["backup"]["backup_path"]
            self.assertTrue(Path(backup_path).exists())
            self.assertEqual(result["backup"]["integrity"], "OK")

    def test_update_generates_wrappers(self):
        """Squad update should auto-generate agent wrappers."""
        with tempfile.TemporaryDirectory() as td:
            root = Path(td)
            pkg = self._make_squad_package(root / "packages")
            args = self._make_args(pkg, root)
            result = mod.cmd_update(args, _skip_banner=True)
            wrapper_dir = root / ".claude" / "commands" / "AIOS" / "agents"
            self.assertTrue((wrapper_dir / "agent-a.md").exists())
            self.assertTrue((wrapper_dir / "agent-b.md").exists())

    def test_update_saves_report(self):
        """Update should save a JSON report to update-history."""
        with tempfile.TemporaryDirectory() as td:
            root = Path(td)
            pkg = self._make_squad_package(root / "packages")
            args = self._make_args(pkg, root)
            result = mod.cmd_update(args, _skip_banner=True)
            history_dir = root / ".claude" / "update-history"
            reports = list(history_dir.glob("*.json"))
            self.assertGreaterEqual(len(reports), 1)


class TestRollbackPipeline(unittest.TestCase):
    """P0-3/PV-016: Integration tests for cmd_rollback pipeline."""

    def test_rollback_restores_from_backup(self):
        """Rollback should fully restore target from backup."""
        import time
        with tempfile.TemporaryDirectory() as td:
            root = Path(td)
            # Create original squad
            squad_dir = root / "squads" / "my-squad"
            squad_dir.mkdir(parents=True)
            (squad_dir / "squad.yaml").write_text("name: my-squad\nversion: 1.0.0\n")
            agents = squad_dir / "agents"
            agents.mkdir()
            (agents / "agent-x.md").write_text("# Original Agent X")

            # Create a backup manually (simulating what cmd_update does)
            backup_base = root / ".claude" / "backups"
            backup_result = mod.cmd_backup(str(squad_dir), str(backup_base))
            self.assertEqual(backup_result["integrity"], "OK")

            # Wait to avoid timestamp collision with safety backup
            time.sleep(1.1)

            # "Corrupt" the target to simulate a failed update
            (agents / "agent-x.md").write_text("# CORRUPTED")
            (agents / "agent-y.md").write_text("# Unwanted new file")

            # Rollback
            class Args:
                pass
            args = Args()
            args.aios_root = str(root)
            args.component = "my-squad"
            args.restore = "1"
            result = mod.cmd_rollback(args)

            self.assertTrue(result["result"]["success"])
            # Target should be restored to original state
            self.assertEqual((agents / "agent-x.md").read_text(), "# Original Agent X")
            # Unwanted file should be gone
            self.assertFalse((agents / "agent-y.md").exists())

    def test_rollback_uses_backup_metadata_for_target(self):
        """Rollback should read target_path from .backup-meta.json."""
        with tempfile.TemporaryDirectory() as td:
            root = Path(td)
            # Create squad in a custom location
            custom_target = root / "custom" / "location" / "my-squad"
            custom_target.mkdir(parents=True)
            (custom_target / "squad.yaml").write_text("name: my-squad\nversion: 1.0.0\n")
            (custom_target / "data.txt").write_text("important data")

            # Create backup (will include .backup-meta.json with target_path)
            backup_base = root / ".claude" / "backups"
            backup_result = mod.cmd_backup(str(custom_target), str(backup_base))

            # Destroy target
            shutil.rmtree(custom_target)
            self.assertFalse(custom_target.exists())

            # Rollback should restore to the ORIGINAL custom location
            class Args:
                pass
            args = Args()
            args.aios_root = str(root)
            args.component = "my-squad"
            args.restore = "1"
            result = mod.cmd_rollback(args)

            self.assertTrue(result["result"]["success"])
            # Should be restored to custom location, not squads/my-squad
            self.assertTrue(custom_target.exists())
            self.assertEqual((custom_target / "data.txt").read_text(), "important data")


class TestAiosCompatible(unittest.TestCase):
    """P2 PV-002: Test aios_compatible version checking."""

    def test_compatible_gte(self):
        self.assertTrue(mod.check_aios_compatible(">=1.0.0", "1.1.0"))
        self.assertTrue(mod.check_aios_compatible(">=1.1.0", "1.1.0"))
        self.assertFalse(mod.check_aios_compatible(">=2.0.0", "1.1.0"))

    def test_compatible_gt(self):
        self.assertTrue(mod.check_aios_compatible(">1.0.0", "1.1.0"))
        self.assertFalse(mod.check_aios_compatible(">1.1.0", "1.1.0"))

    def test_compatible_exact(self):
        self.assertTrue(mod.check_aios_compatible("=1.1.0", "1.1.0"))
        self.assertFalse(mod.check_aios_compatible("=2.0.0", "1.1.0"))

    def test_compatible_bare(self):
        """Bare version treated as >=."""
        self.assertTrue(mod.check_aios_compatible("1.0.0", "1.1.0"))
        self.assertFalse(mod.check_aios_compatible("2.0.0", "1.1.0"))


class TestManifestFilesFilter(unittest.TestCase):
    """P2 PV-003: Test manifest files[] filtering in update pipeline."""

    def test_update_with_manifest_files_filters(self):
        """Only manifest-declared files should be applied."""
        import json
        with tempfile.TemporaryDirectory() as td:
            root = Path(td)
            pkg = root / "packages" / "test-squad"
            pkg.mkdir(parents=True)
            manifest = {
                "name": "test-squad",
                "version": "2.0.0",
                "type": "squad",
                "files": ["squad.yaml", "agents/agent-a.md"],
            }
            (pkg / "manifest.json").write_text(json.dumps(manifest))
            (pkg / "squad.yaml").write_text("name: test-squad\nversion: 2.0.0\n")
            agents = pkg / "agents"
            agents.mkdir()
            (agents / "agent-a.md").write_text("# Agent A")
            (agents / "agent-b.md").write_text("# Agent B - NOT in manifest")
            (pkg / "extra.txt").write_text("extra - NOT in manifest")

            class Args:
                pass
            args = Args()
            args.package_path = str(pkg)
            args.aios_root = str(root)
            args.dry_run = False
            args.force_wrappers = False
            args.target = None
            result = mod.cmd_update(args, _skip_banner=True)
            self.assertEqual(result["status"], "SUCCESS")
            installed = root / "squads" / "test-squad"
            # Declared files should exist
            self.assertTrue((installed / "squad.yaml").exists())
            self.assertTrue((installed / "agents" / "agent-a.md").exists())
            # Undeclared files should NOT exist
            self.assertFalse((installed / "agents" / "agent-b.md").exists())
            self.assertFalse((installed / "extra.txt").exists())


class TestDepthHeuristic(unittest.TestCase):
    """P2 AN-RP-01: Test strengthened depth heuristic."""

    @unittest.skipIf(sys.platform == "win32", "Unix paths")
    def test_shallow_under_dangerous_is_dangerous(self):
        """Depth < 3 under dangerous root should be rejected."""
        self.assertTrue(mod.is_dangerous_path("/usr/local"))
        self.assertTrue(mod.is_dangerous_path("/usr/local/bin"))

    @unittest.skipIf(sys.platform != "win32", "Windows-only")
    def test_shallow_program_files_is_dangerous(self):
        """C:\\Program Files\\SomeApp\\ should be dangerous (depth 1)."""
        self.assertTrue(mod.is_dangerous_path("C:\\Program Files\\SomeApp"))
        self.assertTrue(mod.is_dangerous_path("C:\\Program Files\\SomeApp\\subdir"))


class TestOrphanWrapperDetection(unittest.TestCase):
    """AN-R2-01: Test orphan wrapper detection in Phase 6."""

    def test_orphan_wrapper_detected(self):
        """Wrapper referencing removed agent should trigger warning."""
        with tempfile.TemporaryDirectory() as td:
            root = Path(td)
            # Create squad with only agent-a
            squad_dir = root / "squads" / "test-squad"
            agents_dir = squad_dir / "agents"
            agents_dir.mkdir(parents=True)
            (squad_dir / "squad.yaml").write_text("name: test-squad\nversion: 2.0.0\n")
            (agents_dir / "agent-a.md").write_text("# Agent A")

            # Create wrappers for agent-a AND agent-b (orphan)
            wrapper_dir = root / ".claude" / "commands" / "AIOS" / "agents"
            wrapper_dir.mkdir(parents=True)
            (wrapper_dir / "agent-a.md").write_text("squads/test-squad/agents/agent-a.md")
            (wrapper_dir / "agent-b.md").write_text("squads/test-squad/agents/agent-b.md")

            # Install the squad (fresh)
            pkg = root / "packages" / "test-squad"
            pkg.mkdir(parents=True)
            (pkg / "squad.yaml").write_text("name: test-squad\nversion: 2.0.0\n")
            pkg_agents = pkg / "agents"
            pkg_agents.mkdir()
            (pkg_agents / "agent-a.md").write_text("# Agent A v2")

            class Args:
                pass
            args = Args()
            args.package_path = str(pkg)
            args.aios_root = str(root)
            args.dry_run = False
            args.force_wrappers = False
            args.target = None
            result = mod.cmd_update(args, _skip_banner=True)
            # Should have a warning about orphan wrapper
            self.assertTrue(any("Orphan" in w or "orphan" in w.lower() for w in result.get("warnings", [])),
                            f"Expected orphan warning, got: {result.get('warnings', [])}")


class TestMakeBatchArgs(unittest.TestCase):
    """AN-R2-03: Test _make_batch_args helper."""

    def test_batch_args_fields(self):
        class ParentArgs:
            dry_run = True
            force_wrappers = False
            aios_root = "/tmp/test"
        ba = mod._make_batch_args("/tmp/pkg", ParentArgs())
        self.assertEqual(ba.package_path, "/tmp/pkg")
        self.assertIsNone(ba.target)
        self.assertTrue(ba.dry_run)
        self.assertFalse(ba.force_wrappers)
        self.assertEqual(ba.aios_root, "/tmp/test")


class TestRegistrationDetection(unittest.TestCase):
    """PV-R2-03: Test robust CLAUDE.md registration detection."""

    def test_detects_auto_registration_marker(self):
        """Should detect AIOS-AUTO-REGISTERED comment."""
        with tempfile.TemporaryDirectory() as td:
            root = Path(td)
            claude_md = root / ".claude" / "CLAUDE.md"
            claude_md.parent.mkdir(parents=True)
            claude_md.write_text("<!-- AIOS-AUTO-REGISTERED: my-squad -->\n## Resources\n")

            # Run update that would register
            pkg = root / "packages" / "my-squad"
            pkg.mkdir(parents=True)
            (pkg / "squad.yaml").write_text("name: my-squad\nversion: 1.0.0\n")
            agents = pkg / "agents"
            agents.mkdir()
            (agents / "agent-a.md").write_text("# A")

            class Args:
                pass
            args = Args()
            args.package_path = str(pkg)
            args.aios_root = str(root)
            args.dry_run = False
            args.force_wrappers = False
            args.target = None
            result = mod.cmd_update(args, _skip_banner=True)
            # Should NOT duplicate registration
            content = claude_md.read_text()
            count = content.count("AIOS-AUTO-REGISTERED: my-squad")
            self.assertEqual(count, 1, f"Expected 1 registration, found {count}")

    def test_detects_markdown_table_entry(self):
        """Should detect squad in markdown table format."""
        with tempfile.TemporaryDirectory() as td:
            root = Path(td)
            claude_md = root / ".claude" / "CLAUDE.md"
            claude_md.parent.mkdir(parents=True)
            claude_md.write_text("| **my-squad** | 3 agents | squads/other/ |\n## Resources\n")

            pkg = root / "packages" / "my-squad"
            pkg.mkdir(parents=True)
            (pkg / "squad.yaml").write_text("name: my-squad\nversion: 1.0.0\n")
            agents = pkg / "agents"
            agents.mkdir()
            (agents / "agent-a.md").write_text("# A")

            class Args:
                pass
            args = Args()
            args.package_path = str(pkg)
            args.aios_root = str(root)
            args.dry_run = False
            args.force_wrappers = False
            args.target = None
            result = mod.cmd_update(args, _skip_banner=True)
            content = claude_md.read_text()
            self.assertNotIn("AIOS-AUTO-REGISTERED: my-squad", content)


if __name__ == "__main__":
    unittest.main(verbosity=2)
