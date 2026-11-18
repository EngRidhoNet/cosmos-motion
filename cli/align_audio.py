#!/usr/bin/env python3
"""
Audio Aligner & Viseme Generator for CosmosMotion.
Uses faster-whisper when installed; otherwise falls back to ffprobe duration +
syllable-weighted alignment for crisp TreemationSubtitle timing and A/E/I/O/U visemes.
"""

import argparse
import json
import re
import subprocess
from pathlib import Path


def get_audio_duration(audio_path: str) -> float:
    out = subprocess.check_output(
        [
            "ffprobe",
            "-v",
            "error",
            "-show_entries",
            "format=duration",
            "-of",
            "default=noprint_wrappers=1:nokey=1",
            audio_path,
        ],
        text=True,
    ).strip()
    return float(out)


def text_to_visemes(text: str, total_frames: int):
    vowels = [c.upper() for c in text if c.lower() in "aeiou"]
    if not vowels:
        return ["-"] * total_frames
    visemes = []
    for f in range(total_frames):
        idx = int((f / max(1, total_frames)) * len(vowels))
        visemes.append(vowels[min(idx, len(vowels) - 1)] if f % 3 != 0 else "-")
    return visemes


def fallback_align(script_text: str, duration: float, fps: int = 30):
    words = [w for w in re.split(r"\s+", script_text.strip()) if w]
    if not words:
        return {"captions": [], "visemes": ["-"] * int(duration * fps)}

    weights = [max(1, len(re.findall(r"[aeiouAEIOU]", w))) for w in words]
    total_w = sum(weights)
    captions = []
    cur = 0.25
    usable = max(1.0, duration - 0.5)

    chunk = []
    chunk_start = cur
    for w, wt in zip(words, weights):
        dur = (wt / total_w) * usable
        chunk.append({"display": w, "start": round(cur, 3), "end": round(cur + dur, 3)})
        cur += dur
        if len(chunk) >= 3 or w.endswith((".", "!", "?", ",")):
            captions.append({
                "text": " ".join(x["display"] for x in chunk),
                "start": chunk_start,
                "end": chunk[-1]["end"],
                "words": chunk,
            })
            chunk = []
            chunk_start = cur
    if chunk:
        captions.append({
            "text": " ".join(x["display"] for x in chunk),
            "start": chunk_start,
            "end": chunk[-1]["end"],
            "words": chunk,
        })

    return {
        "duration": duration,
        "captions": captions,
        "visemes": text_to_visemes(script_text, int(duration * fps)),
    }


def main():
    p = argparse.ArgumentParser()
    p.add_argument("audio")
    p.add_argument("--script", help="Path to narration script text")
    p.add_argument("--out", default="captions.json")
    p.add_argument("--fps", type=int, default=30)
    args = p.parse_args()

    dur = get_audio_duration(args.audio)
    script_text = Path(args.script).read_text() if args.script else "CosmosMotion documentary narration"

    try:
        from faster_whisper import WhisperModel  # type: ignore

        model = WhisperModel("base", compute_type="int8")
        segments, _ = model.transcribe(args.audio, word_timestamps=True)
        words = []
        for seg in segments:
            for w in seg.words or []:
                words.append({"display": w.word.strip(), "start": round(w.start, 3), "end": round(w.end, 3)})
        captions = []
        for i in range(0, len(words), 3):
            grp = words[i : i + 3]
            captions.append({
                "text": " ".join(g["display"] for g in grp),
                "start": grp[0]["start"],
                "end": grp[-1]["end"],
                "words": grp,
            })
        payload = {
            "duration": dur,
            "captions": captions,
            "visemes": text_to_visemes(" ".join(w["display"] for w in words), int(dur * args.fps)),
        }
    except ImportError:
        payload = fallback_align(script_text, dur, args.fps)

    Path(args.out).write_text(json.dumps(payload, indent=2) + "\n")
    print(f"[align_audio] Wrote {len(payload['captions'])} caption chunks to {args.out}")


if __name__ == "__main__":
    main()
