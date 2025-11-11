import type { RoutesPort } from '../../../core/ports/RoutesPort';
import type { RouteEntity } from '../../../core/domain/Route';
import { pool } from './client';

export class RoutesRepo implements RoutesPort {
  async listAll(): Promise<RouteEntity[]> {
    const { rows } = await pool.query(`
      SELECT id, route_id, vessel_type, fuel_type, year, ghg_intensity, fuel_consumption_tons, distance_km, total_emissions_tons, is_baseline
      FROM routes
      ORDER BY route_id ASC
    `);
    return rows.map(mapRow);
  }
  async findBaseline(): Promise<RouteEntity | null> {
    const { rows } = await pool.query(`
      SELECT id, route_id, vessel_type, fuel_type, year, ghg_intensity, fuel_consumption_tons, distance_km, total_emissions_tons, is_baseline
      FROM routes WHERE is_baseline = true LIMIT 1
    `);
    return rows[0] ? mapRow(rows[0]) : null;
  }
  async setBaseline(routeId: string): Promise<void> {
    await pool.query('UPDATE routes SET is_baseline = false');
    await pool.query('UPDATE routes SET is_baseline = true WHERE route_id = $1', [routeId]);
  }
  async findByRouteId(routeId: string): Promise<RouteEntity | null> {
    const { rows } = await pool.query(`
      SELECT id, route_id, vessel_type, fuel_type, year, ghg_intensity, fuel_consumption_tons, distance_km, total_emissions_tons, is_baseline
      FROM routes WHERE route_id = $1 LIMIT 1
    `, [routeId]);
    return rows[0] ? mapRow(rows[0]) : null;
  }
}

function mapRow(r: any): RouteEntity {
  return {
    id: r.id,
    routeId: r.route_id,
    vesselType: r.vessel_type,
    fuelType: r.fuel_type,
    year: r.year,
    ghgIntensity: Number(r.ghg_intensity),
    fuelConsumptionTons: Number(r.fuel_consumption_tons),
    distanceKm: Number(r.distance_km),
    totalEmissionsTons: Number(r.total_emissions_tons),
    isBaseline: r.is_baseline,
  } as RouteEntity;
}

