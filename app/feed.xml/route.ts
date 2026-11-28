import RSS from "rss";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com";

export async function GET() {
  const posts = await fetchQuery(api.rss.listForFeed, {});

  const feed = new RSS({
    title: "TaQtiQ",
    description: "Latest insights.",
    site_url: SITE_URL,
    feed_url: `${SITE_URL}/feed.xml`,
    language: "en",
    pubDate: posts[0] ? new Date(posts[0].createdAt) : new Date(),
  });

  for (const post of posts) {
    const postUrl = `${SITE_URL}/blog/${post.blogTitleId}`;

    feed.item({
      title: post.title,
      description: post.subtitle,
      url: postUrl,
      guid: post._id,
      author: post.author,
      categories: post.tags,
      date: new Date(post.createdAt),
      ...(post.imageUrl
        ? {
            enclosure: {
              url: post.imageUrl,
              type: "image/jpeg",
            },
          }
        : {}),
      ...(post.content
        ? {
            custom_elements: [{ "content:encoded": post.content }],
          }
        : {}),
    });
  }

  return new Response(feed.xml({ indent: true }), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}