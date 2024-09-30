import { defineStore } from 'pinia';
import { COLOR } from '../enums/Color.enum';

export const useToastStore = defineStore('toast', {
  state: () => ({
    message: '',
    showOKBtn: true,
    type: COLOR.INFO,
    show: false,
    timeOut: null as unknown as NodeJS.Timeout
  }),
  actions: {
    createToast(message: string, type: COLOR = COLOR.INFO) {
      this.message = message;
      this.type = type;
      this.show = true;
      this.timeOut = setTimeout(() => {
        this.show = false;
        clearTimeout(this.timeOut);
      }, 3000);
    },

    hideToast() {
      this.show = false;
      clearTimeout(this.timeOut);
    }
  }
});
