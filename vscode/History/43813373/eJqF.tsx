import Image from 'next/image';

const loading = () => {
  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <div className="space-y-6 px-2 text-center">
        {/* Animated Spinner with Educational Icons */}
        <div className="relative mx-auto h-24 w-24">
          <div className="border-t-purple absolute inset-0 animate-spin rounded-full border-4"></div>
          <div className="absolute inset-0 flex animate-pulse items-center justify-center">
            <Image src="/assets/logo/logo.png" alt="EduGenius Logo" width={28} height={28} />
          </div>
        </div>

        {/* Loading Text */}
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold"> Building Your Portfolio Experience</h2>
          <p>Loading Tariqul Islam&apos;s projects...</p>
        </div>

        {/* Optional Progress Dots */}
        <div className="flex justify-center gap-2">
          <div className="bg-pink h-2 w-2 animate-bounce rounded-full" style={{ animationDelay: '0s' }}></div>
          <div className="bg-pink h-2 w-2 animate-bounce rounded-full" style={{ animationDelay: '0.2s' }}></div>
          <div className="bg-pink h-2 w-2 animate-bounce rounded-full" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default loading;
