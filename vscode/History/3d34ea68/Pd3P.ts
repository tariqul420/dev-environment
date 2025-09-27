import { IconMapKey } from '@/components/dashboard/dashboard-sidebar';

export const admin = [
  {
    title: 'Dashboard',
    url: '/admin',
    icon: 'LayoutDashboard' as IconMapKey,
  },
  {
    title: 'Projects',
    url: '/admin/projects',
    icon: 'FolderKanban' as IconMapKey,
  },
  {
    title: 'Blogs',
    url: '/admin/blogs',
    icon: 'Newspaper' as IconMapKey,
  },
];

export const sidebar = {
  admin,
};
