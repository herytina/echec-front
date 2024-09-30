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

<script setup lang="ts">
  import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
  import { useRouter } from 'vue-router';
  import { useUserStore } from '@/stores/user.store';
  import { getAllParty, getPartyById, updateParty } from '@/utils/partyApi';
  import socket from '@/services/socket';

  interface Party {
    players: string;
    mise: number;
  }

  const props = defineProps<{
    newParty: Array<any>
  }>();

  const avatar = new URL('@/assets/logo/money.svg', import.meta.url).href;
  const partyLists = ref(props.newParty);
  const isPlayer = ref(false);

  const userStore = useUserStore();
  const user = userStore.user;
  const router = useRouter();

  // Watch for newParty prop changes
  watch(() => props.newParty, (val) => {
    partyLists.value = val;
  });

  // Fetch all parties on mount
  const fetchAllParty = async () => {
    partyLists.value = await getAllParty();
  };

  onMounted(async () => {
    await fetchAllParty();
    socket.onNewParty((response: { data: any }) => {
      partyLists.value = response.data;
    });
  });

  // Cleanup socket listener before unmounting
  onBeforeUnmount(() => {
    socket.onNewParty((response: { data: any }) => {
      console.log(response.data);
    });
  });

  const playParty = async (id: number) => {
    const party: Party = await getPartyById(id);
    const player1 = JSON.parse(party.players)[0];

    if (!isEqual(player1, user) && party.mise < user.wallet.balance) {
      isPlayer.value = false;
      const players = [player1, user];
      await updateParty(id, JSON.stringify(players), 'en cours');
      router.push({ name: 'waitPlayer', query: { id } });
    } else if (isEqual(player1, user)) {
      router.push({ name: 'waitPlayer', query: { id } });
    } else {
      isPlayer.value = true;
    }
  };

  // Function to compare objects
  const isEqual = (obj1: any, obj2: any): boolean => {
    if (obj1 === obj2) return true;

    if (typeof obj1 !== 'object' || obj1 === null || 
        typeof obj2 !== 'object' || obj2 === null) {
      return false;
    }

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) return false;

    for (const key of keys1) {
      if (!keys2.includes(key) || !isEqual(obj1[key], obj2[key])) {
        return false;
      }
    }

    return true;
  };
</script>


<style scoped>
  .list{
    margin: 10px;
  }
</style>
