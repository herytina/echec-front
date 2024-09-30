<template>
  <v-toolbar
    density="comfortable"
    :class="bgColor"
  >
    <v-icon class="iconG">
      <img
        :src="iconGame"
        alt="logo"
        width="50"
      >
    </v-icon>
    <v-spacer />
    <div>
      <v-menu
        transition="slide-x-transition"
      >
        <template #activator="{ props }">
          <v-btn
            border
            v-bind="props"
            class="icon-text"
          >
            <v-icon left>
              <img
                :src="iconMoney"
                alt="money"
                width="30"
              >
            </v-icon>
            <span class="ml-2">{{ user.solde }} MGA</span>
            <v-avatar
              size="50"
              class="ml-2"
            >
              <NameToAvatar
                :name="user.name"
                size="50"
                :background-color="user.solde < 60000 ? '#ffc400' : '#09ff00'"
                text-color="#ffffff"
              />
            </v-avatar>
          </v-btn>
        </template>

        <v-list>
          <v-list-item
            v-for="(item, i) in items"
            :key="i"
          >
            <template #prepend>
              <v-icon :icon="item.icon" />
            </template>
            <v-list-item-title @click="item.access">
              {{ item.title }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </v-toolbar>
</template>
<script>
import { useUserStore } from '@/stores/user.store';
import NameToAvatar from '@/components/NameToAvatar.vue';

export default {
  components :{
    NameToAvatar
  },
  setup() {
    const userStore = useUserStore();
    return {
      user: userStore.user,
    };
  },
  data() {
    return {
      iconGame: require('@/assets/logo/logo.svg'),
      iconMoney: require('@/assets/logo/money.svg'),
      avatar: null,
      items: [
        { title: 'Compte', access : this.compte, icon:'mdi-account' },
        { title: 'Parametre', access : this.parameter, icon:'mdi-cog-outline'  },
        { title: 'Transaction', access : this.parameter, icon:'mdi-cash-multiple'  },
        { title: 'Deconnexion', access : this.logout, icon:'mdi-logout' },
      ]
      }
  },
  computed(){
    if(this.user === null){
      console.log('ici c user ', this.user);
      this.logout();
    }
  },
  methods: {
    // logout() {
    //   const userStore = useStoreUser()
    //   userStore.setUser({})
    //   this.$router.push('/')
    // },
    parameter() {
      this.$router.push('/party')
    },
    compte() {
      this.$router.push('/')
    },
  }

}

</script>
<style scoped>
.icon-text {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-right: 10px;
}
.iconG{margin-left: 20px;}

</style>
