import { AnimatedSpan, Terminal } from './magicui/terminal';

const profile = {
  name: 'Tariqul Islam',
  title: 'Full-Stack Developer',
  skills: ['React', 'NextJS', 'Express', 'Tailwind CSS', 'MongoDB', 'TypeScript', 'Javascript', 'Git', 'Firebase'],
  hardWorker: true,
  quickLearner: true,
  problemSolver: true,
  yearsOfExperience: 1,
  hireable: function () {
    return this.hardWorker && this.problemSolver && this.skills.length >= 5 && this.yearsOfExperience >= 1;
  },
};

export function TerminalProfile() {
  const baseDelay = 1500;
  const lineDelay = 1000;
  let currentDelay = baseDelay;

  const getNextDelay = () => {
    const delay = currentDelay;
    currentDelay += lineDelay;
    return delay;
  };

  return (
    <Terminal className="overflow-y-auto">
      <AnimatedSpan delay={getNextDelay()} className="text-purple">
        <span>✔ Fetching profile data...</span>
      </AnimatedSpan>

      <AnimatedSpan delay={getNextDelay()} className="text-pink">
        <span>Name: {profile.name}</span>
      </AnimatedSpan>

      <AnimatedSpan delay={getNextDelay()} className="text-pink">
        <span>Title: {profile.title}</span>
      </AnimatedSpan>

      <AnimatedSpan delay={getNextDelay()} className="text-purple">
        <span>✔ Loading skills...</span>
      </AnimatedSpan>

      {profile.skills.map((skill) => (
        <AnimatedSpan key={skill} delay={getNextDelay()} className="text-pink">
          <span className="pl-2">- {skill}</span>
        </AnimatedSpan>
      ))}

      <AnimatedSpan delay={getNextDelay()} className="text-purple">
        <span>✔ Verifying traits...</span>
      </AnimatedSpan>

      <AnimatedSpan delay={getNextDelay()} className="text-pink">
        <span>Hard Worker: {profile.hardWorker ? 'Yes' : 'No'}</span>
      </AnimatedSpan>

      <AnimatedSpan delay={getNextDelay()} className="text-pink">
        <span>Quick Learner: {profile.quickLearner ? 'Yes' : 'No'}</span>
      </AnimatedSpan>

      <AnimatedSpan delay={getNextDelay()} className="text-pink">
        <span>Problem Solver: {profile.problemSolver ? 'Yes' : 'No'}</span>
      </AnimatedSpan>

      <AnimatedSpan delay={getNextDelay()} className="text-pink">
        <span>Years of Experience: {profile.yearsOfExperience}</span>
      </AnimatedSpan>

      <AnimatedSpan delay={getNextDelay()} className="text-purple">
        <span>✔ Evaluating hireable status...</span>
      </AnimatedSpan>

      <AnimatedSpan delay={getNextDelay()} className="text-pink">
        <span>Hireable: {profile.hireable() ? 'Yes' : 'No'}</span>
      </AnimatedSpan>

      <AnimatedSpan delay={getNextDelay()} className="text-muted-foreground">
        <span>Profile retrieval completed.</span>
      </AnimatedSpan>

      <AnimatedSpan delay={getNextDelay()} className="text-muted-foreground">
        <span>Ready for next command.</span>
      </AnimatedSpan>
    </Terminal>
  );
}
