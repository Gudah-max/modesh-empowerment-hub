import Script from 'next/script';

/**
 * Google Analytics 4 slot. Activates only when NEXT_PUBLIC_GA_ID is set
 * (e.g. in Netlify env vars as "G-XXXXXXXXXX"). Renders nothing otherwise,
 * so the site works with or without analytics configured.
 */
export function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  if (!gaId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `}
      </Script>
    </>
  );
}
