/**
 * Currency utility for ZOLAR
 * All prices are stored in cents (MAD cents)
 * Display format: XXX.XX DH (Moroccan Dirham)
 */

export const CURRENCY_SYMBOL = 'DH'
export const CURRENCY_CODE = 'MAD'
export const CURRENCY_NAME = 'Moroccan Dirham'

/**
 * Format price in cents to MAD display format
 * @param priceCents - Price in cents (e.g., 22000 = 220.00 DH)
 * @param showSymbol - Whether to show the DH symbol (default: true)
 * @returns Formatted price string (e.g., "220.00 DH")
 */
export function formatPrice(priceCents: number, showSymbol: boolean = true): string {
  const price = (priceCents / 100).toFixed(2)
  return showSymbol ? `${price} ${CURRENCY_SYMBOL}` : price
}

/**
 * Format price with currency code for admin/backend
 * @param priceCents - Price in cents
 * @returns Formatted price with code (e.g., "220.00 MAD")
 */
export function formatPriceWithCode(priceCents: number): string {
  const price = (priceCents / 100).toFixed(2)
  return `${price} ${CURRENCY_CODE}`
}

/**
 * Parse price string to cents
 * @param priceString - Price as string (e.g., "220.00" or "220")
 * @returns Price in cents
 */
export function parsePriceToCents(priceString: string | number): number {
  const price = typeof priceString === 'string' ? parseFloat(priceString) : priceString
  return Math.round(price * 100)
}

