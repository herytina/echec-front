import { defineStore } from 'pinia';

export const usePlayerStore = defineStore('players', {
  state: () => ({
    players:[{
      id: null,
      name: '',
      pwd: '',
      numberPhone: '',
      solde: '',
      sexe: '',
      status: ''
    }],
  }),
  actions: {
    setPlayers(players:any) {
      this.players = players
    },
  },
  getters: {
    currentPlayers: (state) => state.players,
  },
  persist: true,
})
