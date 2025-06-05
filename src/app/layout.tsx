
import '@/styles/globals.css';
import React from 'react';
import { Providers } from './_providers';

// Generate default metadata for the site
// export const metadata: Metadata = getDefaultSiteMetadata({
//   siteName: process.env.NEXT_PUBLIC_SITE_NAME || 'Video Player App',
//   siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com',
//   siteLogoUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'}/logo.png`,
//   siteTwitterHandle: process.env.NEXT_PUBLIC_TWITTER_HANDLE,
// });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* 
        Added suppressHydrationWarning={true} to the body tag to prevent hydration errors
        from browser extensions like Grammarly that add data-* attributes to the body element.
        These attributes (data-new-gr-c-s-check-loaded, data-gr-ext-installed) cause
        hydration mismatches between server and client rendering.
      */}
      <body suppressHydrationWarning={true}>
        <Providers>
          <header>
            <nav>
              <div className="logo">Video Player App</div>
              <div className="nav-links">
                <a href="/">Home</a>
                <a href="/videos">Videos</a>
                <a href="/channels">Channels</a>
                <a href="/about">About</a>
              </div>
            </nav>
          </header>
          <main>{children}</main>
          <footer>
            <div className="footer-content">
              <div className="footer-logo">Video Player App</div>
              <div className="footer-links">
                <a href="/terms">Terms</a>
                <a href="/privacy">Privacy</a>
                <a href="/contact">Contact</a>
              </div>
              <div className="copyright">
                {/* 
                  Using client component or useEffect for client-side date rendering
                  would be more hydration-safe than inline new Date(), but for a 
                  footer copyright it's reasonable to use suppressHydrationWarning
                */}
                © {new Date().getFullYear()} Video Player App. All rights reserved.
              </div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
