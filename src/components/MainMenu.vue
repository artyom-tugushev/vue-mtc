<template>
  <div class="navbar">
    <div class="flex flex-column fixed calc-height">
      <div class="flex align-items-center py-2">
        <img class="dashboard-logo" src="../assets/images/logo.svg" alt="" />
        <div class="flex flex-column no-wrap pl-2 pt-1 text-primary">
          <span class="logo-text">MTC Change Behaviour</span>
          <span class="small-logo-text"> Distance coaching </span>
        </div>
      </div>
      <div class="border-05 border-300 my-2"></div>

      <div
        v-for="(menuItem, index) of menuItems"
        :class="{ 'active-menu': $route.fullPath === '/' + menuItem.link }"
        class="mb-1 cursor-pointer flex align-items-center gray-text p-2 hover:text-primary"
        @click="$router.push({ name: menuItem.link })"
      >
        <i class="pi text-lg" :class="menuItem.icon"></i>
        <span class="text-base pt-1 pl-2">{{ menuItem.title }}</span>
      </div>

      <div class="mt-auto">
        <div class="border-05 border-300 my-2"></div>
        <div
          v-if="profile"
          :class="{ 'active-menu': $route.fullPath === '/profile' }"
          class="mb-1 cursor-pointer flex align-items-center gray-text p-2 hover:text-primary"
          @click="$router.push({ name: 'profile' })"
        >
          <i class="pi pi-cog text-lg"></i>
          <span class="text-base pt-1 pl-2">{{ profile.fullName }}</span>
        </div>
        <div
          class="cursor-pointer flex align-items-center gray-text p-2 hover:text-primary"
          @click="signOut"
        >
          <i class="pi pi-user text-lg"></i>
          <span class="text-base pt-1 pl-2">Sign Out</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAccountStore } from "../stores/account";

export default {
  data() {
    return {
      menuItems: [
        { icon: "pi-folder", title: "Space Info", link: "dashboard" },
        // { icon: "pi-briefcase", title: "Clients" },
        { icon: "pi-file", title: "Projects", link: "projects" },
        { icon: "pi-pencil", title: "Teachers", link: "teachers" },
        // { icon: "pi-users", title: "Participants" },
      ],

      accountStore: useAccountStore(),
    };
  },
  computed: {
    profile() {
      return this.accountStore.account;
    },
  },
  methods: {
    signOut() {
      this.$router.push("/sign-in");
      this.user = null;
      this.accountStore.clear();
      this.email = "";
      this.password = "";
    },
  },
};
</script>
