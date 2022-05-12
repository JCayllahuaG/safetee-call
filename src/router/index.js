import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [

    {
      path: "/",
      redirect: "/home"
    },
    {
      path: "/home",
      name: "home",
      component: () => import("../emergency/pages/guardian-list.component.vue"),
    },
    {
      path: "/urgencies",
      name: "urgencies",
      component: () => import("../Urgency/pages/urgency-list.component.vue"),
    },
  ],
});

export default router;
