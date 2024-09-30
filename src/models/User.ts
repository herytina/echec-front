import { type IWallet, Wallet } from './Wallet';

/**
 * User Credentials
 */
export interface ICredentials {
  phone: string;
  password: string;
}

export interface IUser {
  id?: number;
  idWallet: number;
  password: string;
  pseudo: string;
  phone: string;
  avatar?: string;
  acceptTerms: boolean;
  accountVerified: boolean;
  createdAt: number;
  updatedAt: number;
  wallet: IWallet;
}

export class User implements IUser {
  id: number;
  idWallet: number;
  password: string;
  pseudo: string;
  phone: string;
  avatar: string;
  acceptTerms: boolean;
  accountVerified: boolean;
  createdAt: number;
  updatedAt: number;
  wallet: Wallet;

  constructor(params: IUser) {
    this.id = params.id ? params.id : NaN;
    this.idWallet = params.idWallet;
    this.password = params.password;
    this.pseudo = params.pseudo;
    this.phone = params.phone ? params.phone : '';
    this.avatar = params.avatar ? params.avatar : '';
    this.acceptTerms = params.acceptTerms;
    this.accountVerified = params.accountVerified;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
    this.wallet = params.wallet = new Wallet(params.wallet) 
  }
}
