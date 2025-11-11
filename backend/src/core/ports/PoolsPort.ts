export interface PoolEntity {
  id?: number;
  year: number;
  createdAt?: string;
}

export interface PoolMemberEntity {
  poolId?: number;
  shipId: string;
  cb_before: number;
  cb_after: number;
}

export interface PoolsPort {
  createPool(year: number, members: PoolMemberEntity[]): Promise<number>; // returns pool id
}

