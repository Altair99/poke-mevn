<script setup lang="ts">
import PokemonLogo from './components/icons/PokemonLogo.vue';
import PokemonSearchbar from './components/PokemonSearchbar.vue';
import PokemonContent from './components/PokemonContent.vue';
</script>

<template>
  <div class="container">
    <PokemonLogo />
    <PokemonSearchbar @search="searchPokemon" @toggleAnimation="toggleAnimation" />
  </div>
  <div class="grid-container">
    <main>
      <PokemonContent :pokemonsData="pokemons" :searchQuery="searchQueryName" :animated="animated" @fetchPokemonsCallback="fetchPokemons" />
    </main>
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
  spriteGifUrl: string;
}

export default defineComponent({
  data() {
    return {
      pokemons: [] as Pokemon[],
      searchQueryName: "",
      animated: false,
    };
  },
  mounted() {
    // Get the first set of pokemons
    this.fetchPokemons(0, 40);
  },
  methods: {
    async searchPokemon(pokemonName: string) {
      try {
        this.searchQueryName = pokemonName;

        // Clean the array
        this.pokemons = [];

        if (!pokemonName) {
          this.fetchPokemons(0, 40);
          return;
        }

        const response = await fetch(`http://localhost:3000/api/search-pokemon?name=${pokemonName}`);
        // console.log(response);
        const data = await response.json();
        console.log("data:", data);

        this.pokemons.push(...data.pokemons);
        console.log("Pokemons:", this.pokemons);

      } catch (error) {
        console.error('Error fetching Pokémon data:', error);
        // Handle erro
      }
    },
    async fetchPokemons(offset: number, limit: number) {
      try {

        const response = await fetch(`http://localhost:3000/api/fetch-pokemons?limit=${limit}&offset=${offset}`);

        // console.log(response);
        const data = await response.json();
        console.log("data:", data);

        this.pokemons.push(...data.pokemons);
        console.log("Pokemons:", this.pokemons);

      } catch (error) {
        console.error('Error fetching Pokémon data:', error);
        // Handle erro
      }
    },
    toggleAnimation(animated: boolean) {
      this.animated = animated;
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

.grid-container {
  width: 100%;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}
</style>
