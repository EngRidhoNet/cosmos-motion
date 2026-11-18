#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const PKG_ROOT = path.resolve(__dirname, "..");
const [, , command, ...args] = process.argv;

function printHelp() {
  console.log(`
CosmosMotion CLI (npx cosmos-motion)

Usage:
  npx cosmos-motion init <project-dir> [--title "Title"]   Scaffold a new documentary project
  npx cosmos-motion verify <project-dir>                   Verify sources.json & storyboard.json citations
  npx cosmos-motion fetch <project-dir>                    Fetch OpenStreetMap/Esri tiles & Wikimedia photos
  npx cosmos-motion align <audio.mp3> [--script s.txt]     Generate word timestamps & lip-sync visemes
  npx cosmos-motion render [Composition] [--out out.mp4]   Render Remotion composition to MP4
  npx cosmos-motion --help                                 Show this help message
`);
}

function cmdInit(rest) {
  const dirName = rest[0];
  if (!dirName || dirName.startsWith("-")) {
    console.error("[cosmos-motion] Error: Please provide a project directory name.");
    process.exit(1);
  }
  const titleIdx = rest.indexOf("--title");
  const title =
    titleIdx !== -1 && rest[titleIdx + 1]
      ? rest[titleIdx + 1]
      : dirName.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const target = path.resolve(process.cwd(), dirName);
  if (fs.existsSync(target)) {
    console.error(`[cosmos-motion] Directory '${dirName}' already exists.`);
    process.exit(1);
  }

  fs.mkdirSync(path.join(target, "assets"), { recursive: true });

  fs.writeFileSync(
    path.join(target, "project.json"),
    JSON.stringify(
      {
        name: dirName,
        title,
        fps: 30,
        width: 1080,
        height: 1920,
        language: "id",
        subtitleStyle: "treemation",
      },
      null,
      2,
    ) + "\n",
  );

  fs.writeFileSync(
    path.join(target, "characters.json"),
    JSON.stringify(
      [
        {
          id: "narrator_scientist",
          name: "Nikolai Vavilov",
          preset: "nikolai_vavilov",
        },
      ],
      null,
      2,
    ) + "\n",
  );

  fs.writeFileSync(
    path.join(target, "storyboard.json"),
    JSON.stringify(
      {
        acts: [
          {
            id: "S01",
            title: "Opening: Living Planet",
            template: "RealEarth3D",
            durationSec: 5,
            sourceIds: ["nasa-blue-marble"],
          },
          {
            id: "S02",
            title: "Global Expedition Map",
            template: "NaturalEarthMap",
            durationSec: 5,
            sourceIds: ["natural-earth"],
          },
        ],
      },
      null,
      2,
    ) + "\n",
  );

  fs.writeFileSync(
    path.join(target, "sources.json"),
    JSON.stringify(
      {
        sources: [
          {
            id: "nasa-blue-marble",
            category: "CITRA BUMI",
            title: "NASA Visible Earth",
            citation: "NASA Blue Marble Next Generation",
            url: "https://visibleearth.nasa.gov/",
            license: "Public Domain",
          },
          {
            id: "natural-earth",
            category: "DATA PETA",
            title: "Natural Earth 110m",
            citation: "Natural Earth Vector Data (naturalearthdata.com)",
            url: "https://www.naturalearthdata.com/",
            license: "Public Domain",
          },
        ],
      },
      null,
      2,
    ) + "\n",
  );

  console.log(`[cosmos-motion] Initialized documentary project at '${dirName}/'`);
  console.log(`  Next: npx cosmos-motion verify ${dirName}`);
}

function cmdVerify(rest) {
  const dirName = rest[0];
  if (!dirName) {
    console.error("[cosmos-motion] Error: Please provide a project directory.");
    process.exit(1);
  }
  const projectDir = path.resolve(process.cwd(), dirName);
  const sourcesPath = path.join(projectDir, "sources.json");
  const storyboardPath = path.join(projectDir, "storyboard.json");

  if (!fs.existsSync(sourcesPath) || !fs.existsSync(storyboardPath)) {
    console.error(`[verify_sources] FAIL: Missing sources.json or storyboard.json in '${dirName}'.`);
    process.exit(1);
  }

  const sourcesData = JSON.parse(fs.readFileSync(sourcesPath, "utf8"));
  const storyboardData = JSON.parse(fs.readFileSync(storyboardPath, "utf8"));

  const sourceMap = new Map();
  for (const s of sourcesData.sources || []) {
    if (s.id) sourceMap.set(s.id, s);
  }
  if (sourceMap.size === 0) {
    console.error("[verify_sources] FAIL: sources.json contains zero source entries.");
    process.exit(1);
  }

  const errors = [];
  for (const [id, entry] of sourceMap.entries()) {
    if (!entry.citation) errors.push(`Source '${id}' is missing a 'citation' field.`);
    if (!entry.category) errors.push(`Source '${id}' is missing a 'category' field.`);
  }
  for (const act of storyboardData.acts || []) {
    const actId = act.id || "unknown";
    const refs = act.sourceIds || [];
    if (refs.length === 0) errors.push(`Act '${actId}' has no 'sourceIds' attribution.`);
    for (const ref of refs) {
      if (!sourceMap.has(ref)) errors.push(`Act '${actId}' references unknown sourceId '${ref}'.`);
    }
  }

  if (errors.length > 0) {
    console.error("[verify_sources] FAIL:");
    for (const e of errors) console.error(`  - ${e}`);
    process.exit(1);
  }

  console.log(
    `[verify_sources] PASS: ${sourceMap.size} sources verified across ${(storyboardData.acts || []).length} acts.`,
  );
}

function delegatePython(subCmd, rest) {
  const pyScript = path.join(PKG_ROOT, "cli", "cosmos.py");
  const res = spawnSync("python3", [pyScript, subCmd, ...rest], { stdio: "inherit" });
  if (res.error) {
    console.error("[cosmos-motion] Error running python3:", res.error.message);
    process.exit(1);
  }
  process.exit(res.status ?? 1);
}

function cmdRender(rest) {
  const comp = rest[0] && !rest[0].startsWith("-") ? rest[0] : "DemoDocumentary";
  const outIdx = rest.indexOf("--out");
  const outPath = outIdx !== -1 && rest[outIdx + 1] ? rest[outIdx + 1] : `out/${comp}.mp4`;
  const res = spawnSync(
    "npx",
    ["remotion", "render", "src/index.ts", comp, outPath, "--codec=h264", "--crf=18", "--gl=angle"],
    { stdio: "inherit" },
  );
  process.exit(res.status ?? 1);
}

if (!command || command === "--help" || command === "-h") {
  printHelp();
  process.exit(0);
}

switch (command) {
  case "init":
    cmdInit(args);
    break;
  case "verify":
    cmdVerify(args);
    break;
  case "fetch":
  case "align":
    delegatePython(command, args);
    break;
  case "render":
    cmdRender(args);
    break;
  default:
    console.error(`[cosmos-motion] Unknown command '${command}'.`);
    printHelp();
    process.exit(1);
}
