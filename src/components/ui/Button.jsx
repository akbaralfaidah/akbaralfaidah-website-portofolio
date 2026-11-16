import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

const VARIANTS = {
  primary: 'bg-ink text-on-ink hover:bg-ink/90 shadow-sm border border-transparent',
  accent: 'bg-accent-solid text-on-accent hover:bg-accent-hover shadow-md shadow-accent/20 border border-transparent',
  outline: 'bg-surface text-ink border border-line hover:border-accent hover:text-accent shadow-sm',
  ghost: 'bg-transparent text-ink hover:bg-mist border border-transparent',
  whatsapp: 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-md shadow-emerald-700/20 border border-transparent'
};

const SIZES = {
  sm: 'min-h-[42px] px-4 py-2 text-sm font-medium',
  md: 'min-h-[46px] px-5 py-2.5 text-[15px] font-semibold',
  lg: 'min-h-[54px] px-7 py-3.5 text-base sm:text-[17px] font-semibold'
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
          'group inline-flex items-center justify-center gap-2 rounded-xl tracking-tight transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] whitespace-nowrap select-none disabled:opacity-50 disabled:pointer-events-none cursor-pointer',
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
