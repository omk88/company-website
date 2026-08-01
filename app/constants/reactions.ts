export const EMOJI_REACTIONS = [
  { type: "heart", field: "heartCount", emoji: "❤️", label: "Heart" },
  { type: "insightful", field: "insightfulCount", emoji: "💡", label: "Insightful" },
  { type: "mindblown", field: "mindblownCount", emoji: "🤯", label: "Mind Blown" },
  { type: "fire", field: "fireCount", emoji: "🔥", label: "Hot Take" },
  { type: "thinking", field: "thinkingCount", emoji: "🤔", label: "Curious" },
] as const;

export type ReactionType = (typeof EMOJI_REACTIONS)[number]["type"];
export type ReactionField = (typeof EMOJI_REACTIONS)[number]["field"];