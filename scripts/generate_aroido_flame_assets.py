#!/usr/bin/env python3

from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]


def resolve_paths() -> tuple[Path, Path, Path]:
    repo_brand_dir = ROOT / "assets" / "aroido-brand"
    repo_source_dir = repo_brand_dir / "flame-source"
    central_source_dir = ROOT / "source"

    if repo_source_dir.exists():
        return repo_brand_dir, repo_source_dir, repo_brand_dir / "flame-raster"

    if central_source_dir.exists():
        return ROOT, central_source_dir, ROOT / "exports" / "flame-raster"

    return repo_brand_dir, repo_source_dir, repo_brand_dir / "flame-raster"


BRAND_DIR, SOURCE_DIR, OUT_DIR = resolve_paths()

SYMBOL_MASTER = SOURCE_DIR / "aroido-flame-symbol-master.png"
LOCKUP_MASTER = SOURCE_DIR / "aroido-flame-lockup-master.png"

COLORS = {
    "navy_950": (8, 13, 31, 255),
    "navy_900": (13, 21, 42, 255),
    "navy_800": (25, 40, 79, 255),
    "light_000": (255, 255, 255, 255),
    "light_050": (247, 250, 255, 255),
    "light_100": (239, 244, 250, 255),
    "light_200": (225, 233, 246, 255),
    "ink_900": (12, 22, 44, 255),
    "ink_700": (67, 87, 126, 255),
}

FONT_PATH = "/System/Library/Fonts/Avenir Next.ttc"


def ensure_dirs() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)


def load_font(size: int) -> ImageFont.FreeTypeFont:
    try:
        return ImageFont.truetype(FONT_PATH, size=size)
    except OSError:
        return ImageFont.load_default()


def save(image: Image.Image, name: str) -> None:
    image.save(OUT_DIR / name)


def estimate_background(arr: np.ndarray) -> np.ndarray:
    return np.array(
        [arr[0, 0, :3], arr[0, -1, :3], arr[-1, 0, :3], arr[-1, -1, :3]],
        dtype=np.float32,
    ).mean(axis=0)


def rgba_from_alpha(rgb: np.ndarray, alpha: np.ndarray) -> Image.Image:
    rgba = np.dstack([rgb.astype(np.uint8), (alpha * 255).astype(np.uint8)])
    return Image.fromarray(rgba, "RGBA")


def trim(image: Image.Image, min_alpha: int = 8, padding: int = 0) -> Image.Image:
    alpha = image.getchannel("A").point(lambda px: 255 if px >= min_alpha else 0)
    bbox = alpha.getbbox()
    if not bbox:
        return image
    left = max(0, bbox[0] - padding)
    top = max(0, bbox[1] - padding)
    right = min(image.width, bbox[2] + padding)
    bottom = min(image.height, bbox[3] + padding)
    return image.crop((left, top, right, bottom))


def extract_transparent_symbol() -> Image.Image:
    image = Image.open(SYMBOL_MASTER).convert("RGBA")
    arr = np.array(image).astype(np.uint8)
    rgb = arr[:, :, :3].astype(np.float32)
    bg = estimate_background(arr)
    dist = np.sqrt(((rgb - bg) ** 2).sum(axis=2))
    value = rgb.max(axis=2)
    alpha = np.maximum.reduce(
        [
            (dist - 18) / 70,
            (value - 65) / 120,
        ]
    )
    alpha = np.clip(alpha, 0, 1)
    transparent = rgba_from_alpha(arr[:, :, :3], alpha)
    return trim(transparent, padding=6)


def extract_detail_symbol() -> Image.Image:
    image = Image.open(LOCKUP_MASTER).convert("RGBA")
    crop = image.crop((180, 140, 620, 760))
    arr = np.array(crop).astype(np.uint8)
    rgb = arr[:, :, :3].astype(np.float32)
    bg = estimate_background(arr)
    dist = np.sqrt(((rgb - bg) ** 2).sum(axis=2))
    value = rgb.max(axis=2)
    alpha = np.maximum.reduce(
        [
            (dist - 18) / 60,
            (value - 60) / 120,
        ]
    )
    alpha = np.clip(alpha, 0, 1)
    detail = rgba_from_alpha(arr[:, :, :3], alpha)
    return trim(detail, padding=4)


