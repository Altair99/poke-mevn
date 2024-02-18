<script setup lang="ts">
import PokemonLogo from './components/icons/PokemonLogo.vue';
import PokemonSearchbar from './components/PokemonSearchbar.vue';
import PokemonContent from './components/PokemonContent.vue';
</script>

<template>
  <div class="container">
    <PokemonLogo />
    <PokemonSearchbar @search="searchPokemon" />
  </div>
  <main>
    <PokemonContent :pokemonsData="pokemons" />
  </main>
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
  data() {
    return {
      pokemons: [] as Pokemon[]
    };
  },
  mounted() {
    // Get the first set of pokemons
    this.fetchPokemons(0);
  },
  methods: {
    async searchPokemon(pokemonName: string) {
      try {
        // Make API call to fetch Pokémon data based on searchQuery
        console.log(`http://localhost:3000/api/search-pokemon?name=${pokemonName}`);
        const response = await fetch(`http://localhost:3000/api/search-pokemon?name=${pokemonName}`);
        // console.log(response);
        const data = await response.json();
        console.log("data:", data);

        this.pokemons = data;
        console.log("Pokemons:", this.pokemons);

      } catch (error) {
        console.error('Error fetching Pokémon data:', error);
        // Handle erro
      }
    },
    async fetchPokemons(offset: number) {
      try {
        // The limit set for the pagination
        const limit = 60;
        // Make API call to fetch Pokémon data based on searchQuery
        console.log(`http://localhost:3000/api/fetch-pokemons?limit=${limit}&offset=${offset}`);
        const response = await fetch(`http://localhost:3000/api/fetch-pokemons?limit=${limit}&offset=${offset}`);
        // console.log(response);
        const data = await response.json();
        console.log("data:", data);

        this.pokemons = data.pokemons;
        console.log("Pokemons:", this.pokemons);

      } catch (error) {
        console.error('Error fetching Pokémon data:', error);
        // Handle erro
      }
    }
  }
});
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {}
</style>
