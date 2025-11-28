// LOKASI: src/views/StockListView.vue

<script setup lang="ts">
import { computed } from "vue";
import { RouterLink } from "vue-router";
import { useMainStore } from "@/stores/main";
import { PlusIcon, ArchiveBoxIcon, ChevronRightIcon } from "@heroicons/vue/24/outline";

const store = useMainStore();

const products = computed(() => store.products);
const isEmpty = computed(() => products.value.length === 0 && !store.isLoading);
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-3xl font-bold text-gray-800">Daftar Stok Parfum</h1>
      <RouterLink
        :to="{ name: 'new-product' }"
        class="flex items-center space-x-1 py-2 px-3 bg-secondary text-white font-medium rounded-full shadow-md hover:bg-secondary/90 transition duration-150 text-sm"
      >
        <PlusIcon class="w-5 h-5" />
      </RouterLink>
    </div>

    <!-- List Item -->
    <div v-if="!isEmpty" class="bg-white rounded-xl shadow-lg divide-y divide-gray-100">
      <RouterLink
        v-for="product in products"
        :key="product.id"
        :to="{ name: 'product-detail', params: { id: product.id } }"
        class="flex items-center justify-between p-4 hover:bg-gray-50 transition duration-150"
      >
        <div class="flex-1 min-w-0">
          <p class="text-lg font-semibold text-gray-800 truncate">
            {{ product.name }}
          </p>
          <p class="text-sm text-gray-500 truncate">
            {{ product.brand }} | {{ product.volume_ml }} ml
          </p>
        </div>
        <div class="flex items-center space-x-2 flex-shrink-0 ml-4">
          <span
            :class="[
              'px-3 py-1 text-xs font-bold rounded-full',
              product.stock_quantity < 5
                ? 'bg-red-100 text-red-800'
                : 'bg-green-100 text-green-800',
            ]"
          >
            Stok: {{ product.stock_quantity }}
          </span>
          <ChevronRightIcon class="w-5 h-5 text-gray-400" />
        </div>
      </RouterLink>
    </div>

    <!-- State Kosong -->
    <div v-else-if="isEmpty" class="text-center p-12 bg-white rounded-xl shadow-md mt-8 space-y-4">
      <ArchiveBoxIcon class="w-12 h-12 mx-auto text-gray-400" />
      <p class="text-gray-600 text-lg font-medium">Data stok parfum Anda kosong.</p>
      <p class="text-gray-500 text-sm">
        Tambahkan produk baru untuk mulai mengelola inventaris Anda.
      </p>
      <RouterLink
        :to="{ name: 'new-product' }"
        class="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-secondary hover:bg-secondary/90 transition duration-150"
      >
        + Tambah Produk Pertama
      </RouterLink>
    </div>
  </div>
</template>
