// LOKASI: src/views/ProductDetailView.vue

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useMainStore, type Product } from "@/stores/main";
import { currencyFormat } from "@/utils/helpers";
import { PencilIcon, TrashIcon, XMarkIcon, CheckIcon } from "@heroicons/vue/24/outline";

const props = defineProps<{
  id: string;
}>();

const store = useMainStore();
const router = useRouter();

const isEditing = ref(false);
const modalVisible = ref(false); // Untuk modal konfirmasi hapus

// State lokal untuk form edit
const productToEdit = ref<Partial<Product>>({});
const detailError = ref<string | null>(null);

// Cari produk yang sesuai dengan ID
const product = computed(() => store.products.find((p) => p.id === props.id));

// Sinkronkan data produk ke state lokal saat produk berubah (misalnya saat pertama dimuat)
watch(
  product,
  (newProduct) => {
    if (newProduct) {
      productToEdit.value = { ...newProduct };
    } else if (!store.isLoading) {
      // Jika tidak ditemukan dan loading sudah selesai, arahkan ke 404
      router.replace({ name: "not-found" });
    }
  },
  { immediate: true }
);

async function handleUpdate() {
  detailError.value = null;
  if (!product.value || !productToEdit.value.name) {
    detailError.value = "Nama produk tidak boleh kosong.";
    return;
  }

  try {
    const dataToUpdate = {
      name: productToEdit.value.name,
      brand: productToEdit.value.brand || "",
      volume_ml: productToEdit.value.volume_ml || 0,
      stock_quantity: productToEdit.value.stock_quantity || 0,
      price: productToEdit.value.price || 0,
      description: productToEdit.value.description || "",
    };

    await store.updateProduct(product.value.id, dataToUpdate);
    isEditing.value = false; // Keluar dari mode edit
  } catch (e: any) {
    detailError.value = store.error || "Gagal memperbarui produk.";
  }
}

async function handleDelete() {
  if (!product.value) return;
  try {
    await store.deleteProduct(product.value.id);
    router.push({ name: "stock-list" }); // Kembali ke daftar stok
  } catch (e: any) {
    detailError.value = store.error || "Gagal menghapus produk.";
  } finally {
    modalVisible.value = false;
  }
}
</script>

<template>
  <div v-if="product" class="space-y-6">
    <div class="flex justify-between items-start">
      <h1 class="text-3xl font-bold text-gray-800">{{ product.name }}</h1>
      <div class="flex space-x-2">
        <button
          @click="isEditing = !isEditing"
          :class="[
            'p-2 rounded-full transition-colors',
            isEditing ? 'bg-red-100 text-red-600' : 'bg-primary text-white hover:bg-primary/90',
          ]"
          aria-label="Edit Produk"
        >
          <XMarkIcon v-if="isEditing" class="w-5 h-5" />
          <PencilIcon v-else class="w-5 h-5" />
        </button>
        <button
          @click="modalVisible = true"
          class="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
          aria-label="Hapus Produk"
        >
          <TrashIcon class="w-5 h-5" />
        </button>
      </div>
    </div>

    <div
      v-if="detailError"
      class="bg-red-50 border border-red-200 p-3 rounded-xl text-red-600 text-sm"
    >
      {{ detailError }}
    </div>

    <!-- Mode Tampil -->
    <div v-if="!isEditing" class="bg-white p-6 rounded-xl shadow-lg space-y-4">
      <div class="detail-item">
        <p class="text-sm font-medium text-gray-500">Merek (Brand)</p>
        <p class="text-lg font-semibold">{{ product.brand || "-" }}</p>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div class="detail-item">
          <p class="text-sm font-medium text-gray-500">Volume</p>
          <p class="text-lg font-semibold">{{ product.volume_ml }} ml</p>
        </div>
        <div class="detail-item">
          <p class="text-sm font-medium text-gray-500">Stok</p>
          <span
            :class="[
              'text-lg font-bold',
              product.stock_quantity < 5 ? 'text-red-500' : 'text-green-600',
            ]"
          >
            {{ product.stock_quantity }} unit
          </span>
        </div>
      </div>
      <div class="detail-item">
        <p class="text-sm font-medium text-gray-500">Harga Jual</p>
        <p class="text-2xl font-bold text-primary">{{ currencyFormat(product.price) }}</p>
      </div>
      <div class="detail-item">
        <p class="text-sm font-medium text-gray-500">Deskripsi</p>
        <p class="text-gray-700 whitespace-pre-wrap">
          {{ product.description || "Tidak ada deskripsi." }}
        </p>
      </div>
      <div class="detail-item border-t pt-4">
        <p class="text-xs text-gray-400">
          Dibuat: {{ new Date(product.created_at).toLocaleString() }}
        </p>
      </div>
    </div>

    <!-- Mode Edit (CRUD - Update) -->
    <div v-else class="bg-white p-6 rounded-xl shadow-lg space-y-4">
      <h2 class="text-xl font-semibold border-b pb-2 mb-4">Edit Produk</h2>
      <form @submit.prevent="handleUpdate" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Nama Produk</label>
          <input
            type="text"
            v-model="productToEdit.name"
            required
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Merek</label>
          <input
            type="text"
            v-model="productToEdit.brand"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Volume (ml)</label>
            <input
              type="number"
              v-model.number="productToEdit.volume_ml"
              required
              min="1"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Stok (unit)</label>
            <input
              type="number"
              v-model.number="productToEdit.stock_quantity"
              required
              min="0"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Harga Jual (Rp)</label>
          <input
            type="number"
            v-model.number="productToEdit.price"
            required
            min="0"
            step="0.01"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Deskripsi</label>
          <textarea
            v-model="productToEdit.description"
            rows="3"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          ></textarea>
        </div>
        <button
          type="submit"
          :disabled="store.isLoading"
          class="w-full py-2 px-4 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary/90 transition duration-300 flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          <CheckIcon class="w-5 h-5" />
          <span>Simpan Perubahan</span>
        </button>
      </form>
    </div>

    <!-- Modal Konfirmasi Hapus (CRUD - Delete) -->
    <div
      v-if="modalVisible"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-white p-6 rounded-xl shadow-2xl max-w-sm w-full">
        <h3 class="text-xl font-bold text-red-600 mb-4">Konfirmasi Hapus</h3>
        <p class="text-gray-700 mb-6">
          Anda yakin ingin menghapus produk **{{ product.name }}**? Tindakan ini tidak dapat
          dibatalkan.
        </p>
        <div class="flex justify-end space-x-3">
          <button
            @click="modalVisible = false"
            class="py-2 px-4 rounded-lg border border-gray-300 hover:bg-gray-50 transition"
          >
            Batal
          </button>
          <button
            @click="handleDelete"
            :disabled="store.isLoading"
            class="py-2 px-4 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition disabled:opacity-50"
          >
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="text-center p-12 text-gray-500">
    <p>Memuat atau mencari produk...</p>
  </div>
</template>
