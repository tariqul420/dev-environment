'use client';

import { AudioWaveform, BookOpen, Bot, Command, Frame, GalleryVerticalEnd, Map, PieChart, Settings2, SquareTerminal } from 'lucide-react';
import * as React from 'react';

import { Sidebar, SidebarContent, SidebarHeader, SidebarRail } from '@/components/ui/sidebar';
import { NavMain } from './nav-main';
import { NavProjects } from './nav-projects';

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
          url: '#',
        },
      ],
    },
    {
      title: 'Settings',
      url: '#',
      icon: Settings2,
      items: [
        {
          title: 'General',
          url: '#',
        },
        {
          title: 'Team',
          url: '#',
        },
        {
          title: 'Billing',
          url: '#',
        },
        {
          title: 'Limits',
          url: '#',
        },
      ],
    },
  ],
  projects: [
    {
      name: 'Design Engineering',
      url: '#',
      icon: Frame,
    },
    {
      name: 'Sales & Marketing',
      url: '#',
      icon: PieChart,
    },
    {
      name: 'Travel',
      url: '#',
      icon: Map,
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
        <NavProjects projects={data.projects} />
      </SidebarContent>
      {/* <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter> */}
      <SidebarRail />
    </Sidebar>
  );
}
