'use client'

import React from 'react'
import { useCart } from './CartContext'

interface CartIconProps {
  isScrolled?: boolean
  shouldBeBlack?: boolean
}

export default function CartIcon({ isScrolled = false, shouldBeBlack }: CartIconProps) {
  const { toggleCart, getItemCount } = useCart()
  const itemCount = getItemCount()

  // Use shouldBeBlack if provided, otherwise fall back to isScrolled
  const useBlackColor = shouldBeBlack !== undefined ? shouldBeBlack : isScrolled

  return (
    <button
      onClick={toggleCart}
      className={`relative p-2 hover:bg-orange-500/10 rounded-full transition-colors hover:text-orange-500 ${useBlackColor ? 'text-black' : 'text-white'
        }`}
      aria-label="Open shopping cart"
      style={{ filter: useBlackColor ? 'none' : 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))' }}
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L5 3H3m4 10v6a1 1 0 001 1h10a1 1 0 001-1v-6M9 19a1 1 0 102 0 1 1 0 00-2 0zm8 0a1 1 0 102 0 1 1 0 00-2 0z" />
      </svg>

      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold shadow-lg">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </button>
  )
}
