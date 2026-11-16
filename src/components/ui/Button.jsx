import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

const VARIANTS = {
  primary: 'bg-ink text-on-ink hover:bg-ink/90 shadow-sm border border-transparent',
  accent: 'bg-brass text-on-brass hover:bg-brass-hover shadow-sm border border-transparent',
  outline: 'bg-surface text-ink border border-line hover:border-brass hover:text-brass',
  ghost: 'bg-transparent text-ink hover:bg-mist border border-transparent',
  whatsapp: 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm border border-transparent'
};

const SIZES = {
  sm: 'min-h-[40px] px-4 py-2 text-xs',
  md: 'min-h-[44px] px-5 py-2.5 text-sm',
  lg: 'min-h-[48px] px-7 py-3 text-sm sm:text-base'
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
          'inline-flex items-center justify-center gap-2 rounded-lg font-medium tracking-tight transition-colors duration-200 whitespace-nowrap select-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer',
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
