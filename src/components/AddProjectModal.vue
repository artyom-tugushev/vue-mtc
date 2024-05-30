<template>
  <p-dialog
    v-model:visible="isModalShow"
    modal
    :header="id ? 'Edit Project' : 'Add Project'"
    :style="{ width: '50rem' }"
  >
    <div class="flex">
      <div class="col-6 pr-4">
        <span class="p-text-secondary block mb-5">General</span>
        <div class="flex flex-column gap-2 mb-3">
          <label for="title" class="font-semibold w-6rem">Title</label>
          <p-input-text
            v-model="title"
            id="title"
            class="flex-auto p-2"
            autocomplete="off"
            placeholder="Enter Title"
            :invalid="v$.title.$error"
          />
        </div>

        <div class="flex flex-column gap-2 mb-3">
          <label for="client" class="font-semibold w-6rem">Client</label>
          <p-dropdown
            v-model="client"
            :options="clientsDropdown"
            optionLabel="name"
            optionValue="id"
            placeholder="Select a Client"
            class="flex-auto"
            inputClass="flex-auto p-2 w-full"
            :invalid="v$.client.$error"
          />
        </div>

        <div class="flex flex-column gap-2 mb-3">
          <label for="teacher" class="font-semibold w-6rem">Teacher</label>
          <p-dropdown
            v-model="teacher"
            :options="teachersDropdown"
            optionLabel="fullName"
            optionValue="id"
            placeholder="Select a Teacher"
            class="flex-auto"
            inputClass="flex-auto p-2 w-full"
            :invalid="v$.teacher.$error"
          />
        </div>

        <div class="flex flex-column gap-2 mb-3">
          <label for="goal" class="font-semibold w-6rem">Goal</label>
          <p-input-text
            v-model="goal"
            id="goal"
            class="flex-auto p-2"
            autocomplete="off"
            placeholder="Enter Goal"
            :invalid="v$.goal.$error"
          />
        </div>
        <div class="flex flex-column gap-2 mb-3">
          <label for="introduction" class="font-semibold w-6rem"
            >Introduction</label
          >
          <p-textarea
            autoResize
            v-model="introduction"
            rows="3"
            cols="30"
            id="introduction"
            class="flex-auto p-2"
            autocomplete="off"
            placeholder="Enter Introduction"
            :invalid="v$.introduction.$error"
          />
        </div>
        <div class="flex flex-column gap-2 mb-3">
          <label for="teaser" class="font-semibold w-6rem">Teaser</label>
          <p-textarea
            autoResize
            v-model="teaser"
            rows="1"
            cols="30"
            id="teaser"
            class="flex-auto p-2"
            autocomplete="off"
            placeholder="Enter Teaser"
            :invalid="v$.teaser.$error"
          />
        </div>
      </div>
      <div class="col-6">
        <span class="p-text-secondary block mb-5">Settings</span>
        <div class="flex gap-4">
          <div class="flex flex-column gap-2 mb-3">
            <label for="dateStartsOn" class="font-semibold w-6rem"
              >Starts On</label
            >
            <p-calendar
              v-model="startsOn"
              date-format="yy/mm/dd"
              input-class="p-2"
              placeholder="Select a Date"
              :invalid="v$.startsOn.$error"
            />
          </div>
          <div class="flex flex-column gap-2">
            <label for="dateEndsOn" class="font-semibold w-6rem">Ends On</label>
            <p-calendar
              v-model="endsOn"
              date-format="yy/mm/dd"
              input-class="p-2"
              placeholder="Select a Date"
              :invalid="v$.endsOn.$error"
            />
          </div>
        </div>
        <div class="flex flex-column gap-2 mb-3">
          <label class="font-semibold" for=""
            >Days Before Deadline to Notify
          </label>
          <p-inputnumber
            v-model="notifyBeforeXDays"
            :min="0"
            :max="31"
            show-buttons
            input-class="p-2"
            :invalid="v$.notifyBeforeXDays.$error"
          ></p-inputnumber>
        </div>
        <div class="flex flex-column gap-2 mb-3">
          <label class="font-semibold" for=""
            >Delete Participant Videos After The Last Challenge Was Completed
          </label>
          <div class="flex align-items-center gap-2">
            <p-checkbox v-model="isInputEnabled" binary></p-checkbox>
            <p-inputnumber
              :disabled="!isInputEnabled"
              v-model="deleteAfterDays"
              :min="0"
              :max="31"
              show-buttons
              input-class="p-2"
            ></p-inputnumber>
          </div>
        </div>
        <div class="flex flex-column gap-3">
          <div class="flex gap-3">
            <p-checkbox
              v-model="isFlexible"
              :invalid="v$.isFlexible.$error"
              binary
            ></p-checkbox>
            <label class="font-semibold" for="">Flexible </label>
          </div>
          <div class="flex gap-3">
            <p-checkbox
              v-model="isActive"
              :invalid="v$.isActive.$error"
              binary
            ></p-checkbox>
            <label class="font-semibold" for="">Active</label>
          </div>
          <div class="flex gap-3">
            <p-checkbox v-model="isInsulated" binary disabled></p-checkbox>
            <label class="font-semibold" for="">Insulated</label>
          </div>
        </div>
      </div>
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
        :label="id ? 'Save' : 'Add Project'"
        @click="addProject"
      ></p-button>
    </div>
  </p-dialog>
