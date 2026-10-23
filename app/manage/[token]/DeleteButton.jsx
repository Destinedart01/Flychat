'use client';

import { useState } from 'react';

export default function DeleteButton({ token }) {
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleDelete() {
    if (!confirm('Delete this flyer link? This cannot be undone.')) return;
    setBusy(true);
    const res = await fetch('/api/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
    setBusy(false);
    if (res.ok) setDone(true);
  }

  if (done) {
    return <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', marginTop: 22 }}>Deleted. This link no longer works.</p>;
  }

  return (
    <button onClick={handleDelete} disabled={busy} className="btn btn-outline" style={{ marginTop: 22, width: 'auto', padding: '10px 18px' }}>
      {busy ? 'Deleting...' : 'Delete this link'}
    </button>
  );
}
