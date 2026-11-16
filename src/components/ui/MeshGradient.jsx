export function MeshGradient({ className = '', dark = false }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {/* Calm architectural directional light */}
      <div
        className="animate-aurora absolute -top-40 left-1/2 -translate-x-1/2 w-[1100px] h-[540px] rounded-full blur-3xl"
        style={{
          background: dark
            ? 'radial-gradient(ellipse at center, rgba(96, 165, 250, 0.14) 0%, rgba(255, 255, 255, 0.03) 50%, transparent 74%)'
            : 'radial-gradient(ellipse at center, rgba(30, 64, 175, 0.055) 0%, rgba(19, 19, 18, 0.025) 48%, transparent 74%)'
        }}
      />
      <div className="film-grain absolute inset-0 opacity-70" />
    </div>
  );
}

export default MeshGradient;
