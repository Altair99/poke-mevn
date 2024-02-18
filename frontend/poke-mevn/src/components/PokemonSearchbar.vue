<template>
    <div>
        <input type="text" v-model="searchQuery" placeholder="Search for Pokémon">
        <button @click="search">Search</button>
    </div>
</template>

<script lang="ts">
export default {
  name: 'SearchBar',
  data() {
    return {
        searchQuery: ''
    };
  },
  methods: {
    search() {
      this.$emit('search', this.searchQuery);
    }
  }
};
</script>