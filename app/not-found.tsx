import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="shell flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <p className="text-display font-display text-accent-dark">404</p>
      <h1 className="mt-2 text-h2 text-ink">Page not found</h1>
      <p className="mt-2 max-w-sm text-body text-ink-muted">
        The page you’re looking for doesn’t exist or may have moved.
      </p>
      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <Button href="/">Back home</Button>
        <Button href="/shop" variant="outline">Shop jerseys</Button>
      </div>
    </div>
  );
}
