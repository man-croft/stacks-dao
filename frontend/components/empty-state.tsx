import Link from "next/link";

export function EmptyState({ 
  title = "No proposals found", 
  description = "Get started by creating the first proposal for the DAO.",
  actionHref,
  actionLabel
}: { 
  title?: string; 
  description?: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/5 py-12 text-center">
      <div className="rounded-full bg-white/5 p-3 mb-4">
        <span className="text-2xl">📝</span>
      </div>
      <h3 className="text-lg font-medium text-white/90">{title}</h3>
      <p className="mt-1 text-sm text-white/50 max-w-xs mx-auto">{description}</p>
      
      {actionHref && (
        <Link 
          href={actionHref}
          className="mt-6 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 text-sm text-emerald-400 hover:bg-emerald-500/20 transition"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