</template>

<script>
import Dialog from "primevue/dialog";
import Dropdown from "primevue/dropdown";
import Textarea from "primevue/textarea";
import Calendar from "primevue/calendar";
import InputNumber from "primevue/inputnumber";
import InputText from "primevue/inputtext";
import Checkbox from "primevue/checkbox";
import Button from "primevue/button";
import Column from "primevue/column";

import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import axios from "axios";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

export default {
  components: {
    "p-input-text": InputText,
    "p-button": Button,
    "p-column": Column,
    "p-dialog": Dialog,
    "p-dropdown": Dropdown,
    "p-textarea": Textarea,
    "p-calendar": Calendar,
    "p-inputnumber": InputNumber,
    "p-checkbox": Checkbox,
  },
  data() {
    return {
      isModalShow: false,
      dayjs,
      isInputEnabled: false,
      clientsDropdown: [],
      teachersDropdown: [],
      v$: useVuelidate(),

      id: null,
      title: "",
      client: "",
      teacher: "",
      goal: "",
      introduction: "",
      teaser: "",
      startsOn: "",
      endsOn: "",
      notifyBeforeXDays: 3,
      deleteAfterDays: null,
      isFlexible: false,
      isActive: true,
      isInsulated: false,
    };
  },
  validations() {
    const rules = {
      title: { required },
      client: { required },
      teacher: { required },
      goal: { required },
      introduction: { required },
      teaser: { required },
      startsOn: {},
      endsOn: {},
      notifyBeforeXDays: { required },

      isFlexible: { required },
      isActive: { required },
    };
    if (!this.isFlexible) {
      rules.startsOn.required = required;
      rules.endsOn.required = required;
    }
    return rules;
  },

  methods: {
    openModal(project) {
      if (project) {
        this.title = project.title;
        this.client = project.client.id;
        this.teacher = project.leader.id;
        this.goal = project.goal;
        this.introduction = project.introduction;
        this.isFlexible = project.isFlexible;
        this.teaser = project.teaser;
        this.startsOn = project.startsOn;
        this.endsOn = project.endsOn;
        this.id = project.id;
      } else {
        this.title = "";
        this.client = "";
        this.teacher = "";
        this.goal = "";
        this.introduction = "";
        this.teaser = "";
        this.startsOn = null;
        this.endsOn = null;
      }
      this.isModalShow = true;
      this.v$.$reset();

      axios
        .post("https://mtc.voodoo.work/backend/admin/clients/list", {
          accessToken: JSON.parse(localStorage.getItem("user")).accessToken,
          offset: 0,
          limit: -1,
        })
        .then((response) => {
          this.clientsDropdown = response.data.results;
        });
      axios
        .post("https://mtc.voodoo.work/backend/admin/users/list", {
          accessToken: JSON.parse(localStorage.getItem("user")).accessToken,
          filters: {
            role: "teacher",
          },
        })
        .then((response) => {
          this.teachersDropdown = response.data.results;
        });
    },
    async addProject() {
      const isFormCorrect = await this.v$.$validate();
      if (!isFormCorrect) return;

      const projectData = {
        clientId: this.client,
        deleteAfterDays: this.deleteAfterDays,
        goal: this.goal,
        introduction: this.introduction,
        isActive: this.isActive,
        isFlexible: this.isFlexible,
        isInsulated: this.isInsulated,
        leaderId: this.teacher,
        notifyBeforeXDays: this.notifyBeforeXDays,
        teaser: this.teaser,
        title: this.title,
      };

      if (!this.isFlexible) {
        projectData.startsOn = this.dayjs(this.startsOn).format("YYYY-MM-DD");
        projectData.endsOn = this.dayjs(this.endsOn).format("YYYY-MM-DD");
      }

      try {
        await axios.post(
          this.id
            ? "https://mtc.voodoo.work/backend/admin/projects/update"
            : "https://mtc.voodoo.work/backend/admin/projects/create",
          {
            accessToken: JSON.parse(localStorage.getItem("user")).accessToken,
            id: this.id,
            project: projectData,
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
