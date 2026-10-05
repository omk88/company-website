import { api } from '@/convex/_generated/api';
import { fetchQuery } from 'convex/nextjs';
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://taqtiq.tech';

  let blogPosts: Array<{ slug: string; updatedAt: number }> = [];
  let usernames: string[] = [];

  try {
    const [fetchedPosts, fetchedUsernames] = await Promise.all([
      fetchQuery(api.blogs.getSitemapBlogs, {}),
      fetchQuery(api.blogs.getSitemapUsernames, {}),
    ]);
    blogPosts = fetchedPosts;
    usernames = fetchedUsernames;
  } catch (error) {
    console.error("Error fetching sitemap data:", error);
  }

  const blogUrls: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/insights/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const profileUrls: MetadataRoute.Sitemap = usernames.map((username) => ({
    url: `${baseUrl}/${username}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const routes = ['', '/about', '/contact', '/insights', '/sign-in', '/solutions', '/rules', '/terms-and-conditions', '/privacy-policy', '/inbox', '/create-blog', '/cookie-policy', '/careers'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1.0 : 0.5,
  }));

  return [...routes, ...blogUrls, ...profileUrls];
}

export const revalidate = 86400;