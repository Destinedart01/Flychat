'use client';

import { getPlatform } from '@/lib/platforms';
import { PLATFORM_ICONS } from '@/components/PlatformIcons';

const BTN_CLASS = {
  whatsapp: 'btn-wa',
  telegram: 'btn-telegram',
  instagram: 'btn-instagram',
};

export default function FlyerButton({ slug, platform = 'whatsapp', countryCode, phone, username, message }) {
  const config = getPlatform(platform);
  const Icon = PLATFORM_ICONS[config.key];

  function handleClick() {
    fetch('/api/track-click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug }),
    }).catch(() => {});

    const url = config.buildUrl({ countryCode, phone, username, message });
    window.location.href = url;
  }

  return (
    <button onClick={handleClick} className={`btn ${BTN_CLASS[config.key]}`}>
      <Icon />
      {config.buttonText}
    </button>
  );
}
