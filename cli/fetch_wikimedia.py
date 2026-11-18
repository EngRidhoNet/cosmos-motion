#!/usr/bin/env python3
"""
Search & download Public Domain / CC BY-SA archival photographs from Wikimedia Commons
and automatically record author, license, and source URL in sources.json.
"""

import argparse
import json
import urllib.parse
import urllib.request
from pathlib import Path


def search_wikimedia_image(query: str):
    params = urllib.parse.urlencode({
        "action": "query",
        "format": "json",
        "generator": "search",
        "gsrsearch": f"filetype:bitmap {query}",
        "gsrnamespace": "6",
        "gsrlimit": "5",
        "prop": "imageinfo",
        "iiprop": "url|extmetadata|mime",
        "iiurlwidth": "1600",
    })
    url = f"https://commons.wikimedia.org/w/api.php?{params}"
    req = urllib.request.Request(
        url,
        headers={"User-Agent": "CosmosMotion-OpenSource-Documentary/0.1 (https://github.com/EngRidhoNet/cosmos-motion)"},
    )
    with urllib.request.urlopen(req, timeout=15) as resp:
        data = json.loads(resp.read().decode("utf-8"))

    pages = data.get("query", {}).get("pages", {})
    for page in pages.values():
        info_list = page.get("imageinfo", [])
        if not info_list:
            continue
        info = info_list[0]
        mime = info.get("mime", "")
        if mime not in ("image/jpeg", "image/png"):
            continue
        meta = info.get("extmetadata", {})
        return {
            "title": page.get("title", ""),
            "url": info.get("thumburl") or info.get("url"),
            "descriptionurl": info.get("descriptionurl", ""),
            "license": meta.get("LicenseShortName", {}).get("value", "Wikimedia Commons"),
            "artist": meta.get("Artist", {}).get("value", "Unknown"),
        }
    return None


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--query", required=True)
    p.add_argument("--out", type=Path, required=True)
    p.add_argument("--sources", type=Path)
    args = p.parse_args()

    result = search_wikimedia_image(args.query)
    if not result:
        print(f"[fetch_wikimedia] No bitmap match found for '{args.query}'")
        return

    args.out.parent.mkdir(parents=True, exist_ok=True)
    req = urllib.request.Request(
        result["url"],
        headers={"User-Agent": "CosmosMotion-OpenSource-Documentary/0.1"},
    )
    with urllib.request.urlopen(req, timeout=20) as resp:
        args.out.write_bytes(resp.read())

    print(f"[fetch_wikimedia] Downloaded '{result['title']}' -> {args.out}")

    if args.sources:
        data = json.loads(args.sources.read_text()) if args.sources.exists() else {"sources": []}
        data["sources"].append({
            "id": f"wiki-{args.out.stem}",
            "category": "ARSIP SEJARAH",
            "title": result["title"].replace("File:", ""),
            "citation": f"Wikimedia Commons ({result['license']})",
            "url": result["descriptionurl"],
            "license": result["license"],
        })
        args.sources.write_text(json.dumps(data, indent=2) + "\n")


if __name__ == "__main__":
    main()
