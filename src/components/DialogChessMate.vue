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



<script>
import { useStoreUser } from '@/stores/user.store';
import { createParty } from '@/utils/partyApi';

export default {
  name: 'DialogChess',
  props: {
    open: {
      type: Boolean,
      required: true
    },
    chessMate: {
      type: Boolean,
      required: true
    }
  },
  setup() {
    const userStore = useStoreUser();
    return {
      user: userStore.user,
    };
  },
  data() {
    return {
      mise: 500,
      timerOption:1,
      dialog: this.open,
      partyName : null,
      icon: require('@/assets/logo/checkmate.svg'),
      players : [],
      selectTimer: true,
      minRule: value => value >= 500 || 'La mise minimum est de 500 ar',
    };
  },
  computed: {
    color () {
      if (this.mise < 5000) return 'red'
      if (this.mise < 10000) return 'orange'
      if (this.mise < 15000) return 'teal'
      if (this.mise <= 20000) return 'green'
      return 'green'
    },
    selectItems() {
      if (this.mise >= 500 && this.mise < 1000) {
        return [1, 2, 3];
      } else if (this.mise >= 1000 && this.mise < 3000) {
        return [1, 2, 3, 4, 5, 6, 7];
      } else if (this.mise >= 3000) {
        return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      }
      return [];
    },
  },
  watch: {
    open(val) {
      this.dialog = val;
    },
    dialog(val) {
      this.$emit('update:open', val);
    }
  },
  methods: {
    closeDialog() {
      this.dialog = false;
    },
    decrement () {
        this.mise--
    },
    increment () {
      this.mise++
    },
    postNewParty() {
      createParty(this.partyName, this.mise,JSON.stringify([this.user]), 'created',this.timerOption).then((data) => {
        if (data) {
          this.dialog = false;
          this.$emit('party', data.parties);
          this.$router.push({name: 'waitPlayer', query :{id:data.partyId.insertId}})
        }
      })
    },
    validateInput() {
      if (this.mise !== '' && !/^\d+$/.test(this.mise)) {
        this.mise = this.mise.replace(/\D/g, '');
        if(this.mise >= 500){
          this.selectTimer = false
        }
      }
    }
  }
};
</script>

<style scoped>
/* Ajoutez des styles personnalisés si nécessaire */
</style>
