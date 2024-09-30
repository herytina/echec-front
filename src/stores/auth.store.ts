import apiClient from '@/utils/axios';
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLoading: false,
    registerForm: {
      pseudo: '',
      phone: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false
    },
    loginForm: {
      phone: '',
      password: ''
    },
    verifyCode: '',
    changePasswordForm: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  }),
  actions: {
    initStore() {
      this.isLoading = false;
      this.registerForm = {
        pseudo: '',
        phone: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false
      };
      this.loginForm = {
        phone: '',
        password: ''
      };
      this.verifyCode = '';
      this.changePasswordForm = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      };
    },

    register() {
      return apiClient.post('register', this.registerForm);
    },

    login() {
      return apiClient.post('login', this.loginForm);
    },

    verifyAccount() {
      return apiClient.post('account-validation', {
        phone: this.loginForm.phone || localStorage.getItem('phoneNumber'),
        code: this.verifyCode
      });
    },

    forgotPassword() {
      return apiClient.post('forgot-password', {
        phone: this.loginForm.phone
      });
    },

    forgotPasswordWithCodeAndPwd() {
      return apiClient.post('forgot-password-with-code-and-pwd', {
        code: this.verifyCode,
        password: this.registerForm.password,
        phoneNumber: this.loginForm.phone || localStorage.getItem('phoneNumber')
      });
    },

    updatePassword() {
      return apiClient.post('update-password', {
        oldPassword: this.changePasswordForm.currentPassword,
        password: this.changePasswordForm.newPassword
      });
    },

    logout() {
      return apiClient.post('logout');
    }
  }
});
