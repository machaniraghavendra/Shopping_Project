package com.shopping.query.command.exceptions;

import java.io.Serializable;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Builder
@Setter
@Getter
@NoArgsConstructor
public class TraceableError implements Serializable {

	private static final long serialVersionUID = 12345L;

	private String correlationId;

	private String errorCode;

	private String errorDescription;

	private String exceptionType;

	private String errorMessage;

	public TraceableError(String correlationId, String errorCode, String errorDescription, String exceptionType,
			String errorMessage) {
		super();
		this.correlationId = correlationId;
		this.errorCode = errorCode;
		this.errorDescription = errorDescription;
		this.exceptionType = exceptionType;
		this.errorMessage = errorMessage;
	}

}
