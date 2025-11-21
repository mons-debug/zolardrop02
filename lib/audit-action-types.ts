/**
 * Audit Action Type Constants
 * 
 * Defines all possible action types and categories for the admin audit system.
 * Used across the application for consistent action logging and filtering.
 */

// Action Categories
export enum ActionCategory {
  DATA_CHANGE = 'DATA_CHANGE',
  EXTERNAL_ACTION = 'EXTERNAL_ACTION',
  CONTENT_MANAGEMENT = 'CONTENT_MANAGEMENT',
  SYSTEM = 'SYSTEM'
}

// Entity Types
export enum EntityType {
  ORDER = 'order',
  CUSTOMER = 'customer',
  PRODUCT = 'product',
  HERO = 'hero',
  CAROUSEL = 'carousel',
  COLLECTION = 'collection',
  ARCHIVE = 'archive',
  SETTINGS = 'settings',
  NEWSLETTER = 'newsletter'
}

// Order Actions
export enum OrderAction {
  CONFIRMED = 'order.confirmed',
  SHIPPED = 'order.shipped',
  DELIVERED = 'order.delivered',
  CANCELLED = 'order.cancelled',
  REFUNDED = 'order.refunded',
  NOTES_UPDATED = 'order.notes_updated'
}

// Customer Actions
export enum CustomerAction {
  CREATED = 'customer.create',
  UPDATED = 'customer.update',
  BLOCKED = 'customer.block',
  UNBLOCKED = 'customer.unblock',
  VIP_MARKED = 'customer.vip',
  WHATSAPP = 'customer.whatsapp',
  PHONE = 'customer.phone',
  EMAIL = 'customer.email'
}

// Product Actions
export enum ProductAction {
  CREATED = 'product.create',
  UPDATED = 'product.update',
  DELETED = 'product.delete',
  PRICE_CHANGED = 'product.price_change',
  STOCK_CHANGED = 'product.stock_change'
}

// Content Actions
export enum ContentAction {
  HERO_CREATED = 'hero.create',
  HERO_UPDATED = 'hero.update',
  HERO_DELETED = 'hero.delete',
  HERO_ACTIVATED = 'hero.activate',
  HERO_DEACTIVATED = 'hero.deactivate',
  
  CAROUSEL_CREATED = 'carousel.create',
  CAROUSEL_UPDATED = 'carousel.update',
  CAROUSEL_DELETED = 'carousel.delete',
  
  COLLECTION_CREATED = 'collection.create',
  COLLECTION_UPDATED = 'collection.update',
  COLLECTION_DELETED = 'collection.delete',
  COLLECTION_ACTIVATED = 'collection.activate',
  COLLECTION_DEACTIVATED = 'collection.deactivate',
  
  ARCHIVE_CREATED = 'archive.create',
  ARCHIVE_UPDATED = 'archive.update',
  ARCHIVE_DELETED = 'archive.delete'
}

// Settings Actions
export enum SettingsAction {
  TRACKING_UPDATED = 'settings.tracking'
}

// Newsletter Actions
export enum NewsletterAction {
  EXPORTED = 'newsletter.export',
  VIEWED = 'newsletter.view'
}

// External Communication Actions
export enum ExternalAction {
  WHATSAPP = 'whatsapp',
  PHONE = 'phone',
  EMAIL = 'email'
}

// Helper function to get category for an action
export function getActionCategory(action: string): ActionCategory {
  if (action.includes('whatsapp') || action.includes('phone') || action.includes('email')) {
    return ActionCategory.EXTERNAL_ACTION
  }
  
  if (action.includes('hero') || action.includes('carousel') || 
      action.includes('collection') || action.includes('archive')) {
    return ActionCategory.CONTENT_MANAGEMENT
  }
  
  return ActionCategory.DATA_CHANGE
}

// Helper function to format action name for display
export function formatActionName(action: string): string {
  const parts = action.split('.')
  if (parts.length === 1) {
    return action.charAt(0).toUpperCase() + action.slice(1)
  }
  
  const entity = parts[0]
  const actionType = parts.slice(1).join(' ')
  
  return `${entity.charAt(0).toUpperCase() + entity.slice(1)} ${actionType}`
}

// Helper function to validate action type
export function isValidAction(action: string): boolean {
  const allActions = [
    ...Object.values(OrderAction),
    ...Object.values(CustomerAction),
    ...Object.values(ProductAction),
    ...Object.values(ContentAction),
    ...Object.values(SettingsAction),
    ...Object.values(NewsletterAction)
  ]
  
  return allActions.includes(action as any)
}

