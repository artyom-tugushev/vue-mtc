<template>
  <div class="px-4 pb-6">
    <h1 class="text-800">Teachers</h1>
    <div>
      <p-input-text
        v-model="search"
        placeholder="Search..."
        class="teachers-search-input p-2 mr-2"
      ></p-input-text>
      <!-- <p-button class="p-button-outlined mr-2"
          ><i class="pr-2 pi pi-print"></i>Print</p-button
        >
        <p-button class="p-button-outlined mr-2"
          ><i class="pr-2 pi pi-upload"></i>Export</p-button
        > -->
      <p-button class="p-button" @click="openModal"
        ><i class="pr-2 pi pi-plus"></i>Add Teacher</p-button
      >
    </div>

    <p-data-table
      class="mt-4"
      :value="teachers"
      tableStyle="min-width: 50rem"
      @row-click="openTeacherPage"
    >
      <p-column
        class="cursor-pointer hover:text-primary"
        field="fullName"
        header="Name"
      ></p-column>
      <p-column field="email" header="Email"></p-column>
      <p-column field="phone" header="Phone"></p-column>
      <p-column field="summary.projectsCount" header="Projects"></p-column>
      <p-column>
        <template #body="slotProps">
          <p-button
            @click="confirmDelete(slotProps.data.id, slotProps.data.fullName)"
            class="p-button-outlined cursor-pointer"
            icon="pi pi-trash"
          ></p-button>
        </template>
      </p-column>
    </p-data-table>
    <p-paginator
      :totalRecords="count"
      :rows="rowsPerPage"
      @page="updatePage"
    ></p-paginator>
  </div>

  <add-teacher-modal
    ref="add-teacher-modal"
    @done="getTeachers()"
  ></add-teacher-modal>

  <p-confirm-dialog></p-confirm-dialog>
</template>

<script>
import InputText from "primevue/inputtext";
import InputMask from "primevue/inputmask";
import Button from "primevue/button";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import ConfirmDialog from "primevue/confirmdialog";
import { useConfirm } from "primevue/useconfirm";
import Paginator from "primevue/paginator";
import Dialog from "primevue/dialog";

import MainMenu from "@/components/MainMenu.vue";
import AddTeacherModal from "@/components/AddTeacherModal.vue";

import axios from "axios";
import _ from "lodash";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

export default {
  components: {
    "p-button": Button,
    "p-input-text": InputText,
    "p-input-mask": InputMask,
    MainMenu,
    AddTeacherModal,
    "p-data-table": DataTable,
    "p-column": Column,
    "p-dialog": Dialog,
    "p-confirm-dialog": ConfirmDialog,
    "p-paginator": Paginator,
  },
  data() {
    return {
      teachers: null,
      search: "",
      dayjs,
      confirm: useConfirm(),
      page: 1,
      rowsPerPage: 5,
      count: 0,
    };
  },
  watch: {
    search(newValue) {
      this.page = 1;
      this.getTeachersDebounced(newValue);
    },
    page() {
      this.getTeachers(this.search);
    },
  },
  created() {
    if (!localStorage.getItem("user")) {
      return this.$router.push({ name: "sign-in" });
    }
    this.getTeachers();
  },
  methods: {
    getTeachers(search) {
      axios
        .post("https://mtc.voodoo.work/backend/admin/users/list", {
          accessToken: JSON.parse(localStorage.getItem("user")).accessToken,
          offset: (this.page - 1) * this.rowsPerPage,
          limit: this.rowsPerPage,
          filters: {
            role: "teacher",
            query: search,
          },
        })
        .then((response) => {
          this.teachers = response.data.results;
          this.count = response.data.count;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    getTeachersDebounced: _.debounce(function (search) {
      this.getTeachers(search);
    }, 1000),

    openModal() {
      this.$refs["add-teacher-modal"].openModal();
    },

    updatePage(paginator) {
      this.page = paginator.page + 1;
    },

    async deleteTeacher(id) {
      try {
        await axios.post("https://mtc.voodoo.work/backend/admin/users/delete", {
          accessToken: JSON.parse(localStorage.getItem("user")).accessToken,
          id: id,
        });
        await this.getTeachers();
      } catch (error) {
        console.error(error);
      }
    },

    confirmDelete(id, name) {
      this.confirm.require({
        message: `Do you want to delete teacher ${name}?`,
        header: "Are you sure?",
        icon: "pi pi-info-circle",
        rejectLabel: "Cancel",
        acceptLabel: "Delete",
        rejectClass: "p-button-outlined",
        acceptClass: "p-button",
        accept: () => {
          this.deleteTeacher(id);
        },
      });
    },
    openTeacherPage(event) {
      this.$router.push({
        name: "teachers-id",
        params: { id: event.data.id },
      });
    },
  },
};
</script>
