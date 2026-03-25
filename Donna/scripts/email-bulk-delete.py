#!/usr/bin/env python3
"""
Donna Email Bulk Cleanup — Microsoft Graph API
Deletes emails from specified senders using $batch API (20 per request).
"""

import json, os, sys, time, subprocess, urllib.parse

USER = "gustavo@oacontabil.com.br"
GRAPH = f"https://graph.microsoft.com/v1.0/users/{USER}"
BATCH_SIZE = 20
PAGE_SIZE = 999

def get_token():
    """Get token via curl using credentials from ~/.config/donna/graph-credentials.json"""
    cred_path = os.path.expanduser("~/.config/donna/graph-credentials.json")
    with open(cred_path) as f:
        creds = json.load(f)
    result = subprocess.run([
        "curl", "-s", "-X", "POST",
        f"https://login.microsoftonline.com/{creds['tenant_id']}/oauth2/v2.0/token",
        "-H", "Content-Type: application/x-www-form-urlencoded",
        "-d", f"client_id={creds['client_id']}",
        "-d", f"client_secret={creds['client_secret']}",
        "-d", "scope=https://graph.microsoft.com/.default",
        "-d", "grant_type=client_credentials"
    ], capture_output=True, text=True)
    return json.loads(result.stdout)["access_token"]

def graph_get(token, url, retries=5):
    """GET request via curl with retry on throttle"""
    for attempt in range(retries):
        result = subprocess.run(
            ["curl", "-s", "-w", "\n%{http_code}", "-H", f"Authorization: Bearer {token}", url],
            capture_output=True, text=True
        )
        output = result.stdout.strip()
        if not output:
            return None
        lines = output.rsplit("\n", 1)
        body = lines[0] if len(lines) > 1 else output
        status = lines[1] if len(lines) > 1 else "0"
        if status == "429":
            wait = 60 * (attempt + 1)  # 60s, 120s, 180s...
            print(f" [429 wait {wait}s]", end="", flush=True)
            time.sleep(wait)
            continue
        if not body.strip():
            return None
        return json.loads(body)
    return None

def graph_batch_delete(token, message_ids):
    """Delete up to 20 messages via $batch"""
    requests = []
    for i, mid in enumerate(message_ids):
        requests.append({
            "id": str(i),
            "method": "DELETE",
            "url": f"/users/{USER}/messages/{mid}"
        })
    body = json.dumps({"requests": requests})
    result = subprocess.run([
        "curl", "-s", "-X", "POST",
        "https://graph.microsoft.com/v1.0/$batch",
        "-H", f"Authorization: Bearer {token}",
        "-H", "Content-Type: application/json",
        "-d", body
    ], capture_output=True, text=True)
    if not result.stdout.strip():
        return 0
    data = json.loads(result.stdout)
    return sum(1 for r in data.get("responses", []) if r.get("status") in (200, 204))

def cleanup_sender(token, sender_email):
    """Find and delete all inbox emails from a sender"""
    total_deleted = 0
    filter_str = f"from/emailAddress/address eq '{sender_email}'"
    encoded_filter = urllib.parse.quote(filter_str)
    base_url = f"{GRAPH}/mailFolders/Inbox/messages?$filter={encoded_filter}&$select=id&$top={PAGE_SIZE}"

    passes = 0
    while passes < 100:  # safety limit
        data = graph_get(token, base_url)
        if not data or "error" in data:
            if data and "error" in data:
                print(f" [error: {data['error'].get('code', '?')}]", end="", flush=True)
            break

        messages = data.get("value", [])
        if not messages:
            break

        ids = [m["id"] for m in messages]

        # Delete in batches of 20 with delay between batches
        for i in range(0, len(ids), BATCH_SIZE):
            chunk = ids[i:i + BATCH_SIZE]
            ok = graph_batch_delete(token, chunk)
            total_deleted += ok
            time.sleep(0.5)  # 500ms between batch deletes

        passes += 1
        time.sleep(1)  # 1s between pages

    return total_deleted

def main():
    if len(sys.argv) < 2:
        print("Usage: python3 email-bulk-delete.py <category>")
        sys.exit(1)

    category = sys.argv[1]
    script_dir = os.path.dirname(os.path.abspath(__file__))
    map_path = os.path.join(script_dir, "..", "email-cleanup-map.json")

    with open(map_path) as f:
        cleanup_map = json.load(f)

    cat_data = cleanup_map["categories"].get(category)
    if not cat_data:
        print(f"Category '{category}' not found")
        sys.exit(1)

    senders = cat_data["senders"]
    print(f"=== {category} === ({len(senders)} remetentes)")
    print(f"Ação: {cat_data['action']}")
    print()

    token = get_token()
    grand_total = 0

    for i, sender in enumerate(senders, 1):
        print(f"[{i}/{len(senders)}] {sender}...", end=" ", flush=True)
        deleted = cleanup_sender(token, sender)
        grand_total += deleted
        status = f"✓ {deleted}" if deleted > 0 else "- 0"
        print(status)

        # Refresh token every 15 senders
        if i % 15 == 0:
            token = get_token()

    print(f"\n{'='*50}")
    print(f"TOTAL {category}: {grand_total} emails deletados")

if __name__ == "__main__":
    main()
