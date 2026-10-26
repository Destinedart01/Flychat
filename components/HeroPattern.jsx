// A field of small chat-bubble glyphs (not the generic "arrow" pattern
// from the reference image -- a chat bubble ties directly to what
// Flychat actually does) behind the hero. Each bubble has its own
// animation-delay based on its row+col position, so the fade plays as a
// diagonal wave sweeping across the field rather than random twinkling.
// Opacity is kept low and a white gradient sits on top, so hero text
// stays fully readable regardless of where the wave currently is.
export default function HeroPattern() {
  const cols = 12;
  const rows = 7;
  const cell = 52;

  const bubbles = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const dist = Math.hypot(c - cols / 2 + 0.5, r - 1.2);
      const base = Math.max(0.05, 0.3 - dist * 0.028);
      const delay = (r * 0.11 + c * 0.08) % 3.6;
      bubbles.push({ key: `${r}-${c}`, x: c * cell, y: r * cell, base, delay });
    }
  }

  return (
    <div className="hero-pattern" aria-hidden="true">
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${cols * cell} ${rows * cell}`}
        preserveAspectRatio="xMidYMin slice"
      >
        {bubbles.map(({ key, x, y, base, delay }) => (
          <g
            key={key}
            transform={`translate(${x + 14}, ${y + 12})`}
            className="hero-pattern-bubble"
            style={{ animationDelay: `${delay}s`, '--base-opacity': base }}
          >
            <rect x="0" y="0" width="22" height="15" rx="4.5" fill="#c8102e" />
            <path d="M4 15 L4 21 L10.5 15 Z" fill="#c8102e" />
          </g>
        ))}
      </svg>
      <div className="hero-pattern-fade" />
    </div>
  );
}
