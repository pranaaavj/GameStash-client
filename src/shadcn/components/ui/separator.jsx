import * as React from 'react';
import * as SeparatorPrimitive from '@radix-ui/react-separator';
import PropTypes from 'prop-types';

import { cn } from '@/shadcn/lib/utils';

const Separator = React.forwardRef(
  (
    { className, orientation = 'horizontal', decorative = true, ...props },
    ref
  ) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        'shrink-0 bg-gray-200 dark:bg-gray-800',
        orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
        className
      )}
      {...props}
    />
  )
);
Separator.displayName = SeparatorPrimitive.Root.displayName;

Separator.propTypes = {
  className: PropTypes.string,
  decorative: PropTypes.bool,
  orientation: PropTypes.string,
};

export { Separator };
