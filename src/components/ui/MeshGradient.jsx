export function MeshGradient({ className = '', dark = false }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {/* Drifting multi-stop aurora atmosphere */}
      <div
        className="animate-aurora absolute -top-28 -right-24 w-[680px] h-[540px] rounded-full blur-3xl"
        style={{
          background: dark
            ? 'radial-gradient(circle, rgba(37, 99, 235, 0.34) 0%, rgba(14, 165, 233, 0.14) 45%, transparent 72%)'
            : 'radial-gradient(circle, rgba(29, 78, 216, 0.16) 0%, rgba(14, 165, 233, 0.1) 45%, transparent 72%)'
        }}
      />
      <div
        className="animate-aurora absolute -bottom-32 -left-24 w-[620px] h-[480px] rounded-full blur-3xl"
        style={{
          animationDelay: '-6s',
          background: dark
            ? 'radial-gradient(circle, rgba(245, 158, 11, 0.14) 0%, rgba(37, 99, 235, 0.12) 48%, transparent 72%)'
            : 'radial-gradient(circle, rgba(245, 158, 11, 0.12) 0%, rgba(56, 189, 248, 0.1) 48%, transparent 72%)'
        }}
      />
      {/* Subtle tactile film grain */}
      <div className="film-grain absolute inset-0" />
    </div>
  );
}

export default MeshGradient;
