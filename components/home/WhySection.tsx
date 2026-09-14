import { Section, SectionHeading } from '@/components/ui/Container';
import { ShieldIcon, TruckIcon, PaletteIcon, CheckIcon } from '@/components/ui/icons';

const REASONS = [
  {
    icon: ShieldIcon,
    title: 'Authentic & verified',
    body: 'Every jersey is quality-checked before it ships. No surprises, no fakes — just the real thing.',
  },
  {
    icon: PaletteIcon,
    title: 'Made to personalize',
    body: 'A premium customizer lets you add names, numbers and patches with live pricing.',
  },
  {
    icon: TruckIcon,
    title: 'Fast Nigeria delivery',
    body: 'Dispatched within 24 hours and delivered 3–5 days nationwide, with Lagos pickup available.',
  },
  {
    icon: CheckIcon,
    title: 'Secure checkout',
    body: 'Pay by secure bank transfer. Orders are confirmed only after payment is received — no card details stored.',
  },
];

export function WhySection() {
  return (
    <Section className="bg-paper-2">
      <div className="shell">
        <SectionHeading
          eyebrow="Why MyJerseyPlug"
          title="Confidence, stitched into every order"
          description="We obsess over the details so you can shop without second-guessing."
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {REASONS.map((r) => (
            <div key={r.title} className="card p-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-accent-soft text-accent-dark">
                <r.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-h3 text-ink">{r.title}</h3>
              <p className="mt-2 text-small text-ink-muted">{r.body}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
