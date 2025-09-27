'use client';

import { BlogCardProps } from '@/types/blog';
import { BadgeTitle } from '../badge-title';
import AnimationContainer from '../global/animation-container';
import NoResults from '../global/no-results';
import MagicButton from '../magic-button';
import BlogCard from '../root/blog-card';

const BlogSection = ({ blogs }: { blogs: BlogCardProps[] }) => {
  return (
    <section id="blogs" className="pt-24">
      <div className="max-w-7xl mx-auto w-full flex flex-col items-center">
        <AnimationContainer delay={0.2}>
          <BadgeTitle title="Latest Blogs" />
        </AnimationContainer>

        {blogs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full mt-8">
              {blogs.map((blog, index) => (
                <AnimationContainer key={index} delay={0.2 * index}>
                  <BlogCard blog={blog} />
                </AnimationContainer>
              ))}
            </div>

            <AnimationContainer delay={0.2}>
              <MagicButton href="/blogs" type="shiny" className="mt-6">
                See all Blogs
              </MagicButton>
            </AnimationContainer>
          </>
        ) : (
          <NoResults className="min-w-4xl" title="No Blogs Found" description="No blog posts yet. Check again soon." />
        )}
      </div>
    </section>
  );
};

export default BlogSection;
