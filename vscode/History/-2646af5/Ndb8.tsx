'use client';

import { updateBlogLike } from '@/lib/actions/blog.action';
import { HeartIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

interface LikeButtonProps {
  slug: string;
  initialLikes: number;
}

export default function LikeButtonClient({ slug, initialLikes }: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);

  const key = `blog_like_${slug}`;

  useEffect(() => {
    const stored = localStorage.getItem(key);
    setLiked(!!stored);
  }, [key]);

  const handleLikeToggle = async () => {
    const isLiked = localStorage.getItem(key);

    if (isLiked) {
      setLikes((prev) => prev - 1);
      localStorage.removeItem(key);
      setLiked(false);
      await updateBlogLike(slug, false);
    } else {
      setLikes((prev) => prev + 1);
      localStorage.setItem(key, 'liked');
      setLiked(true);
      await updateBlogLike(slug, true);
    }
  };

  return (
    <div className={`flex items-center gap-1 cursor-pointer transition ${liked ? 'text-red-500' : 'hover:text-primary'}`} onClick={handleLikeToggle}>
      <HeartIcon className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
      <span>{likes} likes</span>
    </div>
  );
}
