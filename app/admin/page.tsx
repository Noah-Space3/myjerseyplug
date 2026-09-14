import type { Metadata } from 'next';
import { AdminApp } from '@/components/admin/AdminApp';

export const metadata: Metadata = {
  title: 'Admin',
  description: 'MyJerseyPlug back office — products, pricing, inventory, delivery and orders.',
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminApp />;
}
