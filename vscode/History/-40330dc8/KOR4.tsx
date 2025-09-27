'use client';

import { BlogCardProps } from '@/types/blog';
import { BadgeTitle } from '../badge-title';
import AnimationContainer from '../global/animation-container';
import NoResults from '../global/no-results';
import MagicButton from '../magic-button';
import BlogCard from '../root/blog-card';

const Blogs = ({ blogs }: { blogs: BlogCardProps[] }) => {
  return (
    <section id="blogs" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center">
        <AnimationContainer delay={0.2}>
          <BadgeTitle title="Latest Blogs" />
        </AnimationContainer>

        {blogs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full mt-12">
              {blogs.map((blog, index) => (
                <AnimationContainer key={index} delay={0.1 * index}>
                  <BlogCard blog={blog} />
                </AnimationContainer>
              ))}
            </div>

            <AnimationContainer delay={0.3}>
              <MagicButton href="/blogs" type="shiny" className="mt-12">
                See all Blogs
              </MagicButton>
            </AnimationContainer>
          </>
        ) : (
          <NoResults className="w-full mt-12" title="No Blogs Found" description="No blog posts yet. Check again soon." />
        )}
      </div>
    </section>
  );
};

export default Blogs;
