import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';

const BLOG_DIR = path.join(process.cwd(), 'content/blogs');

export function getBlogSlugs(): string[] {
  return fs.readdirSync(BLOG_DIR).map((file) => file.replace(/\.mdx$/, ''));
}

export function getBlogBySlug(slug: string) {
  const fullPath = path.join(BLOG_DIR, `${slug}.mdx`);
  const fileContent = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContent);

  return { slug, frontmatter: data, content };
}

export function getAllBlogs() {
  const slugs = getBlogSlugs();
  return slugs.map((slug) => getBlogBySlug(slug));
}
