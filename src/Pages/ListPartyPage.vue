<template>
  <div>
    <NavBarVue bg-color="global" />
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

<script>
import PartyList from '@/components/PartyList.vue';
import DialogChessMate from '../components/DialogChessMate.vue';
import NavBarVue from '../components/NavBar.vue';


export default {
  name: 'ListPartyPage',
  components: {
    NavBarVue,
    PartyList,
    DialogChessMate
  },
  data() {
    return {
      openDialog: false,
      newPartyList : []
    }
  },
  methods: {
    setParty() {
      this.openDialog = true
    },
    fetchParty(data) {
      this.newPartyList = data
    }
  }
}
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
