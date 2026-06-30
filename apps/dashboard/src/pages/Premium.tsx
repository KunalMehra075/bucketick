import { useState } from 'react';
import {
  Sparkles,
  Check,
  Wand2,
  Palette,
  BarChart3,
  Users2,
  Infinity as InfinityIcon,
  ShieldCheck,
} from 'lucide-react';
import { Button, Card, cn } from '@bucketick/ui';
import { PageHeader } from '@/components/layout/PageHeader';

const perks = [
  {
    icon: Wand2,
    title: 'AI trip planner',
    desc: 'Describe a dream, get a real itinerary back in seconds.',
  },
  {
    icon: Palette,
    title: 'Custom themes',
    desc: 'Make your lists look like you, not a default template.',
  },
  {
    icon: BarChart3,
    title: 'Advanced analytics',
    desc: 'Deeper insight into what your audience actually loves.',
  },
  {
    icon: Users2,
    title: 'Unlimited collaborators',
    desc: 'Plan the group trip without the group spreadsheet.',
  },
  {
    icon: InfinityIcon,
    title: 'Unlimited lists',
    desc: 'Dream without a cap. The free plan stops at 10.',
  },
  {
    icon: ShieldCheck,
    title: 'Priority support',
    desc: 'Jump the queue when something needs a human.',
  },
];

const plans = [
  {
    name: 'Free',
    tagline: 'The starter dream kit',
    monthly: 0,
    yearly: 0,
    features: [
      'Up to 10 bucket lists',
      'Basic analytics',
      '1 collaborator per list',
      'Community support',
    ],
    cta: 'Your current plan',
    highlight: false,
    current: true,
  },
  {
    name: 'Premium',
    tagline: 'For the serious dreamer',
    monthly: 9,
    yearly: 84,
    features: [
      'Everything in Free',
      'Unlimited lists & collaborators',
      'AI trip planner',
      'Custom themes',
      'Advanced analytics',
      'Priority support',
    ],
    cta: 'Upgrade to Premium',
    highlight: true,
    current: false,
  },
  {
    name: 'Lifetime',
    tagline: 'Pay once, dream forever',
    monthly: 199,
    yearly: 199,
    features: [
      'Everything in Premium',
      'One payment, no renewals',
      'Early access to new features',
      'Founder badge',
    ],
    cta: 'Go Lifetime',
    highlight: false,
    current: false,
    once: true,
  },
];

const faqs = [
  {
    q: 'Can I cancel anytime?',
    a: 'Yep. Cancel in two clicks and you keep Premium until the period you paid for runs out. No guilt-trip screens.',
  },
  {
    q: 'What happens to my lists if I downgrade?',
    a: 'Nothing disappears. Lists beyond the free limit just become read-only until you upgrade again.',
  },
  {
    q: 'Is the AI planner actually good?',
    a: 'Surprisingly, yes. It is not magic, but it will save you an evening of browser tabs.',
  },
];

export function Premium() {
  const [yearly, setYearly] = useState(true);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Premium"
        subtitle="The free plan is genuinely great. This is for when great stops being enough and you want the whole toolkit."
      />

      {/* Hero */}
      <Card className="overflow-hidden">
        <div className="flex flex-col items-center gap-3 bg-gradient-dusk px-6 py-10 text-center text-white">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/20 backdrop-blur-sm">
            <Sparkles className="h-7 w-7" />
          </span>
          <h2 className="text-2xl font-extrabold sm:text-3xl">Dream bigger, plan smarter</h2>
          <p className="max-w-lg text-sm text-white/85">
            AI planning, unlimited everything, and the kind of polish that makes people ask how you
            did it.
          </p>
        </div>
      </Card>

      {/* Billing toggle */}
      <div className="flex items-center justify-center gap-3">
        <span className={cn('text-sm font-bold', !yearly ? 'text-content' : 'text-content-muted')}>
          Monthly
        </span>
        <button
          onClick={() => setYearly((v) => !v)}
          className={cn(
            'relative h-7 w-12 rounded-full transition-colors',
            yearly ? 'bg-brand-pink' : 'bg-surface2',
          )}
          aria-pressed={yearly}
        >
          <span
            className={cn(
              'absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-soft-sm transition-transform',
              yearly ? 'translate-x-[22px]' : 'translate-x-0.5',
            )}
          />
        </button>
        <span className={cn('text-sm font-bold', yearly ? 'text-content' : 'text-content-muted')}>
          Yearly
        </span>
        <span className="rounded-pill bg-soft-yellow px-2.5 py-0.5 text-xs font-bold text-[#9a6b00]">
          Save 22%
        </span>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {plans.map((plan) => {
          const price = plan.once
            ? plan.monthly
            : yearly
              ? Math.round(plan.yearly / 12)
              : plan.monthly;
          return (
            <Card
              key={plan.name}
              className={cn(
                'relative flex flex-col p-6',
                plan.highlight && 'border-brand-pink shadow-soft-md ring-1 ring-brand-pink',
              )}
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-pill bg-brand-pink px-3 py-1 text-xs font-bold text-white">
                  Most popular
                </span>
              )}
              <p className="text-lg font-extrabold text-content">{plan.name}</p>
              <p className="text-sm text-content-muted">{plan.tagline}</p>

              <div className="mt-4 flex items-end gap-1">
                <span className="text-4xl font-extrabold tracking-tight text-content">
                  ${price}
                </span>
                <span className="mb-1 text-sm font-semibold text-content-muted">
                  {plan.once ? 'once' : '/mo'}
                </span>
              </div>
              {!plan.once && yearly && plan.yearly > 0 && (
                <p className="text-xs font-semibold text-content-muted">
                  ${plan.yearly} billed yearly
                </p>
              )}

              <ul className="mt-5 space-y-2.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-content">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-pink" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.highlight ? 'primary' : 'outline'}
                className="mt-6 w-full"
                disabled={plan.current}
              >
                {plan.cta}
              </Button>
            </Card>
          );
        })}
      </div>

      {/* Perks grid */}
      <div>
        <h2 className="mb-4 text-lg font-bold text-content">What you actually get</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {perks.map((p) => {
            const Icon = p.icon;
            return (
              <Card key={p.title} className="p-5">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-soft-pink text-brand-pink">
                  <Icon className="h-5 w-5" />
                </span>
                <p className="mt-3 font-bold text-content">{p.title}</p>
                <p className="mt-1 text-sm text-content-muted">{p.desc}</p>
              </Card>
            );
          })}
        </div>
      </div>

      {/* FAQ */}
      <div>
        <h2 className="mb-4 text-lg font-bold text-content">Questions, answered</h2>
        <div className="space-y-3">
          {faqs.map((f) => (
            <Card key={f.q} className="p-5">
              <p className="font-bold text-content">{f.q}</p>
              <p className="mt-1 text-sm text-content-muted">{f.a}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
