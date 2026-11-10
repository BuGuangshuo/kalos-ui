"""Regenerate the outlined wordmark, merging overlapping font contours first.

Run from the repository with:
uv run --with fonttools --with brotli --with skia-pathops python scripts/generate-wordmark.py

Normal builds use the committed SVG paths and do not require Python.
"""

import json
import re
from pathlib import Path

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from fontTools.ttLib.removeOverlaps import removeOverlaps


def svg_number(value):
    return f"{value:.3f}".rstrip("0").rstrip(".")


root = Path(__file__).resolve().parents[1]
brand_path = root / "lib/brand.ts"
font_path = root / "node_modules/@fontsource/outfit/files/outfit-latin-600-normal.woff2"
font = TTFont(font_path)
cmap = font.getBestCmap()
text = "Kalos UI"

# Font contours can overlap even when the filled glyph looks correct. Stroking
# those contours exposes internal seams (notably in a and K), so union them.
removeOverlaps(font, glyphNames=sorted({cmap[ord(char)] for char in text}))
glyphs = font.getGlyphSet()
pen = SVGPathPen(glyphs, ntos=svg_number)
scale = 57.354 / font["head"].unitsPerEm
cursor = 77
for char in text:
    glyph_name = cmap[ord(char)]
    glyphs[glyph_name].draw(TransformPen(pen, (scale, 0, 0, -scale, cursor, 51)))
    cursor += font["hmtx"][glyph_name][0] * scale - 0.5

source = brand_path.read_text()
source, path_count = re.subn(
    r'(export const KALOS_WORDMARK =\s*)"[^"]*";',
    lambda match: match[1] + json.dumps(pen.getCommands()) + ";",
    source,
)
source, viewbox_count = re.subn(
    r'export const KALOS_LOGO_VIEWBOX = "[^"]*";',
    f'export const KALOS_LOGO_VIEWBOX = "0 0 {svg_number(cursor + 9)} 64";',
    source,
)
source, wordmark_viewbox_count = re.subn(
    r'export const KALOS_WORDMARK_VIEWBOX = "[^"]*";',
    f'export const KALOS_WORDMARK_VIEWBOX = "77 0 {svg_number(cursor + 9 - 77)} 64";',
    source,
)
assert path_count == viewbox_count == wordmark_viewbox_count == 1, "Expected one wordmark and matching viewBoxes."
source = re.sub(
    r"^//[^\n]*",
    "// Kalos UI: an AnimateIcons Disc3 mark and Outfit SemiBold (600) with merged contours.",
    source,
    count=1,
)
brand_path.write_text(source)
print(f"Generated Outfit 600 wordmark with merged contours; width {svg_number(cursor + 9)}.")
