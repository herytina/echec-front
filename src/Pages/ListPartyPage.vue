<template>
  <div>
    <NavBarVue bg-color="global" />
    <GoodHeader />
    <PartyList v-model:newParty="newPartyList" />
    <div>
      <DialogChessMate
        v-model:open="openDialog"
        :chess-mate="false"
        @party="fetchParty"
      />
    </div>
    <div class="btn">
      <v-btn
        color="#d2992f"
        size="x-large"
        variant="tonal"
        class="text-none btn"
        border
        @click="setParty"
      >
        Cree une partie
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import PartyList from '@/components/PartyList.vue';
  import DialogChessMate from '../components/DialogChessMate.vue';
  import NavBarVue from '../components/NavBar.vue';
  import GoodHeader from '@/components/GoodHeader.vue';

  // État réactif
  const openDialog = ref<boolean>(false);
  const newPartyList = ref<any[]>([]); // Utilisez le type approprié si vous avez une interface définie

  // Méthodes
  const setParty = () => {
    openDialog.value = true;
  };

  const fetchParty = (data: any[]) => { // Remplacez 'any' par le type approprié pour vos données
    newPartyList.value = data;
  };
</script>

<style scoped>
#ListPartyPage{
  overflow-y: auto;
}
.btn{
  position: fixed;
  width: 95%;
  bottom: 5px;
  justify-content: center;
  align-items: center;
  margin: 5px;
  z-index: 9999;
}
</style>
