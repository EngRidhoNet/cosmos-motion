# CosmosMotion — Open-Source Science Documentary Engine

**CosmosMotion** is an open-source, code-first video engine for producing vertical (`1080×1920`) science and history documentaries inspired by ***Cosmos: A Spacetime Odyssey***—combining **Remotion (React + TypeScript)**, **Three.js 3D NASA Blue Marble Earth**, **Natural Earth (`d3-geo`)**, **OpenStreetMap / Esri World Satellite**, **2D Graphic-Novel Historical Character Rigs**, **Treemation-style Karaoke Subtitles**, and **verifiable per-scene source attributions**.

---

## Key Features

- **Real 3D Earth & Space (`@cosmos-motion/geo-space`):** Three.js WebGL globe using NASA Visible Earth *Blue Marble Next Generation* textures, atmospheric glow, cloud layer, and `(lat, lon)` coordinate pins.
- **Real Cartography (`NaturalEarthMap` & `SlippyTileMap`):** Exact coastlines via `d3-geo` + `world-atlas` 110m, animated geodesic routes, and stitched OpenStreetMap / Esri World Imagery slippy tiles.
- **Consistent 2D Graphic-Novel Characters (`@cosmos-motion/characters`):** JSON-driven `<HistoricalActor />` rig with `Front`, `3/4`, and `Profile` views, audio-reactive viseme lip-sync, secondary motion (breathing, scarf sway, sub-zero breath vapor), plus an automatic **Character Reference Sheet** PNG exporter.
- **Cinematic Camera & Atmosphere (`@cosmos-motion/core`):** Bezier-eased `CinemaCam` (`dollyIn`, `craneUp`, `pushDiag`, `trackRight`) with handheld micro-sway, `PhotoPlate` archival grading, `LightShafts`, `Dust`, `Boil`, and `FilmLook`.
- **Transparent Source Verification (`cli/verify_sources.py`):** Every scene is linked to `sources.json`, rendering per-scene `<SourceBadge />` citations and an end-of-video `<ReferenceEndCard />`.
- **AI Agent Ready (`skills/cosmos-motion/SKILL.md`):** Includes a 2-stage workflow skill for Antigravity, Claude Code, and Cursor.

---

## Repository Structure

```text
cosmos-motion/
├── cli/                        # Python CLI (init, fetch, align, verify, render)
├── packages/
│   ├── core/                   # CinemaCam, TreemationSubtitle, SourceAttribution, DocumentaryLayout
│   ├── characters/             # CharacterSchema, HistoricalActor rig, CharacterReferenceSheet
│   ├── geo-space/              # RealEarth3D (NASA Blue Marble), NaturalEarthMap, SlippyTileMap
│   └── scenes/                 # SplitConfrontation, ArchivalDossier, MacroApparatusECU, DataTimelineShot
├── src/                        # Remotion entrypoint & DemoDocumentary composition
├── templates/                  # Ready-to-use templates (nikolai-vavilov, michael-faraday)
└── skills/cosmos-motion/       # Agent Skill instructions & JSON schema reference
```

---

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Type-Check & Verify Templates
```bash
npm run typecheck
python3 cli/cosmos.py verify templates/nikolai-vavilov
python3 cli/cosmos.py verify templates/michael-faraday
```

### 3. Preview in Remotion Studio or Render Demo
```bash
npm run dev
# or render the 15s demo & character reference sheet:
npm run render:charsheet
npm run render:demo
```

### 4. Create a New Documentary Project via CLI
```bash
python3 cli/cosmos.py init my-science-story --title "Marie Curie & Radium"
python3 cli/cosmos.py verify my-science-story
python3 cli/cosmos.py align narration.mp3 --script script.txt --out captions.json
```

---

## License

Released under the **MIT License**. See [LICENSE](./LICENSE) for details.
