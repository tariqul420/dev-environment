'use client';

import AnimationContainer from '../global/animation-container';
import { IconDock } from '../icon-dock';
import { InteractiveHoverButton } from '../magicui/interactive-hover-button';
import { SparklesText } from '../magicui/sparkles-text';
import { TypingAnimation } from '../magicui/typing-animation';
import { TerminalProfile } from '../terminal-profile';

const Banner = () => {
  const resumeLink = 'https://drive.google.com/uc?export=download&id=1UheF68g8pawYs2GEvXXS0mSJTonplz7U';

  const handelResumeDownload = () => {
    const link = document.createElement('a');
    link.href = resumeLink;
    link.setAttribute('download', 'Resume of Md Tariqul Islam.pdf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="#" className="mt-4">
      <div className="lg:flex-row grid grid-cols-1 md:grid-cols-2 items-center">
        {/* Text Section */}
        <AnimationContainer delay={0.1} className="flex-1 items-center justify-center">
          <p className="text-[2.5rem] md:text-[3.5rem] lg:text-[2.5rem] font-semibold text-center lg:text-left">Hi, I&apos;m</p>
          <SparklesText className="text-[3.5rem] md:text-[4.5rem] lg:text-[3.5rem] font-bold text-center lg:text-left max-sm:text-5xl mb-2">Tariqul Islam</SparklesText>
          <TypingAnimation className="text-2xl font-medium max-sm:text-center">Full Stack Developer | Problem Solver</TypingAnimation>
          {/* Social Links */}
          <div className="flex items-center justify-center lg:justify-start">
            <IconDock />
          </div>
          <div className="mt-4 flex items-center justify-center lg:justify-start">
            <InteractiveHoverButton onClick={handelResumeDownload}>Download Resume</InteractiveHoverButton>
          </div>
        </AnimationContainer>

        {/* Right column - Code window */}
        <AnimationContainer delay={0.3} className="flex-1 py-4 flex items-center justify-end">
          <TerminalProfile />
        </AnimationContainer>
      </div>
    </section>
  );
};

export default Banner;
