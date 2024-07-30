<template>
  <div class="mt-16">
    <v-img
      class="mx-auto my-6"
      max-width="228"
      :src="icon"
    />
    
    <v-card-text>
      <div class="text-subtitle-1 text-medium-emphasis">
        E-mail
      </div>

      <v-text-field
        v-model="username"
        density="compact"
        placeholder="adresse email"
        prepend-inner-icon="mdi-email-outline"
        variant="outlined"
        required
      />

      <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
        Mots de passe

        <a
          class="text-caption text-decoration-none text-blue"
          href="#"
          rel="noopener noreferrer"
          target="_blank"
        >
          mots de passe oublier ?</a>
      </div>

      <v-text-field
        v-model="password"
        :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
        :type="visible ? 'text' : 'password'"
        density="compact"
        placeholder="mots de passe"
        prepend-inner-icon="mdi-lock-outline"
        variant="outlined"
        @click:append-inner="visible = !visible"
      />

      <v-btn
        class="mb-8"
        color="orange"
        size="large"
        variant="tonal"
        block
        @click="login"
      >
        Connecter
      </v-btn>

      <v-card-text class="text-center">
        <a
          class="text-blue text-decoration-none"
          href="#"
          rel="noopener noreferrer"
          target="_blank"
        >
          Créer un compte <v-icon icon="mdi-chevron-right" />
        </a>
      </v-card-text>
    </v-card-text>

    <!-- <v-otp-input :length="4" variant="solo-filled"></v-otp-input> -->
  </div>
</template>

<script>
import { useStoreUser } from '@/stores/user.store';
import { verifyUser } from '@/utils/loginApi';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'LoginPage',
  setup() {
    const username = ref('');
    const password = ref('');
    const router = useRouter();
    const userStore = useStoreUser();

    const login = async () => {
      try {
        const access = await verifyUser(username.value, password.value);
        if (access.length === 1) {
          userStore.setUser(access[0]);
          router.push('/listOfParty');
        }
      } catch (error) {
        console.error('Login failed', error);
      }
    };

    return {
      username,
      password,
      login,
    };
  },
  data: () => ({
    visible: false,
    icon: require('@/assets/logo/logo.svg'),
  }),
};
</script>

<style scoped>

</style>
