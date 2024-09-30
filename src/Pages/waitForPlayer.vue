<template>
  <div v-if="party">
    <NavBarVue />
    <GoodHeader />
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
      <v-divider
        :thickness="2"
        class="border-opacity-25"
      />
      <v-row class="mx-auto mt-7">
        <v-col>
          <NameToAvatar
            :name="JSON.parse(party.players)[0].name"
            :size=50
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
              mdi-account-search-outline
            </v-icon>
          </div>
          <div v-if="JSON.parse(party.players)[1]">
            <NameToAvatar
              :name="JSON.parse(party.players)[1].name"
              :size=50
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
      color="warning"
      class="pa-16"
    >
      {{ JSON.parse(party.players)[0].piece === 'white' && JSON.parse(party.players)[0].id === userStore.user.id || 
        JSON.parse(party.players)[1].piece === 'white' && JSON.parse(party.players)[1].id === userStore.user.id ? 'Vous êtes blanc' : 'Vous êtes Noire' }}
      <template #actions>
        <v-btn
          color="red"
          density="default"
          icon="mdi-close-circle"
          @click="snackbar = false"
        />
      </template>
    </v-snackbar>

    <v-snackbar
      v-model="playersWithStatus.length"
      color="warning"
      class="pa-16"
    >
      <div
        v-for="player in playersWithStatus"
        :key="player.name"
      >
        {{ player.name }} est prêt.
      </div>
    </v-snackbar>
    
    
    <div
      v-if="selectedPiece"
      class="position-absolute bottom-0 right-0 pa-5"
    >
      <v-btn
        color="warning"
        variant="flat"
        :disabled="onReady"
        @click="goToboard"
      >
        prêts
      </v-btn>
    </div>
    <v-dialog
      v-model="onReady"
      width="auto"
      class="transparent-dialog"
      persistent
    >
      <v-card
        max-width="400"
      >
        <v-card-text class="mx-auto text-h1">
          {{ label }}
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
  import { useUserStore } from '@/stores/user.store';
  import { getPartyById, updateParty } from '@/utils/partyApi';
  import { usePartyStore } from '@/stores/party.store';
  import { usePlayerStore } from '@/stores/players.store';
  import socket from '@/services/socket';
  import NavBarVue from '../components/NavBar.vue';
  import GoodHeader from '@/components/GoodHeader.vue';
  import NameToAvatar from '@/components/NameToAvatar.vue';

  const userStore = useUserStore();
  const party = ref<any>(null); // Utilisez le type approprié pour vos données de party
  const isFullPlayer = ref<boolean>(false);
  const snackbar = ref<boolean>(false);
  const selectedPiece = ref<boolean>(false);
  const players = ref<any[]>([]); // Utilisez le type approprié
  const allReadyPlayer = ref<boolean>(false);
  const onReady = ref<boolean>(false);
  const label = ref<number>(0);
  const intervalId = ref<number>(1); // Type pour l'intervalle
  const playersWithStatus = ref<any[]>([]); // Utilisez le type approprié

  const pieceChoise = ref([
    { color: 'white', image: new URL('@/assets/chess-p/white-king.svg', import.meta.url).href },
    { color: 'black', image: new URL('@/assets/chess-p/black-king.svg', import.meta.url).href }
  ]);
  const vs = new URL('@/assets/logo/vs.png', import.meta.url).href;

  const allStatusReady = computed(() => {
    return party.value?.every((item: any) => item.status && item.status === 'ready') || false; // Remplacez 'any' par un type approprié
  });

  // Socket event listeners
  socket.onPartyListUpdated((response: any) => { // Remplacez 'any' par un type approprié
    party.value = response.data[0];
    isFullPlayer.value = JSON.parse(party.value.players).length === 2;
  });

  socket.onPartySelected(async () => {
    const partyStore = usePartyStore();
    party.value = await getPartyById(party.value.id);
    partyStore.setParty(party.value);
    selectedPiece.value = true;
    snackbar.value = true;
  });

  socket.onReadyPlayer(async (response: any) => { // Remplacez 'any' par un type approprié
    const playerStore = usePlayerStore();
    const playersSocket = response.players;
    playerStore.setPlayers(playersSocket);
    players.value = playerStore.players;
    allReadyPlayer.value = players.value.every((item: any) => 'status' in item); // Remplacez 'any' par un type approprié
    playersWithStatus.value = players.value.filter((item: any) => 'status' in item);
    if (allReadyPlayer.value) {
      onReady.value = false;
      // Redirection
      // Utilisez `useRouter` si vous voulez faire une redirection
    }
  });

  // Mounted lifecycle hook
  onMounted(async () => {
    try {
      const id = new URLSearchParams(window.location.search).get('id'); // Utilisez l'API URL pour extraire les paramètres de l'URL
      if (id) {
        party.value = await getPartyById(id);
        isFullPlayer.value = JSON.parse(party.value.players).length === 2;
      }
    } catch (error) {
      console.error('fetch party failed', error);
    }
  });

  // BeforeUnmount lifecycle hook
  onBeforeUnmount(() => {
    // Nettoyer l'intervalle lors de la destruction du composant
    if (intervalId.value) {
      clearInterval(intervalId.value);
    }
  });

  // Methods
  const updateStatus = async () => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        allReadyPlayer.value = players.value.every((item: any) => 'status' in item); // Remplacez 'any' par un type approprié
        if (allReadyPlayer.value) {
          // Redirection
          // Utilisez `useRouter` si vous voulez faire une redirection
        }
        resolve();
      }, 1000);
    });
  };

  const choiseColor = async (color: string) => {
    if (JSON.parse(party.value.players).length === 2) {
      let player1: any, player2: any; // Remplacez 'any' par un type approprié
      JSON.parse(party.value.players).forEach((player: any) => { // Remplacez 'any' par un type approprié
        if (color === 'white') {
          if (player.id === userStore.user.id) {
            player.piece = color;
            player1 = player;
          } else {
            player.piece = 'black';
            player2 = player;
          }
        }
        if (color === 'black') {
          if (player.id === userStore.user.id) {
            player.piece = color;
            player1 = player;
          } else {
            player.piece = 'white';
            player2 = player;
          }
        }
      });
      const playersArray = [player1, player2];
      await updateParty(party.value.id, JSON.stringify(playersArray), 'matching');
    }
  };

  const goToboard = async () => {
    const playerStore = usePlayerStore();
    let tmpPlayer = players.value.length === 0 ? JSON.parse(party.value.players) : players.value;
    let tmpPlayer1 = tmpPlayer[0];
    let tmpPlayer2 = tmpPlayer[1];

    if (userStore.user.id === tmpPlayer1.id) {
      tmpPlayer1.status = 'ready';
    } else if (userStore.user.id === tmpPlayer2.id) {
      tmpPlayer2.status = 'ready';
    }
    
    players.value = [tmpPlayer1, tmpPlayer2];
    playerStore.setPlayers(players.value);
    
    onReady.value = true;

    if (onReady.value) {
      // Démarrer l'incrémentation du label chaque seconde
      intervalId.value = setInterval(() => {
        label.value += 1;
        if (label.value >= 30) {
          onReady.value = false;
          clearInterval(intervalId.value);
          label.value = 0; // Réinitialiser le label
        }
      }, 1000);
    } else {
      // Arrêter l'incrémentation du label et réinitialiser la valeur
      clearInterval(intervalId.value);
      label.value = 0;
    }
    
    try {
      await updateStatus();
      socket.readyToPlay(players.value);
    } catch (error) {
      console.error('error to up players', error);
    }
  };
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
.transparent-dialog .v-overlay__scrim {
  background-color: rgba(0, 0, 0, 0.0) !important; /* Semi-transparent background */
}
.transparent-dialog .v-card {
  background: rgba(255, 255, 255, 0.0) !important; /* Semi-transparent card background */
}
</style>
