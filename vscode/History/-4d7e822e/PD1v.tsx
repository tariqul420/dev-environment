'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Quote } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function TestimonialSection() {
  const testimonials = [
    {
      quote: 'Meetora transformed our hiring process and boosted team collaboration.',
      author: 'Sarah L.',
      role: 'Product Lead, TechCorp',
      image: '/avatars/sarah.jpg',
    },
    {
      quote: 'Scheduling and video interviews are now effortless and fast.',
      author: 'John D.',
      role: 'HR Manager, InnovateX',
      image: '/avatars/john.jpg',
    },
    {
      quote: 'I love how easy it is to share feedback with my team in real time.',
      author: 'Emily K.',
      role: 'Recruitment Specialist, HireRight',
      image: '/avatars/emily.jpg',
    },
  ];

  const [testimonialIndex, setTestimonialIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTestimonialIndex((i: number) => (i + 1) % testimonials.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const { quote, author, role, image } = testimonials[testimonialIndex];

  return (
    <section className="max-w-4xl mx-auto text-center py-20 px-6">
      <h2 className="text-4xl font-bold mb-14">What Our Users Say</h2>

      <figure className="flex flex-col items-center space-y-8 max-w-xl mx-auto">
        {/* Avatar */}
        <Avatar className="w-24 h-24 shadow-lg">
          <AvatarImage src={image} alt={`${author} photo`} />
          <AvatarFallback>{author.split(' ')[0][0]}</AvatarFallback>
        </Avatar>

        {/* Quote Icon */}
        <Quote className="w-8 h-8 text-primary mx-auto" />

        {/* Quote Text */}
        <blockquote className="italic text-lg text-muted-foreground">{`“${quote}”`}</blockquote>

        {/* Author and Role */}
        <figcaption className="mt-2 text-foreground font-semibold text-lg">
          {author}
          <span className="block text-sm text-muted-foreground font-normal">{role}</span>
        </figcaption>
      </figure>

      {/* Pagination Dots */}
      <div className="mt-10 flex justify-center space-x-4">
        {testimonials.map((_, i) => (
          <button
            key={i}
            aria-label={`Show testimonial ${i + 1}`}
            className={`
      w-4 h-4 rounded-full transition-colors
      focus:outline-none focus:ring-2 focus:ring-primary
      ${i === testimonialIndex ? 'bg-primary' : 'bg-muted-foreground hover:bg-primary/70'}
    `}
            onClick={() => setTestimonialIndex(i)}
          />
        ))}
      </div>
    </section>
  );
}
