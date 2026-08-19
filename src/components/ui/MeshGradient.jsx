export default function MeshGradient() {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-paper dark:bg-[#1A1A1C] transition-colors duration-500">
      <div className="mesh-blob mesh-blob-1 absolute -top-40 -left-40 w-96 h-96 bg-brass/8 rounded-full mix-blend-multiply filter blur-3xl dark:mix-blend-screen dark:bg-brass/5" />
      <div className="mesh-blob mesh-blob-2 absolute top-40 right-20 w-[30rem] h-[30rem] bg-charcoal/3 rounded-full mix-blend-multiply filter blur-3xl dark:mix-blend-screen dark:bg-paper/3" />
    </div>
  );
}