def extract_wordmark_mask() -> Image.Image:
    image = Image.open(LOCKUP_MASTER).convert("RGBA")
    crop = image.crop((650, 200, image.width, 760))
    arr = np.array(crop).astype(np.uint8)
    rgb = arr[:, :, :3].astype(np.float32)
    value = rgb.max(axis=2)
    alpha = np.clip((value - 150) / 70, 0, 1)
    rgba = np.dstack([np.full_like(arr[:, :, :3], 255), (alpha * 255).astype(np.uint8)])
    wordmark = Image.fromarray(rgba, "RGBA")
    return trim(wordmark, padding=2).getchannel("A")


def colorize_mask(mask: Image.Image, color: tuple[int, int, int, int]) -> Image.Image:
    image = Image.new("RGBA", mask.size, color)
    image.putalpha(mask)
    return image


def resize_to_fit(image: Image.Image, max_width: int, max_height: int) -> Image.Image:
    ratio = min(max_width / image.width, max_height / image.height)
    size = (max(1, int(round(image.width * ratio))), max(1, int(round(image.height * ratio))))
    return image.resize(size, Image.Resampling.LANCZOS)


def diagonal_gradient(
    size: tuple[int, int],
    start: tuple[int, int, int, int],
    end: tuple[int, int, int, int],
) -> Image.Image:
    width, height = size
    x = np.linspace(0, 1, width, dtype=np.float32)
    y = np.linspace(0, 1, height, dtype=np.float32)
    grid = (x[None, :] * 0.65) + (y[:, None] * 0.35)
    grid = np.clip(grid, 0, 1)
    start_arr = np.array(start, dtype=np.float32)
    end_arr = np.array(end, dtype=np.float32)
    rgba = start_arr + (end_arr - start_arr) * grid[:, :, None]
    return Image.fromarray(rgba.astype(np.uint8), "RGBA")


def rounded_background(
    size: tuple[int, int],
    start: tuple[int, int, int, int],
    end: tuple[int, int, int, int],
    radius: int,
) -> Image.Image:
    image = diagonal_gradient(size, start, end)
    mask = Image.new("L", size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, size[0], size[1]), radius=radius, fill=255)
    image.putalpha(mask)
    return image


