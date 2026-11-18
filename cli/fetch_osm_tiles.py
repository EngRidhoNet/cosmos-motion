#!/usr/bin/env python3
"""
Download & stitch real OpenStreetMap or Esri World Imagery slippy tiles
centered on (lat, lon) at a given zoom level, and record attribution in sources.json.
"""

import argparse
import io
import json
import math
import urllib.request
from pathlib import Path

from PIL import Image


def deg2num(lat_deg: float, lon_deg: float, zoom: int):
    lat_rad = math.radians(lat_deg)
    n = 2.0 ** zoom
    xtile = int((lon_deg + 180.0) / 360.0 * n)
    ytile = int((1.0 - math.asinh(math.tan(lat_rad)) / math.pi) / 2.0 * n)
    return xtile, ytile


def fetch_stitched_map(lat: float, lon: float, zoom: int, provider: str, out_path: Path, radius: int = 2):
    cx, cy = deg2num(lat, lon, zoom)
    side = (radius * 2 + 1) * 256
    canvas = Image.new("RGB", (side, side))

    headers = {"User-Agent": "CosmosMotion-OpenSource-Documentary/0.1 (https://github.com/EngRidhoNet/cosmos-motion)"}

    for dx in range(-radius, radius + 1):
        for dy in range(-radius, radius + 1):
            tx = cx + dx
            ty = cy + dy
            if provider == "esri":
                url = f"https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{zoom}/{ty}/{tx}"
            else:
                url = f"https://tile.openstreetmap.org/{zoom}/{tx}/{ty}.png"

            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=15) as resp:
                tile = Image.open(io.BytesIO(resp.read())).convert("RGB")
            px = (dx + radius) * 256
            py = (dy + radius) * 256
            canvas.paste(tile, (px, py))

    out_path.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(out_path)
    print(f"[fetch_osm_tiles] Saved {side}x{side} {provider} map to {out_path}")


def append_source(sources_path: Path, provider: str):
    if not sources_path.exists():
        data = {"sources": []}
    else:
        data = json.loads(sources_path.read_text())

    entry_id = f"map-{provider}"
    if not any(s.get("id") == entry_id for s in data.get("sources", [])):
        if provider == "esri":
            data["sources"].append({
                "id": entry_id,
                "category": "DATA PETA",
                "title": "Esri World Imagery",
                "citation": "Esri, Maxar, Earthstar Geographics, & GIS User Community",
                "url": "https://www.arcgis.com/",
                "license": "Esri Attribution",
            })
        else:
            data["sources"].append({
                "id": entry_id,
                "category": "DATA PETA",
                "title": "OpenStreetMap",
                "citation": "© OpenStreetMap contributors",
                "url": "https://www.openstreetmap.org/copyright",
                "license": "ODbL",
            })
        sources_path.write_text(json.dumps(data, indent=2) + "\n")


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--lat", type=float, required=True)
    p.add_argument("--lon", type=float, required=True)
    p.add_argument("--zoom", type=int, default=10)
    p.add_argument("--provider", choices=["osm", "esri"], default="osm")
    p.add_argument("--radius", type=int, default=2)
    p.add_argument("--out", type=Path, required=True)
    p.add_argument("--sources", type=Path)
    args = p.parse_args()

    fetch_stitched_map(args.lat, args.lon, args.zoom, args.provider, args.out, args.radius)
    if args.sources:
        append_source(args.sources, args.provider)


if __name__ == "__main__":
    main()
