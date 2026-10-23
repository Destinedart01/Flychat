import { siteConfig } from '@/lib/siteConfig';

export default function Footer() {
  const waDigits = siteConfig.whatsapp.replace(/[^0-9]/g, '');

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <img src={siteConfig.logo} alt={siteConfig.ownerBrand} className="footer-logo" />

        <div className="site-footer-grid">
          <div>
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
          </div>
          <div>
            <a href={`https://wa.me/${waDigits}`} target="_blank" rel="noopener noreferrer">
              {siteConfig.whatsapp}
            </a>
          </div>
          <div>
            <a href={siteConfig.socialUrl} target="_blank" rel="noopener noreferrer">
              {siteConfig.socialHandle}
            </a>
          </div>
          <div>{siteConfig.location}</div>
        </div>

        <div className="site-footer-bottom">
          © {siteConfig.year} {siteConfig.ownerBrand}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
