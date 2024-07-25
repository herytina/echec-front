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
            required
          />

          <div>
            <span class="text-subheading">MISE :</span>
          </div>

          <v-slider
            v-model="mise"
            :color="color"
            :step="1"
            max="20000"
            min="1000"
            track-color="grey"
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

          <v-col class="text-left">
            <span
              class="text-h5 font-weight-light"
              v-text="mise"
            />
            <span class="subheading font-weight-light me-1"> MGA</span>
          </v-col>
        </v-card-text>


        <v-card-actions>
          <v-spacer />
          <v-btn
            color="warning"
            text="annuler"
            variant="outlined"
            @click="dialog = false"
          />

          <v-btn
            color="success"
            text="envoyer"
            variant="flat"
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
      mise: 1000,
      dialog: this.open,
      partyName : null,
      icon: require('@/assets/logo/checkmate.svg'),
      players : []
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
      createParty(this.partyName, this.mise,JSON.stringify([this.user]), 'created').then((data) => {
        if (data) {
          this.dialog = false;
          this.$emit('party', data.parties);
          this.$router.push({name: 'waitPlayer', query :{id:data.partyId.insertId}})
        }
      })
    }
  }
};
</script>

<style scoped>
/* Ajoutez des styles personnalisés si nécessaire */
</style>
