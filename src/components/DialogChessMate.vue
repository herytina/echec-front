<template>
  <div class="text-center pa-4">
    <v-dialog
      v-model="dialog"
      max-width="400"
      persistent
    >
      <v-card
        class="d-flex flex-column align-center justify-center text-center"
        title="Partie terminer"
        text="echec est mate"
      >
        <v-card-text>
          <v-icon>
            <img :src="icon" width="70" alt="Custom Icon" />
          </v-icon>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="closeDialog">ok</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>



<script>
export default {
  name: 'Dialog-Chess',
  props: {
    open: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      dialog: this.open,
      icon : require('@/assets/logo/checkmate.svg')
    };
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
    }
  }
};
</script>

<style scoped>
/* Ajoutez des styles personnalisés si nécessaire */
</style>
