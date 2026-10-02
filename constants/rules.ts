export interface PlatformRule {
  id: string;
  title: string;
  description: string;
}

export const PLATFORM_RULES: PlatformRule[] = [
  {
    id: "off-topic",
    title: "Keep content on topic",
    description:
      "This is a tech blog, try to keep all content about technology and coding/programming. Content that is off topic will be removed.",
  },
  {
    id: "explicit-content",
    title: "No explicit content",
    description:
      "Any explicit/adult/pornographic content will be removed and you will be banned.",
  },
  {
    id: "plagiarism",
    title: "No plagiarism",
    description:
      "Plagiarised content will be removed. Cross posting content is fine but stealing somebody else's content will get you banned.",
  },
  {
    id: "low-value",
    title: "Do not post low value content",
    description:
      "Content that is low effort and low value will be removed. This includes content that is entirely or almost entirely AI generated.",
  },
  {
    id: "doxxing",
    title: "Don't post people's private information without permission",
    description:
      "Any post containing personal information without permission from that individual (such as their physical address) will be removed immediately and you will be banned.",
  },
];