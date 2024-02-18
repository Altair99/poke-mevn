<template>
  <div class="pokemon-card">
    <img :src="pokemon.spriteUrl" :alt="pokemon.name" class="pokemon-image">
    <div class="pokemon-info">
      <p>{{ pokemon.name }}</p>
      <p>ID: {{ pokemon.pokemonId }}</p>
    </div>
  </div>
</template>
  
<script lang="ts">
import { defineComponent } from 'vue';

interface Pokemon {
  pokemonId: number,
  height: number,
  weight: number,
  types: string[],
  name: string;
  spriteUrl: string;
}

export default defineComponent({
  props: {
    pokemon: {
      type: Object as () => Pokemon,
      required: true
    }
  }
});
</script>
  
<style scoped>
.pokemon-card {
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  margin: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.pokemon-image {
  width: 100px;
  height: 100px;
}

.pokemon-info {
  text-align: center;
}
</style>
  