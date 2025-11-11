import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;

const connectionString = process.env.POSTGRES_URL;
if (!connectionString) {
  // allow running without DB for now (tests/in-memory), but warn at runtime
  console.warn('POSTGRES_URL not set. Database features will fail until configured.');
}

export const pool = new Pool({ connectionString });

