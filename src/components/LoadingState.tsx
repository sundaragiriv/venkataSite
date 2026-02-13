import { cn } from "../lib/utils";

interface LoadingStateProps {
  className?: string;
  message?: string;
}

export function LoadingState({ className, message = "Loading..." }: LoadingStateProps) {
  return (
    <div className={cn("min-h-screen flex items-center justify-center", className)}>
      <div className="text-center">
        <div 
          className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-accent border-t-transparent mb-4"
          aria-hidden="true"
        ></div>
        <p className="text-secondary" aria-live="polite">{message}</p>
      </div>
    </div>
  );
}

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("card-glow p-6 animate-pulse", className)}>
      <div className="h-4 bg-dark-tertiary rounded w-1/4 mb-4"></div>
      <div className="h-6 bg-dark-tertiary rounded w-3/4 mb-2"></div>
      <div className="h-6 bg-dark-tertiary rounded w-1/2 mb-4"></div>
      <div className="h-4 bg-dark-tertiary rounded w-full mb-2"></div>
      <div className="h-4 bg-dark-tertiary rounded w-5/6"></div>
    </div>
  );
}

export function GridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}


