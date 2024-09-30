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
  
<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';

  // Props typées avec `defineProps`
  interface Props {
    name: string;
    size?: number;
    backgroundColor?: string;
    textColor?: string;
  }

  const props = defineProps<Props>();

  // Données locales (équivalent à `data()`)
  const avatarUrl = ref<string>('');

  // Calcul des initiales (équivalent à `computed`)
  const initials = computed(() => props.name.substring(0, 2).toUpperCase());

  // Méthode pour générer l'avatar (équivalent à `methods`)
  const generateAvatar = () => {
    const canvas = document.createElement('canvas');
    canvas.width = props.size || 100;
    canvas.height = props.size || 100;
    
    const context = canvas.getContext('2d');
    if (!context) return;

    // Dessiner le fond
    context.fillStyle = props.backgroundColor || '#0000ff';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Dessiner les initiales
    context.fillStyle = props.textColor || '#ffffff';
    context.font = `${(props.size || 100) / 2}px Arial`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(initials.value, (props.size || 100) / 2, (props.size || 100) / 2);

    // Convertir en URL de données
    avatarUrl.value = canvas.toDataURL();
  };

  // Utilisation de `onMounted` pour exécuter la méthode après le montage du composant
  onMounted(() => {
    generateAvatar();
  });
</script>
  
  <style scoped>
  img {
    border-radius: 50%;
  }
  </style>
  