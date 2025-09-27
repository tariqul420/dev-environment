import { ChildrenProps } from '@/types';
import { useUser } from '@clerk/nextjs';
import { StreamVideoClient } from '@stream-io/video-react-sdk';
import { useState } from 'react';

export default function StreamClientProvider({ children }: ChildrenProps) {
  const [streamVideoClient, setStreamVideoClient] = useState<StreamVideoClient>();
  const { user } = useUser();
  return { children };
}
