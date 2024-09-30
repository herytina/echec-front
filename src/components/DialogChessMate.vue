<template>
  <div class="text-center pa-4">
    <v-dialog
      v-model="dialog"
      max-width="400"
      persistent
    >
      <v-card
        v-if="chessMate"
        class="d-flex flex-column align-center justify-center text-center"
        title="Partie terminer"
        text="echec est mate"
      >
        <v-card-text>
          <v-icon>
            <img
              :src="icon"
              width="70"
              alt="Custom Icon"
            >
          </v-icon>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="closeDialog">
            ok
          </v-btn>
        </v-card-actions>
      </v-card>

      <v-card
        v-if="!chessMate"
        title="Cree une partie"
      >
        <v-card-text>
          <v-text-field
            v-model="partyName"
            label="Nom de la partie"
            variant="solo"
            required
          />

          <div>
            <span class="text-subheading">MISE :</span>
          </div>

          <v-text-field
            v-model="mise"
            append-inner-icon="mdi-currency-usd"
            :rules="[minRule]"
            variant="solo"
            required
            @input="validateInput"
          />

          <v-slider
            v-model="mise"
            :color="color"
            :step="1"
            max="20000"
            min="500"
            track-color="grey"
            class="mb-5"
          >
            <template #prepend>
              <v-btn
                :color="color"
                icon="mdi-minus"
                size="small"
                variant="text"
                @click="decrement"
              />
            </template>

            <template #append>
              <v-btn
                :color="color"
                icon="mdi-plus"
                size="small"
                variant="text"
                @click="increment"
              />
            </template>
          </v-slider>

          <v-row>
            <div>
              <span class="text-subheading">Durée de la partie :</span>
            </div>

            <v-select
              v-if="mise >= 500"
              v-model="timerOption"
              variant="solo"
              :items="selectItems"
              class="mx-5"
              style="width: 50px;"
            />
            <span>en minute</span>
          </v-row>
        </v-card-text>


        <v-card-actions class="d-flex mb-6">
          <v-btn
            class="ma-2 pa-2 me-auto"
            color="warning"
            text="annuler"
            variant="outlined"
            append-icon="mdi-cancel"
            @click="dialog = false"
          />
          <v-btn
            class="w-33"
            color="success"
            text="créer"
            variant="flat"
            append-icon="mdi-pencil-outline"
            end
            @click="postNewParty"
          />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>


<script setup lang="ts">
  import { ref, computed, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import { useUserStore } from '@/stores/user.store';
  import { createParty } from '@/utils/partyApi';

  interface PartyResponse {
    parties: any[];
    partyId: { insertId: number };
  }

  // Props definition
  const props = defineProps<{
    open: boolean;
    chessMate: boolean;
  }>();

  const emit = defineEmits(['update:open', 'party']);

  // User store
  const userStore = useUserStore();
  const user = userStore.user;

  // Reactive state
  const mise = ref(500);
  const timerOption = ref(1);
  const dialog = ref(props.open);
  const partyName = ref<string>('');
  const icon = new URL('@/assets/logo/checkmate.svg', import.meta.url).href;
  const players = ref<any[]>([]);
  const selectTimer = ref(true);

  // Custom validation rule
  const minRule = (value: number) => value >= 500 || 'La mise minimum est de 500 ar';

  // Computed properties
  const color = computed(() => {
    if (mise.value < 5000) return 'red';
    if (mise.value < 10000) return 'orange';
    if (mise.value < 15000) return 'teal';
    return 'green';
  });

  const selectItems = computed(() => {
    if (mise.value >= 500 && mise.value < 1000) {
      return [1, 2, 3];
    } else if (mise.value >= 1000 && mise.value < 3000) {
      return [1, 2, 3, 4, 5, 6, 7];
    } else if (mise.value >= 3000) {
      return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    }
    return [];
  });

  // Watchers
  watch(() => props.open, (val) => {
    dialog.value = val;
  });

  watch(dialog, (val) => {
    emit('update:open', val);
  });

  // Methods
  const closeDialog = () => {
    dialog.value = false;
  };

  const decrement = () => {
    if (mise.value > 500) mise.value--;
  };

  const increment = () => {
    mise.value++;
  };

  const postNewParty = async () => {
    try {
      const data: PartyResponse = await createParty(
        partyName.value, 
        mise.value, 
        JSON.stringify([user]), 
        'created', 
        timerOption.value
      );
      if (data) {
        dialog.value = false;
        emit('party', data.parties);
        router.push({ name: 'waitPlayer', query: { id: data.partyId.insertId } });
      }
    } catch (error) {
      console.error('Error creating party:', error);
    }
  };

  const validateInput = () => {
    const miseString = mise.value.toString();
    if (miseString !== '' && !/^\d+$/.test(miseString)) {
      mise.value = parseInt(miseString.replace(/\D/g, ''), 10);
      if (mise.value >= 500) {
        selectTimer.value = false;
      }
    }
  };

  // Router
  const router = useRouter();
</script>


<style scoped>
/* Ajoutez des styles personnalisés si nécessaire */
</style>
