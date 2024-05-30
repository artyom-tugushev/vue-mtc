<template>
  <div class="px-4 pb-6">
    <div class="flex flex-row align-items-center">
      <h1 class="text-800">Profile</h1>
      <p-button class="ml-auto max-h-2rem" @click="saveProfile">Save</p-button>
    </div>

    <div class="p-4 pb-5 bg-white grid gap-5 border-round-sm">
      <div class="flex flex-column col gap-4 p-0">
        <div class="flex flex-column gap-3">
          <label for="password" class="font-semibold text-800 w-6rem"
            >Name</label
          >
          <p-input-text
            v-model="name"
            id="name"
            class="p-2"
            autocomplete="off"
          />
        </div>
        <div class="flex flex-column gap-3">
          <label for="password" class="font-semibold text-800 w-6rem"
            >E-mail</label
          ><p-input-text
            v-model="email"
            id="email"
            class="p-2"
            autocomplete="off"
          />
        </div>
      </div>

      <div class="flex flex-column col gap-4 p-0">
        <div class="flex flex-column gap-3">
          <label for="password" class="font-semibold text-800 w-6rem"
            >Password</label
          >
          <p-input-text
            v-model="password"
            id="password"
            class="p-2"
            autocomplete="off"
          />
        </div>
        <div class="flex flex-column gap-3">
          <label for="password" class="font-semibold text-800 w-6rem"
            >Phone</label
          ><p-input-text
            v-model="phone"
            id="phone"
            class="p-2"
            autocomplete="off"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAccountStore } from "../stores/account";
import MainMenu from "@/components/MainMenu.vue";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import axios from "axios";

export default {
  components: {
    MainMenu,
    "p-button": Button,
    "p-input-text": InputText,
  },

  data() {
    return {
      name: "",
      email: "",
      password: "",
      phone: "",
      accountStore: useAccountStore(),
    };
  },
  mounted() {
    const profile = JSON.parse(localStorage.getItem("user"));
    this.name = profile.fullName;
    this.email = profile.email;
    this.phone = profile.phone;
  },
  methods: {
    async saveProfile() {
      const user = {
        fullName: this.name,
        email: this.email,
        phone: this.phone,
      };
      if (this.password) {
        this.user.password = this.password;
      }

      const response = await axios.post(
        "https://mtc.voodoo.work/backend/account/profile/update",
        {
          accessToken: JSON.parse(localStorage.getItem("user")).accessToken,
          user,
        }
      );
      this.accountStore.setAccount(response.data.user);
      // localStorage.setItem("user", JSON.stringify(response.data.user));
    },
  },
};
</script>
