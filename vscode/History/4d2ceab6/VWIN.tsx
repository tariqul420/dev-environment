import { BlogCardProps } from '@/types/blog';
import { Calendar, EyeIcon, HeartIcon } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export default function BlogCard({ blog }: { blog: BlogCardProps }) {
  return (
    <Link key={blog.slug} href={`/blogs/${blog.slug}`}>
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-colors">{blog.title}</CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{blog.description}</p>

          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mb-3">
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              {new Date(blog.createdAt).toLocaleDateString()}
            </span>

            <span className="text-muted-foreground">•</span>

            <span className="flex items-center gap-1">
              <EyeIcon size={14} />
              {blog.views ?? 0} views
            </span>

            <span className="text-muted-foreground">•</span>

            <span className="flex items-center gap-1">
              <HeartIcon size={13} />
              {blog.likes} likes
            </span>
          </div>

          {Array.isArray(blog.categories) && blog.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {blog.categories.map((category) => (
                <Badge key={category} variant="outline" className="rounded-md text-xs font-medium hover:bg-muted transition">
                  #{category}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
