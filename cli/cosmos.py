#!/usr/bin/env python3
"""
CosmosMotion CLI — Open-Source Science Documentary Engine
Usage:
  python3 cli/cosmos.py init <project_name>
  python3 cli/cosmos.py fetch <project_dir>
  python3 cli/cosmos.py align <audio.mp3> --out captions.json
  python3 cli/cosmos.py verify <project_dir>
  python3 cli/cosmos.py render <composition> --out out/video.mp4
"""

import argparse
import json
import os
import subprocess
import sys
from pathlib import Path

from verify_sources import verify_project_sources


def cmd_init(args):
    target = Path(args.name)
    if target.exists():
        print(f"[cosmos] Directory '{target}' already exists.")
        sys.exit(1)

    target.mkdir(parents=True)
    (target / "assets").mkdir()

    project_data = {
        "name": args.name,
        "title": args.title or args.name.replace("-", " ").title(),
        "fps": 30,
        "width": 1080,
        "height": 1920,
        "language": "id",
        "subtitleStyle": "treemation",
    }
    characters_data = [
        {
            "id": "narrator_scientist",
            "name": "Nikolai Vavilov",
            "era": "1887–1943",
            "preset": "nikolai_vavilov",
        }
    ]
    storyboard_data = {
        "acts": [
            {
                "id": "S01",
                "title": "Opening: Living Planet",
                "template": "RealEarth3D",
                "durationSec": 5,
                "sourceIds": ["nasa-blue-marble"],
            },
            {
                "id": "S02",
                "title": "Global Expedition Map",
                "template": "NaturalEarthMap",
                "durationSec": 5,
                "sourceIds": ["natural-earth"],
            },
        ]
    }
    sources_data = {
        "sources": [
            {
                "id": "nasa-blue-marble",
                "category": "CITRA BUMI",
                "title": "NASA Visible Earth",
                "citation": "NASA Blue Marble Next Generation",
                "url": "https://visibleearth.nasa.gov/",
                "license": "Public Domain",
            },
            {
                "id": "natural-earth",
                "category": "DATA PETA",
                "title": "Natural Earth 110m",
                "citation": "Natural Earth Vector Data (naturalearthdata.com)",
                "url": "https://www.naturalearthdata.com/",
                "license": "Public Domain",
            },
        ]
    }

    (target / "project.json").write_text(json.dumps(project_data, indent=2) + "\n")
    (target / "characters.json").write_text(json.dumps(characters_data, indent=2) + "\n")
    (target / "storyboard.json").write_text(json.dumps(storyboard_data, indent=2) + "\n")
    (target / "sources.json").write_text(json.dumps(sources_data, indent=2) + "\n")

    print(f"[cosmos] Initialized new documentary project at '{target}/'")
    print(f"  Next: python3 cli/cosmos.py verify {target}")


def cmd_verify(args):
    ok = verify_project_sources(Path(args.project_dir))
    sys.exit(0 if ok else 1)


def cmd_fetch(args):
    project_dir = Path(args.project_dir)
    storyboard_file = project_dir / "storyboard.json"
    if not storyboard_file.exists():
        print(f"[cosmos] Missing {storyboard_file}")
        sys.exit(1)

    sb = json.loads(storyboard_file.read_text())
    maps = sb.get("maps", [])
    wikimedia = sb.get("wikimediaQueries", [])

    for m in maps:
        cmd = [
            sys.executable,
            str(Path(__file__).parent / "fetch_osm_tiles.py"),
            "--lat", str(m["lat"]),
            "--lon", str(m["lon"]),
            "--zoom", str(m.get("zoom", 10)),
            "--out", str(project_dir / "assets" / m["filename"]),
            "--sources", str(project_dir / "sources.json"),
        ]
        subprocess.run(cmd, check=True)

    for q in wikimedia:
        cmd = [
            sys.executable,
            str(Path(__file__).parent / "fetch_wikimedia.py"),
            "--query", q["query"],
            "--out", str(project_dir / "assets" / q["filename"]),
            "--sources", str(project_dir / "sources.json"),
        ]
        subprocess.run(cmd, check=True)

    print("[cosmos] Asset fetch complete.")


def cmd_align(args):
    cmd = [
        sys.executable,
        str(Path(__file__).parent / "align_audio.py"),
        args.audio,
        "--out", args.out,
    ]
    if args.script:
        cmd.extend(["--script", args.script])
    subprocess.run(cmd, check=True)


def cmd_render(args):
    out_path = args.out or f"out/{args.composition}.mp4"
    os.makedirs(os.path.dirname(out_path) or ".", exist_ok=True)
    cmd = [
        "npx",
        "remotion",
        "render",
        "src/index.ts",
        args.composition,
        out_path,
        "--codec=h264",
        "--crf=18",
        "--gl=angle",
    ]
    subprocess.run(cmd, check=True)


def main():
    parser = argparse.ArgumentParser(description="CosmosMotion Science Documentary CLI")
    sub = parser.add_subparsers(dest="command", required=True)

    p_init = sub.add_parser("init", help="Create a new CosmosMotion project")
    p_init.add_argument("name", help="Directory name for the project")
    p_init.add_argument("--title", help="Documentary title")
    p_init.set_defaults(func=cmd_init)

    p_verify = sub.add_parser("verify", help="Verify sources.json & storyboard.json citations")
    p_verify.add_argument("project_dir", help="Project directory containing sources.json")
    p_verify.set_defaults(func=cmd_verify)

    p_fetch = sub.add_parser("fetch", help="Fetch OpenStreetMap/Esri tiles & Wikimedia photos")
    p_fetch.add_argument("project_dir", help="Project directory")
    p_fetch.set_defaults(func=cmd_fetch)

    p_align = sub.add_parser("align", help="Generate word timestamps & visemes from MP3")
    p_align.add_argument("audio", help="Input MP3/WAV narration audio")
    p_align.add_argument("--script", help="Optional transcript text file")
    p_align.add_argument("--out", default="captions.json", help="Output JSON file")
    p_align.set_defaults(func=cmd_align)

    p_render = sub.add_parser("render", help="Render Remotion composition to MP4")
    p_render.add_argument("composition", default="DemoDocumentary", nargs="?")
    p_render.add_argument("--out", help="Output MP4 path")
    p_render.set_defaults(func=cmd_render)

    args = parser.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
