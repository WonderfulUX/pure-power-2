"""
resize_assets.py
================
Batch-resize images and videos for responsive web delivery.
Tailored for the project structure:

    project/
    ├── index.html
    ├── about.html
    ├── css/
    ├── js/
    └── assets/
        ├── img/
        │   ├── jpg/   ← JPG sources  → resized files written back here
        │   ├── png/   ← PNG sources  → resized files written back here
        │   └── webp/  ← WebP sources → resized files written back here
        └── videos/
            ├── mp4/   ← MP4 sources  → resized files written back here
            └── webm/  ← WebM sources → resized files written back here

Breakpoints : 480px (mobile) | 1024px (tablet) | 1920px (desktop)
Images      : WebP output (preserves alpha for PNG/WebP) via Pillow
Videos      : MP4 (H.264/AAC) + WebM (VP9/Opus) via ffmpeg-python

Output filename convention
    original.jpg  →  original-mobile.webp
                     original-tablet.webp
                     original-desktop.webp   (written next to original)

Requirements
------------
    pip install Pillow ffmpeg-python

FFmpeg binary must also be installed:
    macOS  : brew install ffmpeg
    Ubuntu : sudo apt install ffmpeg
    Windows: https://ffmpeg.org/download.html

Usage
-----
    # Run from the project root:
    python resize_assets.py

    # Or point to a different project root:
    python resize_assets.py --root /path/to/project
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

# { folder_name: [extensions to process inside it] }
IMAGE_FOLDERS = {
    "jpg":  [".jpg", ".jpeg"],
    "png":  [".png"],
    "webp": [".webp"],
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

# Suffix tokens added by this script — used to skip already-resized files
BREAKPOINT_SUFFIXES = {f"-{label}" for label in BREAKPOINTS}


def already_resized(stem: str) -> bool:
    """Return True if the filename looks like one we already generated."""
    return any(stem.endswith(sfx) for sfx in BREAKPOINT_SUFFIXES)


# ---------------------------------------------------------------------------
# Image processing
# ---------------------------------------------------------------------------

def process_image_folders(assets_img: Path) -> list[dict]:
    """Process all image sub-folders. Returns list of snippet info dicts."""
    try:
        from PIL import Image
    except ImportError:
        print("❌  Pillow not found. Run: pip install Pillow")
        sys.exit(1)

    snippets = []

    for folder_name, extensions in IMAGE_FOLDERS.items():
        folder = assets_img / folder_name
        if not folder.exists():
            print(f"⚠️   Folder not found, skipping: {folder}")
            continue

        files = [
            f for f in folder.iterdir()
            if f.suffix.lower() in extensions and not already_resized(f.stem)
        ]

        if not files:
            print(f"ℹ️   No new images in {folder}")
            continue

        print(f"\n🖼️   {folder_name.upper()}  —  {len(files)} image(s)")

        for src in files:
            stem = src.stem
            with Image.open(src) as img:
                orig_w, orig_h = img.size

                if img.mode not in ("RGB", "RGBA"):
                    img = img.convert("RGBA" if "transparency" in img.info else "RGB")

                for label, target_w in BREAKPOINTS.items():
                    if orig_w <= target_w:
                        out_img = img.copy()
                    else:
                        ratio    = target_w / orig_w
                        target_h = int(orig_h * ratio)
                        out_img  = img.resize((target_w, target_h), Image.LANCZOS)

                    # Output lives next to the source file, always as .webp
                    out_path = folder / f"{stem}-{label}.webp"
                    out_img.save(out_path, "WEBP", quality=85, method=6)
                    print(f"  ✅  {out_path.name}  ({out_img.size[0]}×{out_img.size[1]})")

            # Relative path from project root for HTML snippet
            rel_folder = folder.relative_to(assets_img.parent.parent)
            snippets.append({"stem": stem, "folder": str(rel_folder).replace("\\", "/")})

    return snippets


# ---------------------------------------------------------------------------
# Video processing
# ---------------------------------------------------------------------------

def process_video_folders(assets_videos: Path) -> list[dict]:
    """Process all video sub-folders. Returns list of snippet info dicts."""
    try:
        import ffmpeg
    except ImportError:
        print("❌  ffmpeg-python not found. Run: pip install ffmpeg-python")
        sys.exit(1)

    snippets = []

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

            for label, target_w in BREAKPOINTS.items():
                settings = VIDEO_SETTINGS[label]

                scale_filter = (
                    "scale=trunc(iw/2)*2:trunc(ih/2)*2"  # passthrough, even dims
                    if orig_w <= target_w
                    else f"scale={target_w}:-2"
                )

                # MP4 output — always written to the mp4/ sub-folder
                mp4_folder = assets_videos / "mp4"
                mp4_folder.mkdir(parents=True, exist_ok=True)
                mp4_out = mp4_folder / f"{stem}-{label}.mp4"
                try:
                    (
                        ffmpeg
                        .input(str(src))
                        .output(
                            str(mp4_out),
                            vf=scale_filter,
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
                    print(f"  ❌  {mp4_out.name} failed: {e.stderr.decode()}")

                # WebM output — always written to the webm/ sub-folder
                webm_folder = assets_videos / "webm"
                webm_folder.mkdir(parents=True, exist_ok=True)
                webm_out = webm_folder / f"{stem}-{label}.webm"
                try:
                    (
                        ffmpeg
                        .input(str(src))
                        .output(
                            str(webm_out),
                            vf=scale_filter,
                            vcodec="libvp9",
                            **{"b:v": "0"},
                            crf=settings["crf"],
                            acodec="libopus",
                            audio_bitrate=settings["audio_bitrate"],
                            y=None,
                        )
                        .run(quiet=True)
                    )
                    print(f"  ✅  webm/{webm_out.name}")
                except ffmpeg.Error as e:
                    print(f"  ❌  {webm_out.name} failed: {e.stderr.decode()}")

            snippets.append({"stem": stem})

    return snippets


# ---------------------------------------------------------------------------
# HTML snippet printer
# ---------------------------------------------------------------------------

def print_html_snippets(img_snippets: list[dict], vid_snippets: list[dict]) -> None:
    print("\n" + "─" * 64)
    print("📋  HTML snippets — paste into index.html / about.html\n")

    seen_img = set()
    for s in img_snippets:
        key = (s["stem"], s["folder"])
        if key in seen_img:
            continue
        seen_img.add(key)
        f = s["folder"]
        stem = s["stem"]
        print(f"""\
