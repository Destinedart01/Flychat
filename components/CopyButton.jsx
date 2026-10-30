'use client';

import { useState } from 'react';

// Copies `value` to the clipboard. Falls back to a hidden textarea +
// execCommand for browsers/webviews (e.g. in-app browsers) where the
// modern clipboard API is blocked or unavailable.
export default function CopyButton({ value }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
    } catch (err) {
      const ta = document.createElement('textarea');
      ta.value = value;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
      } catch (e) {}
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <button type="button" className={`copy-btn${copied ? ' copied' : ''}`} onClick={handleCopy}>
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}
