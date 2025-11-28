// LOKASI: src/App.vue

<script setup lang="ts">
import { onMounted, watch } from "vue";
import { RouterView, useRouter } from "vue-router";
import { useMainStore } from "@/stores/main";
import { supabase } from "@/supabase";
import BottomNavBar from "@/components/BottomNavBar.vue";

const store = useMainStore();
const router = useRouter();

// Listen to Supabase Auth changes
onMounted(() => {
  // Ini adalah cara untuk memastikan Vue bereaksi terhadap perubahan auth di luar router guard
  supabase.auth.onAuthStateChange((event, session) => {
    store.user = session?.user ?? null;
    if (event === "SIGNED_OUT") {
      router.push({ name: "login" });
    }
  });
});

// Ambil data produk setelah user terdeteksi login
watch(
  () => store.user,
  (newUser) => {
    if (newUser) {
      store.fetchProducts();
    }
  },
  { immediate: true }
);
</script>

<template>
  <div class="min-h-screen bg-background flex flex-col">
    <!-- Konten Utama (Main Content) -->
    <main class="flex-grow p-4 pb-20 max-w-xl w-full mx-auto">
      <RouterView />
    </main>

    <!-- Bottom Navigation Bar (Hanya ditampilkan jika sudah login) -->
    <BottomNavBar v-if="store.user" />

    <!-- Loading Indicator Global -->
    <div
      v-if="store.isLoading"
      class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-[100]"
    >
      <div
        class="w-12 h-12 border-4 border-white border-t-4 border-t-primary rounded-full animate-spin"
      ></div>
    </div>
  </div>
</template>
