import { ChildrenProps } from '@/types';
import { useUser } from '@clerk/nextjs';
import { StreamVideoClient } from '@stream-io/video-react-sdk';
import { useEffect, useState } from 'react';

export default function StreamClientProvider({ children }: ChildrenProps) {
  const [streamVideoClient, setStreamVideoClient] = useState<StreamVideoClient>();
  const { user } = useUser();

  useEffect(() => {
    if (!user) return;
  }, []);

  return { children };
}
