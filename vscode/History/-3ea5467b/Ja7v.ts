import fs from 'fs/promises'; // ✅ async version
import matter from 'gray-matter';
import path from 'path';

const BLOG_DIR = path.join(process.cwd(), 'content/blogs');

export async function getBlogSlugs(): Promise<string[]> {
  const files = await fs.readdir(BLOG_DIR);
  return files.map((file) => file.replace(/\.mdx$/, ''));
}

export async function getBlogBySlug(slug: string) {
  const fullPath = path.join(BLOG_DIR, `${slug}.mdx`);
  const fileContent = await fs.readFile(fullPath, 'utf8');
  const { data, content } = matter(fileContent);

  return { slug, frontmatter: data, content };
}

export async function getAllBlogs() {
  const slugs = await getBlogSlugs();
  const blogs = await Promise.all(slugs.map((slug) => getBlogBySlug(slug)));
  return blogs;
}
