import { ChildrenProps } from '@/types';
import { useUser } from '@clerk/nextjs';
import { StreamVideoClient } from '@stream-io/video-react-sdk';
import { useEffect, useState } from 'react';

export default function StreamClientProvider({ children }: ChildrenProps) {
  const [streamVideoClient, setStreamVideoClient] = useState<StreamVideoClient>();
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (!user && !isLoaded) return;
    const client = new StreamVideoClient({
      apiKey: process.env.NEXT_PUBLIC_STREAM_API_KEY,
      user: {
        id: user.id,
        name: `${user.firstName} ${user.lastName}` || user.id,
        image: user.imageUrl,
      },
      tokenProvider: streamTokenProvider,
    });

    if (!setStreamVideoClient) return <p>Loading...</p>;
  }, []);

  return { children };
}
