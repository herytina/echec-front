<template>
  <v-toolbar density="comfortable" :class="bgColor">
    <v-icon class="iconG">
      <img :src="iconGame" alt="logo" width="50"/>
    </v-icon>
    <v-spacer></v-spacer>
    <div>
      <v-menu
        transition="slide-x-transition"
      >
        <template v-slot:activator="{ props }">
          <v-btn border v-bind="props" class="icon-text">
            <v-icon left>
              <img :src="iconMoney" alt="money" width="30"/>
            </v-icon>
            <span class="ml-2">8 000 MGA</span>
            <v-avatar size="30" class="ml-2">
              <img :src="iconGame" alt="logo"/>
            </v-avatar>
          </v-btn>
        </template>

        <v-list>
          <v-list-item
            v-for="(item, i) in items"
            :key="i"
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </v-toolbar>
  </template>
<script>
export default {
  data() {
    return {
      iconGame: require('@/assets/logo/logo.svg'),
      iconMoney: require('@/assets/logo/money.svg'),
      avatar: null,
      items: [
        { title: 'Compte' },
        { title: 'Parametre' },
        { title: 'Deconnexion' },
      ],
      }
  },
  props: {
    bgColor: {
      type: String,
      require:false
    }
  }

}

</script>
<style scoped>
.party {
  background-color: #d2992f; /* Couleur de fond personnalisée */
  color: white; /* Couleur du texte */
}
.global{
  color:#d2992f;
  margin-bottom: 20px;
}
.icon-text {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-right: 10px;
}
.iconG{margin-left: 20px;}

</style>
