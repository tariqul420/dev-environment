import { ChildrenProps } from '@/types';

export default function RootLayout({ children }: ChildrenProps) {
  return <main className="mx-auto min-h-screen w-[90vw] max-w-7xl py-14">{children}</main>;
}
