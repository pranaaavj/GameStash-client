/* eslint-disable react/prop-types */
import { cn } from '@/shadcn/lib/utils';
import { badgeVariants } from '@/shadcn/lib/badgeStyles';

function Badge({ className, variant, ...props }) {
  return (
    <div
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge };
