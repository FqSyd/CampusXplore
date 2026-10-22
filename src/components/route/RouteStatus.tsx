import React from 'react';
import { NavigationStatus, WalkerProgress } from '../../types';
import { CheckCircle2, AlertTriangle, AlertCircle, Loader2, Sparkles, Navigation, AlertOctagon } from 'lucide-react';

export interface RouteStatusProps {
  status: NavigationStatus;
  errorMessage?: string;
  rerouteNotice?: string;
  walkerProgress?: WalkerProgress | null;
  startName?: string;
  destinationName?: string;
}

export const RouteStatus: React.FC<RouteStatusProps> = ({
  status,
  errorMessage,
  rerouteNotice,
  walkerProgress,
  startName,
  destinationName,
}) => {
  if (status === 'idle') return null;

  return (
    <div className="w-full flex flex-col gap-2">
      {/* 1. Base Algorithm Navigation Status */}
      {status === 'ready' && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-950/40 border border-blue-500/30 text-blue-300 text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          <span>A* Status: Ready. Click "Find Walkable Route".</span>
        </div>
      )}

      {status === 'searching' && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-yellow-950/50 border border-yellow-500/40 text-yellow-300 text-xs font-medium animate-pulse">
          <Loader2 className="w-3.5 h-3.5 text-yellow-400 animate-spin shrink-0" />
          <span>A* Status: Evaluating f(n) = g(n) + h(n)...</span>
        </div>
      )}

      {status === 'same_location' && (
        <div className="flex items-start gap-2 px-3 py-2 rounded-lg bg-amber-950/60 border border-amber-500/50 text-amber-200 text-xs font-medium">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-amber-300">Start and destination are the same.</div>
            <div className="text-[11px] text-amber-300/80">Already at destination. Select two distinct locations.</div>
          </div>
        </div>
      )}

      {status === 'not_found' && (
        <div className="flex items-start gap-2 px-3 py-2 rounded-lg bg-rose-950/60 border border-rose-500/50 text-rose-200 text-xs font-medium">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-rose-300">No walkable route found.</div>
            <div className="text-[11px] text-rose-300/80">
              {errorMessage || 'Connecting paths may be blocked by temporary pathway closures.'}
            </div>
          </div>
        </div>
      )}

      {/* Pathway Reroute Alert if a closure triggered recalculation */}
      {rerouteNotice && status === 'found' && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-950/60 border border-amber-500/50 text-amber-200 text-xs font-medium animate-fadeIn">
          <AlertOctagon className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{rerouteNotice}</span>
        </div>
      )}

      {/* 2. Live 3D Walker Locomotion & Arrival HUD Status */}
      {status === 'found' && (
        <>
          {walkerProgress?.isArrived ? (
            /* Arrival State */
            <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-emerald-950/70 border border-emerald-400/60 text-emerald-200 text-xs font-medium shadow-lg shadow-emerald-950/50 animate-fadeIn">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-400/40">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-white text-xs">
                  ✓ Arrived at {destinationName || 'Destination'}
                </div>
                <div className="text-[11px] text-emerald-300/80">
                  Optimal path completed without obstacle collisions.
                </div>
              </div>
            </div>
          ) : walkerProgress?.isWalking ? (
            /* Live Walking State */
            <div className="flex flex-col gap-1.5 px-3 py-2.5 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-200 text-xs font-medium shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                  </span>
                  <span className="font-bold text-white uppercase tracking-wider text-[11px]">
                    Walking to {destinationName || 'Destination'}
                  </span>
                </div>
                <span className="font-mono text-cyan-300 text-[11px] font-bold">
                  {Math.round((walkerProgress.progressRatio || 0) * 100)}%
                </span>
              </div>

              {/* Walking Progress Bar */}
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-cyan-400 h-full transition-all duration-150 rounded-full"
                  style={{ width: `${Math.round((walkerProgress.progressRatio || 0) * 100)}%` }}
                />
              </div>

              {/* Remaining Metrics */}
              <div className="flex items-center justify-between text-[11px] text-slate-300 pt-0.5">
                <span>
                  Remaining: <strong>{walkerProgress.remainingDistance} m</strong>
                </span>
                <span>
                  Est. Time: <strong>{walkerProgress.remainingTimeMinutes} min</strong>
                </span>
              </div>
            </div>
          ) : (
            /* Route Ready State */
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs font-medium">
              <Navigation className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>A* Status: Optimal Route Computed</span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RouteStatus;
