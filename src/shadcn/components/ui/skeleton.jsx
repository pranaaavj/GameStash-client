import { cn } from "@/shadcn/lib/utils"

function Skeleton({
  // eslint-disable-next-line react/prop-types
  className,
  ...props
}) {
  return (
    (<div
      className={cn("animate-pulse rounded-md bg-gray-900/10 dark:bg-gray-50/10", className)}
      {...props} />)
  );
}

export { Skeleton }
