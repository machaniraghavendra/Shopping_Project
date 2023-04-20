package com.shopping.query.command.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.view.InternalResourceViewResolver;

import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

//@org.springframework.context.annotation.Configuration
//@EnableSwagger2
//@EnableWebMvc
public class Configuration {

//	@Bean
//	public Docket docket() {
//		return new Docket(DocumentationType.SWAGGER_2).apiInfo(apiInfo()).select().paths(PathSelectors.any())
//				.apis(RequestHandlerSelectors.basePackage("com.shopping")).build();
//	}
//
//	@Bean
//	public InternalResourceViewResolver defaultViewResolver() {
//		return new InternalResourceViewResolver();
//	}
//
//	private ApiInfo apiInfo() {
//		return new ApiInfoBuilder().title("Shopping Application").version("1.0.0")
//				.description("Latest products available and for UI click here http://localhost:3000/").build();
//	}
}
