import './globals.css';
import Footer from '@/components/Footer';
import { siteName } from '@/lib/siteConfig';

export const metadata = {
  title: siteName,
  description: 'Turn a flyer into a WhatsApp DM link.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="page">
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
