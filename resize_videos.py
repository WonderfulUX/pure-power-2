"""
resize_videos.py
================
Batch-resize videos for responsive web delivery.
Tailored for the project structure:

    project/
    └── assets/
        └── videos/
            ├── mp4/   ← MP4 sources  → resized MP4s written back here
            └── webm/  ← WebM sources → resized MP4s + WebMs written here too

Breakpoints : 480px (mobile) | 1024px (tablet) | 1920px (desktop)
              Landscape videos → scaled by WIDTH
              Portrait videos  → scaled by HEIGHT (e.g. vertical social clips)

Output      : MP4 (H.264/AAC) + WebM (VP9/Opus)
Encoder     : libvpx-vp9  ← correct name for gyan.dev full FFmpeg builds

Requirements
------------
    pip install ffmpeg-python

FFmpeg (gyan.dev full build) must be installed and on your PATH.

Usage
-----
    # Run from your project root:
    python resize_videos.py

    # Or point to a different project root:
    python resize_videos.py --root C:\\path\\to\\project
"""

import argparse
import sys
from pathlib import Path

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

BREAKPOINTS = {
    "mobile":  480,
    "tablet":  1024,
    "desktop": 1920,
}

VIDEO_FOLDERS = {
    "mp4":  [".mp4"],
    "webm": [".webm"],
}

VIDEO_SETTINGS = {
    "mobile":  {"crf": 30, "preset": "slow", "audio_bitrate": "96k"},
    "tablet":  {"crf": 26, "preset": "slow", "audio_bitrate": "128k"},
    "desktop": {"crf": 22, "preset": "slow", "audio_bitrate": "192k"},
}

BREAKPOINT_SUFFIXES = {f"-{label}" for label in BREAKPOINTS}


def already_resized(stem: str) -> bool:
    return any(stem.endswith(sfx) for sfx in BREAKPOINT_SUFFIXES)


# ---------------------------------------------------------------------------
# Scale filter builder
# ---------------------------------------------------------------------------

def scale_filter(orig_w: int, orig_h: int, target: int) -> str:
    """
    Landscape (w >= h) → scale by width.
    Portrait  (h >  w) → scale by height.
    Always ensures dimensions are divisible by 2 (H.264/VP9 requirement).
    Never upscales.
    """
    is_portrait = orig_h > orig_w

    if is_portrait:
        if orig_h <= target:
            return "scale=trunc(iw/2)*2:trunc(ih/2)*2"   # passthrough
        return f"scale=trunc(oh*a/2)*2:{target}"          # fix height, auto width
    else:
        if orig_w <= target:
            return "scale=trunc(iw/2)*2:trunc(ih/2)*2"   # passthrough
        return f"scale={target}:trunc(ow/a/2)*2"          # fix width, auto height


# ---------------------------------------------------------------------------
# Video processing
# ---------------------------------------------------------------------------

