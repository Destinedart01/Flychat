import Link from 'next/link';
import GridBackground from '@/components/GridBackground';

export default function Home() {
  return (
    <>
      <GridBackground />
      <main className="page-content wide">
        <section className="hero">
          <div className="tag">No login needed</div>
          <h1>Turn your flyer into a WhatsApp link</h1>
          <p className="hero-sub">
            Upload a flyer, add your WhatsApp number, and get one link for
            Instagram, business cards, or a poster. Anyone who opens it sees
            your flyer and one button straight into your DMs.
          </p>
          <div className="hero-ctas">
            <Link href="/create" className="btn btn-primary" style={{ width: 'auto', padding: '14px 28px' }}>
              Create your link
            </Link>
          </div>
        </section>

        <section className="steps-grid">
          <div className="step-card">
            <div className="step-num">1</div>
            <h3>Upload your flyer</h3>
            <p>Drag and drop the image, or tap to browse from your phone.</p>
          </div>
          <div className="step-card">
            <div className="step-num">2</div>
            <h3>Add your WhatsApp number</h3>
            <p>Optionally add a business name and a message to open with.</p>
          </div>
          <div className="step-card">
            <div className="step-num">3</div>
            <h3>Share your link</h3>
            <p>One link, a QR code, done. No account, no app to install.</p>
          </div>
        </section>

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
