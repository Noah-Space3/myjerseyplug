import { formatNGN } from '@/lib/format';
import { cn } from '@/lib/utils';

export function Price({
  amount,
  className,
  size = 'price',
}: {
  amount: number;
  className?: string;
  size?: 'price' | 'h3' | 'body' | 'small';
}) {
  const sizeCls =
    size === 'price'
      ? 'text-price'
      : size === 'h3'
        ? 'text-h3'
        : size === 'body'
          ? 'text-body font-semibold'
          : 'text-small font-semibold';
  return <span className={cn(sizeCls, className)}>{formatNGN(amount)}</span>;
}
