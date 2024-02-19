<script setup lang="ts">
import { AnOutlinedHeart } from "@kalimahapps/vue-icons";
import { AnFilledHeart } from "@kalimahapps/vue-icons";
</script>

<template>
  <div class="pokemon-card">
    <div class="top">
      <div class="pokemon-id">#{{ pokemon.pokemonId }}</div>
      <i class="favorite-icon" @click="toggleFavorite">
        <AnOutlinedHeart v-show="!isFavorite"/>
        <AnFilledHeart v-show="isFavorite"/>
      </i>
    </div>
    <img v-if="!animated" :src="pokemon.spriteUrl" :alt="pokemon.name" class="pokemon-image">
    <img v-if="animated" :src="pokemon.spriteGifUrl" :alt="pokemon.name" class="pokemon-image">
    <div class="pokemon-name">{{ pokemon.name }}</div>
    <div class="pokemon-data">
      <div class="data-item">
        <div>Height:</div>
        <div class="value">{{ pokemon.height }}</div>
      </div>
      <div class="data-item">
        <div>Weight:</div>
        <div class="value">{{ pokemon.weight }}</div>
      </div>
    </div>
    <div class="type-item">
      <div>Type:</div>
      <div class="value"> {{ pokemonTypes }}</div>
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
  spriteGifUrl: string;
}

export default defineComponent({
  mounted() {
    this.setTypes();
  },
  props: {
    pokemon: {
      type: Object as () => Pokemon,
      required: true
    },
    animated: Boolean
  },
  data() {
    return {
      isFavorite: false,
      pokemonTypes: "",
      borderColor: "white"
    }
  },
  methods: {
    toggleFavorite() {
      this.isFavorite = !this.isFavorite;
      console.log("isFavorite", this.isFavorite);
    },

    setTypes() {
      this.pokemon.types.forEach((element) => {
        // Capitalize the element
        let firstChar = element.charAt(0).toUpperCase();
        element = element.slice(1);
        element = firstChar + element;

        this.pokemonTypes += `${element}/`;
        // console.log(element);
      });

      this.pokemonTypes = this.pokemonTypes.substring(0, this.pokemonTypes.length - 1);

      // Change the border color base on the first type
      switch (this.pokemon.types[0]) {
        case "normal":
          this.borderColor = "#A8A77A";
          break;
        case "fire":
          this.borderColor = "#EE8130";
          break;
        case "water":
          this.borderColor = "#6390F0";
          break;
        case "electric":
          this.borderColor = "#F7D02C";
          break;
        case "grass":
          this.borderColor = "#7AC74C";
          break;
        case "ice":
          this.borderColor = "#96D9D6";
          break;
        case "fighting":
          this.borderColor = "#C22E28";
          break;
        case "poison":
          this.borderColor = "#A33EA1";
          break;
        case "ground":
          this.borderColor = "#E2BF65";
          break;
        case "flying":
          this.borderColor = "#A98FF3";
          break;
        case "psychic":
          this.borderColor = "#F95587";
          break;
        case "bug":
          this.borderColor = "#A6B91A";
          break;
        case "rock":
          this.borderColor = "#B6A136";
          break;
        case "ghost":
          this.borderColor = "#735797";
          break;
        case "dragon":
          this.borderColor = "#6F35FC";
          break;
        case "dark":
          this.borderColor = "#705746";
          break;
        case "steel":
          this.borderColor = "#B7B7CE";
          break;
        case "fairy":
          this.borderColor = "#D685AD";
          break;
        default:
          this.borderColor = "white";
          break;
      }

    }
  }
});
</script>
  
<style scoped>
.pokemon-card {
  /* background-color: #1c1c1c; */
  background-image: linear-gradient(#2a2929, #1c1c1c);
  border: 2px solid;
  border-color: v-bind(borderColor);
  border-radius: 5px;
  padding: 10px;
  margin: 10px;
  display: flex;
  flex-direction: column;
  text-align: center;
  width: 200px;
}

.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.pokemon-id {
  font-weight: bold;
  color: whitesmoke;
}

.favorite-icon {
  cursor: pointer;
}

.pokemon-image {
  width: 150px;
  height: 150px;
  margin-bottom: 10px;
  align-self: center;
}

.pokemon-name {
  font-weight: bold;
  color: whitesmoke;
  margin-bottom: 10px;
  text-transform: capitalize;
}

.pokemon-data {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.data-item {
  display: flex;
  flex-direction: column;
}

.type-item {
  display: flex;
  gap: 5px;
  flex-direction: row;
  align-self: center;
}

.value {
  font-weight: bold;
  color: whitesmoke;
}

.type {
  font-style: italic;
}
</style>
  