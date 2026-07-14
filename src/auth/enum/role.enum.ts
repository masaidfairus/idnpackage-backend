/**
 * Role untuk system user.
 * - ADMIN: akses penuh ke semua fitur
 * - OPERATOR: bisa membuat package
 * - TEACHER: bisa mengelola room, student, dan meng-update package
 */
export enum Role {
  ADMIN = 'admin',
  OPERATOR = 'operator',
  TEACHER = 'teacher',
}
