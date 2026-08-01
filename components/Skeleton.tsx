export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-[var(--surface-hover)] rounded ${className}`} />
  );
}

export function MatchRowSkeleton() {
  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded p-4 flex items-center justify-between">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-4 w-20" />
    </div>
  );
}