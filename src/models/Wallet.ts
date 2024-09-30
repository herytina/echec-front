export interface IWallet {
  id: number;
  balance: number;
  createdAt: number;
  updatedAt: number;
}

export class Wallet implements IWallet {
  id: number;
  balance: number;
  createdAt: number;
  updatedAt: number;

  constructor(params: IWallet) {
    this.id = params.id;
    this.balance = params.balance;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
  }
}
