// Google Analytics 4 and Hotjar tracking utilities

declare global {
  interface Window {
    gtag?: (...args: any[]) => void
    hj?: (...args: any[]) => void
    _hjSettings?: { hjid: number; hjsv: number }
  }
}

// Google Analytics 4
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ''

// Hotjar
export const HOTJAR_ID = process.env.NEXT_PUBLIC_HOTJAR_ID || ''
export const HOTJAR_VERSION = 6

// Page view tracking
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    })
  }
}

// Event tracking
export const event = ({ action, category, label, value }: {
  action: string
  category: string
  label?: string
  value?: number
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// E-commerce events
export const trackAddToCart = (product: {
  id: string
  name: string
  price: number
  quantity: number
}) => {
  event({
    action: 'add_to_cart',
    category: 'ecommerce',
    label: product.name,
    value: product.price * product.quantity,
  })

  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'add_to_cart', {
      currency: 'USD',
      value: product.price,
      items: [{
        item_id: product.id,
        item_name: product.name,
        price: product.price,
        quantity: product.quantity,
      }]
    })
  }
}

export const trackPurchase = (order: {
  id: string
  total: number
  items: Array<{
    id: string
    name: string
    price: number
    quantity: number
  }>
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'purchase', {
      transaction_id: order.id,
      value: order.total,
      currency: 'USD',
      items: order.items.map(item => ({
        item_id: item.id,
        item_name: item.name,
        price: item.price,
        quantity: item.quantity,
      }))
    })
  }
}

export const trackProductView = (product: {
  id: string
  name: string
  price: number
  category?: string
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'view_item', {
      currency: 'USD',
      value: product.price,
      items: [{
        item_id: product.id,
        item_name: product.name,
        item_category: product.category,
        price: product.price,
      }]
    })
  }
}

export const trackBeginCheckout = (cart: {
  total: number
  items: Array<{
    id: string
    name: string
    price: number
    quantity: number
  }>
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'begin_checkout', {
      currency: 'USD',
      value: cart.total,
      items: cart.items.map(item => ({
        item_id: item.id,
        item_name: item.name,
        price: item.price,
        quantity: item.quantity,
      }))
    })
  }
}

// Hotjar trigger
export const triggerHotjarEvent = (eventName: string) => {
  if (typeof window !== 'undefined' && window.hj) {
    window.hj('event', eventName)
  }
}

// Check if analytics are enabled
export const isAnalyticsEnabled = () => {
  return GA_MEASUREMENT_ID && GA_MEASUREMENT_ID.startsWith('G-')
}

export const isHotjarEnabled = () => {
  return HOTJAR_ID && parseInt(HOTJAR_ID) > 0
}











