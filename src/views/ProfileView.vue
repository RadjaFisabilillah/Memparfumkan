// LOKASI: src/views/ProfileView.vue

<script setup lang="ts">
import { useMainStore } from "@/stores/main";
import { useRouter } from "vue-router";
import { UserCircleIcon, ArrowLeftOnRectangleIcon } from "@heroicons/vue/24/outline";

const store = useMainStore();
const router = useRouter();

async function handleLogout() {
  try {
    await store.logout();
    // Redireksi ditangani oleh onAuthStateChange di App.vue, tapi tambahkan push secara eksplisit
    router.push({ name: "login" });
  } catch (e) {
    // Error sudah ditangani di store, tampilkan pesan jika perlu
    console.error("Logout failed:", e);
  }
}
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-3xl font-bold text-gray-800">Profil Pengguna</h1>

    <div class="bg-white p-6 rounded-xl shadow-lg space-y-4">
      <div class="flex items-center space-x-4 border-b pb-4">
        <UserCircleIcon class="w-16 h-16 text-primary" />
        <div>
          <p class="text-xl font-semibold text-gray-800">Pengelola Toko Parfum</p>
          <p class="text-sm text-gray-500">Status: Aktif</p>
        </div>
      </div>

      <div class="space-y-2">
        <h2 class="text-lg font-semibold text-gray-700">Informasi Akun</h2>
        <div class="p-3 bg-gray-50 rounded-lg">
          <p class="text-sm font-medium text-gray-500">Email (ID Pengguna)</p>
          <p class="text-gray-800 break-all">{{ store.user?.email || "N/A" }}</p>
        </div>
        <div class="p-3 bg-gray-50 rounded-lg">
          <p class="text-sm font-medium text-gray-500">ID Pengguna Internal</p>
          <p class="text-gray-800 break-all text-xs">{{ store.user?.id || "N/A" }}</p>
        </div>
      </div>

      <button
        @click="handleLogout"
        :disabled="store.isLoading"
        class="w-full py-2 px-4 mt-6 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition duration-300 flex items-center justify-center space-x-2 disabled:opacity-50"
      >
        <ArrowLeftOnRectangleIcon class="w-5 h-5" />
        <span>{{ store.isLoading ? "Keluar..." : "Logout" }}</span>
      </button>

      <div
        v-if="store.error"
        class="text-red-500 text-sm mt-4 p-2 bg-red-50 rounded-lg border border-red-200"
      >
        {{ store.error }}
      </div>
    </div>
  </div>
</template>
