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

  useEffect(() => {
    const storedLikes = JSON.parse(localStorage.getItem('blog_likes') || '{}');
    setLiked(!!storedLikes[slug]);
  }, [slug]);

  const handleLikeToggle = async () => {
    const storedLikes = JSON.parse(localStorage.getItem('blog_likes') || '{}');

    if (storedLikes[slug]) {
      setLikes((prev) => prev - 1);
      delete storedLikes[slug];
      setLiked(false);
      await updateBlogLike(slug, false);
    } else {
      setLikes((prev) => prev + 1);
      storedLikes[slug] = true;
      setLiked(true);
      await updateBlogLike(slug, true);
    }

    localStorage.setItem('blog_likes', JSON.stringify(storedLikes));
  };

  return (
    <div className={`flex items-center gap-1 cursor-pointer transition ${liked ? 'text-red-500' : 'hover:text-primary'}`} onClick={handleLikeToggle}>
      <HeartIcon className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
      <span>{likes} likes</span>
    </div>
  );
}
