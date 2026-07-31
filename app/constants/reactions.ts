export const EMOJI_REACTIONS = [
  { type: "like", emoji: "❤️", label: "Love" },
  { type: "insightful", emoji: "💡", label: "Insightful" },
  { type: "mindblown", emoji: "🤯", label: "Mind Blown" },
  { type: "fire", emoji: "🔥", label: "Hot Take" },
  { type: "thinking", emoji: "🤔", label: "Curious" },
] as const;

export type ReactionType = (typeof EMOJI_REACTIONS)[number]["type"];