def square_canvas(image: Image.Image, size: int, scale: float = 0.82) -> Image.Image:
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    fitted = resize_to_fit(image, int(size * scale), int(size * scale))
    offset = ((size - fitted.width) // 2, (size - fitted.height) // 2)
    canvas.alpha_composite(fitted, offset)
    return canvas


def mono_symbol(symbol: Image.Image, color: tuple[int, int, int, int], size: int = 1024) -> Image.Image:
    mask = resize_to_fit(symbol.getchannel("A"), int(size * 0.82), int(size * 0.82))
    mono = Image.new("RGBA", mask.size, color)
    mono.putalpha(mask)
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    offset = ((size - mono.width) // 2, (size - mono.height) // 2)
    canvas.alpha_composite(mono, offset)
    return canvas


def icon_panel(symbol: Image.Image, background: str, size: int) -> Image.Image:
    if background == "dark":
        panel = rounded_background((size, size), COLORS["navy_950"], COLORS["navy_800"], radius=int(size * 0.22))
    else:
        panel = rounded_background((size, size), COLORS["light_000"], COLORS["light_200"], radius=int(size * 0.22))
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    canvas.alpha_composite(panel)
    fitted = resize_to_fit(symbol, int(size * 0.76), int(size * 0.76))
    offset = ((size - fitted.width) // 2, (size - fitted.height) // 2)
    canvas.alpha_composite(fitted, offset)
    return canvas


def compose_lockup(
    mark: Image.Image,
    wordmark: Image.Image,
    background: tuple[int, int, int, int] | None,
    name: str,
) -> Image.Image:
    canvas = Image.new("RGBA", (1600, 640), background or (0, 0, 0, 0))
    mark_fitted = resize_to_fit(mark, 430, 430)
    word_fitted = resize_to_fit(wordmark, 880, 190)
    mark_x = 104
    mark_y = (640 - mark_fitted.height) // 2
    word_x = mark_x + mark_fitted.width + 72
    word_y = (640 - word_fitted.height) // 2 + 6
    canvas.alpha_composite(mark_fitted, (mark_x, mark_y))
    canvas.alpha_composite(word_fitted, (word_x, word_y))
    save(canvas, name)
    return canvas


def compose_social_og(
    mark: Image.Image,
    wordmark: Image.Image,
    background_start: tuple[int, int, int, int],
    background_end: tuple[int, int, int, int],
    stroke: tuple[int, int, int, int],
    name: str,
) -> Image.Image:
    canvas = rounded_background((1200, 630), background_start, background_end, radius=42)
    draw = ImageDraw.Draw(canvas)
    draw.rounded_rectangle((52, 52, 1148, 578), radius=28, outline=stroke, width=2)
    mark_fitted = resize_to_fit(mark, 360, 430)
    word_fitted = resize_to_fit(wordmark, 620, 138)
    mark_x = 92
    mark_y = (630 - mark_fitted.height) // 2
    word_x = 540
    word_y = 188
    canvas.alpha_composite(mark_fitted, (mark_x, mark_y))
    canvas.alpha_composite(word_fitted, (word_x, word_y))
    font_title = load_font(52)
    font_body = load_font(26)
    draw.text((542, 340), "AI product studio", fill=stroke, font=font_title)
    draw.text((542, 418), "Web, app, and social asset pack.", fill=stroke, font=font_body)
    save(canvas, name)
    return canvas


def build_brand_board(previews: list[tuple[str, Image.Image, tuple[int, int, int, int]]]) -> Image.Image:
    canvas = Image.new("RGBA", (1800, 1400), COLORS["light_100"])
    draw = ImageDraw.Draw(canvas)
    title_font = load_font(54)
    label_font = load_font(26)
    body_font = load_font(24)
    draw.text((88, 86), "Aroido Flame Asset Pack", fill=COLORS["ink_900"], font=title_font)
    draw.text((88, 150), "Raster pack derived directly from the approved PNG logo masters.", fill=COLORS["ink_700"], font=body_font)
    slots = [
        (88, 220, 492, 492),
        (648, 220, 492, 492),
        (1208, 220, 492, 492),
        (88, 802, 772, 240),
        (940, 802, 772, 240),
        (88, 1096, 492, 240),
        (648, 1096, 492, 240),
        (1208, 1096, 492, 240),
    ]
    for (label, image, fill), (x, y, w, h) in zip(previews, slots):
        panel = Image.new("RGBA", (w, h), fill)
        mask = Image.new("L", (w, h), 0)
        ImageDraw.Draw(mask).rounded_rectangle((0, 0, w, h), radius=38, fill=255)
        panel.putalpha(mask)
        canvas.alpha_composite(panel, (x, y))
        preview = resize_to_fit(image, w - 64, h - 84)
        px = x + (w - preview.width) // 2
        py = y + 56 + (h - 84 - preview.height) // 2
        canvas.alpha_composite(preview, (px, py))
        draw.text((x + 26, y + 22), label, fill=COLORS["light_000"] if fill[0] < 60 else COLORS["ink_900"], font=label_font)
    save(canvas, "aroido-flame-brand-board.png")
    return canvas


def generate() -> None:
    ensure_dirs()

    symbol = extract_transparent_symbol()
    detail = extract_detail_symbol()
    wordmark_mask = extract_wordmark_mask()
    wordmark_dark = colorize_mask(wordmark_mask, COLORS["ink_900"])
    wordmark_light = colorize_mask(wordmark_mask, (244, 247, 252, 255))

    symbol_square = square_canvas(symbol, 1024, scale=0.86)
    detail_square = square_canvas(detail, 1024, scale=0.84)

    save(symbol_square, "aroido-flame-symbol-transparent-1024.png")
    save(detail_square, "aroido-flame-detail-transparent-1024.png")
    save(wordmark_dark, "aroido-flame-wordmark-dark.png")
    save(wordmark_light, "aroido-flame-wordmark-light.png")
    save(mono_symbol(symbol, COLORS["ink_900"]), "aroido-flame-symbol-dark-mono-1024.png")
    save(mono_symbol(symbol, COLORS["light_050"]), "aroido-flame-symbol-light-mono-1024.png")

    lockup_dark_transparent = compose_lockup(detail, wordmark_light, None, "aroido-flame-lockup-dark-transparent-1600.png")
    lockup_light = compose_lockup(symbol, wordmark_dark, None, "aroido-flame-lockup-light-transparent-1600.png")
    compose_lockup(detail, wordmark_light, COLORS["navy_950"], "aroido-flame-lockup-dark-1600.png")
    light_panel = compose_lockup(symbol, wordmark_dark, COLORS["light_100"], "aroido-flame-lockup-light-1600.png")

    icon_dark_1024 = icon_panel(symbol, "dark", 1024)
    icon_light_1024 = icon_panel(symbol, "light", 1024)
    save(icon_dark_1024, "aroido-flame-app-icon-dark-1024.png")
    save(icon_light_1024, "aroido-flame-app-icon-light-1024.png")
    save(icon_dark_1024.resize((512, 512), Image.Resampling.LANCZOS), "aroido-flame-app-icon-dark-512.png")
    save(icon_dark_1024.resize((192, 192), Image.Resampling.LANCZOS), "aroido-flame-app-icon-dark-192.png")
    save(icon_dark_1024.resize((48, 48), Image.Resampling.LANCZOS), "aroido-flame-favicon-dark-48.png")
    save(icon_dark_1024.resize((32, 32), Image.Resampling.LANCZOS), "aroido-flame-favicon-dark-32.png")
    save(icon_dark_1024.resize((16, 16), Image.Resampling.LANCZOS), "aroido-flame-favicon-dark-16.png")
    save(icon_light_1024.resize((512, 512), Image.Resampling.LANCZOS), "aroido-flame-app-icon-light-512.png")
    save(icon_light_1024.resize((192, 192), Image.Resampling.LANCZOS), "aroido-flame-app-icon-light-192.png")
    save(icon_light_1024.resize((48, 48), Image.Resampling.LANCZOS), "aroido-flame-favicon-light-48.png")
    save(icon_light_1024.resize((32, 32), Image.Resampling.LANCZOS), "aroido-flame-favicon-light-32.png")
    save(icon_light_1024.resize((16, 16), Image.Resampling.LANCZOS), "aroido-flame-favicon-light-16.png")
    save(icon_light_1024.resize((180, 180), Image.Resampling.LANCZOS), "aroido-flame-apple-touch-icon-180.png")

    avatar_dark = icon_panel(symbol, "dark", 1024)
    avatar_light = icon_panel(symbol, "light", 1024)
    save(avatar_dark, "aroido-flame-social-avatar-dark-1024.png")
    save(avatar_light, "aroido-flame-social-avatar-light-1024.png")
    save(avatar_dark.resize((512, 512), Image.Resampling.LANCZOS), "aroido-flame-social-avatar-dark-512.png")
    save(avatar_light.resize((512, 512), Image.Resampling.LANCZOS), "aroido-flame-social-avatar-light-512.png")

    og_dark = compose_social_og(detail, wordmark_light, COLORS["navy_950"], COLORS["navy_800"], (207, 221, 250, 255), "aroido-flame-social-og-dark-1200x630.png")
    og_light = compose_social_og(symbol, wordmark_dark, COLORS["light_000"], COLORS["light_200"], COLORS["ink_700"], "aroido-flame-social-og-light-1200x630.png")

    previews = [
        ("Symbol Transparent", symbol_square, COLORS["navy_900"]),
        ("Detail Transparent", detail_square, COLORS["navy_900"]),
        ("App Icon Light", icon_light_1024, COLORS["light_200"]),
        ("Lockup Dark", lockup_dark_transparent, COLORS["navy_900"]),
        ("Lockup Light", light_panel, COLORS["light_200"]),
        ("Wordmark Dark", wordmark_dark, COLORS["light_050"]),
        ("OG Dark", og_dark, COLORS["light_200"]),
        ("OG Light", og_light, COLORS["light_200"]),
    ]
    build_brand_board(previews)


if __name__ == "__main__":
    generate()
