import MyButton from "@/components/global/my-btn";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { BlogCardProps } from "@/types/blog";
import { format } from "date-fns";
import Image from "next/image";

export default function BlogCard({ post }: { post: BlogCardProps }) {
  return (
    <Card className="group flex h-full flex-col transition-shadow duration-300 hover:shadow-xl">
      <CardHeader>
        {/* Blog Image */}
        <div className="relative h-48 w-full">
          <Image
            src={post.image}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="rounded-t-md object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </CardHeader>
      <CardContent className="flex flex-grow flex-col justify-between pt-0">
        {/* Blog Title */}
        <h3 className="mb-2 line-clamp-2 text-xl font-semibold">
          {post.title}
        </h3>

        {/* Blog Short Description */}
        <p className="mb-1 line-clamp-2">{post.description}</p>

        {/* Blog Date */}
        <p className="text-sm">{format(new Date(post.createdAt), "PPP")}</p>
      </CardContent>
      <CardFooter className="flex justify-center">
        {/* Read More Button */}
        <MyButton href={`/blogs/${post.slug}`} className="w-full">
          আরও পড়ুন
        </MyButton>
      </CardFooter>
    </Card>
  );
}
