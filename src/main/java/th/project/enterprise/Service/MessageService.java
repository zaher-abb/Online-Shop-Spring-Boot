package th.project.enterprise.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

@Transactional
@Service
public class MessageService {

  @Autowired
  private JavaMailSender mailSender;
 
  public void sendMail(List<String> mailList) {
    
    for (String mailAdress: mailList
    ) {
      SimpleMailMessage message = new SimpleMailMessage();
      message.setFrom("zimmermannzacharias89@gmail.com");
      message.setTo(mailAdress);
      message.setText("new Order were added");
      message.setSubject("Pizza Pronto Notif");
      mailSender.send(message);
      System.out.println("Mail Send to" + mailAdress);
  
    }
   
  
  }
}
