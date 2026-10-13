import GithubSlugger from "github-slugger";

export interface Heading {
  id: string;
  text: string;
  level: number;
}

export function stripMarkdownLinks(text: string): string {
  return text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
}

export function cleanHeadingText(text: string): string {
  const linkStripped = stripMarkdownLinks(text);
  return linkStripped.trim().replace(/[*_~`]/g, "");
}

export function processHeadings(rawHeadings: { text: string; level: number }[]): Heading[] {
  const slugger = new GithubSlugger();

  return rawHeadings.map((heading) => {
    const text = cleanHeadingText(heading.text);
    const id = slugger.slug(text);

    return {
      id,
      text,
      level: heading.level,
    };
  });
}