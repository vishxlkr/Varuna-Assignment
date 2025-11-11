import type { RouteEntity } from "../domain/Route";

export interface RoutesPort {
  listAll(): Promise<RouteEntity[]>;
  findBaseline(): Promise<RouteEntity | null>;
  setBaseline(routeId: string): Promise<void>;
  findByRouteId(routeId: string): Promise<RouteEntity | null>;
}

