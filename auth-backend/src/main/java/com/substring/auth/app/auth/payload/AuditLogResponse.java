package com.substring.auth.app.auth.payload; import java.time.Instant; import java.util.UUID;
public record AuditLogResponse(UUID id,String event,String details,String ipAddress,String userAgent,Instant createdAt){}
