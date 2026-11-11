import Link from 'next/link';
import type { ComponentProps } from 'react';

type Props = ComponentProps<typeof Link> & { variant?: 'primary' | 'secondary' | 'inline' };

export function ButtonLink({ variant = 'primary', className = '', ...props }: Props) {
  return <Link className={`button-link button-link--${variant} ${className}`} {...props} />;
}
