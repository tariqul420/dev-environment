import { ReactNode } from 'react';

export default function layout({ children }: { children: ReactNode }) {
  return <main className="max-w-4xl mx-auto">{children}</main>;
}
