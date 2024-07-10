<template>
  <div v-if="party">
    <NavBarVue bg-color="global" />
    <div>
      <v-sheet
        class="sheet pa-4 text-center mx-auto"
        elevation="12"
        max-width="600"
        rounded="lg"
        width="100%"
      >
        <v-card>
          <v-card-title v-if="isFullPlayer">
            Sélectionnez votre piece
          </v-card-title>
          <v-card-text v-if="isFullPlayer">
            <div class="promotion-options">
              <v-btn
                v-for="(piece, index) in pieceChoise"
                :key="index"
                class="promotion-btn"
                height="60"
                width="60"
                @click="choiseColor(piece.color);"
              >
                <v-img
                  :src="piece.image"
                  class="promotion-image"
                  alt="logo"
                />
              </v-btn>
            </div>
          </v-card-text>
          <v-card-text
            v-if="!selectedPiece && isFullPlayer"
            class="text-error"
          >
            Veuillez choisir une piece
          </v-card-text>
        </v-card>

        <h2 class="text-h5 mb-6 mt-5">
          Nom de votre partie : {{ party.name }}
        </h2>

        <p class="mb-4 text-medium-emphasis text-body-2">
          Mise : <a
            class="text-decoration-none text-info"
            href="#"
          >{{ party.mise }}</a>
          MGA
        </p>
      </v-sheet>
    </div>
    <v-card
      title="Joueurs"
      :text="party.players[0].name"
    />

    <v-card
      v-if="party.players[1]"
      :text="party.players[1].name"
    />

    <v-progress-circular
      v-if="!isFullPlayer"
      :size="70"
      :width="7"
      color="amber"
      class="progress mt-5 mb-3"
      indeterminate
    />
  </div>
</template>

<script>
import { usePartyStore } from '@/stores/party.store';
import { useStoreUser } from '@/stores/user.store';
import { getPartybyId, updateParty } from '@/utils/partyApi';
import NavBarVue from '../components/NavBar.vue';

export default{
  name:"WaitPlayer",
  components :{
    NavBarVue
  },
  setup() {
    const userStore = useStoreUser();
    return {
      user: userStore.user,
    };
  },
  data(){
    return{
      party:null,
      isFullPlayer:false,
      pieceChoise : [
        {color:'white', image:require('@/assets/chess-p/white-king.svg')},
        {color:'black',image:require('@/assets/chess-p/black-king.svg')}
      ],
      selectedPiece : false
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
      }else if(data.event === 'letsPlay'){
        console.log("🚀 ~ data:", data)
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
      if(this.message.event === 'playIn'){
        this.party = this.message.data[0];
        this.party.players.length === 2 ? this.isFullPlayer = true : this.isFullPlayer =false;
      }else if(this.message.event === 'letsPlay' && this.message.data.status === 'matching' && parseInt(this.message.data.id) === this.party.id){
        this.$router.push({name:'PartyChess', query:{id:this.party.id}})
      }
    },
    async choiseColor(color){
      if(this.party.players.length === 2){
        let player1
        let player2
        this.party.players.forEach(player => {
          if(color === 'white'){
            if(player.id === this.user.id){
                player.piece = color
                player1 = player
            }else{
                player.piece = 'black'
                player2 = player
            }
          }
          if(color === 'black'){
            if(player.id === this.user.id){
                player.piece = color
                player1 = player
            }else{
                player.piece = 'white'
                player2 = player
            }
          }
        });
         const players = [player1,player2]
        await updateParty(this.party.id, JSON.stringify(players),'matching');
        this.selectedPiece = true
      }

    }
  }
}
</script>

<style scoped>
.progress{
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
}
.btn{
  width: 97%;
  justify-content: center;
  align-items: center;
  margin: 5px;
  z-index: 9999;
}
.sheet{
  margin: 5px;
}
.promotion-options {
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.promotion-btn {
  padding: 0;
  margin: 0;
}
.promotion-image {
  width: 50px;
  height: 50px;
}
</style>
