# Aroido Brand Marks

Available Aroido icon variants:

- `aroido-mark.svg`: primary color mark
- `aroido-mark-dark-mono.svg`: dark monochrome (for light backgrounds)
- `aroido-mark-light-mono.svg`: light monochrome (for dark backgrounds)

Current usage:

- Home page topbar uses `light-mono` because the page runs a dark theme.
- Projects/Team/VibeSmith topbars use `dark-mono`.
- Site-level favicon for home/projects/team uses the primary color mark.

## Flame Raster Pack

This repo also includes a raster asset pack derived directly from the approved PNG logo masters.

Source masters:

- `flame-source/aroido-flame-symbol-master.png`
- `flame-source/aroido-flame-lockup-master.png`

Generated outputs:

- `flame-raster/aroido-flame-symbol-transparent-1024.png`
- `flame-raster/aroido-flame-detail-transparent-1024.png`
- `flame-raster/aroido-flame-wordmark-dark.png`
- `flame-raster/aroido-flame-wordmark-light.png`
- `flame-raster/aroido-flame-lockup-dark-1600.png`
- `flame-raster/aroido-flame-lockup-light-1600.png`
- `flame-raster/aroido-flame-lockup-dark-transparent-1600.png`
- `flame-raster/aroido-flame-lockup-light-transparent-1600.png`
- `flame-raster/aroido-flame-app-icon-dark-1024.png`
- `flame-raster/aroido-flame-app-icon-light-1024.png`
- `flame-raster/aroido-flame-social-avatar-dark-1024.png`
- `flame-raster/aroido-flame-social-avatar-light-1024.png`
- `flame-raster/aroido-flame-social-og-dark-1200x630.png`
- `flame-raster/aroido-flame-social-og-light-1200x630.png`
- `flame-raster/aroido-flame-brand-board.png`

Recommended usage:

- App icon, favicon, profile image: the simplified symbol and app icon variants
- Website header and presentation lockup: the `lockup-light` or `lockup-dark` variants
- Social or hero artwork on dark backgrounds: the detailed mark and dark OG asset
- One-color fallback: `aroido-flame-symbol-dark-mono-1024.png` or `aroido-flame-symbol-light-mono-1024.png`

Notes:

- No vector master was available, so this pack is intentionally raster-derived from the approved PNGs.
- The detailed network mark carries a soft glow from the original dark-background master and is best on dark surfaces.

Regenerate:

```bash
python3 scripts/generate_aroido_flame_assets.py
```
