import AnimationContainer from '../global/animation-container';
import MagicButton from '../magic-button';
import { AnimatedShinyText } from '../magicui/animated-shiny-text';

const StartProject = () => {
  return (
    <section className="my-10">
      <AnimationContainer delay={0.5} className="flex flex-col lg:flex-row gap-6 items-center justify-between px-14 max-sm:px-6 py-12 rounded-2xl bg-card border border-border">
        <div>
          <h4 className="text-2xl font-semibold">
            <AnimatedShinyText>Begin Your Journey</AnimatedShinyText>
          </h4>
        </div>

        <div>
          <p className="text-base text-center max-w-lg text-muted-foreground">Excited to collaborate? Let&apos;s set up a time to discuss your project. Coffee&apos;s on me!</p>
        </div>

        <MagicButton href="#contact-me">Let&apos;s Talk</MagicButton>
      </AnimationContainer>
    </section>
  );
};

export default StartProject;
