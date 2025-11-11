import { pool } from '../../adapters/outbound/postgres/client';
import fs from 'fs';
import path from 'path';

async function main() {
  const dir = path.join(process.cwd(), 'src', 'infrastructure', 'db', 'migrations');
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.sql')).sort();
  for (const f of files) {
    const sql = fs.readFileSync(path.join(dir, f), 'utf8');
    console.log('Applying migration', f);
    await pool.query(sql);
  }
  console.log('Migrations applied');
  await pool.end();
}

main().catch(async (e) => {
  console.error(e);
  await pool.end();
  process.exit(1);
});

