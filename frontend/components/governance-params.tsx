"use client";

import { useEffect, useState } from "react";
import { getParameters, GovernanceParameters } from "@/lib/stacks-client";
import { Skeleton } from "@/components/skeleton";

/**
 * Displays current on-chain governance parameters
 */
export function GovernanceParamsWidget() {
  const [params, setParams] = useState<GovernanceParameters | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchParams() {
      setLoading(true);
      try {
        const data = await getParameters();
        setParams(data);
        setError(null);
      } catch (e) {
        console.error("Failed to fetch governance parameters:", e);
        setError("Failed to load parameters");
      } finally {
        setLoading(false);
      }
    }

    fetchParams();
  }, []);

  if (loading) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <h3 className="text-sm font-medium text-white/60 mb-3">Governance Parameters</h3>
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !params) {
    return (
      <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4">
        <p className="text-sm text-rose-400">{error || "No parameters available"}</p>
      </div>
    );
  }

  const formatBlocks = (blocks: number): string => {
    // Approximate: 1 block ≈ 10 minutes on Stacks
    const hours = Math.round((blocks * 10) / 60);
    if (hours < 24) return `~${hours}h`;
    const days = Math.round(hours / 24);
    return `~${days}d`;
  };

  const paramItems = [
    {
      label: "Quorum",
      value: `${params["quorum-percent"]}%`,
      description: "Min votes needed",
    },
    {
      label: "Threshold",
      value: `${params["proposal-threshold-percent"]}%`,
      description: "Power to propose",
    },
    {
      label: "Voting Period",
      value: formatBlocks(params["voting-period"]),
      description: `${params["voting-period"]} blocks`,
    },
    {
      label: "Timelock",
      value: formatBlocks(params.timelock),
      description: `${params.timelock} blocks`,
    },
  ];

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <h3 className="text-sm font-medium text-white/60 mb-3">Governance Parameters</h3>
      <div className="grid grid-cols-2 gap-3">
        {paramItems.map((item) => (
          <div
            key={item.label}
            className="rounded-lg bg-white/5 p-3 border border-white/5"
          >
            <div className="text-xs text-white/40">{item.label}</div>
            <div className="text-lg font-semibold text-white/90 mt-1">
              {item.value}
            </div>
            <div className="text-xs text-white/30 mt-0.5">{item.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Compact version for sidebars or smaller spaces
 */
export function GovernanceParamsCompact() {
  const [params, setParams] = useState<GovernanceParameters | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getParameters().then(setParams).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Skeleton className="h-8" />;
  }

  if (!params) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 text-xs text-white/50">
      <span>Quorum: {params["quorum-percent"]}%</span>
      <span className="text-white/20">|</span>
      <span>Voting: {params["voting-period"]} blocks</span>
      <span className="text-white/20">|</span>
      <span>Timelock: {params.timelock} blocks</span>
    </div>
  );
}
