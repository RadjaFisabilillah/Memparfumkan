/// <reference types="vite/client" />

// Deklarasi Modul untuk Heroicons Vue v2
// Ini diperlukan agar TypeScript dapat meresolusi subpath impor
// seperti @heroicons/vue/24/outline dan @heroicons/vue/20/solid
declare module "@heroicons/vue/*" {
  // Gunakan FunctionalComponent sebagai tipe dasar untuk ikon Vue
  import type { FunctionalComponent, SVGAttributes } from "vue";

  // Ikon diekspor sebagai named exports (misalnya HomeIcon, UserIcon)
  // Deklarasi ini menghilangkan error "Cannot find module"
  const IkonKomponen: FunctionalComponent<SVGAttributes>;
  export default IkonKomponen;
  export * from "@heroicons/vue/24/outline"; // Sertakan ekspor dari outline
  export * from "@heroicons/vue/20/solid"; // Sertakan ekspor dari solid
}
