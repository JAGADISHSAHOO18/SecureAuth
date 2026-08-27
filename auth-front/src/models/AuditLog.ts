export default interface AuditLog {
  id: string;
  event: string;
  details: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: string;
}
