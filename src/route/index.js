import { createRouter, createWebHistory } from "vue-router";
import App from "@/App.vue";
import CategoryMapView from "@/views/CategoryMapView.vue";

const routes = [
  {
    path: "/",
    component: App,
  },
  {
    path: "/category/:category",
    name: "category-map",
    component: CategoryMapView,
  },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});