import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const team = [
  {
    name: 'Tariqul Islam',
    role: 'Founder & Engineer',
    image: '/avatars/tariqul.jpg', // use actual image or fallback
  },
  {
    name: 'Sarah Lin',
    role: 'Product Designer',
    image: '/avatars/sarah.jpg',
  },
  {
    name: 'Jason Roy',
    role: 'AI/ML Engineer',
    image: '/avatars/jason.jpg',
  },
];

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16 space-y-20">
      {/* Hero / Mission */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold">About Meetora</h1>
        <p className="text-muted-foreground text-lg">Empowering modern teams to conduct smarter, faster, and more human interviews — from anywhere.</p>
        <Button size="lg">Get Started</Button>
      </section>

      {/* Company Story */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Our Story</h2>
        <p className="text-muted-foreground leading-relaxed">
          Meetora was born out of a simple need: to make interviews less painful and more productive. As remote work became the norm, we realized the traditional tools weren't enough. We set out to
          build a platform that not only connects people via video but also provides structure, clarity, and insights to help teams make better hiring decisions — all in real time.
        </p>
      </section>

      <Separator />

      {/* Why Meetora */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Why Meetora?</h2>
        <ul className="list-disc ml-6 text-muted-foreground space-y-2">
          <li>Built for remote-first teams</li>
          <li>Integrated scheduling and video in one tool</li>
          <li>Role-based access and streamlined candidate evaluation</li>
          <li>Fast, secure, and beautiful to use</li>
        </ul>
      </section>

      {/* Our Team */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Meet the Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {team.map(({ name, role, image }) => (
            <div key={name} className="flex flex-col items-center text-center space-y-2">
              <Avatar className="w-20 h-20">
                <AvatarImage src={image} />
                <AvatarFallback>{name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="text-sm font-medium">{name}</div>
              <div className="text-xs text-muted-foreground">{role}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="text-center bg-muted rounded-xl py-12 px-6 space-y-4">
        <h3 className="text-2xl font-semibold">Ready to interview smarter?</h3>
        <p className="text-muted-foreground">Start using Meetora or reach out to us with questions.</p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Button size="lg">Join Now</Button>
          <Button variant="outline" size="lg">
            Contact Us
          </Button>
        </div>
      </section>
    </div>
  );
}
