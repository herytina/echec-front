<template>
  <NavBarVue bgColor="global"/>
  <PartyList/>
  <div class="btn">
    <v-btn
      color="#d2992f"
      size="x-large"
      variant="tonal"
      class="text-none btn"
      border>
      Cree une partie
    </v-btn>
  </div>
</template>

<script>
import PartyList from '@/components/PartyList.vue';
import NavBarVue from '../components/ NavBar.vue';
export default {
  name: 'PartyChess',
  components: {
    NavBarVue,
    PartyList
  }
}
</script>

<style scoped>
.btn{
  position: fixed;
  width: 95%;
  bottom: 5px;
  justify-content: center;
  align-items: center;
  margin: 5px;
}
</style>
