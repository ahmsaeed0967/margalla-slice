// Simple logo drawn in code: a pizza slice in a circle.
export default function Logo({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <circle cx="32" cy="32" r="30" fill="#B42318" />
      <path d="M32 12 L52 48 H12 Z" fill="#FFF4DC" />
      <circle cx="32" cy="38" r="3.5" fill="#B42318" />
      <circle cx="26" cy="44" r="2.5" fill="#B42318" />
      <circle cx="38" cy="44" r="2.5" fill="#B42318" />
    </svg>
  );
}
