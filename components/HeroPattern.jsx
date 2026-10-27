// A dense, fairly uniform field of small chat-bubble glyphs (on-brand,
// not the generic arrow from the reference) layered over the red
// gradient background. White glyphs read clearly against the dark red
// at the top, naturally fading out of visibility as the base gradient
// itself nears white at the bottom -- no separate fade overlay needed.
// Each bubble has its own animation-delay based on row+col position,
// so the pulse plays as a diagonal wave rather than random twinkling.
// A soft radial glow sits on top, centered behind the text, for extra
// contrast there -- same structure as the reference image.
export default function HeroPattern() {
  const cols = 14;
  const rows = 9;
  const cell = 46;

  const bubbles = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const base = 0.42 + ((r * 3 + c) % 5) * 0.03;
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
            transform={`translate(${x + 11}, ${y + 10})`}
            className="hero-pattern-bubble"
            style={{ animationDelay: `${delay}s`, '--base-opacity': base }}
          >
            <rect x="0" y="0" width="19" height="13" rx="4" fill="#ffffff" />
            <path d="M3.5 13 L3.5 18 L9 13 Z" fill="#ffffff" />
          </g>
        ))}
      </svg>
      <div className="hero-pattern-glow" />
    </div>
  );
}
