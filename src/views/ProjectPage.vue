<template>
  <div v-if="project" class="px-4 pb-6">
    <p-button
      class="max-h-2rem"
      outlined
      label="Back to Projects"
      icon="pi pi-arrow-left"
      @click="this.$router.push({ name: 'projects' })"
    />
    <div class="flex flex-row align-items-center mt-3">
      <h1 class="text-800 text-primary">
        {{ project.title }}
      </h1>
      <div class="flex ml-auto gap-2">
        <p-button
          label="Danger"
          severity="danger"
          class="max-h-2.5rem"
          @click="confirmDelete"
        >
          <i class="pr-2 pi pi-trash"></i>Delete Project</p-button
        >

        <p-button class="max-h-2.5rem" @click="editProject">
          <i class="pr-2 pi pi-file-edit"></i>Edit Project
        </p-button>
      </div>
    </div>
    <div class="grid p-4 bg-white border-round-md border-1 border-300">
      <div class="col">
        <div class="flex flex-column gap-3">
          <h3 class="text-800">General</h3>
          <div class="flex flex-column gap-2">
            <label class="font-light text-600">Client</label>
            <div class="font-medium text-800">{{ project.client.name }}</div>
          </div>
          <div class="flex flex-column gap-2">
            <label class="font-light text-600">Leader Teacher</label>
            <div class="font-medium text-800">
              {{ project.leader.fullName }}
            </div>
          </div>
          <div class="flex flex-column gap-2">
            <label class="font-light text-600">Goal</label>
            <div class="font-medium text-800">
              {{ project.goal }}
            </div>
          </div>
          <div class="flex flex-column gap-2">
            <label class="font-light text-600">Introduction</label>
            <div class="font-medium text-800">
              {{ project.introduction }}
            </div>
          </div>
          <div class="flex flex-column gap-2">
            <label class="font-light text-600">Teaser</label>
            <div class="font-medium text-800">
              {{ project.teaser }}
            </div>
          </div>
          <div class="flex flex-column gap-2">
            <label class="font-light text-600">Teachers</label>
            <div class="font-medium text-800">
              {{ project.summary.teachersCount }}
            </div>
          </div>
          <div class="flex flex-column gap-2">
            <label class="font-light text-600">Participants</label>
            <div class="font-medium text-800">
              {{ project.summary.participantsCount }}
            </div>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="flex flex-column gap-3">
          <h3 class="text-800">Settings</h3>
          <div class="flex flex-column gap-2">
            <label class="font-light text-600">Dates</label>
            <span
              class="font-medium text-800"
              v-if="project.startsOn && project.endsOn"
            >
              {{ dayjs(project.startsOn, "YYYY-MM-DD").format("DD/MM/YYYY") }}
              —
              {{
                dayjs(project.endsOn, "YYYY-MM-DD").format("DD/MM/YYYY")
              }}</span
            >
            <span
              class="font-medium text-800"
              v-else-if="project.isFlexible === true"
              >Flexible Schedule</span
            >
            <span class="font-medium text-800" v-else>—</span>
          </div>
          <div class="flex flex-column gap-2">
            <label class="font-light text-600"
              >Days before deadline to notify</label
            >
            <div class="font-medium text-800">
              {{ project.notifyBeforeXDays }}
            </div>
          </div>
          <div class="flex flex-column gap-2">
            <label class="font-light text-600"
              >Delete Participant Videos After The Last Challenge Was
              Completed</label
            >
            <div v-if="project.deleteAfterDays" class="font-medium text-800">
              {{ project.deleteAfterDays }}
            </div>
            <div v-else>—</div>
          </div>
          <div class="flex flex-row gap-2">
            <p-checkbox
              v-model="project.isFlexible"
              binary
              disabled
            ></p-checkbox>
            <label class="font-light text-600">Flexible</label>
          </div>
          <div class="flex flex-row gap-2">
            <p-checkbox
              v-model="project.isInsulated"
              binary
              disabled
            ></p-checkbox>
            <label class="font-light text-600">Insulated</label>
          </div>
        </div>
      </div>
    </div>
    <div v-if="teacher">
      <div class="flex flex-row align-items-center gap-2 mt-6">
        <div
          @click="selectTab('showTeachers')"
          :class="{ 'text-primary': selectedTab === 'showTeachers' }"
          class="text-3xl font-semibold text-800 cursor-pointer"
        >
          Teachers
        </div>
        <div class="text-3xl font-semibold text-800">|</div>
        <div
          @click="selectTab('showParticipants')"
          :class="{ 'text-primary': selectedTab === 'showParticipants' }"
          class="text-3xl font-semibold text-800 cursor-pointer"
        >
          Participants
        </div>
      </div>
      <p-data-table
        v-if="selectedTab === 'showTeachers'"
        :value="teacher"
        class="mt-4"
        tableStyle="min-width: 50rem"
      >
        <p-column field="user.fullName" header="Name"></p-column>
        <!-- <p-column field="topic" header="Topic"></p-column> -->
        <p-column field="user.email" header="Email"></p-column>
        <p-column field="isTopicStarter" header="Topic Starter">
          <template #body="slotProps">
            {{ slotProps.data.isTopicSatrter ? "Yes" : "No" }}
          </template>
        </p-column>
      </p-data-table>

      <p-data-table
        v-if="selectedTab === 'showParticipants'"
        :value="participant"
        class="mt-4"
        tableStyle="min-width: 50rem"
      >
        <p-column field="user.fullName" header="Name"></p-column>
        <p-column field="user.email" header="Email"></p-column>
      </p-data-table>
    </div>
  </div>

  <div v-else class="col-9 pl-4"></div>

  <add-project-modal
    ref="add-project-modal"
    @done="getProject(this.$route.params.id)"
  ></add-project-modal>

  <p-confirm-dialog></p-confirm-dialog>
