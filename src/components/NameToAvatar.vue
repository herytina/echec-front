<template>
  <div>
    <canvas
      ref="canvas"
      :width="size"
      :height="size"
      style="display:none"
    />
    <img
      :src="avatarUrl"
      :alt="initials"
      :width="size"
      :height="size"
    >
  </div>
</template>
  
  <script>
  export default {
    props: {
      name: {
        type: String,
        required: true,
      },
      size: {
        type: Number,
        default: 100,
      },
      backgroundColor: {
        type: String,
        default: '#0000ff',
      },
      textColor: {
        type: String,
        default: '#ffffff',
      },
    },
    data() {
      return {
        avatarUrl: '',
      };
    },
    computed: {
      initials() {
        return this.name.substring(0, 2).toUpperCase();
      },
    },
    mounted() {
      this.generateAvatar();
    },
    methods: {
      generateAvatar() {
        const canvas = this.$refs.canvas;
        const context = canvas.getContext('2d');
  
        // Dessiner le fond
        context.fillStyle = this.backgroundColor;
        context.fillRect(0, 0, this.size, this.size);
  
        // Dessiner les initiales
        context.fillStyle = this.textColor;
        context.font = `${this.size / 2}px Arial`;
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(this.initials, this.size / 2, this.size / 2);
  
        // Convertir en URL de données
        this.avatarUrl = canvas.toDataURL();
      },
    },
  };
  </script>
  
  <style scoped>
  img {
    border-radius: 50%;
  }
  </style>
  