export type Hsva = { h: number; s: number; v: number; a: number };
type Rgba = { r: number; g: number; b: number; a: number };

export const defaultColor = "#0190fe";
export const clampColor = (value: number, max = 1) => Math.min(max, Math.max(0, value));

const hexPattern = /^#?([\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})$/i;
const component = "[+-]?(?:\\d+(?:\\.\\d*)?|\\.\\d+)%?";
const commaRgb = new RegExp(`^(${component})\\s*,\\s*(${component})\\s*,\\s*(${component})(?:\\s*,\\s*(${component}))?$`);
const spaceRgb = new RegExp(`^(${component})\\s+(${component})\\s+(${component})(?:\\s*/\\s*(${component}))?$`);
export const completeColorInput = /^(?:#?(?:[\da-f]{6}|[\da-f]{8})|rgba?\(.*\))$/i;

function parseColor(input: string): Rgba | undefined {
  const text = input.trim();
  const hex = hexPattern.exec(text)?.[1];
  if (hex) {
    const digits = hex.length <= 4 ? [...hex].map((digit) => digit.repeat(2)).join("") : hex;
    const byte = (offset: number) => Number.parseInt(digits.slice(offset, offset + 2), 16);
    return { r: byte(0), g: byte(2), b: byte(4), a: digits.length === 8 ? byte(6) / 255 : 1 };
  }
  const args = /^rgba?\(([^)]*)\)$/i.exec(text)?.[1]?.trim();
  if (!args) return;
  const match = commaRgb.exec(args) ?? spaceRgb.exec(args);
  if (!match) return;
  const channel = (value: string) => clampColor(Number.parseFloat(value) / (value.endsWith("%") ? 100 : 255)) * 255;
  const opacity = match[4];
  return {
    r: channel(match[1]),
    g: channel(match[2]),
    b: channel(match[3]),
    a: opacity ? clampColor(Number.parseFloat(opacity) / (opacity.endsWith("%") ? 100 : 1)) : 1,
  };
}

function toHex({ r, g, b, a }: Rgba, alpha: boolean) {
  const byte = (value: number) => Math.round(value).toString(16).padStart(2, "0");
  const opacity = Math.round(a * 255);
  return `#${byte(r)}${byte(g)}${byte(b)}${alpha && opacity < 255 ? byte(opacity) : ""}`;
}

export function normalizeColor(input: string, alpha: boolean) {
  const color = parseColor(input);
  return color ? toHex(color, alpha) : undefined;
}

export function colorToHsva(hex: string, previous?: Hsva): Hsva {
  const rgba = parseColor(hex) ?? { r: 1, g: 144, b: 254, a: 1 };
  const r = rgba.r / 255;
  const g = rgba.g / 255;
  const b = rgba.b / 255;
  const v = Math.max(r, g, b);
  const chroma = v - Math.min(r, g, b);
  let h = previous?.h ?? 0;
  if (chroma) {
    if (v === r) h = (g - b) / chroma;
    else if (v === g) h = (b - r) / chroma + 2;
    else h = (r - g) / chroma + 4;
    h = (h * 60 + 360) % 360;
  }
  // Gray has no hue. Black also has no saturation to recover.
  return { h, s: v ? chroma / v : previous?.s ?? 0, v, a: rgba.a };
}

export function hsvaToHex({ h, s, v, a }: Hsva, alpha: boolean) {
  const channel = (offset: number) => {
    const sector = (offset + h / 60) % 6;
    return 255 * v * (1 - s * Math.max(0, Math.min(sector, 4 - sector, 1)));
  };
  return toHex({ r: channel(5), g: channel(3), b: channel(1), a }, alpha);
}
