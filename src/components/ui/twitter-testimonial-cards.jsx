import { useState } from "react";
import { cn } from "../../lib/utils";

function TwitterIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function VerifiedBadge() {
  return (
    <svg
      className="size-4 text-[#1d9bf0]"
      viewBox="0 0 22 22"
      fill="currentColor"
    >
      <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" />
    </svg>
  );
}

function TestimonialCard({
  className,
  avatar,
  username = "PEPE",
  handle = "@PEPE_bigbrother",
  content = "This is amazing! 🔥 Absolutely loving what the team is building here. Can't wait to see what comes next!",
  date = "Jan 5, 2026",
  verified = true,
  likes = 142,
  retweets = 23,
  onHover,
  onLeave,
  isActive,
  onTap,
}) {
  const handleClick = (e) => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (isTouchDevice) {
      if (!isActive) {
        e.preventDefault();
        onTap?.();
      }
    }
  };

  return (
    <div
      onClick={handleClick}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className={cn(
        "relative flex h-auto min-h-[140px] sm:min-h-[180px] w-[280px] sm:w-[420px] -skew-y-[4deg] select-none flex-col rounded-2xl border border-charcoal/10 dark:border-white/10 bg-white/95 dark:bg-[#111113]/95 backdrop-blur-sm px-4 sm:px-5 py-4 sm:py-5 transition-all duration-500 hover:border-charcoal/30 dark:hover:border-white/30 hover:bg-white dark:hover:bg-[#111113] cursor-pointer shadow-lg",
        isActive && "ring-2 ring-charcoal/30 dark:ring-white/30",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
        <div className="size-10 sm:size-12 rounded-full bg-gradient-to-br from-brass/40 via-brass/20 to-transparent flex items-center justify-center overflow-hidden shrink-0 border border-charcoal/5 dark:border-white/5">
          {avatar ? (
            <img src={avatar} alt={username} className="w-full h-full object-cover" />
          ) : (
            <span className="text-lg sm:text-2xl">👤</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <span className="font-bold text-charcoal dark:text-[#F2F0E8] truncate text-sm sm:text-base">{username}</span>
            {verified && <VerifiedBadge />}
          </div>
          <span className="text-charcoal/60 dark:text-[#F2F0E8]/60 text-[11px] sm:text-sm">{handle}</span>
        </div>
        <TwitterIcon className="size-4 sm:size-5 text-charcoal/50 dark:text-[#F2F0E8]/50 shrink-0" />
      </div>

      {/* Content */}
      <p className="text-charcoal/90 dark:text-[#F2F0E8]/90 text-[13px] sm:text-[15px] leading-relaxed mb-3 sm:mb-4 line-clamp-4">
        {content}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between text-charcoal/50 dark:text-[#F2F0E8]/50 text-[11px] sm:text-[13px] mt-auto">
        <span>{date}</span>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span>{likes}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
            <span>{retweets}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Testimonials({ cards }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);

  const displayCards = cards || [];

  const getCardClassName = (index, baseClassName) => {
    const focusedIndex = hoveredIndex ?? activeIndex;
    let pushClass = "";
    
    // Hardcoded push classes for up to 5 cards
    if (focusedIndex !== null && index > focusedIndex) {
      if (index === 1) pushClass = " !translate-y-20 sm:!translate-y-32 !translate-x-14 sm:!translate-x-24";
      else if (index === 2) pushClass = " !translate-y-28 sm:!translate-y-44 !translate-x-24 sm:!translate-x-40";
      else if (index === 3) pushClass = " !translate-y-36 sm:!translate-y-56 !translate-x-32 sm:!translate-x-56";
      else if (index === 4) pushClass = " !translate-y-44 sm:!translate-y-64 !translate-x-40 sm:!translate-x-72";
    }
    return baseClassName + pushClass;
  };

  const handleTap = (index) => {
    if (activeIndex === index) return;
    setActiveIndex(index);
  };

  const baseStyles = [
    "[grid-area:stack] hover:-translate-y-10 hover:!z-50 before:absolute before:w-[100%] before:outline-1 before:rounded-2xl before:outline-charcoal/10 dark:before:outline-white/10 before:h-[100%] before:content-[''] before:bg-white/60 dark:before:bg-[#111113]/60 grayscale-[50%] hover:before:opacity-0 before:transition-opacity before:duration-500 hover:grayscale-0 before:left-0 before:top-0 z-0 transition-all duration-500",
    "[grid-area:stack] translate-x-8 sm:translate-x-12 translate-y-6 sm:translate-y-8 hover:-translate-y-1 hover:!z-50 before:absolute before:w-[100%] before:outline-1 before:rounded-2xl before:outline-charcoal/10 dark:before:outline-white/10 before:h-[100%] before:content-[''] before:bg-white/40 dark:before:bg-[#111113]/40 grayscale-[35%] hover:before:opacity-0 before:transition-opacity before:duration-500 hover:grayscale-0 before:left-0 before:top-0 z-10 transition-all duration-500",
    "[grid-area:stack] translate-x-16 sm:translate-x-24 translate-y-12 sm:translate-y-16 hover:translate-y-6 sm:hover:translate-y-10 hover:!z-50 before:absolute before:w-[100%] before:outline-1 before:rounded-2xl before:outline-charcoal/10 dark:before:outline-white/10 before:h-[100%] before:content-[''] before:bg-white/20 dark:before:bg-[#111113]/20 grayscale-[20%] hover:before:opacity-0 before:transition-opacity before:duration-500 hover:grayscale-0 before:left-0 before:top-0 z-20 transition-all duration-500",
    "[grid-area:stack] translate-x-24 sm:translate-x-36 translate-y-18 sm:translate-y-24 hover:translate-y-12 sm:hover:translate-y-20 hover:!z-50 before:absolute before:w-[100%] before:outline-1 before:rounded-2xl before:outline-charcoal/10 dark:before:outline-white/10 before:h-[100%] before:content-[''] before:bg-white/10 dark:before:bg-[#111113]/10 grayscale-[10%] hover:before:opacity-0 before:transition-opacity before:duration-500 hover:grayscale-0 before:left-0 before:top-0 z-30 transition-all duration-500",
    "[grid-area:stack] translate-x-32 sm:translate-x-48 translate-y-24 sm:translate-y-32 hover:translate-y-18 sm:hover:translate-y-30 hover:!z-50 z-40 transition-all duration-500"
  ];

  return (
    <div className="grid [grid-template-areas:'stack'] place-items-center opacity-100 w-full min-h-[400px] sm:min-h-[500px]">
      {displayCards.map((cardProps, index) => {
        return (
          <TestimonialCard
            key={index}
            {...cardProps}
            className={getCardClassName(index, baseStyles[index] || "")}
            style={{ 
              zIndex: hoveredIndex === index ? 50 : (index * 10),
            }}
            onHover={() => setHoveredIndex(index)}
            onLeave={() => setHoveredIndex(null)}
            isActive={activeIndex === index}
            onTap={() => handleTap(index)}
          />
        );
      })}
    </div>
  );
}
