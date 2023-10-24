package com.shopping.query.command;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
@EnableAsync(proxyTargetClass = true)
@Slf4j
public class ShoppingQueryCommandsApplication {

	public static void main(String[] args) {
		SpringApplication.run(ShoppingQueryCommandsApplication.class, args);
		log.info("Shopping application started");
	}

}
