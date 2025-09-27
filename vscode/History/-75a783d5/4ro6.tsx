import { ChildrenProps } from '@/types';
import { StreamVideoClient } from '@stream-io/video-react-sdk';
import { useState } from 'react';

export default function StreamClientProvider({ children }: ChildrenProps) {
  const [streamVideoClient, setStreamVideoClient] = useState<StreamVideoClient>();
  return { children };
}
