import { computeComplianceBalance } from "../domain/Compliance";
import type { RouteEntity } from "../domain/Route";
import { TARGET_2025 } from "../domain/Route";

export function computeCbForRoute(route: RouteEntity) {
  return computeComplianceBalance(TARGET_2025, route.ghgIntensity, route.fuelConsumptionTons);
}

