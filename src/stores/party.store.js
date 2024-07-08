import { defineStore } from 'pinia'

export const usePartyStore = defineStore('party', {
  state: () => ({
    party: {
      id: null,
      name: '',
      players: '',
      mise: ''
    },
  }),
  actions: {
    setParty(party) {
      this.party = party
    },
  },
  getters: {
    yourParty: (state) => state.party,
  },
})
