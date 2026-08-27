package com.substring.auth.app.auth.services.impl;
import com.substring.auth.app.auth.services.EmailService; import lombok.RequiredArgsConstructor; import org.springframework.beans.factory.annotation.Value; import org.springframework.mail.SimpleMailMessage; import org.springframework.mail.javamail.JavaMailSender; import org.springframework.stereotype.Service;
@Service @RequiredArgsConstructor public class MailEmailService implements EmailService{
 private final JavaMailSender mailSender; @Value("${app.auth.mail.enabled:false}")boolean enabled;@Value("${app.auth.mail.from:no-reply@secureauth.local}")String from;@Value("${app.auth.frontend.success-redirect}")String successRedirect;
 @Value("${app.auth.email-verification-minutes:30}")long verifyMins;@Value("${app.auth.password-reset-minutes:15}")long resetMins;
 public void sendVerificationEmail(String to,String name,String token){if(!enabled)return;send(to,"Verify your SecureAuth account","Hi "+name+",\n\nVerify: "+base()+"/verify-email?token="+token+"\n\nExpires in "+verifyMins+" minutes.");}
 public void sendPasswordResetEmail(String to,String name,String token){if(!enabled)return;send(to,"Reset your SecureAuth password","Hi "+name+",\n\nReset: "+base()+"/reset-password?token="+token+"\n\nExpires in "+resetMins+" minutes.");}
 private void send(String to,String subject,String body){SimpleMailMessage m=new SimpleMailMessage();m.setFrom(from);m.setTo(to);m.setSubject(subject);m.setText(body);mailSender.send(m);}
 private String base(){int i=successRedirect.indexOf("/oauth/success");return i<0?successRedirect:successRedirect.substring(0,i);}
}
