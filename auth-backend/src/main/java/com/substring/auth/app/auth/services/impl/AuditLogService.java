package com.substring.auth.app.auth.services.impl;
import com.substring.auth.app.auth.entities.*; import com.substring.auth.app.auth.payload.AuditLogResponse; import com.substring.auth.app.auth.repositories.AuditLogRepository; import lombok.RequiredArgsConstructor; import org.springframework.stereotype.Service; import java.util.*;
@Service @RequiredArgsConstructor public class AuditLogService{
 private final AuditLogRepository repo;
 public void record(User u,String e,String d,String ip,String ua){repo.save(AuditLog.builder().user(u).event(e).details(d).ipAddress(ip).userAgent(ua).build());}
 public List<AuditLogResponse> recent(UUID id){return repo.findTop20ByUserIdOrderByCreatedAtDesc(id).stream().map(x->new AuditLogResponse(x.getId(),x.getEvent(),x.getDetails(),x.getIpAddress(),x.getUserAgent(),x.getCreatedAt())).toList();}
}