<!-- {stem} -->
<picture>
  <source media="(max-width: 480px)"  srcset="{f}/{stem}-mobile.webp"  type="image/webp">
  <source media="(max-width: 1024px)" srcset="{f}/{stem}-tablet.webp"  type="image/webp">
  <img src="{f}/{stem}-desktop.webp" alt="" loading="lazy" decoding="async">
</picture>
""")

    seen_vid = set()
    for s in vid_snippets:
        if s["stem"] in seen_vid:
            continue
        seen_vid.add(s["stem"])
        stem = s["stem"]
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
        description="Resize images & videos in-place for a static web project."
    )
    parser.add_argument(
        "--root", type=Path, default=Path("."),
        help="Project root folder containing assets/ (default: current directory)"
    )
    return parser.parse_args()


def main():
    args   = parse_args()
    root   = args.root.resolve()

    assets_img    = root / "assets" / "img"
    assets_videos = root / "assets" / "videos"

    print(f"📁  Project root : {root}")
    print(f"    Images       : {assets_img}")
    print(f"    Videos       : {assets_videos}")

    missing = [p for p in (assets_img, assets_videos) if not p.exists()]
    if missing:
        for p in missing:
            print(f"❌  Folder not found: {p}")
        sys.exit(1)

    img_snippets = process_image_folders(assets_img)
    vid_snippets = process_video_folders(assets_videos)

    print_html_snippets(img_snippets, vid_snippets)

    print("✨  All done!")


if __name__ == "__main__":
    main()
