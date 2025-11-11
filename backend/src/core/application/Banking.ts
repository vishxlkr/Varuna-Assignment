import type { BankingPort } from "../ports/BankingPort";

export async function bankSurplus(banking: BankingPort, shipId: string, year: number, cbBefore: number) {
  if (cbBefore <= 0) {
    return { cb_before: cbBefore, applied: 0, cb_after: cbBefore };
  }
  await banking.addBankRecord({ shipId, year, amount_gco2eq: cbBefore });
  return { cb_before: cbBefore, applied: cbBefore, cb_after: 0 };
}

export async function applyBanked(
  banking: BankingPort,
  shipId: string,
  year: number,
  deficit: number,
  amount: number
) {
  // deficit is negative number; we can only apply up to min(available, -deficit)
  const available = await banking.getAvailableBanked(shipId, year);
  const maxApplicable = Math.min(available, Math.abs(deficit));
  if (amount > maxApplicable) {
    throw new Error(`Amount exceeds available or needed. maxApplicable=${maxApplicable}`);
  }
  await banking.addBankRecord({ shipId, year, amount_gco2eq: -amount });
  const cb_after = deficit + amount; // move closer to zero
  return { cb_before: deficit, applied: amount, cb_after };
}

