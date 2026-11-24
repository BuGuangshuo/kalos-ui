// Intl.Segmenter is available at runtime in modern browsers, including in apps compiled with ES2020 libs.
type GraphemeSegmenter = {
  segment(value: string): Iterable<{ segment: string }>;
};
const { Segmenter } = Intl as typeof Intl & { Segmenter?: new () => GraphemeSegmenter };
const graphemes = Segmenter && new Segmenter();

export function firstGrapheme(value: string): string {
  if (graphemes) {
    for (const part of graphemes.segment(value)) return part.segment;
  }
  return Array.from(value)[0] ?? "";
}
