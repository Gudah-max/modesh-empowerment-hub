/**
 * Shared date formatting for updates. Locale and time zone are pinned so the
 * output is identical on the server and in the browser (no hydration drift)
 * and reads naturally for a Kisumu audience.
 */
const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'Africa/Nairobi',
});

/** Returns e.g. "12 March 2026", or null for missing/invalid input. */
export function formatDate(value: string | null | undefined): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return dateFormatter.format(date);
}
