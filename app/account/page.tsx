import type { Metadata } from 'next';
import { AccountView } from '@/components/account/AccountView';

export const metadata: Metadata = {
  title: 'My Account',
  description: 'Manage your profile, saved addresses and orders.',
  robots: { index: false, follow: false },
};

export default function AccountPage() {
  return <AccountView />;
}
