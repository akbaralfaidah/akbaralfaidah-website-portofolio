export default function Footer() {
  return (
    <footer className="bg-charcoal text-paper/70 py-12 px-6 border-t border-paper/10">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-2">
          <span className="font-display font-bold text-2xl text-paper">AA.</span>
          <span className="text-sm">© {new Date().getFullYear()} Akbar Alfaidah. All rights reserved.</span>
        </div>
        
        <div className="flex space-x-6 text-sm font-mono">
          <a href="https://github.com/akbaralfaidah" target="_blank" rel="noopener noreferrer" className="hover:text-brass transition-colors">GitHub</a>
          <a href="https://linkedin.com/in/akbaralfaidah" target="_blank" rel="noopener noreferrer" className="hover:text-brass transition-colors">LinkedIn</a>
          <a href="https://instagram.com/akbaralfaidah" target="_blank" rel="noopener noreferrer" className="hover:text-brass transition-colors">Instagram</a>
        </div>
      </div>
    </footer>
  );
}
