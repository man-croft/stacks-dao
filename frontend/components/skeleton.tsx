export function Skeleton({ className }: { className?: string }) {
  return (
    <div 
      className={`animate-pulse bg-white/5 rounded-xl ${className}`} 
    />
  );
}
