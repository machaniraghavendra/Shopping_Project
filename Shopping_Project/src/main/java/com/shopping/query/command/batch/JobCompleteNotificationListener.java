package com.shopping.query.command.batch;

import com.shopping.query.command.entites.BatchUpdateOfOrder;
import com.shopping.query.command.service.BatchUpdateOfOrderService;
import org.springframework.batch.core.*;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.Objects;

@Component
@Slf4j
public class JobCompleteNotificationListener implements JobExecutionListener {

	@Autowired
	private JobRepository jobRepository;

	@Override
	public void beforeJob(JobExecution jobExecution) {
		if (jobExecution.getStatus()==BatchStatus.STARTED) {
			log.info("The job updating job is started");
		}
	}

	@Override
	public void afterJob(JobExecution jobExecution) {
		if (jobExecution.getStatus()==BatchStatus.FAILED) {
			log.info("The job updating job is failed and now updated batch status table");
		}
		if (jobExecution.getStatus()==BatchStatus.COMPLETED) {
			log.info("The job updating job is completed and now updated batch status table");
		}
	}

}
