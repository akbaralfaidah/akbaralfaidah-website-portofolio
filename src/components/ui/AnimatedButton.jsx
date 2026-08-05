import React from 'react';
import { Link } from 'react-router-dom';

export default function AnimatedButton({ children, href, to, onClick, className = '', variant = 'primary', ...props }) {
  let bgClass = 'bg-charcoal dark:bg-[#2C2E32] text-paper dark:text-[#FAF8ED] border-charcoal dark:border-[#2C2E32]';
  let hoverBgClass = 'bg-[#A9762E]';
  
  if (variant === 'brass') {
    bgClass = 'bg-[#A9762E] text-white dark:text-white border-[#A9762E] font-semibold';
    hoverBgClass = 'bg-[#2C2E32]';
  } else if (variant === 'outline') {
    bgClass = 'bg-transparent border-charcoal/10 dark:border-paper/10 text-charcoal dark:text-paper';
    hoverBgClass = 'bg-[#A9762E]';
  }

  const content = (
    <>
      <div className='inline-flex h-full w-full translate-y-0 items-center justify-center transition duration-500 group-hover:-translate-y-[150%]'>
        {children}
      </div>
      <div className='absolute inline-flex h-full w-full translate-y-[100%] items-center justify-center text-white transition duration-500 group-hover:translate-y-0'>
        <span className={`absolute h-full w-full translate-y-full skew-y-12 scale-y-0 ${hoverBgClass} transition duration-500 group-hover:translate-y-0 group-hover:scale-150`}></span>
        <span className='z-10 flex items-center gap-2'>{children}</span>
      </div>
    </>
  );

  const baseClass = `group relative inline-flex items-center justify-center rounded-full border ${bgClass} font-medium transition-all active:scale-[0.98] ${className}`;
  const clipStyle = { clipPath: 'inset(0 round 9999px)' };

  if (to) {
    return (
      <Link to={to} className={baseClass} style={clipStyle} onClick={onClick} {...props}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={baseClass} style={clipStyle} target={href.startsWith('#') ? undefined : "_blank"} rel={href.startsWith('#') ? undefined : "noopener noreferrer"} onClick={onClick} {...props}>
        {content}
      </a>
    );
  }

  return (
    <button className={baseClass} style={clipStyle} onClick={onClick} {...props}>
      {content}
    </button>
  );
}
