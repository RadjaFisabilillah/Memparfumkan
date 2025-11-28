// LOKASI: src/views/AboutView.vue

<script setup lang="ts">
import { RouterLink } from "vue-router";
import { BeakerIcon, GlobeAltIcon, PuzzlePieceIcon } from "@heroicons/vue/24/outline";
import { UserCircleIcon } from "@heroicons/vue/20/solid";
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-3xl font-bold text-gray-800">Tentang Aplikasi</h1>

    <div class="bg-white p-6 rounded-xl shadow-lg space-y-6">
      <div class="text-center space-y-2">
        <BeakerIcon class="w-12 h-12 text-primary mx-auto" />
        <h2 class="text-xl font-semibold">Parfum Stock Manager PWA</h2>
        <p class="text-gray-600 text-sm">
          Versi 1.0.0 | Dibuat untuk mempermudah manajemen inventaris toko parfum.
        </p>
      </div>

      <div class="space-y-4">
        <h3 class="text-lg font-bold text-gray-700 border-b pb-2">Fitur Utama</h3>
        <ul class="space-y-3">
          <li class="flex items-start space-x-3">
            <PuzzlePieceIcon class="w-5 h-5 text-secondary flex-shrink-0 mt-1" />
            <p><strong>CRUD Stok:</strong> Tambah, Lihat, Edit, dan Hapus data produk parfum.</p>
          </li>
          <li class="flex items-start space-x-3">
            <GlobeAltIcon class="w-5 h-5 text-secondary flex-shrink-0 mt-1" />
            <p>
              <strong>PWA (Progressive Web App):</strong> Dapat diinstal dan diakses secara offline.
            </p>
          </li>
          <li class="flex items-start space-x-3">
            <UserCircleIcon class="w-5 h-5 text-secondary flex-shrink-0 mt-1" />
            <p><strong>Autentikasi Aman:</strong> Login dan Register menggunakan Supabase Auth.</p>
          </li>
        </ul>
      </div>

      <div class="border-t pt-4">
        <h3 class="text-lg font-bold text-gray-700 mb-2">Teknologi yang Digunakan</h3>
        <ul class="text-sm text-gray-600 list-disc list-inside space-y-1">
          <li>Frontend: Vue.js 3 (Composition API & TypeScript)</li>
          <li>Styling: Tailwind CSS</li>
          <li>State Management: Pinia</li>
          <li>Database & Auth: Supabase</li>
          <li>Hosting: Vercel</li>
        </ul>
      </div>

      <RouterLink
        :to="{ name: 'home' }"
        class="mt-4 inline-block text-primary hover:text-primary/90 text-sm font-medium"
      >
        &larr; Kembali ke Dashboard
      </RouterLink>
    </div>
  </div>
</template>
