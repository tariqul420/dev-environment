import Image from 'next/image';
import { BadgeTitle } from '../badge-title';
import AnimationContainer from '../global/animation-container';
import { TextAnimate } from '../magicui/text-animate';

export default function AboutMe() {
  return (
    <section id="about-me" className="pt-24">
      <div className="relative flex flex-col gap-12 lg:flex-row items-center">
        {/* Image Section */}
        <AnimationContainer direction="left" className="lg:w-[30%] w-[320px] h-[320px]  flex justify-center">
          <Image
            blurDataURL="/assets/images/tariqul-islam.jpeg"
            className="lg:w-[320px] rounded-full shadow-lg object-cover"
            src="/assets/images/tariqul-islam.jpeg"
            alt="Tariqul Islam"
            width={320}
            height={320}
            loading="lazy"
            placeholder="blur"
          />
        </AnimationContainer>

        {/* About Content Section */}
        <div className="lg:w-[70%] flex flex-col items-center lg:items-start text-foreground">
          <AnimationContainer delay={0.2}>
            <BadgeTitle title="About Me" />
          </AnimationContainer>

          <TextAnimate animation="fadeIn" by="character" once delay={0} duration={0.5} className="text-center lg:text-start text-3xl font-semibold leading-[48px] mb-4">
            Md. Tariqul Islam
          </TextAnimate>

          <TextAnimate animation="blurInUp" by="character" once delay={0.5} duration={0.7} className="text-justify text-lg leading-[31px] text-muted-foreground font-medium">
            I’m a Full Stack Developer passionate about crafting modern, responsive web applications. I specialize in React, TypeScript, and Tailwind CSS, with experience in Node.js, Express, and
            MongoDB. My goal is to create seamless digital experiences that solve real-world problems.
          </TextAnimate>
        </div>
      </div>

      {/* Additional Information */}
      <div className="mt-12 space-y-10">
        {/* Beyond Coding Section */}
        <div>
          <TextAnimate animation="fadeIn" by="character" once delay={3} duration={0.5} className="text-xl font-semibold">
            Beyond the Code
          </TextAnimate>
          <TextAnimate animation="blurInUp" by="character" once delay={3.5} duration={0.5} className="mt-3 text-lg font-medium leading-[31px]">
            When I’m not coding, I enjoy cycling, exploring new frameworks like Svelte, and mentoring aspiring developers. I’m a lifelong learner, always eager to dive into the latest tech trends.
          </TextAnimate>
        </div>
      </div>
    </section>
  );
}
