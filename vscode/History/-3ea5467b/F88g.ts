import fs from 'fs/promises';
import matter from 'gray-matter';
import path from 'path';

const BLOG_DIR = path.join(process.cwd(), 'content/blogs');

export async function getBlogSlugs() {
  const files = await fs.readdir(BLOG_DIR);
  return files.map((file) => file.replace(/\.mdx$/, ''));
}

export async function getBlogBySlug(slug: string) {
  const fullPath = path.join(BLOG_DIR, `${slug}.mdx`);
  const raw = await fs.readFile(fullPath, 'utf8');
  const { data, content } = matter(raw);
  return { slug, frontmatter: data, content };
}

export async function getAllBlogs() {
  const slugs = await getBlogSlugs();
  return await Promise.all(slugs.map((slug) => getBlogBySlug(slug)));
}
