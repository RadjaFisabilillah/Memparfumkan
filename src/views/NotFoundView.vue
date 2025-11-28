// LOKASI: src/views/NotFoundView.vue

<template>
  <div class="flex flex-col items-center justify-center min-h-screen text-center space-y-4 pt-12">
    <h1 class="text-9xl font-extrabold text-primary">404</h1>
    <h2 class="text-2xl font-semibold text-gray-800">Halaman Tidak Ditemukan</h2>
    <p class="text-gray-600">Sepertinya Anda tersesat. Halaman yang Anda cari tidak ada.</p>
    <RouterLink
      :to="{ name: 'home' }"
      class="py-2 px-4 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary/90 transition duration-300"
    >
      Kembali ke Beranda
    </RouterLink>
  </div>
</template>
