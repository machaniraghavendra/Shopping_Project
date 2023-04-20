package com.shopping.query.command.exceptions;

import org.slf4j.MDC;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {
	
	@ExceptionHandler(value=ItemNotFoundInCartException.class)
	public ResponseEntity<String> itemNotFoundInCartException(ItemNotFoundInCartException e){
		return new ResponseEntity<String>("Item not exists in cart",HttpStatus.OK);
	}
	
	@ExceptionHandler(value=ItemAlreadyInCartException.class)
	public ResponseEntity<String> itemAlreadyExistsInCartException(ItemAlreadyInCartException e){
		return new ResponseEntity<String>("Item already exists in cart",HttpStatus.OK);
	}
	@ExceptionHandler(value=ItemNotFoundInFavException.class)
	public ResponseEntity<String> itemNotFoundInFavException(ItemNotFoundInFavException e){
		return new ResponseEntity<String>("Item not exists in favourites",HttpStatus.ACCEPTED);
	}
	
	@ExceptionHandler(value=ItemAlreadyInFavException.class)
	public ResponseEntity<String> itemAlreadyInFavException(ItemAlreadyInFavException e){
		return new ResponseEntity<String>("Item already exists in favourites",HttpStatus.ACCEPTED);
	}
	
	@ExceptionHandler(value = ItemNotFoundException.class)
	public ResponseEntity<TraceableError> itemNotFoundException(ItemNotFoundException e) {
		if (e.getStatusCode() == null) {
			e.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR);
		}
		TraceableError traceError = TraceableError.builder().errorMessage(e.getMessage())
				.errorCode(String.valueOf(e.getStatusCode().value())).exceptionType(e.getClass().getSimpleName())
				.errorDescription(e.getStatusCode().getReasonPhrase()).correlationId(MDC.get("correltionId")).build();
		return new ResponseEntity<>(traceError, e.getStatusCode());
	}

	@ExceptionHandler(value = ItemAlreadyException.class)
	public ResponseEntity<TraceableError> itemAlreadyExistsException(ItemAlreadyException e) {
		if (e.getStatusCode() == null) {
			e.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR);
		}
		TraceableError traceError = TraceableError.builder().errorMessage(e.getMessage())
				.errorCode(String.valueOf(e.getStatusCode().value())).exceptionType(e.getClass().getSimpleName())
				.errorDescription(e.getStatusCode().getReasonPhrase()).correlationId(MDC.get("correltionId")).build();
		return new ResponseEntity<>(traceError, e.getStatusCode());
	}

	@ExceptionHandler(value = OrderWithSameItemExistsException.class)
	public ResponseEntity<TraceableError> orderWithSameItemExistsException(OrderWithSameItemExistsException e) {
		if (e.getStatusCode() == null) {
			e.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR);
		}
		TraceableError traceError = TraceableError.builder().errorMessage(e.getMessage())
				.errorCode(String.valueOf(e.getStatusCode().value())).exceptionType(e.getClass().getSimpleName())
				.errorDescription(e.getStatusCode().getReasonPhrase()).correlationId(MDC.get("correltionId")).build();
		return new ResponseEntity<>(traceError, e.getStatusCode());
	}

	@ExceptionHandler(value = OrderNotFoundException.class)
	public ResponseEntity<TraceableError> orderNotFoundException(OrderNotFoundException e) {
		if (e.getStatusCode() == null) {
			e.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR);
		}
		TraceableError traceError = TraceableError.builder().errorMessage(e.getMessage())
				.errorCode(String.valueOf(e.getStatusCode().value())).exceptionType(e.getClass().getSimpleName())
				.errorDescription(e.getStatusCode().getReasonPhrase()).correlationId(MDC.get("correltionId")).build();
		return new ResponseEntity<>(traceError, e.getStatusCode());
	}

	@ExceptionHandler(value=UserNotFoundException.class)
	public ResponseEntity<String> usernotfoundexception(UserNotFoundException e){
		return new ResponseEntity<String>("User not exists ",HttpStatus.OK);
	}
	
	@ExceptionHandler(value=UserAlreadyExistsException.class)
	public ResponseEntity<String> useralreadyexception(UserAlreadyExistsException e){
		return new ResponseEntity<String>("User already exists ",HttpStatus.OK);
	}
}
