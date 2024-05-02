package com.shopping.query.command.exceptions;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.http.HttpStatus;

@Setter
@Getter
@NoArgsConstructor
public class NotificationException extends Exception{
     private static final long serialVersionUID = 1L;

     private HttpStatus statusCode;

     private String thrownByMethod;

     private String[] thrownByMethodArgs;

     public NotificationException(String message) {
          super(message);
          statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
     }

     public NotificationException(HttpStatus statusCode, String thrownByMethod, String[] thrownByMethodArgs) {
          super();
          this.statusCode = statusCode;
          this.thrownByMethod = thrownByMethod;
          this.thrownByMethodArgs = thrownByMethodArgs;
     }
}
