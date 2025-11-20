'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'
import CartToast from './CartToast'

interface ToastData {
  productName: string
  variantName: string
  image: string
  price: string
}

interface CartToastContextType {
  showToast: (data: ToastData) => void
}

const CartToastContext = createContext<CartToastContextType | undefined>(undefined)

export const CartToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [showToast, setShowToast] = useState(false)
  const [toastData, setToastData] = useState<ToastData>({
    productName: '',
    variantName: '',
    image: '',
    price: ''
  })

  const handleShowToast = (data: ToastData) => {
    setToastData(data)
    setShowToast(true)
  }

  return (
    <CartToastContext.Provider value={{ showToast: handleShowToast }}>
      {children}
      <CartToast
        show={showToast}
        onClose={() => setShowToast(false)}
        productName={toastData.productName}
        variantName={toastData.variantName}
        image={toastData.image}
        price={toastData.price}
      />
    </CartToastContext.Provider>
  )
}

export const useCartToast = () => {
  const context = useContext(CartToastContext)
  if (context === undefined) {
    throw new Error('useCartToast must be used within a CartToastProvider')
  }
  return context
}







