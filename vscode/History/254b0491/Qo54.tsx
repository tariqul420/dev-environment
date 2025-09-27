export default function HowItWork() {
  return (
    <section className="bg-muted/50 py-20 px-6">
      <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>

      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10 relative">
        {/* Timeline Line */}
        <div className="hidden md:block absolute top-1/2 left-8 right-8 h-1 bg-primary/30 translate-y-1/2 -z-10 rounded-full"></div>

        <Step number={1} title="Schedule" description="Add candidates, select time slots, and generate interview links." />
        <Step number={2} title="Interview" description="Conduct video interviews with built-in notes and timers." />
        <Step number={3} title="Evaluate" description="Collect feedback instantly from your team, all in one place." />
      </div>
    </section>
  );
}

// Step Component for How it Works
function Step({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center text-center max-w-xs mx-auto relative">
      {/* Circle with number */}
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-lg mb-4 z-10 relative shadow-md">{number}</div>

      {/* Content */}
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
