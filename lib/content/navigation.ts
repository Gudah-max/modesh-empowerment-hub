import { updatesPublicReleaseEnabled } from './release';

const navigation = [
  { href: '/programs', label: 'Programs' },
  { href: '/about', label: 'Our Story' },
  { href: '/gallery', label: 'Student Life' },
  { href: '/updates', label: 'Updates' },
  { href: '/contact', label: 'Contact' },
] as const;

// Both header variants and the footer consume this same public navigation.
export const primaryNavigation = navigation.filter(
  item => updatesPublicReleaseEnabled || item.href !== '/updates'
);
