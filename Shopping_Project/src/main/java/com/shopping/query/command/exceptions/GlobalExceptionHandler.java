package com.shopping.query.command.exceptions;

import org.slf4j.MDC;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@ControllerAdvice
public class GlobalExceptionHandler {

	private static final long serialVersionUID = 1L;

	private HttpStatus statusCode;

	private String thrownByMethod;

	private String[] thrownByMethodArgs;
	
	public ResponseEntity<String> globalException(Exception e){
		return  ResponseEntity.ok(e.getMessage());
	}
	
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

	@ExceptionHandler(value= UserException.class)
	public ResponseEntity<String> usernotfoundexception(UserException e){
		return new ResponseEntity<>("User not exists ",HttpStatus.OK);
	}

	@ExceptionHandler(value = AddressAlreadyExistsException.class)
	public ResponseEntity<TraceableError> addressAlreadyExistsException(AddressAlreadyExistsException e){
		if (e.getStatusCode() == null) {
			e.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR);
		}
		TraceableError traceError = TraceableError.builder().errorMessage(e.getMessage())
				.errorCode(String.valueOf(e.getStatusCode().value())).exceptionType(e.getClass().getSimpleName())
				.errorDescription(e.getStatusCode().getReasonPhrase()).correlationId(MDC.get("correltionId")).build();
		return new ResponseEntity<>(traceError, e.getStatusCode());
	}

	@ExceptionHandler(value = AddressNotFoundException.class)
	public ResponseEntity<TraceableError> addressNotFoundException(AddressNotFoundException e) {
		if (e.getStatusCode() == null) {
			e.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR);
		}
		TraceableError traceError = TraceableError.builder().errorMessage(e.getMessage())
				.errorCode(String.valueOf(e.getStatusCode().value())).exceptionType(e.getClass().getSimpleName())
				.errorDescription(e.getStatusCode().getReasonPhrase()).correlationId(MDC.get("correltionId")).build();
		return new ResponseEntity<>(traceError, e.getStatusCode());
	}
	
	@ExceptionHandler(value = RatingsOfUserAlreadyExistsException.class)
	public ResponseEntity<TraceableError> ratingsOfUserAlreadyExistsException(RatingsOfUserAlreadyExistsException e){
		if (e.getStatusCode() == null) {
			e.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR);
		}
		TraceableError traceError = TraceableError.builder().errorMessage(e.getMessage())
				.errorCode(String.valueOf(e.getStatusCode().value())).exceptionType(e.getClass().getSimpleName())
				.errorDescription(e.getStatusCode().getReasonPhrase()).correlationId(MDC.get("correltionId")).build();
		return new ResponseEntity<>(traceError, e.getStatusCode());
	}
	
	@ExceptionHandler(value = RatingsOfUserNotFoundException.class)
	public ResponseEntity<TraceableError> ratingsOfUserNotFoundException(RatingsOfUserNotFoundException e){
		if (e.getStatusCode() == null) {
			e.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR);
		}
		TraceableError traceError = TraceableError.builder().errorMessage(e.getMessage())
				.errorCode(String.valueOf(e.getStatusCode().value())).exceptionType(e.getClass().getSimpleName())
				.errorDescription(e.getStatusCode().getReasonPhrase()).correlationId(MDC.get("correltionId")).build();
		return new ResponseEntity<>(traceError, e.getStatusCode());
	}
	
	@ExceptionHandler(value = ItemReviewNotExistsException.class)
	public ResponseEntity<TraceableError> itemReviewNotExistsException(ItemReviewNotExistsException e){
		if (e.getStatusCode() == null) {
			e.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR);
		}
		TraceableError traceError = TraceableError.builder().errorMessage(e.getMessage())
				.errorCode(String.valueOf(e.getStatusCode().value())).exceptionType(e.getClass().getSimpleName())
				.errorDescription(e.getStatusCode().getReasonPhrase()).correlationId(MDC.get("correltionId")).build();
		return new ResponseEntity<>(traceError, e.getStatusCode());
	}
	
	@ExceptionHandler(value = ReviewImageNotExistsException.class)
	public ResponseEntity<TraceableError> reviewImageNotExistsException(ReviewImageNotExistsException e){
		if (e.getStatusCode() == null) {
			e.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR);
		}
		TraceableError traceError = TraceableError.builder().errorMessage(e.getMessage())
				.errorCode(String.valueOf(e.getStatusCode().value())).exceptionType(e.getClass().getSimpleName())
				.errorDescription(e.getStatusCode().getReasonPhrase()).correlationId(MDC.get("correltionId")).build();
		return new ResponseEntity<>(traceError, e.getStatusCode());
	}

	@ExceptionHandler(value = MailingException.class)
	public ResponseEntity<TraceableError> runTimeException(MailingException e){
		if (e.getStatusCode() == null) {
			e.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR);
		}
		TraceableError traceError = TraceableError.builder().errorMessage(e.getMessage())
				.errorCode(String.valueOf(e.getStatusCode().value())).exceptionType(e.getClass().getSimpleName())
				.errorDescription(e.getStatusCode().getReasonPhrase()).correlationId(MDC.get("correltionId")).build();
		return new ResponseEntity<>(traceError, e.getStatusCode());
	}
}
