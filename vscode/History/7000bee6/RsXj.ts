import { Code, LayoutPanelLeft, LucideIcon } from 'lucide-react';

type Service = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export const services: Service[] = [
  {
    title: 'Web Development',
    description: 'I build modern, responsive and performant web applications using the latest technologies.',
    icon: Code,
  },
  {
    title: 'Wordpress Development',
    description: 'I build custom themes and plugins for WordPress, and can also help with maintenance and optimization.',
    icon: LayoutPanelLeft,
  },
];
