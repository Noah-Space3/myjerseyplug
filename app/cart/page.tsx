import type { Metadata } from 'next';
import { CartView } from '@/components/cart/CartView';

export const metadata: Metadata = {
  title: 'Cart',
  description: 'Review your jerseys and custom kits before checkout.',
  robots: { index: false, follow: true },
};

export default function CartPage() {
  return <CartView />;
}
