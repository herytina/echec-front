<template>
  <div id="PartyChess">
    <NavBarVue />
    <GoodHeader />
    <ChessBoard />
  </div>
</template>

<script setup lang="ts">
  import ChessBoard from '../components/ChessBoard.vue';
  import NavBarVue from '../components/NavBar.vue';
  import GoodHeader from '@/components/GoodHeader.vue';
</script>