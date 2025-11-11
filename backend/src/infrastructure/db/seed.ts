import { pool } from '../../adapters/outbound/postgres/client';

async function main() {
  const routes = [
    ['R001','Container','HFO',2024,91.0,5000,12000,4500,true],
    ['R002','BulkCarrier','LNG',2024,88.0,4800,11500,4200,false],
    ['R003','Tanker','MGO',2024,93.5,5100,12500,4700,false],
    ['R004','RoRo','HFO',2025,89.2,4900,11800,4300,false],
    ['R005','Container','LNG',2025,90.5,4950,11900,4400,false],
  ];
  for (const r of routes) {
    await pool.query(
      `INSERT INTO routes (route_id, vessel_type, fuel_type, year, ghg_intensity, fuel_consumption_tons, distance_km, total_emissions_tons, is_baseline)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       ON CONFLICT (route_id) DO UPDATE SET
         vessel_type = EXCLUDED.vessel_type,
         fuel_type = EXCLUDED.fuel_type,
         year = EXCLUDED.year,
         ghg_intensity = EXCLUDED.ghg_intensity,
         fuel_consumption_tons = EXCLUDED.fuel_consumption_tons,
         distance_km = EXCLUDED.distance_km,
         total_emissions_tons = EXCLUDED.total_emissions_tons,
         is_baseline = EXCLUDED.is_baseline`,
      r
    );
  }
  console.log('Seeded routes');
  await pool.end();
}

main().catch(async (e) => {
  console.error(e);
  await pool.end();
  process.exit(1);
});

