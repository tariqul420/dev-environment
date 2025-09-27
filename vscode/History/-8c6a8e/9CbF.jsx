"use client";
import { useLottie } from "lottie-react";

const LottieAnimation = () => {
  const options = {
    animationData: "/lotte.json",
    loop: true,
    autoplay: true,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const { View } = useLottie(options);

  return (
    <div className="h-full max-h-[300px] w-full max-w-[500px]">{View}</div>
  );
};

export default LottieAnimation;
