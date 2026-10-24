// Fixed, full-viewport, pointer-events-none decorative layer. Drop this
// at the top of a page's JSX to opt that page into the animated grid
// background -- pages that don't render it (currently just the public
// /[slug] flyer page) simply stay clean/white.
export default function GridBackground() {
  return <div className="grid-bg-layer" aria-hidden="true" />;
}
