import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export default function PricingCards() {
  const plans = [
    {
      name: 'Free',
      price: 'Free',
      description: 'Best for individuals or testing the platform.',
      features: ['1 Recruiter seat', '5 Interviews/month', 'Basic scheduling', 'Join via browser'],
      cta: 'Start for Free',
      highlighted: false,
    },
    {
      name: 'Pro',
      price: '$29/mo',
      description: 'Perfect for small teams conducting interviews regularly.',
      features: ['5 Recruiter seats', 'Unlimited interviews', 'Custom branding', 'Priority support'],
      cta: 'Start Pro Trial',
      highlighted: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'Ideal for large orgs and hiring at scale.',
      features: ['Unlimited seats', 'SSO & team roles', 'Team analytics', 'Dedicated support'],
      cta: 'Contact Sales',
      highlighted: false,
    },
  ];
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {plans.map((plan) => (
        <Card key={plan.name} className={`flex flex-col justify-between ${plan.highlighted ? 'border-primary shadow-xl scale-[1.03]' : ''}`}>
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
    </section>
  );
}
