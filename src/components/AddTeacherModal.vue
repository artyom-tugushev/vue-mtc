<template>
  <p-dialog
    v-model:visible="isModalShow"
    modal
    :header="id ? 'Edit Teacher' : 'Add Teacher'"
    :style="{ width: '25rem' }"
  >
    <!-- <span class="p-text-secondary block mb-5">General</span> -->
    <div class="flex align-items-center gap-3 mb-3">
      <label for="name" class="font-semibold w-6rem">Name</label>
      <p-input-text
        v-model="name"
        id="name"
        class="flex-auto p-2"
        autocomplete="off"
        :invalid="v$.name.$error"
      />
    </div>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="email" class="font-semibold w-6rem">Email</label>
      <p-input-text
        v-model="email"
        id="email"
        class="flex-auto p-2"
        autocomplete="off"
        :invalid="v$.email.$error"
      />
    </div>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="phone" class="font-semibold w-6rem">Phone</label>
      <p-input-text
        v-model="phone"
        id="phone"
        class="flex-auto p-2"
        autocomplete="off"
        :invalid="v$.phone.$error"
      />
    </div>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="password" class="font-semibold w-6rem">Password</label>
      <p-input-text
        v-model="password"
        id="password"
        class="flex-auto p-2"
        autocomplete="off"
        :invalid="v$.password.$error"
      />
    </div>

    <div class="flex justify-content-end gap-2">
      <p-button
        type="button"
        label="Cancel"
        severity="secondary"
        @click="isModalShow = false"
      ></p-button>
      <p-button
        type="button"
        :label="id ? 'Save' : 'Add Teacher'"
        @click="addTeacher"
      ></p-button>
    </div>
  </p-dialog>
</template>

<script>
import InputText from "primevue/inputtext";
import InputMask from "primevue/inputmask";
import Button from "primevue/button";
import MainMenu from "@/components/MainMenu.vue";
import Dialog from "primevue/dialog";
import axios from "axios";

import { useVuelidate } from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";

const mustBePhone = (value) =>
  /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(value);

export default {
  components: {
    "p-dialog": Dialog,
    "p-button": Button,
    "p-input-text": InputText,
    "p-input-mask": InputMask,
    MainMenu,
  },
  data() {
    return {
      id: null,
      isModalShow: false,
      name: "",
      email: "",
      phone: "",
      password: "",
      v$: useVuelidate(),
    };
  },
  validations() {
    const rules = {
      name: { required },
      email: { required, email },
      phone: { required, mustBePhone },
      password: {},
    };
    if (!this.id) {
      rules.password.required = required;
    }
    return rules;
  },
  methods: {
    openModal(teacher) {
      if (teacher) {
        this.name = teacher.fullName;
        this.email = teacher.email;
        this.phone = teacher.phone;
        this.id = teacher.id;
      } else {
        this.name = "";
        this.email = "";
        this.phone = "";
        this.password = "";
      }

      this.isModalShow = true;
      this.v$.$reset();
    },
    async addTeacher() {
      const isFormCorrect = await this.v$.$validate();
      if (!isFormCorrect) return;

      try {
        await axios.post(
          this.id
            ? "https://mtc.voodoo.work/backend/admin/users/update"
            : "https://mtc.voodoo.work/backend/admin/users/create",
          {
            accessToken: JSON.parse(localStorage.getItem("user")).accessToken,
            id: this.id,
            user: {
              fullName: this.name,
              email: this.email,
              phone: this.phone,
              role: "teacher",
              password: this.password,
              spaceId: 1,
            },
          }
        );
        this.$emit("done");
        this.isModalShow = false;
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>
