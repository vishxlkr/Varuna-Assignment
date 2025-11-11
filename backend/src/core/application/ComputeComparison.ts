import type { RouteEntity } from "../domain/Route";
import { TARGET_2025 } from "../domain/Route";

export interface ComparisonRow {
  routeId: string;
  baselineGhg: number;
  comparisonGhg: number;
  percentDiff: number; // ((comparison/baseline)-1)*100
  compliant: boolean; // against target
}

export function computeComparison(baseline: RouteEntity | null, others: RouteEntity[]): ComparisonRow[] {
  if (!baseline) return [];
  return others
    .filter(r => r.routeId !== baseline.routeId)
    .map(r => {
      const percentDiff = ((r.ghgIntensity / baseline.ghgIntensity) - 1) * 100;
      const compliant = r.ghgIntensity <= TARGET_2025;
      return {
        routeId: r.routeId,
        baselineGhg: baseline.ghgIntensity,
        comparisonGhg: r.ghgIntensity,
        percentDiff,
        compliant,
      };
    });
}

