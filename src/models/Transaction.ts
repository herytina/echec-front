export enum TRANSACTION_ERROR {
  WALLET_NOT_FOUND = 'WALLET_NOT_FOUND'
}

export enum TransactionType {
  CREDIT = 'CREDIT', // Depot argent
  DEBIT = 'DEBIT', // retrait d'argent
  GAIN = 'GAIN', // Gain de jeton apres un parti
  PURCHASE = 'PURCHASE' // Achat de jeton
}

export enum TransactionStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export enum TransactionSource {
  MVOLA = 'MVOLA',
  AIRTEL_MONEY = 'AIRTEL_MONEY',
  ORANGE_MONEY = 'ORANGE_MONEY',
  MVOLA_ADMIN = 'MVOLA_ADMIN',
  AIRTEL_MONEY_ADMIN = 'AIRTEL_MONEY_ADMIN',
  ORANGE_MONEY_ADMIN = 'ORANGE_MONEY_ADMIN',
  WALLET_BALANCE = 'WALLET_BALANCE', // sold de l'utilisateur
  LUDO_GAME = 'LUDO_GAME',
  FARITANY_GAME = 'FARITANY_GAME',
  RAMI_GAME = 'RAMI_GAME',
  SNAKE_GAME = 'SNAKE_GAME',
  DOMINO_GAME = 'DOMINO_GAME',
  CHESS_GAME = 'CHESS_GAME'
}

export interface ITransaction {
  id?: number;
  idWallet: number;
  idUser: number;
  amount: number;
  type: TransactionType;
  source: TransactionSource;
  createdAt: number;
  updatedAt: number;
  status: TransactionStatus;
  errorContent?: string;
  balance: number;
}

export class Transaction implements ITransaction {
  id: number;
  idWallet: number;
  idUser: number;
  amount: number;
  type: TransactionType;
  source: TransactionSource;
  createdAt: number;
  updatedAt: number;
  status: TransactionStatus;
  errorContent: string;
  balance: number;

  constructor(params: ITransaction) {
    this.id = params.id ? params.id : NaN;
    this.idWallet = params.idWallet;
    this.idUser = params.idUser;
    this.amount = params.amount;
    this.type = params.type;
    this.source = params.source;
    this.status = params.status;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
    this.errorContent = params.errorContent ? params.errorContent : '';
    this.balance = params.balance ?? 0;
  }
}
