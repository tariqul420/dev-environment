'use client';

import { Braces, Calculator, FileText, Globe, Image as ImageIcon, Link as LinkIcon, SquareTerminal, Type } from 'lucide-react';
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
    { name: 'Acme Inc', logo: FileText, plan: 'Enterprise' },
    { name: 'Acme Corp.', logo: ImageIcon, plan: 'Startup' },
    { name: 'Evil Corp.', logo: SquareTerminal, plan: 'Free' },
  ],
  navMain: [
    {
      title: 'Url',
      url: '/tools/url',
      icon: LinkIcon, // was SquareTerminal
      isActive: true,
      items: [{ title: 'URL Shortener', url: '/tools/url' }],
    },
    {
      title: 'Text',
      url: '/tools/text/qr',
      icon: Type, // was Bot
      items: [
        { title: 'QR Code', url: '/tools/text/qr' },
        { title: 'Base64', url: '/tools/text/base64' },
        { title: 'Case Converter', url: '/tools/text/case-converter' },
        { title: 'Slugify', url: '/tools/text/slugify' },
        { title: 'Word Counter', url: '/tools/text/word-counter' }, // fixed path (was work-counter)
      ],
    },
    {
      title: 'PDF',
      url: '/tools/pdf/merge',
      icon: FileText, // better fit for docs/PDF
      items: [
        { title: 'PDF Merge', url: '/tools/pdf/merge' },
        { title: 'PDF Split', url: '/tools/pdf/split' },
        { title: 'PDF Compress', url: '/tools/pdf/compress' },
        { title: 'PDF to Word', url: '/tools/pdf/pdf-to-word' },
      ],
    },
    {
      title: 'Image',
      url: '/tools/image/convert',
      icon: ImageIcon, // was Settings2
      items: [
        { title: 'Image Convert', url: '/tools/image/convert' },
        { title: 'Image Resize', url: '/tools/image/resize' },
        { title: 'EXIF Remove', url: '/tools/image/exif-remove' },
      ],
    },
    {
      title: 'Developer',
      url: '/tools/dev/json-formatter',
      icon: Braces, // was Settings2
      items: [
        { title: 'JSON Formatter', url: '/tools/dev/json-formatter' },
        { title: 'JWT Decoder', url: '/tools/dev/jwt-decode' },
        { title: 'Regex Tester', url: '/tools/dev/regex-tester' },
      ],
    },
    {
      title: 'SEO',
      url: '/tools/seo/og-builder',
      icon: Globe, // was Settings2
      items: [
        { title: 'OG Image Builder', url: '/tools/seo/og-builder' },
        { title: 'robots.txt Generator', url: '/tools/seo/robots-generator' }, // label cleaned up
      ],
    },
    {
      title: 'Calculators',
      url: '/tools/calc/bmi',
      icon: Calculator, // was Settings2
      items: [
        { title: 'BMI Calculator', url: '/tools/calc/bmi' },
        { title: 'Unit Converter', url: '/tools/calc/unit-converter' },
        { title: 'Date Difference', url: '/tools/calc/date-diff' },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
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
