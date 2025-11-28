// LOKASI: src/utils/helpers.ts

/**
 * Format angka menjadi mata uang Rupiah (IDR).
 * @param amount Angka yang akan diformat.
 * @returns String format mata uang.
 */
export function currencyFormat(amount: number | string): string {
  const value = typeof amount === "string" ? parseFloat(amount) : amount;

  if (isNaN(value)) {
    return "Rp 0";
  }

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}
