export interface Heading {
  id: string;
  text: string;
  level: number;
}

function stripMarkdownLinks(text: string): string {
  return text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
}

export function extractHeadings(markdown: string): Heading[] {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const headings: Heading[] = [];
  let match;

  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length;
    
    const linkStripped = stripMarkdownLinks(match[2]);
    const text = linkStripped.trim().replace(/[*_~`]/g, "");
    
    const id = text
      .toLowerCase()
      .replace(/\//g, "-")        
      .replace(/[^\w\s-]/g, "")    
      .replace(/\s+/g, "-")       
      .replace(/-+/g, "-");       

    headings.push({ id, text, level });
  }

  return headings;
}