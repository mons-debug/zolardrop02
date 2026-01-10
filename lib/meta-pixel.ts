// Meta Pixel Event Tracking Utilities
// Pixel ID is loaded from database via TrackingScripts component

declare global {
    interface Window {
        fbq?: (...args: any[]) => void
    }
}

/**
 * Track AddToCart event when a product is added to cart
 */
export const trackAddToCart = (product: {
    id: string
    name: string
    price: number // in cents
    quantity: number
    category?: string
    variant?: string
}) => {
    if (typeof window !== 'undefined' && window.fbq) {
        try {
            window.fbq('track', 'AddToCart', {
                content_ids: [product.id],
                content_name: product.name,
                content_type: 'product',
                value: product.price / 100, // Convert cents to MAD
                currency: 'MAD',
                contents: [{
                    id: product.id,
                    quantity: product.quantity,
                    item_price: product.price / 100
                }]
            })
        } catch (error) {
            if (process.env.NODE_ENV === 'development') {
                console.error('Meta Pixel AddToCart error:', error)
            }
        }
    }
}

/**
 * Track InitiateCheckout event when user starts checkout
 */
export const trackInitiateCheckout = (cart: {
    items: Array<{
        id: string
        name: string
        price: number // in cents
        quantity: number
    }>
    total: number // in cents
}) => {
    if (typeof window !== 'undefined' && window.fbq) {
        try {
            window.fbq('track', 'InitiateCheckout', {
                content_ids: cart.items.map(item => item.id),
                content_type: 'product',
                value: cart.total / 100, // Convert cents to MAD
                currency: 'MAD',
                num_items: cart.items.reduce((sum, item) => sum + item.quantity, 0),
                contents: cart.items.map(item => ({
                    id: item.id,
                    quantity: item.quantity,
                    item_price: item.price / 100
                }))
            })
        } catch (error) {
            if (process.env.NODE_ENV === 'development') {
                console.error('Meta Pixel InitiateCheckout error:', error)
            }
        }
    }
}

/**
 * Track Lead event when user fills checkout form (before placing order)
 */
export const trackLead = (data: {
    name: string
    phone: string
    city: string
    cartValue: number // in cents
}) => {
    if (typeof window !== 'undefined' && window.fbq) {
        try {
            window.fbq('track', 'Lead', {
                content_name: 'Checkout Form',
                value: data.cartValue / 100, // Convert cents to MAD
                currency: 'MAD'
            })
        } catch (error) {
            if (process.env.NODE_ENV === 'development') {
                console.error('Meta Pixel Lead error:', error)
            }
        }
    }
}

/**
 * Track Purchase event (already implemented in thank-you page, but here for reference)
 */
export const trackPurchase = (order: {
    orderId: string
    total: number // in cents
    items: Array<{
        id: string
        name: string
        price: number // in cents
        quantity: number
    }>
}) => {
    if (typeof window !== 'undefined' && window.fbq) {
        try {
            window.fbq('track', 'Purchase', {
                content_ids: order.items.map(item => item.id),
                content_type: 'product',
                value: order.total / 100, // Convert cents to MAD
                currency: 'MAD',
                num_items: order.items.reduce((sum, item) => sum + item.quantity, 0),
                contents: order.items.map(item => ({
                    id: item.id,
                    quantity: item.quantity,
                    item_price: item.price / 100
                }))
            })
        } catch (error) {
            if (process.env.NODE_ENV === 'development') {
                console.error('Meta Pixel Purchase error:', error)
            }
        }
    }
}

/**
 * Track ViewContent event for product detail pages
 */
export const trackViewContent = (product: {
    id: string
    name: string
    price: number // in cents
    category?: string
}) => {
    if (typeof window !== 'undefined' && window.fbq) {
        try {
            window.fbq('track', 'ViewContent', {
                content_ids: [product.id],
                content_name: product.name,
                content_type: 'product',
                value: product.price / 100, // Convert cents to MAD
                currency: 'MAD'
            })
        } catch (error) {
            if (process.env.NODE_ENV === 'development') {
                console.error('Meta Pixel ViewContent error:', error)
            }
        }
    }
}
