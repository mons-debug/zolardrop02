/**
 * Audit Logger
 * Tracks all admin actions for compliance and analytics
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface AuditLogOptions {
  userId: string
  action: string // e.g., 'order.confirm', 'customer.block', 'product.update'
  entityType: string // e.g., 'order', 'customer', 'product'
  entityId: string
  oldValue?: any // Previous state
  newValue?: any // New state
  metadata?: Record<string, any> // IP, user agent, etc.
  description?: string // Human-readable description
}

/**
 * Log an admin action
 */
export async function logAdminAction(options: AuditLogOptions) {
  try {
    const {
      userId,
      action,
      entityType,
      entityId,
      oldValue,
      newValue,
      metadata,
      description
    } = options

    // Create the audit log entry
    await prisma.adminAction.create({
      data: {
        userId,
        action,
        entityType,
        entityId,
        oldValue: oldValue ? JSON.stringify(oldValue) : null,
        newValue: newValue ? JSON.stringify(newValue) : null,
        metadata: metadata ? JSON.stringify(metadata) : null,
        description
      }
    })

    // Update user's total actions count
    await prisma.user.update({
      where: { id: userId },
      data: {
        totalActions: { increment: 1 },
        lastActivity: new Date()
      }
    })

    return { success: true }
  } catch (error) {
    console.error('[Audit Logger] Failed to log action:', error)
    return { success: false, error }
  }
}

/**
 * Get audit logs for a specific entity
 */
export async function getEntityAuditLog(entityType: string, entityId: string) {
  try {
    const logs = await prisma.adminAction.findMany({
      where: {
        entityType,
        entityId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return logs
  } catch (error) {
    console.error('[Audit Logger] Failed to fetch audit log:', error)
    return []
  }
}

/**
 * Get audit logs for a specific user
 */
export async function getUserAuditLog(userId: string, limit = 50) {
  try {
    const logs = await prisma.adminAction.findMany({
      where: { userId },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    })

    return logs
  } catch (error) {
    console.error('[Audit Logger] Failed to fetch user audit log:', error)
    return []
  }
}

/**
 * Get recent admin actions (for activity feed)
 */
export async function getRecentActions(limit = 20) {
  try {
    const logs = await prisma.adminAction.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    })

    return logs
  } catch (error) {
    console.error('[Audit Logger] Failed to fetch recent actions:', error)
    return []
  }
}

/**
 * Get user analytics
 */
export async function getUserAnalytics() {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: {
          in: ['VIEWER', 'MANAGER', 'ADMIN', 'SUPER_ADMIN']
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        totalActions: true,
        lastActivity: true,
        lastLogin: true,
        createdAt: true
      },
      orderBy: {
        totalActions: 'desc'
      }
    })

    return users
  } catch (error) {
    console.error('[Audit Logger] Failed to fetch user analytics:', error)
    return []
  }
}

/**
 * Helper function to track order status changes
 */
export async function trackOrderStatusChange(
  orderId: string,
  userId: string,
  oldStatus: string,
  newStatus: string,
  metadata?: Record<string, any>
) {
  return logAdminAction({
    userId,
    action: `order.${newStatus}`,
    entityType: 'order',
    entityId: orderId,
    oldValue: { status: oldStatus },
    newValue: { status: newStatus },
    metadata,
    description: `Changed order status from ${oldStatus} to ${newStatus}`
  })
}

/**
 * Helper function to track customer actions
 */
export async function trackCustomerAction(
  customerId: string,
  userId: string,
  action: 'block' | 'unblock' | 'vip' | 'update',
  oldValue?: any,
  newValue?: any,
  metadata?: Record<string, any>
) {
  return logAdminAction({
    userId,
    action: `customer.${action}`,
    entityType: 'customer',
    entityId: customerId,
    oldValue,
    newValue,
    metadata,
    description: `Performed ${action} on customer`
  })
}

/**
 * Helper function to track product operations
 */
export async function trackProductAction(
  productId: string,
  userId: string,
  action: 'create' | 'update' | 'delete' | 'price_change' | 'stock_change',
  oldValue?: any,
  newValue?: any,
  metadata?: Record<string, any>
) {
  const descriptions: Record<string, string> = {
    create: 'Created new product',
    update: 'Updated product details',
    delete: 'Deleted product',
    price_change: 'Changed product price',
    stock_change: 'Updated stock level'
  }

  return logAdminAction({
    userId,
    action: `product.${action}`,
    entityType: 'product',
    entityId: productId,
    oldValue,
    newValue,
    metadata,
    description: descriptions[action]
  })
}

/**
 * Helper function to track content management actions
 */
export async function trackContentAction(
  entityType: 'hero' | 'carousel' | 'collection' | 'archive',
  entityId: string,
  userId: string,
  action: 'create' | 'update' | 'delete' | 'activate' | 'deactivate',
  oldValue?: any,
  newValue?: any,
  metadata?: Record<string, any>
) {
  const descriptions: Record<string, string> = {
    create: `Created new ${entityType}`,
    update: `Updated ${entityType}`,
    delete: `Deleted ${entityType}`,
    activate: `Activated ${entityType}`,
    deactivate: `Deactivated ${entityType}`
  }

  return logAdminAction({
    userId,
    action: `${entityType}.${action}`,
    entityType,
    entityId,
    oldValue,
    newValue,
    metadata,
    description: descriptions[action]
  })
}

/**
 * Helper function to track settings changes
 */
export async function trackSettingsAction(
  userId: string,
  settingType: string,
  oldValue?: any,
  newValue?: any,
  metadata?: Record<string, any>
) {
  return logAdminAction({
    userId,
    action: `settings.${settingType}`,
    entityType: 'settings',
    entityId: settingType,
    oldValue,
    newValue,
    metadata,
    description: `Updated ${settingType} settings`
  })
}

/**
 * Helper function to track newsletter actions
 */
export async function trackNewsletterAction(
  userId: string,
  action: 'export' | 'view',
  metadata?: Record<string, any>
) {
  const descriptions: Record<string, string> = {
    export: 'Exported newsletter subscribers',
    view: 'Viewed newsletter subscribers'
  }

  return logAdminAction({
    userId,
    action: `newsletter.${action}`,
    entityType: 'newsletter',
    entityId: 'subscribers',
    metadata,
    description: descriptions[action]
  })
}

/**
 * Helper function to track external actions (WhatsApp, phone, email)
 */
export async function trackExternalAction(
  userId: string,
  actionType: 'whatsapp' | 'phone' | 'email',
  entityType: 'order' | 'customer',
  entityId: string,
  metadata?: Record<string, any>
) {
  const descriptions: Record<string, string> = {
    whatsapp: `Clicked WhatsApp for ${entityType}`,
    phone: `Called ${entityType}`,
    email: `Emailed ${entityType}`
  }

  return logAdminAction({
    userId,
    action: `${entityType}.${actionType}`,
    entityType,
    entityId,
    metadata,
    description: descriptions[actionType]
  })
}

