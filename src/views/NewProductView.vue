// LOKASI: src/views/NewProductView.vue

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useMainStore, type Product } from "@/stores/main";
import { CheckIcon } from "@heroicons/vue/24/outline";

const store = useMainStore();
const router = useRouter();

// Inisialisasi data form
const newProduct = ref<Omit<Product, "id" | "user_id" | "created_at">>({
  name: "",
  brand: "",
  volume_ml: 100,
  stock_quantity: 1,
  price: 0,
  description: "",
});
const formError = ref<string | null>(null);

async function handleSubmit() {
  formError.value = null;

  // Validasi sederhana
  if (!newProduct.value.name || newProduct.value.stock_quantity < 0 || newProduct.value.price < 0) {
    formError.value =
      "Pastikan semua kolom yang diperlukan telah diisi dengan benar (Nama, Stok, Harga).";
    return;
  }

  try {
    await store.addProduct(newProduct.value);
    // Arahkan ke daftar stok setelah berhasil
    router.push({ name: "stock-list" });
  } catch (e: any) {
    formError.value = store.error || "Gagal menambahkan produk.";
  }
}
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-3xl font-bold text-gray-800">Tambah Produk Baru</h1>
    <div class="bg-white p-6 rounded-xl shadow-lg">
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div
          v-if="formError"
          class="bg-red-50 border border-red-200 p-3 rounded-lg text-red-600 text-sm"
        >
          {{ formError }}
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700"
            >Nama Produk <span class="text-red-500">*</span></label
          >
          <input
            type="text"
            v-model="newProduct.name"
            required
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Merek (Brand)</label>
          <input
            type="text"
            v-model="newProduct.brand"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Volume (ml) <span class="text-red-500">*</span></label
            >
            <input
              type="number"
              v-model.number="newProduct.volume_ml"
              required
              min="1"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Stok Awal (unit) <span class="text-red-500">*</span></label
            >
            <input
              type="number"
              v-model.number="newProduct.stock_quantity"
              required
              min="0"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700"
            >Harga Jual (Rp) <span class="text-red-500">*</span></label
          >
          <input
            type="number"
            v-model.number="newProduct.price"
            required
            min="0"
            step="0.01"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Deskripsi</label>
          <textarea
            v-model="newProduct.description"
            rows="3"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          ></textarea>
        </div>

        <button
          type="submit"
          :disabled="store.isLoading"
          class="w-full py-2 px-4 bg-secondary text-white font-semibold rounded-lg shadow-md hover:bg-secondary/90 transition duration-300 flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          <CheckIcon class="w-5 h-5" />
          <span>Simpan Produk</span>
        </button>
      </form>
    </div>
  </div>
</template>
