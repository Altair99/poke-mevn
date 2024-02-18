<template>
  <div class="pokemon-grid">
    <PokemonCard v-for="(pokemon, index) in pokemonsData" :key="index" :pokemon="pokemon" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PokemonCard from './PokemonCard.vue';

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
    pokemonsData: {
      type: Array as () => Pokemon[],
      required: true
    }
  },
  components: {
    PokemonCard
  }
});
</script>

<style scoped>
.pokemon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}
</style>
