export interface PoolMemberInput {
  shipId: string;
  cb_before: number; // positive surplus, negative deficit
}

export interface PoolResultMember extends PoolMemberInput {
  cb_after: number;
}

// Greedy allocation: sort desc by cb, distribute surplus to deficits.
export function createPoolGreedy(members: PoolMemberInput[]): PoolResultMember[] {
  const surplus = members
    .filter(m => m.cb_before > 0)
    .sort((a, b) => b.cb_before - a.cb_before)
    .map(m => ({ ...m }));
  const deficits = members
    .filter(m => m.cb_before < 0)
    .sort((a, b) => a.cb_before - b.cb_before) // most negative first
    .map(m => ({ ...m }));

  // total sum must be >= 0 to be valid
  const total = members.reduce((s, m) => s + m.cb_before, 0);
  if (total < 0) {
    throw new Error('Invalid pool: total CB must be >= 0');
  }

  // allocation
  for (const s of surplus) {
    let available = s.cb_before;
    for (const d of deficits) {
      if (available <= 0) break;
      if (d.cb_before >= 0) continue; // already resolved
      const needed = Math.abs(d.cb_before);
      const transfer = Math.min(available, needed);
      d.cb_before += transfer; // less negative, closer to zero
      available -= transfer;
    }
    s.cb_before = available; // leftover
  }

  // Build result and enforce constraints
  const result: PoolResultMember[] = [];
  const afterMap = new Map<string, number>();
  // deficits can't be worse, surplus can't go negative
  for (const m of members) {
    const fromSurplus = surplus.find(s => s.shipId === m.shipId);
    const fromDef = deficits.find(d => d.shipId === m.shipId);
    const after = fromSurplus ? fromSurplus.cb_before : fromDef ? fromDef.cb_before : m.cb_before;
    if (m.cb_before < 0 && after < m.cb_before) {
      throw new Error('Deficit member cannot exit worse');
    }
    if (m.cb_before > 0 && after < 0) {
      throw new Error('Surplus member cannot exit negative');
    }
    afterMap.set(m.shipId, after);
  }

  for (const m of members) {
    result.push({ shipId: m.shipId, cb_before: m.cb_before, cb_after: afterMap.get(m.shipId)! });
  }
  return result;
}