def process_video_folders(assets_videos: Path) -> list[str]:
    try:
        import ffmpeg
    except ImportError:
        print("❌  ffmpeg-python not found. Run: pip install ffmpeg-python")
        sys.exit(1)

    mp4_out_dir  = assets_videos / "mp4"
    webm_out_dir = assets_videos / "webm"
    mp4_out_dir.mkdir(parents=True, exist_ok=True)
    webm_out_dir.mkdir(parents=True, exist_ok=True)

    processed_stems = []

    for folder_name, extensions in VIDEO_FOLDERS.items():
        folder = assets_videos / folder_name
        if not folder.exists():
            print(f"⚠️   Folder not found, skipping: {folder}")
            continue

        files = [
            f for f in folder.iterdir()
            if f.suffix.lower() in extensions and not already_resized(f.stem)
        ]

        if not files:
            print(f"ℹ️   No new videos in {folder}")
            continue

        print(f"\n🎬  {folder_name.upper()}  —  {len(files)} video(s)")

        for src in files:
            stem = src.stem

            # Probe
            try:
                probe = ffmpeg.probe(str(src))
            except ffmpeg.Error as e:
                print(f"  ⚠️  Could not probe {src.name}: {e.stderr.decode()}")
                continue

            video_stream = next(
                (s for s in probe["streams"] if s["codec_type"] == "video"), None
            )
            if not video_stream:
                print(f"  ⚠️  No video stream in {src.name}, skipping.")
                continue

            orig_w = int(video_stream["width"])
            orig_h = int(video_stream["height"])
            orient = "portrait" if orig_h > orig_w else "landscape"
            print(f"\n  📹  {src.name}  ({orig_w}×{orig_h}, {orient})")

            for label, target in BREAKPOINTS.items():
                sf       = scale_filter(orig_w, orig_h, target)
                settings = VIDEO_SETTINGS[label]

                # ── MP4 (H.264 + AAC) ──────────────────────────────────────
                mp4_out = mp4_out_dir / f"{stem}-{label}.mp4"
                try:
                    (
                        ffmpeg
                        .input(str(src))
                        .output(
                            str(mp4_out),
                            vf=sf,
                            vcodec="libx264",
                            crf=settings["crf"],
                            preset=settings["preset"],
                            acodec="aac",
                            audio_bitrate=settings["audio_bitrate"],
                            movflags="+faststart",
                            y=None,
                        )
                        .run(quiet=True)
                    )
                    print(f"  ✅  mp4/{mp4_out.name}")
                except ffmpeg.Error as e:
                    print(f"  ❌  mp4/{mp4_out.name}  →  {e.stderr.decode()[-300:]}")

                # ── WebM (VP9 + Opus) ───────────────────────────────────────
                webm_out = webm_out_dir / f"{stem}-{label}.webm"
                try:
                    (
                        ffmpeg
                        .input(str(src))
                        .output(
                            str(webm_out),
                            vf=sf,
                            vcodec="libvpx-vp9",   # ← correct encoder name
                            **{"b:v": "0"},         # constant-quality mode
                            crf=settings["crf"],
                            acodec="libopus",
                            audio_bitrate=settings["audio_bitrate"],
                            y=None,
                        )
                        .run(quiet=True)
                    )
                    print(f"  ✅  webm/{webm_out.name}")
                except ffmpeg.Error as e:
                    print(f"  ❌  webm/{webm_out.name}  →  {e.stderr.decode()[-300:]}")

            processed_stems.append(stem)

    return processed_stems


# ---------------------------------------------------------------------------
# HTML snippet printer
# ---------------------------------------------------------------------------

def print_html_snippets(stems: list[str]) -> None:
    if not stems:
        return
    print("\n" + "─" * 64)
    print("📋  HTML snippets — paste into your HTML files\n")
    for stem in dict.fromkeys(stems):   # deduplicate, preserve order
        print(f"""\
<!-- {stem} -->
<video autoplay muted loop playsinline>
  <source media="(max-width: 480px)"  src="assets/videos/webm/{stem}-mobile.webm"  type="video/webm">
  <source media="(max-width: 480px)"  src="assets/videos/mp4/{stem}-mobile.mp4"   type="video/mp4">
  <source media="(max-width: 1024px)" src="assets/videos/webm/{stem}-tablet.webm"  type="video/webm">
  <source media="(max-width: 1024px)" src="assets/videos/mp4/{stem}-tablet.mp4"   type="video/mp4">
  <source src="assets/videos/webm/{stem}-desktop.webm" type="video/webm">
  <source src="assets/videos/mp4/{stem}-desktop.mp4"  type="video/mp4">
</video>
""")


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def parse_args():
    parser = argparse.ArgumentParser(
        description="Resize videos in-place for a static web project (MP4 + WebM)."
    )
    parser.add_argument(
        "--root", type=Path, default=Path("."),
        help="Project root containing assets/videos/ (default: current directory)"
    )
    return parser.parse_args()


def main():
    args          = parse_args()
    root          = args.root.resolve()
    assets_videos = root / "assets" / "videos"

    print(f"📁  Project root : {root}")
    print(f"    Videos       : {assets_videos}")

    if not assets_videos.exists():
        print(f"❌  Folder not found: {assets_videos}")
        sys.exit(1)

    stems = process_video_folders(assets_videos)
    print_html_snippets(stems)
    print("✨  All done!")


if __name__ == "__main__":
    main()
