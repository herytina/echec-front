<template>
  <div class="player">
    <v-avatar
      size="54"
      class="mx-auto"
    >
      <NameToAvatar
        :name="playerName"
        :size=54
        :background-color="solde < 60000 ? '#ffc400' : '#09ff00'"
        text-color="#ffffff"
      />
    </v-avatar>
    <div class="player-info">
      <div class="player-name">
        {{ playerName }}
      </div>
      <div
        v-if="turn"
        class="status-indicator"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import NameToAvatar from '@/components/NameToAvatar.vue';
  import { useUserStore } from '@/stores/user.store';

  // Props définies avec `defineProps` et typage explicite
  interface Props {
    solde: number;
    playerName: string;
    turn: boolean;
  }

  const props = defineProps<Props>();

  // Utilisation du store Pinia
  const userStore = useUserStore();
  const user = userStore.user;
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
