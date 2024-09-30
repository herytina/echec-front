import apiClient from '@/utils/axios';
import type { ITransaction, TransactionType } from '@/models/Transaction';
import type { IUser } from '@/models/User';
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: {} as IUser,
    historyTransactionType: 'ALL' as TransactionType | 'ALL',
    transactionHistory: [] as ITransaction[]
  }),
  getters: {
    getUser: (state) => state.user
  },
  actions: {
    initStore() {
      this.user = {} as IUser;
    },

    async getCurrentUser() {
      try {
        const connectedUser = await apiClient.get('me');
        this.user = connectedUser.data?.data[0];
        return this.user;
      } catch (error) {
        console.log('🚀 ~ error:', error);
      }
    },

    async getTransactionHistory() {
      try {
        const history = await apiClient.post('transaction-history', {
          type: this.historyTransactionType
        });
        this.transactionHistory = history.data?.data || [];
      } catch (error) {
        console.log('🚀 ~ error:', error);
      }
    }
  },
  persist: true
});
