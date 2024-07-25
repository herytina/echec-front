<template>
  <div>
    <div v-if="isPlayer">
      solde insuffisante
    </div>
    <v-list-item
      v-for="(party, key) in partyLists"
      :key="key"
      base-color="surface-light"
      border="opacity-50 md"
      lines="two"
      :prepend-avatar="avatar"
      rounded="lg"
      variant="flat"
      class="list"
    >
      <v-list-item-title>
        <span class="text-h6">{{ party.name }} <span class="text-medium-emphasis text-caption">créer par {{ JSON.parse(party.players)[0].name }}</span> </span>
      </v-list-item-title>

      <v-list-item-subtitle>
        <v-scroll-y-reverse-transition mode="out-in">
          <div
            class="text-warning text-caption"
          >
            {{ party.mise }} MGA
          </div>
        </v-scroll-y-reverse-transition>
      </v-list-item-subtitle>

      <template #append>
        <v-fade-transition mode="out-in">
          <v-btn
            color="#d2992f"
            text="Rejoindre"
            variant="tonal"
            class="me-2 text-none"
            size="small"
            flat
            @click="playParty(party.id)"
          />
        </v-fade-transition>
      </template>
    </v-list-item>
  </div>
</template>
<script>
import { useStoreUser } from '@/stores/user.store';
import { getAllParty, getPartybyId, updateParty } from '@/utils/partyApi';

export default {
  props: {
    newParty: {
      type: Array,
      require :true
    }
  },
  setup() {
    const userStore = useStoreUser();
    return {
      user: userStore.user,
    };
  },
  data(){
    return {
      avatar: require('@/assets/logo/money.svg'),
      partyLists: this.newParty,
      isPlayer : false
    }
  },
  sockets: {
    connect() {
      console.log('WebSocket connected');
    },
    disconnect() {
      console.log('WebSocket disconnected');
    },
    message(data) {
      if (data.event === 'newParty') {
        this.partyLists.push(data.data);
      }
    },
  },
  watch: {
    newParty(val) {
      this.partyLists = val;
    }
  },
  async mounted() {
    await this.fetchAllParty()
  },
  created(){
    this.$socket.addEventListener('message', this.handleWebSocketMessage);
  },
  methods:{
    handleWebSocketMessage(event) {
      this.message = JSON.parse(event.data); // Mettre à jour la donnée du message
      if(this.message.event === 'newParty' ){
        this.partyLists = this.message.data
      }
    },
    playParty(id) {
      let user = this.user
      getPartybyId(id).then(async (party) => {
        let player1 = JSON.parse(party.players)[0]
        if(!this.isEqual(player1, user) && party.mise < user.solde){
          this.isPlayer =false
          let players = [player1]
          players.push(user)
          await updateParty(id, JSON.stringify(players),'en cours');
          this.$router.push({name: 'waitPlayer', query :{id:id}})
        }else if(this.isEqual(player1, user)){
          this.$router.push({name: 'waitPlayer', query :{id:id}})
        }else{
          this.isPlayer = true
        }
      })
    },
    isEqual(obj1, obj2) {
      if (obj1 === obj2) return true;

      if (typeof obj1 !== 'object' || obj1 === null ||
          typeof obj2 !== 'object' || obj2 === null) {
        return false;
      }

      const keys1 = Object.keys(obj1);
      const keys2 = Object.keys(obj2);

      if (keys1.length !== keys2.length) return false;

      for (let key of keys1) {
        if (!keys2.includes(key) || !this.isEqual(obj1[key], obj2[key])) {
          return false;
        }
      }

      return true;
    },
    async fetchAllParty() {
      this.partyLists = await getAllParty()
    }
  }

}

</script>

<style scoped>
  .list{
    margin: 10px;
  }
</style>
