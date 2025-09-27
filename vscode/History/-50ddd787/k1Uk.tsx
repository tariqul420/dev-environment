'use client';

import { AudioWaveform, BookOpen, Bot, Command, GalleryVerticalEnd, Settings2, SquareTerminal } from 'lucide-react';
import * as React from 'react';

import { Sidebar, SidebarContent, SidebarHeader, SidebarRail } from '@/components/ui/sidebar';
import { NavMain } from './nav-main';

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
    {
      name: 'Evil Corp.',
      logo: Command,
      plan: 'Free',
    },
  ],
  navMain: [
    {
      title: 'Url',
      url: '/tools/url',
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: 'URL Shortener',
          url: '/tools/url',
        },
      ],
    },
    {
      title: 'Text',
      url: '/tools/text/qr',
      icon: Bot,
      items: [
        {
          title: 'QR Code',
          url: '/tools/text/qr',
        },
        {
          title: 'Base64',
          url: '/tools/text/base64',
        },
        {
          title: 'Case Converter',
          url: '/tools/text/case-converter',
        },
        {
          title: 'Slugify',
          url: '/tools/text/slugify',
        },
        {
          title: 'Word Counter',
          url: '/tools/text/work-counter',
        },
      ],
    },
    {
      title: 'PDF',
      url: '/tools/pdf/merge',
      icon: BookOpen,
      items: [
        {
          title: 'PDF Merge',
          url: '/tools/pdf/merge',
        },
        {
          title: 'PDF Split',
          url: '/tools/pdf/split',
        },
        {
          title: 'PDF Compress',
          url: '/tools/pdf/compress',
        },
        {
          title: 'PDF to Word',
          url: '/tools/pdf/pdf-to-word',
        },
      ],
    },
    {
      title: 'Image',
      url: '/tools/image/convert',
      icon: Settings2,
      items: [
        {
          title: 'Image Convert',
          url: '/tools/image/convert',
        },
        {
          title: 'Image Resize',
          url: '/tools/image/resize',
        },
        {
          title: 'EXIF Remove',
          url: '/tools/image/exif-remove',
        },
      ],
    },
    {
      title: 'Developer',
      url: '/tools/dev/json-formatter',
      icon: Settings2,
      items: [
        {
          title: 'JSON Formatter',
          url: '/tools/dev/json-formatter',
        },
        {
          title: 'JWT Decoder',
          url: '/tools/dev/jwt-decode',
        },
        {
          title: 'Regex Tester',
          url: '/tools/dev/regex-tester',
        },
      ],
    },
    {
      title: 'SEO',
      url: '/tools/seo/og-builder',
      icon: Settings2,
      items: [
        {
          title: 'OG Image Builder',
          url: '/tools/seo/og-builder',
        },
        {
          title: 'Robots.txt Generate',
          url: '/tools/seo/robots-generator',
        },
      ],
    },
    {
      title: 'Calculators',
      url: '/tools/calc/bmi',
      icon: Settings2,
      items: [
        {
          title: 'JSON Formatter',
          url: '/tools/dev/json-formatter',
        },
        {
          title: 'JWT Decoder',
          url: '/tools/dev/jwt-decode',
        },
        {
          title: 'Regex Tester',
          url: '/tools/dev/regex-tester',
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {/* <TeamSwitcher teams={data.teams} /> */}
        <h2>Tools Hub</h2>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      {/* <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter> */}
      <SidebarRail />
    </Sidebar>
  );
}
