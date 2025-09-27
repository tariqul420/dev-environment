import Image from "next/image";

const loading = () => {
  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <div className="space-y-6 px-4 text-center">
        {/* Spinner with Logo */}
        <div className="relative mx-auto h-24 w-24">
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-black border-t-transparent dark:border-white dark:border-t-transparent"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src="/assets/icon.webp"
              alt="Loading Icon"
              width={70}
              height={70}
              className="rounded-full grayscale"
            />
          </div>
        </div>

        {/* Loading Text */}
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">
            Nurturing Your Natural Glow...
          </h2>
          <p className="text-sm">
            Preparing nature-powered skincare for you 🌱
          </p>
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center gap-2">
          <div
            className="h-2 w-2 animate-bounce rounded-full bg-black dark:bg-white"
            style={{ animationDelay: "0s" }}
          ></div>
          <div
            className="h-2 w-2 animate-bounce rounded-full bg-black dark:bg-white"
            style={{ animationDelay: "0.2s" }}
          ></div>
          <div
            className="h-2 w-2 animate-bounce rounded-full bg-black dark:bg-white"
            style={{ animationDelay: "0.4s" }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default loading;
