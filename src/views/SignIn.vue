<template>
  <div
    v-if="!user"
    class="w-full min-h-screen flex flex-column align-items-center justify-content-center"
  >
    <img class="signin-logo" src="../assets/images/logo.svg" alt="" />
    <p-card class="px-5 py-3 mb-6">
      <template #title>MTC Change Behaviour</template>
      <template #content>
        <div class="flex flex-column">
          <label class="p-2">E-mail</label>
          <p-input-text
            placeholder="example@yourmail.com"
            class="p-2"
            type="email"
            v-model="email"
          ></p-input-text>

          <label class="p-2">Password</label>
          <p-password
            inputClass="w-full p-2"
            v-model="password"
            :feedback="false"
          />

          <p-button class="mt-3" @click="signIn">Login</p-button>
        </div>
      </template>
    </p-card>
  </div>
</template>

<script>
import { useAccountStore } from "../stores/account";
import Button from "primevue/button";
import Card from "primevue/card";
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import InputMask from "primevue/inputmask";
import axios from "axios";

export default {
  components: {
    "p-button": Button,
    "p-card": Card,
    "p-input-text": InputText,
    "p-password": Password,
    "p-input-mask": InputMask,
  },
  data() {
    return {
      email: "",
      password: "",
      user: null,
      accountStore: useAccountStore(),
    };
  },
  created() {
    if (JSON.parse(localStorage.getItem("user"))) {
      this.$router.push({ name: "projects" });
    }
  },
  methods: {
    signIn() {
      axios
        .post("https://mtc.voodoo.work/backend/account/auth/sign-in", {
          email: this.email,
          password: this.password,
        })
        .then((response) => {
          this.email = "";
          this.password = "";
          this.user = response.data.user;
          // localStorage.setItem("user", JSON.stringify(response.data.user));

          this.accountStore.setAccount(response.data.user);

          this.$router.push({ name: "dashboard" });
        })
        .catch((error) => {
          console.error(error);
          // alert(error.response.data.exception.message);
        });
    },
    signOut() {
      this.user = null;

      localStorage.removeItem("user");
    },
  },
};
</script>
