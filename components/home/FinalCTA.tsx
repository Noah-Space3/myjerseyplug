import { Button } from '@/components/ui/Button';

export function FinalCTA() {
  return (
    <section className="shell pb-16 pt-4 sm:pb-20">
      <div className="relative overflow-hidden rounded-xl border border-line bg-gradient-to-br from-accent-soft to-paper-warm px-6 py-14 text-center sm:px-12 sm:py-20">
        <p className="text-label uppercase text-accent-dark">Ready when you are</p>
        <h2 className="mx-auto mt-3 max-w-xl text-h1 text-ink">Rep your colours this season</h2>
        <p className="mx-auto mt-4 max-w-md text-body text-ink-muted">
          From matchday classics to a fully custom kit, your next jersey is a few taps away.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button href="/shop">Shop Jerseys</Button>
          <Button href="/customize" variant="outline">
            Customize Your Kit
          </Button>
        </div>
      </div>
    </section>
  );
}
