export type Role = 'customer' | 'VIEWER' | 'MANAGER' | 'ADMIN' | 'SUPER_ADMIN'

export type Permission = 
  | 'view_dashboard'
  | 'view_products'
  | 'create_product'
  | 'edit_product'
  | 'delete_product'
  | 'view_orders'
  | 'edit_order'
  | 'delete_order'
  | 'view_analytics'
  | 'view_users'
  | 'create_user'
  | 'edit_user'
  | 'delete_user'
  | 'manage_settings'

const rolePermissions: Record<Role, Permission[]> = {
  customer: [],
  
  VIEWER: [
    'view_dashboard',
    'view_products',
    'view_orders',
    'view_analytics'
  ],
  
  MANAGER: [
    'view_dashboard',
    'view_products',
    'edit_product',
    'view_orders',
    'edit_order',
    'view_analytics'
  ],
  
  ADMIN: [
    'view_dashboard',
    'view_products',
    'create_product',
    'edit_product',
    'delete_product',
    'view_orders',
    'edit_order',
    'delete_order',
    'view_analytics',
    'view_users',
    'manage_settings'
  ],
  
  SUPER_ADMIN: [
    'view_dashboard',
    'view_products',
    'create_product',
    'edit_product',
    'delete_product',
    'view_orders',
    'edit_order',
    'delete_order',
    'view_analytics',
    'view_users',
    'create_user',
    'edit_user',
    'delete_user',
    'manage_settings'
  ]
}

export function hasPermission(role: string, permission: Permission): boolean {
  const permissions = rolePermissions[role as Role]
  return permissions ? permissions.includes(permission) : false
}

export function hasAnyPermission(role: string, permissions: Permission[]): boolean {
  return permissions.some(permission => hasPermission(role, permission))
}

export function hasAllPermissions(role: string, permissions: Permission[]): boolean {
  return permissions.every(permission => hasPermission(role, permission))
}

export function isAdmin(role: string): boolean {
  return ['ADMIN', 'SUPER_ADMIN'].includes(role)
}

export function isSuperAdmin(role: string): boolean {
  return role === 'SUPER_ADMIN'
}

export function canManageUsers(role: string): boolean {
  return hasPermission(role, 'create_user') || hasPermission(role, 'edit_user')
}

export function canManageProducts(role: string): boolean {
  return hasPermission(role, 'create_product') || hasPermission(role, 'edit_product')
}

export function canManageOrders(role: string): boolean {
  return hasPermission(role, 'edit_order')
}

export function getRoleLabel(role: string): string {
  const labels: Record<string, string> = {
    customer: 'Customer',
    VIEWER: 'Viewer',
    MANAGER: 'Manager',
    ADMIN: 'Admin',
    SUPER_ADMIN: 'Super Admin'
  }
  return labels[role] || role
}

export function getRoleBadgeColor(role: string): string {
  const colors: Record<string, string> = {
    customer: 'bg-gray-100 text-gray-800',
    VIEWER: 'bg-blue-100 text-blue-800',
    MANAGER: 'bg-purple-100 text-purple-800',
    ADMIN: 'bg-orange-100 text-orange-800',
    SUPER_ADMIN: 'bg-red-100 text-red-800'
  }
  return colors[role] || 'bg-gray-100 text-gray-800'
}

export const adminRoles: Role[] = ['VIEWER', 'MANAGER', 'ADMIN', 'SUPER_ADMIN']

export function isAdminRole(role: string): boolean {
  return adminRoles.includes(role as Role)
}











