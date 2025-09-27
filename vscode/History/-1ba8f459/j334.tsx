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
  return <div>pricing-cards</div>;
}
