const common = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: '#ffffff',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

export function BioLinkIcon() {
  return (
    <svg {...common}>
      <rect x="6" y="2" width="12" height="20" rx="3" />
      <line x1="9" y1="18" x2="15" y2="18" />
      <circle cx="12" cy="8" r="2.4" />
      <line x1="9" y1="13.5" x2="15" y2="13.5" />
    </svg>
  );
}

export function QrFlyerIcon() {
  return (
    <svg {...common}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <line x1="15" y1="15" x2="15" y2="15.01" />
      <line x1="19" y1="15" x2="19" y2="18" />
      <line x1="15" y1="19" x2="18" y2="19" />
      <line x1="19" y1="19" x2="19" y2="21" />
    </svg>
  );
}

export function StoryIcon() {
  return (
    <svg {...common}>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <line x1="17" y1="7" x2="17" y2="7" />
    </svg>
  );
}

export function MessageIcon() {
  return (
    <svg {...common}>
      <path d="M4 5h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H9l-5 4v-4H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" />
    </svg>
  );
}