</template>

<script>
import MainMenu from "@/components/MainMenu.vue";
import AddProjectModal from "@/components/AddProjectModal.vue";

import axios from "axios";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import Button from "primevue/button";
import Checkbox from "primevue/checkbox";
import Column from "primevue/column";
import DataTable from "primevue/datatable";
import ConfirmDialog from "primevue/confirmdialog";
import Dialog from "primevue/dialog";
import { useConfirm } from "primevue/useconfirm";

dayjs.extend(customParseFormat);

export default {
  components: {
    MainMenu,
    AddProjectModal,
    "p-button": Button,
    "p-checkbox": Checkbox,
    "p-column": Column,
    "p-data-table": DataTable,
    "p-dialog": Dialog,
    "p-confirm-dialog": ConfirmDialog,
  },
  data() {
    return {
      dayjs,
      project: null,
      teacher: null,
      participant: null,
      selectedTab: "showTeachers",
      confirm: useConfirm(),
    };
  },
  created() {
    this.getProject(this.$route.params.id);
    this.getTeachers();
    this.getParticipants();
  },
  methods: {
    async getProject(id) {
      try {
        let response = await axios.post(
          "https://mtc.voodoo.work/backend/admin/projects/get",
          {
            accessToken: JSON.parse(localStorage.getItem("user")).accessToken,
            id: id,
          }
        );
        this.project = response.data.project;
      } catch (error) {
        console.error(error);
      }
    },
    async getTeachers() {
      try {
        let response = await axios.post(
          "https://mtc.voodoo.work/backend/admin/members/list",
          {
            accessToken: JSON.parse(localStorage.getItem("user")).accessToken,
            filters: { role: "teacher" },
            projectId: this.$route.params.id,
          }
        );
        this.teacher = response.data.results;
      } catch (error) {
        console.error(error);
      }
    },
    async getParticipants() {
      try {
        let response = await axios.post(
          "https://mtc.voodoo.work/backend/admin/members/list",
          {
            accessToken: JSON.parse(localStorage.getItem("user")).accessToken,
            filters: { role: "participant" },
            projectId: this.$route.params.id,
          }
        );
        this.participant = response.data.results;
      } catch (error) {
        console.error(error);
      }
    },
    selectTab(tab) {
      this.selectedTab = tab;
    },
    editProject() {
      this.$refs["add-project-modal"].openModal(this.project);
      this.getProject(this.$route.params.id);
    },

    async deleteProject() {
      try {
        await axios.post(
          "https://mtc.voodoo.work/backend/admin/projects/delete",
          {
            accessToken: JSON.parse(localStorage.getItem("user")).accessToken,
            id: this.$route.params.id,
          }
        );
        await this.$router.push({ name: "projects" });
      } catch (error) {
        console.error(error);
      }
    },

    confirmDelete(id) {
      this.confirm.require({
        message: `Do you want to delete this project?`,
        header: "Are you sure?",
        icon: "pi pi-info-circle",
        rejectLabel: "Cancel",
        acceptLabel: "Delete",
        rejectClass: "p-button-outlined",
        acceptClass: "p-button",
        accept: () => {
          this.deleteProject(id);
        },
      });
    },
  },
};
</script>
