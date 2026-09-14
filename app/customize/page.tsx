import type { Metadata } from 'next';
import { JerseyCustomizer } from '@/components/customizer/JerseyCustomizer';

export const metadata: Metadata = {
  title: 'Customize Your Kit',
  description:
    'Build a fully customizable football kit from real product photography — choose your top, shorts and socks, add a name, number and competition patches with live pricing.',
  alternates: { canonical: '/customize' },
};

export default function CustomizePage() {
  return <JerseyCustomizer />;
}
