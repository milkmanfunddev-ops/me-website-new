type PortableTextSpan = { _type?: string; text?: string };
type PortableTextBlock = {
  _type?: string;
  children?: PortableTextSpan[];
};

export function portableTextToPlain(value: unknown): string {
  if (!Array.isArray(value)) return "";
  return value
    .map((block) => {
      const b = block as PortableTextBlock;
      if (!b || b._type !== "block" || !Array.isArray(b.children)) return "";
      return b.children
        .map((span) => (typeof span?.text === "string" ? span.text : ""))
        .join("");
    })
    .filter(Boolean)
    .join("\n\n")
    .trim();
}
