// LOKASI: src/stores/main.ts

import { ref } from "vue";
import { defineStore } from "pinia";
import { supabase } from "@/supabase";
import type { User } from "@supabase/supabase-js";

// Definisi Tipe Produk
export interface Product {
  id: string;
  user_id: string;
  name: string;
  brand: string;
  volume_ml: number;
  stock_quantity: number;
  price: number;
  description: string;
  created_at: string;
}

export const useMainStore = defineStore("main", () => {
  const user = ref<User | null>(null);
  const products = ref<Product[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // --- AUTENTIKASI ---
  async function checkAuth() {
    isLoading.value = true;
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      user.value = session?.user ?? null;
    } catch (err: any) {
      console.error("Error checking auth:", err.message);
      error.value = "Gagal memuat sesi autentikasi.";
    } finally {
      isLoading.value = false;
    }
  }

  async function login(email: string, password: string) {
    isLoading.value = true;
    error.value = null;
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (authError) throw authError;
      user.value = data.user;
      await fetchProducts(); // Ambil data setelah login
    } catch (err: any) {
      error.value = err.message || "Gagal login.";
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function register(email: string, password: string) {
    isLoading.value = true;
    error.value = null;
    try {
      const { data, error: authError } = await supabase.auth.signUp({ email, password });
      if (authError) throw authError;
      user.value = data.user;
      // Supabase secara otomatis login setelah register
    } catch (err: any) {
      error.value = err.message || "Gagal registrasi.";
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function logout() {
    isLoading.value = true;
    try {
      const { error: authError } = await supabase.auth.signOut();
      if (authError) throw authError;
      user.value = null;
      products.value = [];
    } catch (err: any) {
      error.value = err.message || "Gagal logout.";
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  // --- CRUD DATA PRODUK ---

  async function fetchProducts() {
    if (!user.value) return; // Tidak ambil jika belum login
    isLoading.value = true;
    error.value = null;
    try {
      const { data, error: dbError } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (dbError) throw dbError;
      products.value = (data as Product[]) || [];
    } catch (err: any) {
      error.value = err.message || "Gagal memuat produk.";
      console.error(err);
    } finally {
      isLoading.value = false;
    }
  }

  async function addProduct(productData: Omit<Product, "id" | "user_id" | "created_at">) {
    if (!user.value) return;
    isLoading.value = true;
    error.value = null;
    try {
      const { data, error: dbError } = await supabase
        .from("products")
        .insert({
          ...productData,
          user_id: user.value.id,
        })
        .select()
        .single();

      if (dbError) throw dbError;
      products.value.unshift(data as Product); // Tambahkan ke depan list
    } catch (err: any) {
      error.value = err.message || "Gagal menambahkan produk.";
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function updateProduct(
    id: string,
    productData: Partial<Omit<Product, "id" | "user_id" | "created_at">>
  ) {
    isLoading.value = true;
    error.value = null;
    try {
      const { data, error: dbError } = await supabase
        .from("products")
        .update(productData)
        .eq("id", id)
        .select()
        .single();

      if (dbError) throw dbError;

      // Update produk di store lokal
      const index = products.value.findIndex((p) => p.id === id);
      if (index !== -1) {
        products.value[index] = data as Product;
      }
    } catch (err: any) {
      error.value = err.message || "Gagal memperbarui produk.";
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteProduct(id: string) {
    isLoading.value = true;
    error.value = null;
    try {
      const { error: dbError } = await supabase.from("products").delete().eq("id", id);

      if (dbError) throw dbError;
      products.value = products.value.filter((p) => p.id !== id);
    } catch (err: any) {
      error.value = err.message || "Gagal menghapus produk.";
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    user,
    products,
    isLoading,
    error,
    checkAuth,
    login,
    register,
    logout,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
  };
});
