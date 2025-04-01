import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { buttonVariants } from '@/shadcn/lib/buttonStyles';
import { cn } from '@/shadcn/lib/utils';

const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button };
