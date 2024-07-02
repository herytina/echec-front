<template>
  <v-list-item
    base-color="surface-light"
    border="opacity-50 md"
    lines="two"
    :prepend-avatar=avatar
    rounded="lg"
    variant="flat"
    class="list"
   v-for="(party, key) in partyLists" :key="key"
  >
    <v-list-item-title>
      <span class="text-h6">{{party.name}}</span>
    </v-list-item-title>

    <v-list-item-subtitle>
      <v-scroll-y-reverse-transition mode="out-in">
        <div
          class="text-warning text-caption"
        >
          {{party.mise}} MGA
        </div>
      </v-scroll-y-reverse-transition>
    </v-list-item-subtitle>

    <template v-slot:append>
      <v-fade-transition mode="out-in">
        <v-btn
          color="#d2992f"
          text="Rejoindre"
          variant="tonal"
          class="me-2 text-none"
          size="small"
          flat
          @click="getParty(party.id)"
        ></v-btn>
      </v-fade-transition>
    </template>
  </v-list-item>
</template>
<script>
export default {
  data(){
    return {
      avatar: require('@/assets/logo/money.svg'),
      partyLists: [{ id: 1, name:'Party One', mise: 5000},{ id: 2, name:'Bandy akama', mise: 10000},{ id: 3, name:'Fianarantsoa', mise: 7000}]
    }
  },
  methods:{
    getParty(id) {
      console.log(id)
    }
  }
}

</script>

<style scoped>
  .list{
    margin: 10px;
  }
</style>
