'use client';

import { streamTokenProvider } from '@/lib/actions/stream.action';
import { ChildrenProps } from '@/types';
import { useUser } from '@clerk/nextjs';
import { StreamVideo, StreamVideoClient } from '@stream-io/video-react-sdk';
import { useEffect, useState } from 'react';
import LoadingUI from '../global/loading-ui';

export default function StreamClientProvider({ children }: ChildrenProps) {
  const [streamVideoClient, setStreamVideoClient] = useState<StreamVideoClient>();
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded || !user) return;

    const client = new StreamVideoClient({
      apiKey: process.env.NEXT_PUBLIC_STREAM_API_KEY!,
      user: {
        id: user.id,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.id,
        image: user.imageUrl,
      },
      tokenProvider: streamTokenProvider,
    });

    setStreamVideoClient(client);

    return () => client.disconnectUser(); // cleanup
  }, [isLoaded, user?.id]);

  if (!streamVideoClient) return <LoadingUI />;

  return <StreamVideo client={streamVideoClient}>{children}</StreamVideo>;
}
