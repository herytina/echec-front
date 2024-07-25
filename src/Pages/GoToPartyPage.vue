<template>
  <div id="PartyChess">
    <NavBarVue bg-color="party" />
    <ChessBoard />
  </div>
</template>

<script>
import ChessBoard from '../components/ChessBoard.vue';
import NavBarVue from '../components/NavBar.vue';
export default {
  name: 'PartyChess',
  components: {
    ChessBoard,
    NavBarVue
  }
}
</script>
<style>
#PartyChess {
  background-color: rgb(219, 205, 176);
}
</style>
