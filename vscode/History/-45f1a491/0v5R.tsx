'use client';

import { Progress } from '@/components/ui/progress';
import { useEffect, useState } from 'react';

export default function LoadingUI() {
  const [progress, setProgress] = useState(13);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-screen flex flex-col items-center justify-center space-y-4">
      <div className="w-full max-w-md text-center">
        <p className="text-lg font-semibold text-muted-foreground">Loading, please wait...</p>
      </div>
      <Progress value={progress} className="w-[15%]" />
    </div>
  );
}
