<template>
  <div class="container default-layout">
    <main-menu></main-menu>

    <RouterView></RouterView>
  </div>
</template>

<script>
import MainMenu from "@/components/MainMenu.vue";

export default {
  components: {
    MainMenu,
  },
};
</script>
