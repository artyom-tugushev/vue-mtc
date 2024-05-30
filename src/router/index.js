import { createRouter, createWebHistory } from "vue-router";
import SignIn from "../views/SignIn.vue";
import DashBoard from "../views/DashBoard.vue";
import ProjectsPage from "../views/ProjectsPage.vue";
import ProjectPage from "../views/ProjectPage.vue";
import TeachersPage from "../views/TeachersPage.vue";
import TeacherPage from "../views/TeacherPage.vue";
import ProfilePage from "../views/ProfilePage.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      redirect: { name: "dashboard" },
    },
    {
      path: "/sign-in",
      name: "sign-in",
      component: SignIn,
      meta: { layout: "Guest" },
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: DashBoard,
    },
    {
      path: "/projects",
      name: "projects",
      component: ProjectsPage,
    },
    {
      path: "/teachers",
      name: "teachers",
      component: TeachersPage,
    },
    { path: "/teachers/:id", name: "teachers-id", component: TeacherPage },
    { path: "/projects/:id", name: "projects-id", component: ProjectPage },
    { path: "/profile", name: "profile", component: ProfilePage },
  ],
});

export default router;
