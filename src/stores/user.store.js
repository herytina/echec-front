import { defineStore } from 'pinia';

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
    switchUser() {
      const newUser = { name: this.user?.name === 'User1' ? 'User2' : 'User1' };
      this.setUser(newUser);
      return newUser;
    },
  },
  getters: {
    currentUser: (state) => state.user,
  },
  persist: true,
})
