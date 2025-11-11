export interface BankRecord {
  id?: number;
  shipId: string;
  year: number;
  amount_gco2eq: number; // positive for banked, negative for applied
}

export interface BankingPort {
  getAvailableBanked(shipId: string, year: number): Promise<number>;
  addBankRecord(record: BankRecord): Promise<void>;
  listBankRecords(shipId: string, year: number): Promise<BankRecord[]>;
}

