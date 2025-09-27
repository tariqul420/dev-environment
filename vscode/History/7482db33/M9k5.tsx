'use client';

import Image from 'next/image';

import { Button } from '@/components/ui/button';

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="en">
      <body className="bg-white transition-colors duration-200 dark:bg-black">
        <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-4 py-12 md:flex-row md:gap-12 lg:gap-16">
          <div className="w-full max-w-md space-y-6 md:w-1/2">
            <div className="relative">
              <Image src="/error/404.png" width={400} height={400} alt="404 error illustration" className="mx-auto mb-6" priority />
              <div className="space-y-4 text-center">
                <h1 className="mb-4 text-2xl font-bold sm:text-3xl">Looks like you&apos;ve found the doorway to the great nothing</h1>
                <p className="dark:text-medium-bg mb-6 text-base text-gray-600 sm:text-lg">Sorry about that! Please try again or visit our homepage.</p>
                <Button onClick={reset} className="  cursor-pointer rounded-md px-6 py-2 text-white transition-colors duration-200">
                  Try Again
                </Button>
              </div>
            </div>
          </div>
          <div className="w-full max-w-md md:w-1/2">
            <Image src="/error/socket.png" width={400} height={400} alt="Group illustration" className="mx-auto" priority />
          </div>
        </div>
      </body>
    </html>
  );
}
