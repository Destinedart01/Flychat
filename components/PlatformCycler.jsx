'use client';

import { useEffect, useState } from 'react';
import { PLATFORMS, PLATFORM_KEYS } from '@/lib/platforms';

export default function PlatformCycler() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % PLATFORM_KEYS.length);
    }, 2200);
    return () => clearInterval(id);
  }, []);

  const current = PLATFORMS[PLATFORM_KEYS[index]];

  return (
    <span className="platform-cycler" key={current.key}>
      {current.label}
    </span>
  );
}
