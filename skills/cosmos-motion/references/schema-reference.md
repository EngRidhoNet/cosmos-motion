# CosmosMotion JSON Schema Reference

## `project.json`
- `name`: Project slug
- `title`: Documentary title
- `fps`: Frames per second (default `30`)
- `width` / `height`: `1080` × `1920` (9:16 vertical)

## `sources.json`
Each entry in `sources` requires:
- `id`: Unique identifier referenced by `storyboard.json`
- `category`: `"DATA PETA" | "CITRA BUMI" | "ARSIP SEJARAH" | "SUMBER ILMIAH"`
- `title`: Short source title
- `citation`: Full bibliographic or attribution text
- `license`: Optional license string (e.g., `"Public Domain"`, `"ODbL"`, `"CC BY-SA"`)

## `storyboard.json`
Each item in `acts` requires:
- `id`: Scene ID (e.g., `"VS01"`)
- `title`: Human-readable scene title
- `template`: `"RealEarth3D" | "NaturalEarthMap" | "SlippyTileMap" | "SplitConfrontation" | "ArchivalDossier" | "MacroApparatusECU" | "DataTimelineShot"`
- `durationSec`: Planned scene duration in seconds
- `sourceIds`: Non-empty array of IDs from `sources.json`
