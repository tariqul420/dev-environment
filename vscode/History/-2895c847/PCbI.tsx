import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const plans = [
  {
    name: 'Free',
    price: 'Free',
    description: 'Great for candidates and solo recruiters.',
    features: ['1 Recruiter seat', '5 Interviews / month', 'Basic scheduling', 'Standard support'],
    cta: 'Get Started',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$29/mo',
    description: 'Designed for teams who interview regularly.',
    features: ['5 Recruiter seats', 'Unlimited interviews', 'Calendar & email integration', 'Priority support'],
    cta: 'Start Pro Trial',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'Custom plans and onboarding for large orgs.',
    features: ['Unlimited recruiters', 'Advanced permissions', 'Team analytics', 'Dedicated support'],
    cta: 'Contact Sales',
    highlighted: false,
  },
];

export default function PricingPage() {
  return (
    <section className="max-w-6xl mx-auto py-16 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold">Simple, Transparent Pricing</h1>
        <p className="text-muted-foreground mt-2">Choose a plan that fits your team and start interviewing better.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.name} className={`flex flex-col justify-between border ${plan.highlighted ? 'border-primary shadow-lg scale-[1.03]' : ''}`}>
            <CardHeader>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <p className="text-3xl font-bold mt-2">{plan.price}</p>
              <p className="text-muted-foreground text-sm mt-1">{plan.description}</p>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between">
              <ul className="mt-4 space-y-2 text-sm">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <span className="mr-2 text-primary">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <Button variant={plan.highlighted ? 'default' : 'outline'} className="mt-6 w-full">
                {plan.cta}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
