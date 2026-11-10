"""Expand the registry icon's strokes into fillable contours for the intro.

uv run --with fonttools --with skia-pathops python scripts/generate-icon-outline.py

Normal builds use the committed paths and do not require Python.
"""

import json
import re
from pathlib import Path

import pathops
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.svgLib.path import parse_path

root = Path(__file__).resolve().parents[1]
source_path = root / "lib/brand-icon.ts"
source = source_path.read_text()
width = float(re.search(r"BRAND_ICON_STROKE_WIDTH = ([\d.]+)", source)[1])
path_list = re.search(r"BRAND_ICON_PATHS = \[(.*?)\] as const;", source, re.S)[1]
paths = [json.loads(value) for value in re.findall(r'"[^"\n]*"', path_list)]
number = lambda value: f"{value:.3f}".rstrip("0").rstrip(".")
parts = []
circle_count = 0


def circle(cx, cy, radius):
    right, left = number(cx + radius), number(cx - radius)
    y, r = number(cy), number(radius)
    return f"M{right} {y}A{r} {r} 0 1 1 {left} {y}A{r} {r} 0 1 1 {right} {y}Z"

for data in paths:
    # Keep circular bands exact; generic stroke offsetters approximate small
    # circles noticeably when the stroke is thick relative to their radius.
    match = re.fullmatch(
        r"M([\d.]+) ([\d.]+)a([\d.]+) \3 0 1 1\s*(-[\d.]+) 0a\3 \3 0 1 1\s*([\d.]+) 0Z",
        data,
    )
    if match:
        circle_count += 1
        x, y, radius, first, second = map(float, match.groups())
        assert first == -2 * radius and second == 2 * radius
        cx = x - radius
        parts.append(circle(cx, y, radius + width / 2))
        if radius > width / 2:
            parts.append(circle(cx, y, radius - width / 2))
        continue
    outline = pathops.Path()
    parse_path(data, outline.getPen())
    outline.stroke(width, pathops.LineCap.ROUND_CAP, pathops.LineJoin.ROUND_JOIN, 4)
    outline.convertConicsToQuads(0.0001)
    outline = pathops.simplify(outline)
    outline.convertConicsToQuads(0.0001)
    pen = SVGPathPen(None, ntos=number)
    outline.draw(pen)
    parts.append(pen.getCommands())

assert circle_count == 2, "Expected Disc3's two circular bands."
declaration = "export const BRAND_ICON_BODY =\n  " + json.dumps("".join(parts)) + ";\n"
source = re.sub(r"export const BRAND_ICON_BODY =\s*\"[^\"]*\";\n?", "", source)
source_path.write_text(source.rstrip() + "\n" + declaration)
print("Generated fillable Disc3 contours with round caps and joins.")
