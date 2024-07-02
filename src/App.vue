<template>
  <!-- <PageParty/> -->
   <GlobalChessPage/>
</template>

<script>
// import PageParty from './Pages/GoToPartyPage.vue';
import GlobalChessPage from './Pages/GlobalChessPage.vue';
export default {
  name: 'App',
  components: {
    // PageParty
    GlobalChessPage
  }
}
</script>

<style>
#app {
  flex-direction: column;
  height: 100vh;
  width: 60%;
  margin: 0 auto;
}
@media only screen and (max-width: 768px) {
  #app {
    width: 100%;
    margin: 0;
  }
}
</style>
