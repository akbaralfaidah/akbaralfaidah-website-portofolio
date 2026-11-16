export function MeshGradient({ className = '' }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden bg-architectural-grid ${className}`}
    >
      <div
        className="w-full h-full"
        style={{
          background: [
            'radial-gradient(ellipse 62% 50% at 78% 16%, rgba(29, 78, 216, 0.11), transparent 70%)',
            'radial-gradient(ellipse 46% 42% at 14% 78%, rgba(14, 165, 233, 0.08), transparent 68%)'
          ].join(', ')
        }}
      />
    </div>
  );
}

export default MeshGradient;
