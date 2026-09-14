import Link from 'next/link';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost';
type Size = 'md' | 'sm' | 'lg';

const VARIANTS: Record<Variant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  outline: 'btn-outline',
  ghost: 'btn-ghost',
};

const SIZES: Record<Size, string> = {
  sm: 'btn-sm',
  md: '',
  lg: 'px-6 py-3.5 text-body',
};

interface BaseProps {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  className?: string;
  disabled?: boolean;
  children: React.ReactNode;
}

type ButtonProps = BaseProps &
  ({ href: string; onClick?: never } | { href?: never; onClick?: () => void; type?: 'button' | 'submit' });

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth,
  className,
  children,
  ...rest
}: ButtonProps) {
  const cls = cn(VARIANTS[variant], SIZES[size], fullWidth && 'w-full', className);

  if ('href' in rest && rest.href) {
    return (
      <Link href={rest.href} className={cls}>
        {children}
      </Link>
    );
  }
  const { onClick, type, disabled } = rest as { onClick?: () => void; type?: 'button' | 'submit'; disabled?: boolean };
  return (
    <button type={type ?? 'button'} onClick={onClick} disabled={disabled} className={cls}>
      {children}
    </button>
  );
}
