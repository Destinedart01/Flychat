'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

// Pass either `path` (resolved against the current origin, used for
// flyer links) or `value` directly (used by the standalone QR tool,
// where the text/URL isn't necessarily this site's own path).
export default function QrCode({ path, value, size = 168 }) {
  const [dataUrl, setDataUrl] = useState(null);

  useEffect(() => {
    const target = value || (path ? `${window.location.origin}${path}` : '');
    if (!target) {
      setDataUrl(null);
      return;
    }
    let cancelled = false;
    QRCode.toDataURL(target, {
      width: size,
      margin: 1,
      color: { dark: '#121214', light: '#ffffff' },
    })
      .then((d) => {
        if (!cancelled) setDataUrl(d);
      })
      .catch(() => {
        if (!cancelled) setDataUrl(null);
      });
    return () => {
      cancelled = true;
    };
  }, [path, value, size]);

  if (!dataUrl) {
    return <div className="qr-placeholder" style={{ width: size, height: size }} />;
  }

  return (
    <div className="qr-wrap">
      <img src={dataUrl} alt="QR code" width={size} height={size} className="qr-img" />
      <a href={dataUrl} download="flychat-qr.png" className="qr-download">
        Download QR code
      </a>
    </div>
  );
}
