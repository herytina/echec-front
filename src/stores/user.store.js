import { defineStore } from 'pinia'

export const useStoreUser = defineStore('user', {
  state: () => ({
    user: {
      id: null,
      name: '',
      pwd: '',
      numberPhone: '',
      solde: ''
    },
  }),
  actions: {
    setUser(user) {
      this.user = user
    },
  },
  getters: {
    currentUser: (state) => state.user,
  },
})
