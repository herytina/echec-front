import { defineStore } from 'pinia'

export const usePartyStore = defineStore('party', {
  state: () => ({
    party: {
      id: 0,
      name: '',
      players: '',
      mise: '',
      status: '',
      createdAt: '',
      timer:60,
      updatedAt: ''
    },
  }),
  actions: {
    setParty(party:any) {
      this.party = party
    },
  },
  getters: {
    yourParty: (state) => state.party,
  },
  persist: true,
})