// src/app/layout.tsx (updated with theme support)
import { Metadata } from 'next';
import { getDefaultSiteMetadata } from '@/lib/metadata/video-metadata';
import { Providers } from './_providers';
import '@/styles/globals.css';

Generate default metadata for the site
export const metadata: Metadata = getDefaultSiteMetadata({
  siteName: process.env.NEXT_PUBLIC_SITE_NAME || 'Video Player App',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com',
  siteLogoUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'}/logo.png`,
  siteTwitterHandle: process.env.NEXT_PUBLIC_TWITTER_HANDLE,
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <header>
            <nav className="bg-theme-primary text-theme-primary border-b border-theme-light">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                  <div className="flex items-center">
                    <div className="logo theme-transition font-bold text-xl">Video Player App</div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="nav-links space-x-4">
                      <a href="/" className="theme-transition hover:text-primary-500">
                        Home
                      </a>
                      <a href="/videos" className="theme-transition hover:text-primary-500">
                        Videos
                      </a>
                      <a href="/channels" className="theme-transition hover:text-primary-500">
                        Channels
                      </a>
                      <a href="/about" className="theme-transition hover:text-primary-500">
                        About
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </nav>
          </header>
          <main className="bg-theme-primary text-theme-primary min-h-screen theme-transition pb-10">{children}</main>
          <footer className="bg-theme-secondary text-theme-secondary py-8 border-t border-theme-light theme-transition">
            <div className="footer-content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row justify-between">
                <div className="footer-logo text-xl font-bold mb-4 md:mb-0">Video Player App</div>
                <div className="footer-links space-x-6">
                  <a href="/terms" className="theme-transition hover:text-primary-500">
                    Terms
                  </a>
                  <a href="/privacy" className="theme-transition hover:text-primary-500">
                    Privacy
                  </a>
                  <a href="/contact" className="theme-transition hover:text-primary-500">
                    Contact
                  </a>
                </div>
              </div>
              <div className="copyright mt-6 text-theme-tertiary text-sm">
                © {new Date().getFullYear()} Video Player App. All rights reserved.
              </div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
