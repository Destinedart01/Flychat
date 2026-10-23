'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

// Plain black-on-white QR code -- the free-tier version. A styled/branded
// QR (custom color, logo in the middle) is a natural Pro-tier upgrade of
// this same component later; not built yet, left out on purpose.
export default function QrCode({ path, size = 168 }) {
  const [dataUrl, setDataUrl] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const url = `${window.location.origin}${path}`;
    QRCode.toDataURL(url, {
      width: size,
      margin: 1,
      color: { dark: '#121214', light: '#ffffff' },
    })
      .then((d) => {
        if (!cancelled) setDataUrl(d);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [path, size]);

  if (!dataUrl) {
    return <div className="qr-placeholder" style={{ width: size, height: size }} />;
  }

  return (
    <div className="qr-wrap">
      <img src={dataUrl} alt="QR code for this link" width={size} height={size} className="qr-img" />
      <a href={dataUrl} download="flychat-qr.png" className="qr-download">
        Download QR code
      </a>
    </div>
  );
}
