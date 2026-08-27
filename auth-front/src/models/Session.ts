export default interface Session {
  id: string;
  createdAt: string;
  expiresAt: string;
  revoked: boolean;
  current: boolean;
  ipAddress?: string | null;
  userAgent?: string | null;
  lastUsedAt?: string | null;
}
