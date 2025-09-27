import { serialize } from 'next-mdx-remote/serialize';

export async function parseMDX(source: string) {
  return await serialize(source);
}
