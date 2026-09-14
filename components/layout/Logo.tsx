import Image from 'next/image';
import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="group flex items-center" aria-label="MyJerseyPlug home">
      <Image
        src="/logo.png"
        alt="MyJerseyPlug"
        width={1376}
        height={768}
        className="h-7 w-auto"
        priority
      />
    </Link>
  );
}
