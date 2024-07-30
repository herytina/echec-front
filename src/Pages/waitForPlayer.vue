<template>
  <div v-if="party">
    <NavBarVue bg-color="global" />
    <div class="mt-7">
      <v-sheet
        class="pa-4 text-center mx-auto"
        elevation="12"
        max-width="500"
        rounded="lg"
        width="94%"
      >
        <v-card v-if="isFullPlayer">
          <v-card-title>
            Sélectionnez votre piece
          </v-card-title>
          <v-card-text class="mt-6 mb-6">
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
            v-if="!selectedPiece"
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
            class="text-decoration-none text-warning"
            href="#"
          >{{ party.mise }}</a>
          MGA
        </p>
      </v-sheet>
    </div>

    
    <v-card
      elevation="12"
      class="mx-4 mt-8 text-center pa-6"
    >
      <v-card-title prepend-icon="mdi-handshake-outline">
        Les joueurs
      </v-card-title>
      <v-row class="mx-auto mt-7">
        <v-col>
          <NameToAvatar
            :name="JSON.parse(party.players)[0].name"
            size="50"
            background-color="#ffc400"
            text-color="#ffffff"
          />
          <v-card-text>
            {{ JSON.parse(party.players)[0].name }}
          </v-card-text>

          <v-card-text v-if="selectedPiece">
            <v-img
              :src="JSON.parse(party.players)[0].piece === 'white' ? pieceChoise[0].image : pieceChoise[1].image"
            />
          </v-card-text>
        </v-col>
        <v-col>
          <v-progress-circular
            v-if="!isFullPlayer"
            :size="50"
            :width="7"
            color="amber"
            class="progress mt-5 mb-3"
            indeterminate
          />
          <div v-if="isFullPlayer">
            <v-img
              :width="150"
              aspect-ratio="16/9"
              cover
              :src="vs"
            />
          </div>
        </v-col>
        <v-col>
          <div v-if="!JSON.parse(party.players)[1]">
            <v-icon size="65">
              mdi-account-settings
            </v-icon>
          </div>
          <div v-if="JSON.parse(party.players)[1]">
            <NameToAvatar
              :name="JSON.parse(party.players)[1].name"
              size="50"
              background-color="#09ff00"
              text-color="#ffffff"
            />
            <v-card-text>
              {{ JSON.parse(party.players)[1].name }}
            </v-card-text>

            <v-card-text v-if="selectedPiece">
              <v-img
                :src="JSON.parse(party.players)[0].piece === 'white' ? pieceChoise[1].image : pieceChoise[0].image"
              />
            </v-card-text>
          </div>
        </v-col>
      </v-row>
    </v-card>

    <v-snackbar
      v-model="snackbar"
      color="success"
    >
      {{ JSON.parse(party.players)[0].piece === 'white' && JSON.parse(party.players)[0].id === user.id || 
        JSON.parse(party.players)[1].piece === 'white' && JSON.parse(party.players)[1].id === user.id ? 'Vous êtes blanc' : 'Vous êtes Noire' }}
      <template #actions>
        <v-btn
          color="red"
          density="default"
          icon="mdi-close-circle"
          @click="snackbar = false"
        />
      </template>
    </v-snackbar>

    <div
      v-if="selectedPiece"
      class="position-absolute bottom-0 right-0 pa-5"
    >
      <v-btn
        color="warning"
        variant="flat"
        @click="goToboard"
      >
        prêts
      </v-btn>
    </div>
  </div>
</template>

<script>
import { useStoreUser } from '@/stores/user.store';
import { getPartybyId, updateParty } from '@/utils/partyApi';
import NavBarVue from '../components/NavBar.vue';
import { usePartyStore } from '@/stores/party.store';
import socket from '@/services/socket';
import NameToAvatar from '@/components/NameToAvatar.vue';

export default{
  name:"WaitPlayer",
  components :{
    NavBarVue,
    NameToAvatar
  },
  setup() {
    const userStore = useStoreUser();

    return {
      user: userStore.user
    };
  },
  data(){
    return{
      party:null,
      isFullPlayer:false,
      snackbar:false,
      pieceChoise : [
        {color:'white', image:require('@/assets/chess-p/white-king.svg')},
        {color:'black',image:require('@/assets/chess-p/black-king.svg')}
      ],
      selectedPiece : false,
      vs : require('@/assets/logo/vs.png')
    }
  },
  created(){
    socket.onPartyListUpdated((response)=>{
      this.party = response.data[0];
      JSON.parse(this.party.players).length === 2 ? this.isFullPlayer = true : this.isFullPlayer = false;
    })
    socket.onPartySelected(async ()=>{
      const partyStore = usePartyStore()
      this.party = await getPartybyId(this.party.id);
      partyStore.setParty(this.party);
      this.selectedPiece = true;
      this.snackbar=true
      // if(response.data.status === 'matching'){
      //   // this.$router.push('/party')
      // }
    })
  },
  async mounted() {
    try {
      const id = this.$route.query.id;
      if(id !== null){
        this.party = await getPartybyId(id);
        JSON.parse(this.party.players).length === 2 ? this.isFullPlayer = true : this.isFullPlayer = false;
      }
    } catch (error) {
      console.error('fetch party failed', error);
    }
  },
  methods:{
    async choiseColor(color){
      if(JSON.parse(this.party.players).length === 2){
        let player1
        let player2
        JSON.parse(this.party.players).forEach(player => {
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
      }

    },
    goToboard(){
      console.log('lasa ty anh');
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
