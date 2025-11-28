// LOKASI: src/views/HomeView.vue

<script setup lang="ts">
import { computed } from "vue";
import { useMainStore } from "@/stores/main";
import { currencyFormat } from "@/utils/helpers";
import {
  ArchiveBoxIcon,
  CurrencyDollarIcon,
  TagIcon,
  InformationCircleIcon,
} from "@heroicons/vue/24/outline";
import { RouterLink } from "vue-router";

const store = useMainStore();

// Hitung Statistik Dashboard
const totalProducts = computed(() => store.products.length);
const totalStock = computed(() => store.products.reduce((sum, p) => sum + p.stock_quantity, 0));
const totalInventoryValue = computed(() =>
  store.products.reduce((sum, p) => sum + p.stock_quantity * p.price, 0)
);
const lowStockCount = computed(() => store.products.filter((p) => p.stock_quantity < 5).length);

// Produk dengan Stok Terendah
const lowStockItems = computed(() => {
  return store.products
    .filter((p) => p.stock_quantity < 5)
    .sort((a, b) => a.stock_quantity - b.stock_quantity)
    .slice(0, 5);
});
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-3xl font-bold text-gray-800">Halo, Pengelola Toko!</h1>
    <p class="text-gray-600">Ringkasan cepat stok parfum Anda.</p>

    <!-- Kartu Statistik -->
    <div class="grid grid-cols-2 gap-4">
      <div class="bg-white p-4 rounded-xl shadow-md border border-gray-100">
        <TagIcon class="w-6 h-6 text-primary mb-2" />
        <p class="text-xl font-bold">{{ totalProducts }}</p>
        <p class="text-sm text-gray-500">Total Varian Parfum</p>
      </div>
      <div class="bg-white p-4 rounded-xl shadow-md border border-gray-100">
        <ArchiveBoxIcon class="w-6 h-6 text-secondary mb-2" />
        <p class="text-xl font-bold">{{ totalStock }}</p>
        <p class="text-sm text-gray-500">Total Unit Stok</p>
      </div>
      <div class="bg-white p-4 rounded-xl shadow-md border border-gray-100 col-span-2">
        <CurrencyDollarIcon class="w-6 h-6 text-indigo-500 mb-2" />
        <p class="text-xl font-bold">{{ currencyFormat(totalInventoryValue) }}</p>
        <p class="text-sm text-gray-500">Nilai Total Inventaris</p>
      </div>
    </div>

    <!-- Peringatan Stok Rendah -->
    <div
      v-if="lowStockCount > 0"
      class="bg-yellow-50 border border-yellow-200 p-4 rounded-xl shadow-sm"
    >
      <div class="flex items-center space-x-2">
        <InformationCircleIcon class="w-5 h-5 text-yellow-600 flex-shrink-0" />
        <p class="font-semibold text-yellow-800">PERINGATAN!</p>
      </div>
      <p class="text-sm text-yellow-700 mt-2">
        Ada **{{ lowStockCount }}** produk yang memiliki stok di bawah 5 unit. Segera lakukan
        pemesanan ulang!
        <RouterLink :to="{ name: 'stock-list' }" class="text-yellow-600 underline ml-1"
          >Lihat Stok</RouterLink
        >
      </p>

      <!-- List Stok Rendah -->
      <ul class="mt-3 space-y-1 text-sm text-gray-700">
        <li v-for="item in lowStockItems" :key="item.id" class="flex justify-between">
          <span class="truncate">{{ item.name }} ({{ item.brand }})</span>
          <span class="font-bold text-red-500">{{ item.stock_quantity }} unit</span>
        </li>
      </ul>
    </div>

    <div
      v-if="store.products.length === 0 && !store.isLoading"
      class="text-center p-8 bg-white rounded-xl shadow-md mt-8"
    >
      <p class="text-gray-500">Belum ada data stok. Mulai tambahkan produk pertama Anda!</p>
      <RouterLink
        :to="{ name: 'new-product' }"
        class="mt-4 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-secondary hover:bg-secondary/90 transition duration-150"
      >
        + Tambah Produk
      </RouterLink>
    </div>
  </div>
</template>
