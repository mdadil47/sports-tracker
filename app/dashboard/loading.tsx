import { MatchRowSkeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <div className="p-4 sm:p-8 max-w-2xl mx-auto">
      <div className="h-8 w-32 bg-[var(--surface-hover)] rounded animate-pulse mb-6" />
      <div className="space-y-6">
        <MatchRowSkeleton />
        <MatchRowSkeleton />
      </div>
    </div>
  );
}