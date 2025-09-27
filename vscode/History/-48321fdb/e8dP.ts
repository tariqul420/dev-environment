// lib/get-mdx-blogs.ts
export async function getAllMdxBlogs(): Promise<Blog[]> {
  const blogs = folders.map((folder) => {
    const filePath = path.join(BLOGS_PATH, folder, 'page.mdx');
    const file = fs.readFileSync(filePath, 'utf-8');
    const { data: metadata } = matter(file);

    if (!metadata.title || !metadata.description) return null;

    return {
      slug: folder,
      title: metadata.title,
      description: metadata.description,
    };
  });

  return blogs.filter(Boolean) as Blog[];
}
