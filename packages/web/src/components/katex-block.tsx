import katex from "katex";

interface KaTeXBlockProps {
  expression: string;
  displayMode?: boolean;
}

export function KaTeXBlock({
  expression,
  displayMode = false,
}: KaTeXBlockProps) {
  const html = katex.renderToString(expression, {
    displayMode,
    throwOnError: false,
    strict: false,
  });

  return (
    <span
      className={displayMode ? "block my-6 text-center overflow-x-auto" : ""}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
