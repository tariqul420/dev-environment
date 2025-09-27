import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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

const faq = [
  {
    question: 'Can I cancel anytime?',
    answer: 'Yes, you can cancel your subscription from your account dashboard anytime without penalty.',
  },
  {
    question: 'Is there a free trial?',
    answer: 'Absolutely! The Pro plan includes a 7-day free trial with no credit card required.',
  },
  {
    question: 'Do you offer discounts for nonprofits or students?',
    answer: 'Yes, we offer special pricing. Please contact our support team for eligibility.',
  },
  {
    question: 'What payment methods are accepted?',
    answer: 'We accept all major credit cards. For Enterprise, invoicing is also available.',
  },
];

export default function PricingPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16 space-y-24">
      {/* Hero Section */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold">Pricing that fits your team</h1>
        <p className="text-muted-foreground text-lg">Start for free, upgrade as you grow. No contracts, cancel anytime.</p>
      </section>

      {/* Pricing Cards */}
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

      {/* Feature Comparison Table */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-center">Compare Plans</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-border rounded-lg">
            <thead>
              <tr className="bg-muted text-left">
                <th className="p-3 font-semibold">Feature</th>
                <th className="p-3">Free</th>
                <th className="p-3">Pro</th>
                <th className="p-3">Enterprise</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Recruiter Seats', '1', '5', 'Unlimited'],
                ['Monthly Interviews', '5', 'Unlimited', 'Unlimited'],
                ['Custom Branding', '-', '✓', '✓'],
                ['Team Roles & Permissions', '-', '-', '✓'],
                ['Priority Support', '-', '✓', '✓'],
                ['SSO Integration', '-', '-', '✓'],
              ].map(([feature, free, pro, enterprise]) => (
                <tr key={feature} className="border-t">
                  <td className="p-3">{feature}</td>
                  <td className="p-3 text-center">{free}</td>
                  <td className="p-3 text-center">{pro}</td>
                  <td className="p-3 text-center">{enterprise}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ Section */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full max-w-2xl mx-auto">
          {faq.map(({ question, answer }) => (
            <AccordionItem key={question} value={question}>
              <AccordionTrigger>{question}</AccordionTrigger>
              <AccordionContent>{answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* CTA Section */}
      <section className="text-center bg-muted rounded-2xl p-8 space-y-4">
        <h3 className="text-2xl font-semibold">Ready to start interviewing smarter?</h3>
        <p className="text-muted-foreground">Create your account and run your first interview in minutes.</p>
        <Button size="lg">Get Started</Button>
      </section>
    </div>
  );
}
