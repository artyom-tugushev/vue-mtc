<template>
  <div class="px-4 pb-6">
    <h1 class="text-800">Projects</h1>
    <div>
      <p-input-text
        v-model="search"
        placeholder="Search..."
        class="teachers-search-input p-2 mr-2"
      ></p-input-text>
      <!-- <p-button class="p-button-outlined mr-2"
          ><i class="pr-2 pi pi-print"></i>Print</p-button
        > -->
      <!-- <p-button class="p-button-outlined mr-2"
          ><i class="pr-2 pi pi-upload"></i>Export</p-button
        > -->
      <p-button class="p-button" @click="openModal"
        ><i class="pr-2 pi pi-plus"></i>Add Project</p-button
      >
    </div>

    <p-data-table
      :rows="rowsPerPage"
      :value="projects"
      class="mt-4"
      tableStyle="min-width: 50rem"
      @row-click="openProjectPage"
    >
      <p-column
        class="cursor-pointer hover:text-primary"
        field="title"
        header="Name"
      ></p-column>
      <p-column field="client.name" header="Client"></p-column>
      <p-column field="leader.fullName" header="Leader"></p-column>
      <p-column header="Dates">
        <template #body="{ data }">
          <span v-if="data.startsOn && data.endsOn">
            {{ dayjs(data.startsOn, "YYYY-MM-DD").format("DD/MM/YYYY") }} —
            {{ dayjs(data.endsOn, "YYYY-MM-DD").format("DD/MM/YYYY") }}</span
          >
          <span v-else>Flexible Schedule</span>
        </template>
      </p-column>

      <p-column field="summary.teachersCount" header="Teachers"></p-column>
      <p-column
        field="summary.participantsCount"
        header="Participabts"
      ></p-column>
    </p-data-table>
    <p-paginator
      :totalRecords="count"
      :rows="rowsPerPage"
      @page="updatePage"
    ></p-paginator>
  </div>

  <add-project-modal
    ref="add-project-modal"
    @done="getProjects()"
  ></add-project-modal>
</template>

<script>
import InputText from "primevue/inputtext";
import InputMask from "primevue/inputmask";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Dropdown from "primevue/dropdown";
import Paginator from "primevue/paginator";

import MainMenu from "@/components/MainMenu.vue";
import AddProjectModal from "@/components/AddProjectModal.vue";

import { getProjects } from "../api";
import _ from "lodash";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

export default {
  components: {
    MainMenu,
    AddProjectModal,
    "p-button": Button,
    "p-input-text": InputText,
    "p-input-mask": InputMask,
    "p-data-table": DataTable,
    "p-column": Column,
    "p-dialog": Dialog,
    "p-dropdown": Dropdown,
    "p-paginator": Paginator,
  },
  data() {
    return {
      projects: [],
      search: "",
      dayjs,
      page: 1,
      rowsPerPage: 5,
      count: 0,
    };
  },
  watch: {
    search(newValue) {
      this.page = 1;
      this.getProjectsDebounced(newValue);
    },
    page() {
      this.getProjects(this.search);
    },
  },
  created() {
    if (!localStorage.getItem("user")) {
      return this.$router.push({ name: "sign-in" });
    }
    this.getProjects();
  },
  methods: {
    async getProjects(search) {
      try {
        const response = await getProjects({
          offset: (this.page - 1) * this.rowsPerPage,
          limit: this.rowsPerPage,
          filters: {
            query: search,
          },
        });
        this.projects = response.results;
        this.count = response.count;
      } catch (error) {
        console.error(error);
      }
    },
    getProjectsDebounced: _.debounce(function (search) {
      this.getProjects(search);
    }, 1000),

    openModal() {
      this.$refs["add-project-modal"].openModal();
    },

    updatePage(paginator) {
      this.page = paginator.page + 1;
    },

    openProjectPage(event) {
      this.$router.push({
        name: "projects-id",
        params: { id: event.data.id },
      });
    },
  },
};
</script>
