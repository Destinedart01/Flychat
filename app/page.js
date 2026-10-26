import Link from 'next/link';
import GridBackground from '@/components/GridBackground';
import HeroPattern from '@/components/HeroPattern';
import PlatformCycler from '@/components/PlatformCycler';
import { BioLinkIcon, QrFlyerIcon, StoryIcon, MessageIcon } from '@/components/UsecaseIcons';

export default function Home() {
  return (
    <>
      <GridBackground />

      <section className="hero-band">
        <HeroPattern />
        <div className="hero">
          <div className="tag">No login needed</div>
          <h1>
            Turn your flyer into a <PlatformCycler /> link
          </h1>
          <p className="hero-sub">
            Upload a flyer, add your contact details, and get one link for
            Instagram, business cards, or a poster. Anyone who opens it sees
            your flyer and one button straight into a chat with you.
          </p>
          <div className="hero-ctas">
            <Link href="/create" className="btn btn-primary" style={{ width: 'auto', padding: '14px 28px' }}>
              Create your link
            </Link>
            <Link href="/qr" className="btn btn-outline" style={{ width: 'auto', padding: '14px 28px' }}>
              Just need a QR code?
            </Link>
          </div>
        </div>
      </section>

      <main className="page-content wide">
        <section className="steps-grid">
          <div className="step-card">
            <div className="step-num">1</div>
            <h3>Upload your flyer</h3>
            <p>Drag and drop the image, or tap to browse from your phone.</p>
          </div>
          <div className="step-card">
            <div className="step-num">2</div>
            <h3>Add your contact details</h3>
            <p>WhatsApp, Telegram, or Instagram — pick one and add a message to open with.</p>
          </div>
          <div className="step-card">
            <div className="step-num">3</div>
            <h3>Share your link</h3>
            <p>One link, a QR code, done. No account, no app to install.</p>
          </div>
        </section>

        <h2 className="section-heading">Where to put your link</h2>
        <div className="usecase-grid">
          <div className="usecase-card">
            <div className="usecase-icon">
              <BioLinkIcon />
            </div>
            <h4>Link in bio</h4>
            <p>The one link in your Instagram or TikTok bio opens a chat, not a page nobody reads.</p>
          </div>
          <div className="usecase-card">
            <div className="usecase-icon">
              <QrFlyerIcon />
            </div>
            <h4>QR on flyers &amp; packaging</h4>
            <p>Print it once. Stick it on the flyer itself, a poster, or product packaging.</p>
          </div>
          <div className="usecase-card">
            <div className="usecase-icon">
              <StoryIcon />
            </div>
            <h4>Stories</h4>
            <p>Add it as a link sticker on an Instagram or Facebook story — one tap, chat opens.</p>
          </div>
          <div className="usecase-card">
            <div className="usecase-icon">
              <MessageIcon />
            </div>
            <h4>SMS &amp; word of mouth</h4>
            <p>Short enough to text. Share it directly when someone asks how to reach you.</p>
          </div>
        </div>

        <section className="features-grid">
          <div className="feature">
            <h4>No login, ever</h4>
            <p>Create a link in seconds — nothing to sign up for, nothing to remember.</p>
          </div>
          <div className="feature">
            <h4>QR code included</h4>
            <p>Every link comes with a free, downloadable QR code for print.</p>
          </div>
          <div className="feature">
            <h4>Built for mobile</h4>
            <p>Works wherever your customers already are — no app required.</p>
          </div>
        </section>

        <section className="closing-cta">
          <h2>Ready to get your link?</h2>
          <Link href="/create" className="btn btn-primary" style={{ width: 'auto', padding: '14px 28px' }}>
            Create your link
          </Link>
        </section>
      </main>
    </>
  );
}
