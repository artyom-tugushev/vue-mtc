<template>
  <div v-if="teacher && teacherProjects" class="px-4 pb-6">
    <p-button
      class="max-h-2rem"
      outlined
      label="Back to Teachers"
      icon="pi pi-arrow-left"
      @click="this.$router.push({ name: 'teachers' })"
    />
    <div class="flex flex-row align-items-center mt-3">
      <h1 class="text-800 text-primary">
        {{ teacher.fullName }}
      </h1>
      <p-button class="ml-auto max-h-2.5rem" @click="editTeacher">
        <i class="pr-2 pi pi-file-edit"></i>Edit Teacher
      </p-button>
    </div>

    <h2 class="text-800 mt-5">Contacts</h2>

    <div class="flex bg-white p-4 border-round-md border-1 border-300">
      <div class="col-6 p-0">
        <div class="text-800 pb-4">Email</div>
        <div class="text-lg font-medium">{{ teacher.email }}</div>
      </div>
      <div class="col-6 p-0">
        <div class="text-800 pb-4">Phone</div>
        <div class="text-lg font-medium">{{ teacher.phone }}</div>
      </div>
    </div>

    <div class="flex flex-row align-items-center mt-6">
      <h2 class="text-800">Projects</h2>
      <p-button class="ml-auto max-h-2.5rem" @click="addProject">
        <i class="pr-2 pi pi-plus"></i>Add Project
      </p-button>
    </div>

    <p-data-table
      :value="teacherProjects"
      class="mt-4"
      tableStyle="min-width: 50rem"
      @row-click="openProjectPage"
    >
      <p-column
        class="cursor-pointer hover:text-primary"
        field="title"
        header="Name"
      ></p-column>
      <p-column header="Dates">
        <template #body="{ data }">
          <span v-if="data.startsOn && data.endsOn">
            {{ dayjs(data.startsOn, "YYYY-MM-DD").format("DD/MM/YYYY") }} —
            {{ dayjs(data.endsOn, "YYYY-MM-DD").format("DD/MM/YYYY") }}</span
          >
          <span v-else>Flexible Schedule</span>
        </template>
      </p-column>
      <!-- <p-column
          class="cursor-pointer hover:text-primary"
          field="topic"
          header="Topic"
        ></p-column> -->
      <p-column
        field="summary.participantsCount"
        header="Participabts"
      ></p-column>

      <p-column>
        <template #body="slotProps">
          <p-button
            @click="confirmDelete(slotProps.data.id)"
            class="p-button-outlined cursor-pointer"
            icon="pi pi-trash"
          ></p-button>
        </template>
      </p-column>
    </p-data-table>
  </div>
  <div v-else class="col-9 pl-4"></div>

  <add-project-modal
    ref="add-project-modal"
    @done="getTeacherProjects(this.$route.params.id)"
  ></add-project-modal>

  <add-teacher-modal
    ref="add-teacher-modal"
    @done="getTeacher(this.$route.params.id)"
  ></add-teacher-modal>
  <p-confirm-dialog></p-confirm-dialog>
</template>

<script>
import Button from "primevue/button";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import ConfirmDialog from "primevue/confirmdialog";
import { useConfirm } from "primevue/useconfirm";
import Dialog from "primevue/dialog";

import MainMenu from "@/components/MainMenu.vue";
import AddProjectModal from "@/components/AddProjectModal.vue";
import AddTeacherModal from "@/components/AddTeacherModal.vue";
import axios from "axios";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

export default {
  components: {
    MainMenu,
    AddProjectModal,
    AddTeacherModal,
    "p-button": Button,
    "p-column": Column,
    "p-data-table": DataTable,
    "p-dialog": Dialog,
    "p-confirm-dialog": ConfirmDialog,
  },
  data() {
    return {
      teacher: null,
      teacherProjects: null,
      dayjs,
      confirm: useConfirm(),
    };
  },
  created() {
    this.getTeacher(this.$route.params.id);
    this.getTeacherProjects(this.$route.params.id);
  },
  methods: {
    getTeacher(id) {
      axios
        .post("https://mtc.voodoo.work/backend/admin/users/get", {
          accessToken: JSON.parse(localStorage.getItem("user")).accessToken,
          id: id,
        })
        .then((response) => {
          this.teacher = response.data.user;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    getTeacherProjects(id) {
      axios
        .post("https://mtc.voodoo.work/backend/admin/projects/list", {
          accessToken: JSON.parse(localStorage.getItem("user")).accessToken,
          filters: {
            teacherId: id,
          },
        })
        .then((response) => {
          this.teacherProjects = response.data.results;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    editTeacher() {
      this.$refs["add-teacher-modal"].openModal(this.teacher);
      this.getTeacher(this.$route.params.id);
    },
    addProject() {
      this.$refs["add-project-modal"].openModal();
    },
    openProjectPage(event) {
      this.$router.push({
        name: "projects-id",
        params: { id: event.data.id },
      });
    },
    async deleteProject(id) {
      try {
        await axios.post(
          "https://mtc.voodoo.work/backend/admin/projects/delete",
          {
            accessToken: JSON.parse(localStorage.getItem("user")).accessToken,
            id: id,
          }
        );
        await this.getTeacherProjects(this.$route.params.id);
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
