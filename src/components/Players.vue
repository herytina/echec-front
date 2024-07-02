<template>
  <div class="player">
    <v-avatar size="54" class="mx-auto">
      <img :src="avatarUrl" alt="Avatar">
    </v-avatar>
    <div class="player-info">
      <div class="player-name">{{ playerName }}</div>
      <div v-if="turn" class="status-indicator"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Player-chess',
  props: {
    avatarUrl: {
      type: String,
      required: true
    },
    playerName: {
      type: String,
      required: true
    },
    turn: {
      type: Boolean,
      required: true
    }
  }
}
</script>

<style scoped>
.player-info {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 8px;
}

.player {
  text-align: center;
}

.player-name {
  margin-top: 8px;
  font-size: 1.2em;
}

.status-indicator {
  width: 10px;
  height: 10px;
  background-color: rgb(195, 91, 6);
  border-radius: 50%;
  margin-left: 5px;
}
</style>
