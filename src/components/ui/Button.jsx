import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

const VARIANTS = {
  primary: 'bg-ink text-on-ink hover:opacity-85 border border-transparent',
  accent: 'bg-ink text-on-ink hover:opacity-85 border border-transparent',
  outline: 'bg-transparent text-ink border border-line hover:border-ink/40 hover:bg-mist/50',
  ghost: 'bg-transparent text-ink hover:bg-mist/60 border border-transparent',
  whatsapp: 'bg-ink text-on-ink hover:opacity-85 border border-transparent'
};

const SIZES = {
  sm: 'min-h-[42px] px-4 py-2 text-sm font-medium',
  md: 'min-h-[44px] px-5 py-2.5 text-[15px] font-medium',
  lg: 'min-h-[48px] px-6 py-3 text-[15px] sm:text-base font-medium'
};

export const Button = forwardRef(
  ({ as: Component = 'button', variant = 'primary', size = 'md', className = '', children, ...props }, ref) => {
    const typeProp = Component === 'button' && !props.type ? { type: 'button' } : {};

    return (
      <Component
        ref={ref}
        {...typeProp}
        {...props}
        className={cn(
          'group inline-flex items-center justify-center gap-2 rounded-lg tracking-[-0.01em] transition-all duration-200 active:scale-[0.98] whitespace-nowrap select-none disabled:opacity-50 disabled:pointer-events-none cursor-pointer',
          VARIANTS[variant] || VARIANTS.primary,
          SIZES[size] || SIZES.md,
          className
        )}
      >
        {children}
      </Component>
    );
  }
);

Button.displayName = 'Button';
export default Button;
