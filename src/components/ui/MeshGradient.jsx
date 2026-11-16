export function MeshGradient({ className = '' }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden bg-architectural-grid ${className}`}
    >
      <div
        className="w-full h-full"
        style={{
          background:
            'radial-gradient(ellipse 68% 54% at 75% 18%, rgba(138, 97, 28, 0.08), transparent 72%)'
        }}
      />
    </div>
  );
}

export default MeshGradient;
