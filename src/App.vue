<template>
  <component :is="layoutName"></component>
</template>

<script>
import Auth from "@/layouts/Auth.vue";
import Guest from "@/layouts/Guest.vue";

export default {
  components: {
    Auth,
    Guest,
  },
  computed: {
    layoutName() {
      if (this.$route.href) {
        return this.$route.meta.layout ?? "Auth";
      }
      return null;
    },
  },

  created() {
    if (!localStorage.getItem("user")) {
      this.$router.push({ name: "sign-in" });
    }
  },
};
</script>
