import { defineStore } from 'pinia';

export const useAppStore = defineStore('app', {
  state: () => ({
    appIsLoading: false,
    breadCrumbName: 'Accueil',
    backendStatus: {
      activeUsers: 0,
      matchingRounds: 0,
      playingRounds: 0
    }
  }),
  actions: {
    initStore() {
      this.appIsLoading = false;
      this.backendStatus = {
        activeUsers: 0,
        matchingRounds: 0,
        playingRounds: 0
      };
    }
  }
});
