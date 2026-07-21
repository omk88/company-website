export function calculateScores(creationTime: number, likes: number, commentCount: number) {
  const ageInHours = Math.max((Date.now() - creationTime) / (1000 * 60 * 60), 1);

  const hotScore = (likes + commentCount * 2) / Math.pow(ageInHours + 2, 1.5);
  const controversialScore = commentCount > 0 ? commentCount / Math.max(likes, 1) : 0;

  return { hotScore, controversialScore }
}

export function calculateCommentScores(creationTime: number, likes: number, blogLikes: number, bodyLength: number) {
  const ageInHours = Math.max((Date.now() - creationTime) / (1000 * 60 * 60), 1);

  const hotScore = (likes * 2) / Math.pow(ageInHours + 2, 1.5);

  const depthFactor = Math.log10(Math.max(bodyLength, 10));
  const engagementDivergence = (blogLikes + 1) / (likes + 2);
  const controversialScore = Number((depthFactor * engagementDivergence).toFixed(4));

  return { hotScore, controversialScore }
}