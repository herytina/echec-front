<template>
  <div v-if="party">
    <NavBarVue bg-color="global" />
    <div>
      <span>{{ party.name }}</span>
    </div>
    <div>
      <span>Mise : {{ party.mise }} MGA</span>
    </div>
    <div>
      En attente de joueur
    </div>
    <v-card
      :text="party.players[0].name"
    />

    <v-card
      v-if="party.players[1]"
      :text="party.players[1].name"
    />

    <div
      v-if="isFullPlayer"
      class="btn"
    >
      <v-btn
        color="#d2992f"
        size="x-large"
        variant="tonal"
        class="text-none btn"
        border
        @click="letGame"
      >
        jouer
      </v-btn>
    </div>
  </div>
</template>

<script>
import { usePartyStore } from '@/stores/party.store';
import { getPartybyId } from '@/utils/partyApi';
import NavBarVue from '../components/NavBar.vue';

export default{
  name:"WaitPlayer",
  components :{
    NavBarVue
  },
  data(){
    return{
      party:null,
      isFullPlayer:false
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
      if (data.event === 'playIn') {
        this.party.push(data.data);
      }
    },
  },
  created(){
    this.$socket.addEventListener('message', this.handleWebSocketMessage);
  },
  async mounted() {
    const partyStore = usePartyStore();
    try {
      const id = this.$route.query.id;
      if(id !== null){
        this.party = await getPartybyId(id);
        this.party.players.length === 2 ? this.isFullPlayer = true : this.isFullPlayer =false;
        partyStore.setParty(this.party)
      }
    } catch (error) {
      console.error('fetch party failed', error);
    }
  },
  methods:{
    handleWebSocketMessage(event) {
      this.message = JSON.parse(event.data); // Mettre à jour la donnée du message
      this.party = this.message.data[0];
      this.party.players.length === 2 ? this.isFullPlayer = true : this.isFullPlayer =false;
    },
    letGame(){
      this.$router.push({name:'PartyChess', query:{id:this.party.id}})
    }
  }
}
</script>

<style scoped>

</style>
