import {} from '';
import { ChildrenProps } from '@/types';
import { useState } from 'react';

export default function StreamClientProvider({ children }: ChildrenProps) {
  const [streamVideoClient, setStreamVideoClient] = useState<StreamVideoClient>();
  return { children };
}
