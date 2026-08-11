import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-xl bg-gradient-to-r from-healthcare-lilac via-white to-pink-100", className)} />;
}
