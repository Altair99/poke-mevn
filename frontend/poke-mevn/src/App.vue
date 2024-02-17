<script setup lang="ts">
import PokemonLogo from './components/icons/PokemonLogo.vue';
import PokemonSearchbar from './components/PokemonSearchbar.vue';
import PokemonContent from './components/PokemonContent.vue';

</script>

<template>
    <div class="container">
      <PokemonLogo />
      <PokemonSearchbar />
    </div>
  <main>
    <PokemonContent />
  </main>
  <!--
  <header>
    <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="This is vue" />
    </div>
  </header>

  <main>
    <TheWelcome />
  </main>
-->
</template>

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

@media (min-width: 1024px) {
}
</style>
