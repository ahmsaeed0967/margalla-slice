// Ink text on a brand-blue brush stroke (like the printed menu). Inline SVG.
//
// The brush is painted with an explicit fill class (fill-brand), NOT with
// fill="currentColor". With currentColor the brush takes the *text* colour of
// its parent whenever the colour class is missing or overridden, and the text
// here is ink, so the brush turned into a black blob with black text on it.
// Contrast rule: text on brand blue is always ink, never white.
export default function BrushLabel({ children, as: Tag = "span", className = "" }) {
  return (
    <Tag className={`relative inline-block isolate px-4 py-1 text-ink ${className}`}>
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 200 48"
        preserveAspectRatio="none"
        className="absolute inset-0 -z-10 w-full h-full"
      >
        <path
          className="fill-brand"
          d="M7 13C30 5 82 9 128 6c26-2 52-1 66 5 5 6-1 11 3 17 3 7-3 13-17 14-36 2-72 1-108 4-23 2-52 3-64-3-6-5 1-9-3-15-3-7-2-12 2-15Z"
        />
        <path
          className="fill-brand"
          opacity=".55"
          d="M150 3c18-1 34 1 46 4l-3 3c-12-3-26-4-43-4ZM4 41c14 3 32 4 50 3l-2 3c-18 1-35-1-49-4Z"
        />
      </svg>
      {children}
    </Tag>
  );
}
