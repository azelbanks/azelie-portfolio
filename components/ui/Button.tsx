'use client';

import { forwardRef, ButtonHTMLAttributes, ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children?: ReactNode;
  fullWidth?: boolean;
  glowEffect?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: cn(
    'bg-accent-primary text-background-primary',
    'hover:shadow-glow hover:scale-[1.02]',
    'active:scale-[0.98]'
  ),
  secondary: cn(
    'bg-background-secondary text-foreground-primary',
    'border border-border',
    'hover:border-accent-primary hover:text-accent-primary'
  ),
  ghost: cn(
    'bg-transparent text-foreground-primary',
    'hover:bg-background-secondary hover:text-accent-primary'
  ),
  outline: cn(
    'bg-transparent border-2 border-accent-primary text-accent-primary',
    'hover:bg-accent-primary hover:text-background-primary'
  ),
  danger: cn(
    'bg-red-500 text-white',
    'hover:bg-red-600'
  ),
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-sm gap-1.5',
  md: 'h-11 px-6 text-base gap-2',
  lg: 'h-14 px-8 text-lg gap-2.5',
  icon: 'h-10 w-10 p-0',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      fullWidth = false,
      glowEffect = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <motion.button
        ref={ref}
        className={cn(
          // Base styles
          'relative inline-flex items-center justify-center',
          'font-medium rounded-xl',
          'transition-all duration-300 ease-out',
          'focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2',
          'focus:ring-offset-background-primary',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
          // Variant & size
          variantStyles[variant],
          sizeStyles[size],
          // Full width
          fullWidth && 'w-full',
          // Glow effect
          glowEffect && 'shadow-glow',
          className
        )}
        disabled={isDisabled}
        whileHover={!isDisabled ? { scale: 1.02 } : undefined}
        whileTap={!isDisabled ? { scale: 0.98 } : undefined}
        {...props}
      >
        {/* Loading spinner */}
        {isLoading && (
          <Loader2 className="absolute animate-spin" size={size === 'sm' ? 16 : 20} />
        )}

        {/* Content */}
        <span
          className={cn(
            'flex items-center justify-center gap-2',
            isLoading && 'invisible'
          )}
        >
          {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
        </span>

        {/* Shine effect on hover (for primary) */}
        {variant === 'primary' && (
          <span
            className={cn(
              'absolute inset-0 rounded-xl overflow-hidden',
              'before:absolute before:inset-0',
              'before:translate-x-[-100%] hover:before:translate-x-[100%]',
              'before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent',
              'before:transition-transform before:duration-700'
            )}
          />
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

// Icon Button variant
interface IconButtonProps extends Omit<ButtonProps, 'leftIcon' | 'rightIcon' | 'children'> {
  icon: ReactNode;
  'aria-label': string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        size="icon"
        className={cn('rounded-xl', className)}
        {...props}
      >
        {icon}
      </Button>
    );
  }
);

IconButton.displayName = 'IconButton';

export default Button;
