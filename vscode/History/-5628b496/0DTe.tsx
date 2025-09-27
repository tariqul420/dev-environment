'use client';

import { TechStack } from '@/data/tech-stack';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

interface CardProps {
  data: TechStack;
}

export default function TechStackCard({ data }: CardProps) {
  return (
    <Link rel="noopener noreferrer" href={data.link} target="_blank">
      <div className="relative group bg-gradient-to-r dark:from-dark-lite to-transparent rounded-lg p-6 shadow border-l-2 flex flex-col min-h-full">
        {/* Icon */}
        <div className="absolute top-4 right-4 cursor-pointer group-hover:-translate-y-1 group-hover:rotate-[50deg] duration-150 transition-all ease-linear">
          <ArrowUpRight className="w-8 h-8 p-2 rounded-full flex items-center justify-center dark:bg-dark-lite bg-gray-100" />
        </div>

        {/* Tech Icon */}
        <div className="flex-shrink-0 mb-4">
          <div className="w-12 h-12 bg-muted shadow rounded-md flex items-center justify-center p-2">{data.icon}</div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold mb-2">{data.name}</h2>

        {/* Description */}
        <p className="text-sm">{data.description}</p>
      </div>
    </Link>
  );
}
