'use client';

import { updateBlogLike } from '@/lib/actions/blog.action';
import { HeartIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

interface LikeButtonProps {
  blogId: string;
  initialLikes: number;
}

export default function LikeButtonClient({ blogId, initialLikes }: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const storedLikes = JSON.parse(localStorage.getItem('blog_likes') || '{}');
    setLiked(!!storedLikes[blogId]);
  }, [blogId]);

  const handleLikeToggle = async () => {
    const storedLikes = JSON.parse(localStorage.getItem('blog_likes') || '{}');

    if (storedLikes[blogId]) {
      setLikes((prev) => prev - 1);
      delete storedLikes[blogId];
      setLiked(false);
      await updateBlogLike(blogId, false);
    } else {
      setLikes((prev) => prev + 1);
      storedLikes[blogId] = true;
      setLiked(true);
      await updateBlogLike(blogId, true);
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
