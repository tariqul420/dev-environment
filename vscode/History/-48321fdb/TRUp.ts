// lib/getMdxBlogs.ts

import fs from 'fs';
import path from 'path';

export const getAllMdxBlogs = async () => {
  const blogsDirectory = path.join(process.cwd(), 'app', 'blogs');

  const folders = fs.readdirSync(blogsDirectory);
  const blogs = await Promise.all(
    folders.map(async (folder) => {
      const filePath = path.join(blogsDirectory, folder, 'page.mdx');
      if (fs.existsSync(filePath)) {
        const { metadata } = await import(`@/app/blogs/${folder}/page.mdx`);
        return {
          slug: folder,
          title: metadata.title,
          description: metadata.description,
        };
      }
      return null;
    }),
  );

  return blogs.filter(Boolean); // remove nulls
};
