// LOKASI: src/router/index.ts

import { createRouter, createWebHistory } from "vue-router";
import { useMainStore } from "@/stores/main";

// Halaman-halaman
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import HomeView from "@/views/HomeView.vue";
import StockListView from "@/views/StockListView.vue";
import ProductDetailView from "@/views/ProductDetailView.vue";
import NewProductView from "@/views/NewProductView.vue";
import ProfileView from "@/views/ProfileView.vue";
import AboutView from "@/views/AboutView.vue";
import NotFoundView from "@/views/NotFoundView.vue"; // Tambahan 404

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: { requiresAuth: true, title: "Dashboard" },
    },
    {
      path: "/stock",
      name: "stock-list",
      component: StockListView,
      meta: { requiresAuth: true, title: "Daftar Stok" },
    },
    {
      path: "/stock/new",
      name: "new-product",
      component: NewProductView,
      meta: { requiresAuth: true, title: "Tambah Produk Baru" },
    },
    {
      path: "/stock/:id",
      name: "product-detail",
      component: ProductDetailView,
      props: true,
      meta: { requiresAuth: true, title: "Detail Produk" },
    },
    {
      path: "/profile",
      name: "profile",
      component: ProfileView,
      meta: { requiresAuth: true, title: "Profil Pengguna" },
    },
    {
      path: "/about",
      name: "about",
      component: AboutView,
      meta: { requiresAuth: false, title: "Tentang Aplikasi" },
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
      meta: { requiresAuth: false, title: "Login" },
    },
    {
      path: "/register",
      name: "register",
      component: RegisterView,
      meta: { requiresAuth: false, title: "Daftar Akun" },
    },
    // Halaman 404
    {
      path: "/:catchAll(.*)",
      name: "not-found",
      component: NotFoundView,
      meta: { requiresAuth: false, title: "Halaman Tidak Ditemukan" },
    },
  ],
});

// Navigation Guard untuk Autentikasi
router.beforeEach(async (to, from, next) => {
  const store = useMainStore();
  await store.checkAuth(); // Pastikan status auth sudah dimuat

  const requiresAuth = to.meta.requiresAuth;

  if (requiresAuth && !store.user) {
    // Jika perlu auth tapi belum login, arahkan ke login
    next({ name: "login" });
  } else if ((to.name === "login" || to.name === "register") && store.user) {
    // Jika sudah login tapi mencoba mengakses login/register, arahkan ke home
    next({ name: "home" });
  } else {
    // Lanjutkan navigasi
    document.title = `${to.meta.title} | Parfum Stock Manager`;
    next();
  }
});

export default router;
