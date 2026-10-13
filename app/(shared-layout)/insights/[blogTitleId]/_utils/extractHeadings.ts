import { Heading, processHeadings } from "../_utils/headingUtils";

export function extractHeadings(markdown: string): Heading[] {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const rawHeadings: { text: string; level: number }[] = [];
  let match;

  while ((match = headingRegex.exec(markdown)) !== null) {
    rawHeadings.push({
      level: match[1].length,
      text: match[2],
    });
  }

  return processHeadings(rawHeadings);
}