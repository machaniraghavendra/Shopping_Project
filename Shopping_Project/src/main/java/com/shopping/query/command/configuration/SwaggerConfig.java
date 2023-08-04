package com.shopping.query.command.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;

@Configuration
public class SwaggerConfig {
	
	@Bean
	public OpenAPI openAPI() {
		return new OpenAPI().info(new Info().title("Shopping mart open Api's")
				.description("Api's for all operations of shopping mart").version("5.0.0"));
	}
	
}
