<template>
  <div>
    <v-card-text>
      <v-text-field
        v-model="username"
        label="nom d'utilisateur"
        required
      />

      <v-text-field
        v-model="password"
        label="mots de passe"
        required
      />

      <v-btn
        color="success"
        text="envoyer"
        variant="flat"
        @click="login"
      />
    </v-card-text>
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
};
</script>

<style scoped>

</style>
