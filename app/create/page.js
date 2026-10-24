'use client';

import { useState, useRef } from 'react';
import QrCode from '@/components/QrCode';
import FlyerPreviewCard from '@/components/FlyerPreviewCard';
import GridBackground from '@/components/GridBackground';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export default function CreatePage() {
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [countryCode, setCountryCode] = useState('+234');
  const [phone, setPhone] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [dragging, setDragging] = useState(false);
  const dragCounter = useRef(0);

  function acceptFile(f) {
    if (!f) return;
    if (!ACCEPTED_TYPES.includes(f.type)) {
      setError('Please use a JPG, PNG or WebP image.');
      return;
    }
    setError('');
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  function handleFile(e) {
    acceptFile(e.target.files[0]);
  }

  function handleDragEnter(e) {
    e.preventDefault();
    dragCounter.current += 1;
    setDragging(true);
  }

  function handleDragOver(e) {
    e.preventDefault();
  }

  function handleDragLeave(e) {
    e.preventDefault();
    dragCounter.current -= 1;
    if (dragCounter.current <= 0) {
      dragCounter.current = 0;
      setDragging(false);
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    dragCounter.current = 0;
    setDragging(false);
    const f = e.dataTransfer.files && e.dataTransfer.files[0];
    acceptFile(f);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!file) {
      setError('Please upload a flyer image.');
      return;
    }
    if (!phone.trim()) {
      setError('Please enter a WhatsApp number.');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('image', file);
    formData.append('countryCode', countryCode);
    formData.append('phone', phone);
    formData.append('businessName', businessName);
    formData.append('message', message);

    try {
      const res = await fetch('/api/create', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        setLoading(false);
        return;
      }
      setResult(data);
    } catch (err) {
      setError('Could not reach the server. Please try again.');
    }
    setLoading(false);
  }

  if (result) {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const link = `${origin}/${result.slug}`;
    const manageLink = `${origin}/manage/${result.manageToken}`;
    return (
      <>
        <GridBackground />
        <main className="page-content">
          <h1 style={{ fontSize: 21 }}>Your link is ready</h1>
          <p style={{ fontSize: 14.5, wordBreak: 'break-all', marginTop: 18 }}>
            <a href={link} className="link-success">
              {link}
            </a>
          </p>

          <FlyerPreviewCard imageSrc={preview} businessName={businessName} />

          <div className="note-box">
            <p>
              Save this manage link somewhere safe. It's the only way to see your
              stats or delete this flyer later — there's no account to log back into.
            </p>
            <p style={{ wordBreak: 'break-all' }}>
              <a href={manageLink} className="link-manage">
                {manageLink}
              </a>
            </p>
          </div>

          <div style={{ marginTop: 28 }}>
            <label className="field-label" style={{ marginTop: 0 }}>
              Scan to open
            </label>
            <QrCode path={`/${result.slug}`} />
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <GridBackground />
      <main className="page-content">
        <h1 style={{ fontSize: 21 }}>Create your link</h1>
        <form onSubmit={handleSubmit}>
          <label className="field-label">Your flyer image</label>
          <div
            className={`dropzone${dragging ? ' dragging' : ''}`}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFile} />
            {preview ? (
              <img src={preview} alt="Flyer preview" className="dropzone-preview" />
            ) : (
              <>
                <div className="dropzone-hint">
                  {dragging ? 'Drop it here' : 'Drag and drop your flyer, or tap to browse'}
                </div>
                <div className="dropzone-subhint">JPG, PNG or WebP</div>
              </>
            )}
          </div>
          {preview && (
            <div className="dropzone-hint" style={{ marginTop: 8 }}>
              Drag a new image in to replace it
            </div>
          )}

          <label className="field-label">WhatsApp number</label>
          <div className="input-row">
            <input
              className="input input-cc"
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
            />
            <input
              className="input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="801 234 5678"
            />
          </div>

          <label className="field-label">Business or flyer name (optional)</label>
          <input
            className="input"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="e.g. Zeysah Luxe"
          />

          <label className="field-label">Message that opens in WhatsApp (optional)</label>
          <input
            className="input"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Hi, I saw your flyer and I'd like to order..."
          />

          {error && <p className="error-text">{error}</p>}

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ marginTop: 24 }}>
            {loading ? 'Generating...' : 'Generate my link'}
          </button>
        </form>
      </main>
    </>
  );
}
