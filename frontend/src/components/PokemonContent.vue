<template>
  <div class="pokemon-grid">
    <PokemonCard v-for="(pokemon, index) in pokemonsData" :key="index" :pokemon="pokemon" :animated="animated" />
  </div>
  <div class="button-area" v-show="!searchQuery">
    <button class="button" @click="loadMorePokemons">More Pokémons</button>
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
  spriteGifUrl: string;
}

export default defineComponent({
  updated() {
    console.log("searechQuery: ", this.searchQuery, !this.searchQuery);
  },
  props: {
    pokemonsData: {
      type: Array as () => Pokemon[],
      required: true
    },
    searchQuery: String,
    animated: Boolean
  },
  components: {
    PokemonCard
  },
  methods: {
    loadMorePokemons() {
      console.log(this.pokemonsData.length);
      this.$emit("fetchPokemonsCallback", this.pokemonsData.length + 40, 40);
    }
  }
});
</script>

<style scoped>
.pokemon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.button-area {
  margin: 4rem;
  display: flex;
  flex-direction: column;
}

.button {
  align-self: center;
  width: 200px;
  height: 60px;
  background: none;
  border: 2px solid #f3da35;
  border-radius: 5px;
  color: white;
  transition-duration: 0.4s;
  font-weight: bold;
  font-size: larger;
}

.button:hover {
  background-color: #f3da35;
  color: white;
}
</style>
