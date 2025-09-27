'use client';
import { useLottie } from 'lottie-react';

const LottieAni = () => {
  const options = {
    animationData: '/lotte.json',
    loop: true,
    autoplay: true,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  const { View } = useLottie(options);

  return <div className="w-full h-full max-w-[500px] max-h-[300px]">{View}</div>;
};

export default LottieAni;
// lottie ani
