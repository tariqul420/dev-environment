import { BlogCardProps } from '@/types/blog';
import { Calendar, EyeIcon } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export default function BlogCard({ blog }: { blog: BlogCardProps }) {
  return (
    <Link key={blog.slug} href={`/blogs/${blog.slug}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader>
          <CardTitle className="line-clamp-2">{blog.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-2 line-clamp-2">{blog.description}</p>
          {/* CreatedAt date */}

          <div className="flex gap-4">
            <p className="text-xs flex text-muted-foreground items-center gap-1">
              <Calendar size={14} /> Published on: {new Date(blog.createdAt).toLocaleDateString()}
            </p>

            <span>|</span>

            <p className="text-xs flex items-center gap-1 text-muted-foreground">
              <EyeIcon className="w-4 h-4" />
              <span>{blog.views ?? 0} views</span>
            </p>
          </div>

          {/* Categories list */}
          {Array.isArray(blog.categories) && blog.categories.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {blog.categories.map((category: string) => (
                <Badge key={category} variant="outline" className="text-xs font-normal">
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
