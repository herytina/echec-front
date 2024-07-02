<template>
  <div id="PartyChess">
    <NavBarVue bgColor="party"/>
    <ChessBoard/>
  </div>

</template>

<script>
import NavBarVue from '../components/ NavBar.vue';
import ChessBoard from '../components/ChessBoard.vue';
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
