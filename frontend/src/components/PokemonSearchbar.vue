<template>
  <div class="searchbar-container">
    <button class="button" @click="toggleAnimation">Press for fun</button>
    <div class="searchbar">
      <input type="text" v-model="searchQuery" @input="search" placeholder="Search for Pokémon">
      <!-- <button @click="search">Search</button> -->
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'SearchBar',
  data() {
    return {
      searchQuery: '',
      animated: false
    };
  },
  methods: {
    search() {
      this.$emit('search', this.searchQuery);
    },
    toggleAnimation() {
      this.animated = !this.animated;
      this.$emit('toggleAnimation', this.animated);
    }
  }
};
</script>

<style scoped>
.searchbar-container {
  display: flex;
  align-items: baseline;
  padding: 10px;
  flex-direction: row;
  gap: 4rem;
  width: 100%;
}

.searchbar {
  display: flex;
  justify-content: center;
  align-items: center;
}

.button {
  /* align-self: center; */
  width: 150px;
  height: 40px;
  background: none;
  border: 2px solid #f3da35;
  border-radius: 5px;
  color: white;
  transition-duration: 0.4s;
  font-weight: bold;
  font-size: larger;
  float: left;
}

.button:hover {
  background-color: #f3da35;
  color: white;
}

input {
  align-items: center;
  width: 20rem;
  border: none;
  background: none;
  border-bottom: 2px solid #f3da35;
  font-size: larger;
  font-weight: bold;
  color: white;
  margin-bottom: 2rem;
}

input:focus {
  border: none;
  background-color: none;
  border-bottom: 2px solid #f3da35;
  font-size: larger;
  font-weight: bold;
  color: white;
  outline: none;
}

@media (max-width: 1024px) {

  .searchbar-container {
    justify-content: center;
    gap: 0;
  }

  .button {
    visibility: collapse;
  }

  input {
    width: 16rem;

  }
}
</style>