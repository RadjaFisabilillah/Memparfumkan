// LOKASI: src/views/LoginView.vue

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useMainStore } from "@/stores/main";

const store = useMainStore();
const router = useRouter();

const email = ref("");
const password = ref("");
const loginError = ref<string | null>(null);

async function handleLogin() {
  loginError.value = null;
  try {
    await store.login(email.value, password.value);
    router.push({ name: "home" });
  } catch (e: any) {
    loginError.value = store.error; // Ambil error dari store
  }
}
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen pt-12">
    <div class="w-full max-w-sm p-6 bg-white rounded-xl shadow-lg">
      <h1 class="text-3xl font-bold text-center text-primary mb-6">Masuk</h1>
      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            id="email"
            type="email"
            v-model="email"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
            placeholder="contoh@email.com"
          />
        </div>
        <div class="mb-6">
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1"
            >Kata Sandi</label
          >
          <input
            id="password"
            type="password"
            v-model="password"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
            placeholder="••••••••"
          />
        </div>

        <p
          v-if="loginError"
          class="text-red-500 text-sm mb-4 p-2 bg-red-50 rounded-lg border border-red-200"
        >
          {{ loginError }}
        </p>

        <button
          type="submit"
          :disabled="store.isLoading"
          class="w-full py-2 px-4 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary/90 transition duration-300 disabled:opacity-50"
        >
          {{ store.isLoading ? "Memproses..." : "Login" }}
        </button>
      </form>
      <div class="mt-6 text-center">
        <RouterLink :to="{ name: 'register' }" class="text-sm text-primary hover:text-primary/80">
          Belum punya akun? Daftar di sini
        </RouterLink>
      </div>
    </div>
  </div>
</template>
