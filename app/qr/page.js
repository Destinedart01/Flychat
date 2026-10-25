'use client';

import { useState } from 'react';
import QrCode from '@/components/QrCode';
import GridBackground from '@/components/GridBackground';

export default function QrToolPage() {
  const [text, setText] = useState('');
  const [submitted, setSubmitted] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    setSubmitted(text.trim());
  }

  return (
    <>
      <GridBackground />
      <main className="page-content">
        <h1 style={{ fontSize: 21 }}>QR code generator</h1>
        <p style={{ fontSize: 14, color: 'var(--ink-soft)', marginTop: 10, lineHeight: 1.6 }}>
          A separate tool from your flyer links — paste any link or text below
          and get a downloadable QR code. No flyer, no contact details needed.
        </p>

        <form onSubmit={handleSubmit}>
          <label className="field-label">Link or text</label>
          <input
            className="input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="https://example.com or any text"
          />
          <button type="submit" className="btn btn-primary" style={{ marginTop: 20 }}>
            Generate QR code
          </button>
        </form>

        {submitted && (
          <div className="qr-tool-frame" style={{ marginTop: 28 }}>
            <QrCode value={submitted} size={200} />
          </div>
        )}

        <div className="pro-card">
          <div className="pro-badge">PRO</div>
          <h3>Custom color &amp; logo QR codes</h3>
          <p>Match your brand colors and embed your logo in the middle of the QR code.</p>

          <div className="pro-fields">
            <div>
              <label className="field-label" style={{ marginTop: 0 }}>
                QR color
              </label>
              <input type="color" className="input" disabled defaultValue="#c8102e" />
            </div>
            <div>
              <label className="field-label" style={{ marginTop: 0 }}>
                Logo image
              </label>
              <input type="file" disabled />
            </div>
          </div>

          <button type="button" className="btn btn-primary" disabled style={{ marginTop: 18 }}>
            Generate custom QR
          </button>
          <p className="pro-note">Coming soon — this will be a Pro feature.</p>
        </div>
      </main>
    </>
  );
}
