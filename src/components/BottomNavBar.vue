// LOKASI: src/components/BottomNavBar.vue

<script setup lang="ts">
import { useRoute, RouterLink } from "vue-router";
import {
  HomeIcon,
  ListBulletIcon,
  UserIcon,
  InformationCircleIcon,
} from "@heroicons/vue/24/outline";

const route = useRoute();

const navItems = [
  { name: "Home", path: "/", icon: HomeIcon },
  { name: "Stok", path: "/stock", icon: ListBulletIcon },
  { name: "Profil", path: "/profile", icon: UserIcon },
  { name: "Tentang", path: "/about", icon: InformationCircleIcon },
];

// Fungsi untuk menentukan apakah rute aktif
const isActive = (path: string) => {
  return route.path === path || (path === "/stock" && route.path.startsWith("/stock/"));
};
</script>

<template>
  <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-xl z-50">
    <div class="max-w-xl mx-auto flex justify-around h-16">
      <RouterLink
        v-for="item in navItems"
        :key="item.name"
        :to="item.path"
        :class="[
          'flex flex-col items-center justify-center p-2 text-sm font-medium transition-colors duration-200',
          isActive(item.path) ? 'text-primary' : 'text-gray-500 hover:text-primary',
        ]"
      >
        <component :is="item.icon" class="w-6 h-6" />
        <span class="text-xs mt-0.5">{{ item.name }}</span>
      </RouterLink>
    </div>
  </nav>
</template>
