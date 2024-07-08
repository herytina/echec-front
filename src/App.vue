<template>
   <router-view/>
</template>

<script>
export default {
  name: 'App'
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
