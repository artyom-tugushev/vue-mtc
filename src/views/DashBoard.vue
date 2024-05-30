<template>
  <div v-if="info" class="px-4 pb-6">
    <h1 class="text-800 mb-3">{{ info.name }}</h1>
    <div class="text-sm text-800 mb-2">
      from
      <span class="font-medium">{{
        dayjs(info.license.effectiveDate, "YYYY-MM-DD").format("DD/MM/YYYY")
      }}</span>
      to
      <span class="font-medium">{{
        dayjs(info.license.validUntil, "YYYY-MM-DD").format("DD/MM/YYYY")
      }}</span>
    </div>
    <div
      v-if="info.license.isActive"
      class="text-sm font-medium text-primary mb-5"
    >
      SPACE IS ACTIVE
    </div>

    <div class="grid">
      <div class="col-8">
        <div class="grid p-3 border-1 border-300 border-round-md bg-white">
          <div class="col flex flex-column align-items-center">
            <span class="text-4xl text-800 font-bold">
              {{ info.summary.projects.count }}
            </span>
            <span class="text-sm text-primary font-medium">
              {{ info.summary.projects.label }}
            </span>
          </div>
          <div class="border-05 border-300 my-2"></div>
          <div class="col flex flex-column align-items-center">
            <span class="text-4xl text-800 font-bold">
              {{ info.summary.clients.count }}
            </span>
            <span class="text-sm text-primary font-medium">
              {{ info.summary.clients.label }}
            </span>
          </div>
          <div class="border-05 border-300 my-2"></div>
          <div class="col flex flex-column align-items-center">
            <span class="text-4xl text-800 font-bold">
              {{ info.summary.teachers.count }}
            </span>
            <span class="text-sm text-primary font-medium">
              {{ info.summary.teachers.label }}
            </span>
          </div>
          <div class="border-05 border-300 my-2"></div>
          <div class="col flex flex-column align-items-center">
            <span class="text-4xl text-800 font-bold">
              {{ info.summary.participants.count }}
            </span>
            <span class="text-sm text-primary font-medium">
              {{ info.summary.participants.label }}
            </span>
          </div>
        </div>
      </div>
      <div class="col-4 pl-5">
        <div class="grid p-3 border-1 border-300 border-round-md bg-white">
          <div class="col flex flex-column align-items-center">
            <span class="text-4xl text-800 font-bold">
              {{ info.summary.participants.count }}/{{
                info.summary.participants.limit
              }}
            </span>
            <span class="text-sm text-primary font-medium">
              used licenses
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="px-4 pb-6"></div>
</template>

<script>
import MainMenu from "@/components/MainMenu.vue";
import axios from "axios";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

export default {
  components: {
    MainMenu,
  },
  data() {
    return {
      dayjs,
      info: null,
    };
  },
  created() {
    this.getInfo();
  },
  methods: {
    async getInfo() {
      try {
        let response = await axios.post(
          "https://mtc.voodoo.work/backend/admin/dashboard/index",
          {
            accessToken: JSON.parse(localStorage.getItem("user")).accessToken,
          }
        );
        this.info = response.data.space;
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>
