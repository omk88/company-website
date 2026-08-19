export const TAGS = [
    "product",
    "research",
    "design",
    "technology",
    "opinion",
    "tutorials"
] as const;

export type Tag = (typeof TAGS)[number];