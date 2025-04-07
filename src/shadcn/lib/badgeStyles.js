import { cva } from 'class-variance-authority';

export const badgeVariants = cva(
  'inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground',

        success: 'bg-accent-green text-black',
        secondary: 'bg-accent-blue text-black',
        destructive: 'bg-accent-red text-white',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);
