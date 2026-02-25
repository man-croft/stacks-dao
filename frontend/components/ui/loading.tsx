"use client";

import { type HTMLAttributes } from "react";

interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-8 w-8 border-3",
};

/**
 * Animated loading spinner
 */
export function Spinner({ size = "md", className = "", ...props }: SpinnerProps) {
  return (
    <div
      className={`animate-spin rounded-full border-white/20 border-t-white ${sizeClasses[size]} ${className}`}
      role="status"
      aria-label="Loading"
      {...props}
    />
  );
}

interface LoadingCardProps {
  message?: string;
}

/**
 * Full card loading state with spinner and message
 */
export function LoadingCard({ message = "Loading..." }: LoadingCardProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 p-8 rounded-xl border border-white/10 bg-white/5">
      <Spinner size="lg" />
      <p className="text-sm text-white/50">{message}</p>
    </div>
  );
}

interface LoadingOverlayProps {
  message?: string;
}

/**
 * Full-screen loading overlay
 */
export function LoadingOverlay({ message = "Loading..." }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-black/80 backdrop-blur-sm">
      <Spinner size="lg" />
      <p className="text-white/70">{message}</p>
    </div>
  );
}

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  width?: string;
  height?: string;
}

/**
 * Skeleton placeholder for loading content
 */
export function Skeleton({ width = "100%", height = "1rem", className = "", ...props }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded bg-white/10 ${className}`}
      style={{ width, height }}
      {...props}
    />
  );
}

/**
 * Skeleton card for proposal list loading state
 */
export function ProposalSkeleton() {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton width="120px" height="24px" />
        <Skeleton width="80px" height="20px" />
      </div>
      <div className="space-y-2">
        <Skeleton width="100%" height="16px" />
        <Skeleton width="75%" height="16px" />
      </div>
      <div className="flex gap-4">
        <Skeleton width="100px" height="32px" />
        <Skeleton width="100px" height="32px" />
        <Skeleton width="100px" height="32px" />
      </div>
    </div>
  );
}

/**
 * Multiple proposal skeletons for list loading
 */
export function ProposalListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProposalSkeleton key={i} />
      ))}
    </div>
  );
}
