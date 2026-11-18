---
name: cosmos-motion
description: Create vertical 9:16 science & history documentary videos in the style of Cosmos: A Spacetime Odyssey using Remotion, Three.js 3D NASA Blue Marble Earth, Natural Earth / OpenStreetMap real geographic maps, consistent 2D graphic-novel historical characters, Treemation-style karaoke subtitles, and verified source attributions.
---

# CosmosMotion Skill — 2-Stage Science Documentary Workflow

## Stage 1: Fact-Check, Script & Storyboard
When the user requests a science or historical documentary topic:
1. **Fact-check all statistics, dates, names, and geographic coordinates** before writing the script.
2. Initialize a project with `python3 cli/cosmos.py init <project-name>`.
3. Populate `sources.json` with verifiable citations (`DATA PETA`, `CITRA BUMI`, `ARSIP SEJARAH`, `SUMBER ILMIAH`).
4. Populate `storyboard.json` linking every act to its `sourceIds`.
5. Run `python3 cli/cosmos.py verify <project-name>` to ensure 100% source attribution coverage.
6. Present the **narration script** (clean voiceover text for ElevenLabs/TTS) and **scene-by-scene storyboard** to the user.

## Stage 2: Audio Alignment, Asset Fetch & Render
When the user provides the narration MP3:
1. Align audio & generate word timestamps + visemes:
   ```bash
   python3 cli/cosmos.py align narration.mp3 --script script.txt --out captions.json
   ```
2. Fetch real OpenStreetMap/Esri tiles and Wikimedia archival photos:
   ```bash
   python3 cli/cosmos.py fetch <project-name>
   ```
3. Export the **Character Reference Sheet** for visual consistency QA:
   ```bash
   npm run render:charsheet
   ```
4. Render the final 1080×1920 H.264 documentary MP4:
   ```bash
   python3 cli/cosmos.py render DemoDocumentary --out out/documentary.mp4
   ```
