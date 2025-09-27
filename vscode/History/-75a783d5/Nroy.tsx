import { ChildrenProps } from '@/types';
import { useAuth } from '@clerk/nextjs';
import { StreamVideoClient } from '@stream-io/video-react-sdk';
import { useState } from 'react';

export default function StreamClientProvider({ children }: ChildrenProps) {
  const [streamVideoClient, setStreamVideoClient] = useState<StreamVideoClient>();
  const { userId } = useAuth();
  return { children };
}
