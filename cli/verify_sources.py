#!/usr/bin/env python3
"""
Source Transparency Validator for CosmosMotion.
Blocks rendering if any scene in storyboard.json lacks a valid entry in sources.json.
"""

import json
import sys
from pathlib import Path


def verify_project_sources(project_dir: Path) -> bool:
    sources_path = project_dir / "sources.json"
    storyboard_path = project_dir / "storyboard.json"

    if not sources_path.exists():
        print(f"[verify_sources] FAIL: Missing {sources_path}")
        return False
    if not storyboard_path.exists():
        print(f"[verify_sources] FAIL: Missing {storyboard_path}")
        return False

    sources_data = json.loads(sources_path.read_text())
    storyboard_data = json.loads(storyboard_path.read_text())

    source_map = {s["id"]: s for s in sources_data.get("sources", []) if "id" in s}
    if not source_map:
        print("[verify_sources] FAIL: sources.json contains zero source entries.")
        return False

    errors = []
    for s_id, entry in source_map.items():
        if not entry.get("citation"):
            errors.append(f"Source '{s_id}' is missing a 'citation' field.")
        if not entry.get("category"):
            errors.append(f"Source '{s_id}' is missing a 'category' field.")

    for act in storyboard_data.get("acts", []):
        act_id = act.get("id", "unknown")
        refs = act.get("sourceIds", [])
        if not refs:
            errors.append(f"Act '{act_id}' has no 'sourceIds' attribution.")
        for ref in refs:
            if ref not in source_map:
                errors.append(f"Act '{act_id}' references unknown sourceId '{ref}'.")

    if errors:
        print("[verify_sources] FAIL:")
        for e in errors:
            print(f"  - {e}")
        return False

    print(f"[verify_sources] PASS: {len(source_map)} sources verified across {len(storyboard_data.get('acts', []))} acts.")
    return True


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 cli/verify_sources.py <project_dir>")
        sys.exit(1)
    ok = verify_project_sources(Path(sys.argv[1]))
    sys.exit(0 if ok else 1)
