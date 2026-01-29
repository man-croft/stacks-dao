import { ProposalData } from "@/hooks/use-proposal";

export function ProposalStats({ proposal }: { proposal: ProposalData }) {
  const forVotes = Number(proposal["for-votes"]);
  const againstVotes = Number(proposal["against-votes"]);
  const total = forVotes + againstVotes;
  
  const forPercent = total > 0 ? (forVotes / total) * 100 : 0;
  const againstPercent = total > 0 ? (againstVotes / total) * 100 : 0;

  return (
    <div className="space-y-6 rounded-2xl border border-white/10 bg-white/5 p-6">
      <h3 className="text-lg font-medium text-white/90">Current Results</h3>
      
      <div className="space-y-4">
        {/* For Votes */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-emerald-400 font-medium">For</span>
            <span className="text-white/60">{forVotes} votes</span>
          </div>
          <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
            <div 
              className="h-full bg-emerald-400 transition-all duration-500"
              style={{ width: `${forPercent}%` }}
            />
          </div>
        </div>

        {/* Against Votes */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-rose-400 font-medium">Against</span>
            <span className="text-white/60">{againstVotes} votes</span>
          </div>
          <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
            <div 
              className="h-full bg-rose-400 transition-all duration-500"
              style={{ width: `${againstPercent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-white/10 text-xs text-white/40 flex justify-between">
        <span>End Block: {proposal["end-height"]}</span>
        <span>Status: {proposal.executed ? "Executed" : proposal.cancelled ? "Cancelled" : "Active"}</span>
      </div>
    </div>
  );
}
