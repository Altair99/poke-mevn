<template>
    <div>
        <input type="text" v-model="searchQuery" placeholder="Search for Pokémon">
        <button @click="searchPokemon">Search</button>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

interface Pokemon {
    name: string;
    spriteUrl: string;
}

export default defineComponent({
    data() {
        return {
            searchQuery: '',
            pokemonList: [] as Pokemon[]
        };
    },
    methods: {
        async searchPokemon() {
            try {
                // Make API call to fetch Pokémon data based on searchQuery
                const response = await fetch(`https://api.example.com/pokemon?search=${this.searchQuery}`);
                const data = await response.json();

                // Assuming API response returns an array of Pokémon objects with 'name' and 'spriteUrl'
                this.pokemonList = data.map((pokemon: any) => ({
                    name: pokemon.name,
                    spriteUrl: pokemon.sprites.front_default
                })) as Pokemon[];
            } catch (error) {
                console.error('Error fetching Pokémon data:', error);
                // Handle erro
            }
        }
    }
});
</script>