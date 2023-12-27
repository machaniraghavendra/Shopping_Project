package com.shopping.query.command.configuration;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

import com.shopping.query.command.batch.*;
import com.shopping.query.command.service.BatchUpdateOfOrderService;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.configuration.annotation.EnableBatchProcessing;
import org.springframework.batch.core.configuration.annotation.StepScope;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.job.flow.FlowExecutionStatus;
import org.springframework.batch.core.job.flow.JobExecutionDecider;
import org.springframework.batch.core.launch.support.RunIdIncrementer;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.batch.item.ItemWriter;
import org.springframework.batch.item.data.RepositoryItemReader;
import org.springframework.batch.item.json.JacksonJsonObjectReader;
import org.springframework.batch.item.json.JsonItemReader;
import org.springframework.batch.item.json.builder.JsonItemReaderBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.data.domain.Sort;
import org.springframework.transaction.PlatformTransactionManager;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.shopping.query.command.entites.ItemEntity;
import com.shopping.query.command.entites.OrdersEntity;
import com.shopping.query.command.exceptions.GlobalExceptionHandler;
import com.shopping.query.command.exceptions.ItemNotFoundException;
import com.shopping.query.command.exceptions.OrderNotFoundException;
import com.shopping.query.command.repos.OrderRepo;
import com.shopping.query.command.service.ItemService;
import com.shopping.query.command.service.OrderService;

import lombok.extern.slf4j.Slf4j;

@EnableBatchProcessing
@Configuration
@Slf4j
public class BatchConfiguration {

    @Autowired
    private JobCompleteNotificationListener jobCompleteNotificationListener;

    @Autowired
    private StepExecutionListener stepExecutionListener;

    @Autowired
    private WriterListener writerListener;

    @Autowired
    private OrderRepo orderRepo;

    @Autowired
    private OrderService orderService;

    @Autowired
    private GlobalExceptionHandler globalExceptionHandler;

    @Value("${batchprocesssize}")
    private static int Batch_Process_Size;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private ItemService itemService;

    @Autowired
    private ItemBatchProcessor itemBatchProcesser;

    @Autowired
    private OrdersBatchProcessor ordersBatchProcessor;

    @Autowired
    private BatchUpdateOfOrderService batchUpdateOfOrderService;

    @Bean
    @StepScope
    public RepositoryItemReader<OrdersEntity> reader() {
        RepositoryItemReader<OrdersEntity> reader = new RepositoryItemReader<>();
        reader.setName("Orders reader");
        reader.setRepository(orderRepo);
        reader.setMethodName("findAll");
        Map<String, Sort.Direction> sort = new HashMap<>();
        sort.put("orderedOn", Sort.Direction.DESC);
        reader.setSort(sort);
        return reader;
    }

    @Bean
    public ItemWriter<? super OrdersEntity> writer() {
        return list -> {
            for (OrdersEntity order : list) {
                try {
                    log.info("Updating order : {} at {}", order.getOrderUUIDId(), LocalDateTime.now());
                    orderService.updateOrderStatus(order.getOrderUUIDId());
                    log.info("Updated order : {} at {}", order.getOrderUUIDId(), LocalDateTime.now());
                } catch (OrderNotFoundException | ItemNotFoundException e) {
                    if (e instanceof OrderNotFoundException)
                        log.error(Objects.requireNonNull(globalExceptionHandler
                                        .orderNotFoundException((OrderNotFoundException) e).getBody())
                                .getErrorMessage());
                    if (e instanceof ItemNotFoundException)
                        log.error(Objects.requireNonNull(
                                        globalExceptionHandler.itemNotFoundException((ItemNotFoundException) e).getBody())
                                .getErrorMessage());
                }
            }
        };
    }

    @Bean
    @StepScope
    public JsonItemReader<ItemEntity> itemEntityReader() {
        ObjectMapper objectMapper = new ObjectMapper();
        JacksonJsonObjectReader<ItemEntity> reader = new JacksonJsonObjectReader<>(ItemEntity.class);
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
        reader.setMapper(objectMapper);
        return new JsonItemReaderBuilder<ItemEntity>().name("Items_File")
                .resource(new ClassPathResource("files/Items_API.json")).jsonObjectReader(reader).build();
    }

    @Bean
    public ItemWriter<? super ItemEntity> itemwriter() {
        return list -> {
            for (ItemEntity item : list) {
                itemService.addItem(item);
            }
        };
    }

    @Bean
    public Step step(PlatformTransactionManager platformTransactionManager) {
        return new StepBuilder("orderupdatejob", jobRepository)
                .<OrdersEntity, OrdersEntity>chunk(Batch_Process_Size, platformTransactionManager).reader(reader())
                .writer(writer()).listener(writerListener).listener(stepExecutionListener)
                .processor(ordersBatchProcessor)
                .build();
    }

    @Bean
    public Step step1(PlatformTransactionManager platformTransactionManager) throws IOException {
        return new StepBuilder("itemsInstaller", jobRepository)
                .<ItemEntity, ItemEntity>chunk(Batch_Process_Size, platformTransactionManager)
                .reader(itemEntityReader()).processor(itemBatchProcesser).writer(itemwriter()).listener(writerListener)
                .listener(stepExecutionListener).build();
    }

    @Bean
    public Job ordersLoadJob(Step step) throws IOException {
        return new JobBuilder("orderupdatejob", jobRepository)
                .incrementer(new RunIdIncrementer())
                .listener(jobCompleteNotificationListener)
                .start(step1(null))
                .next(ordersBatchDecider())
                .on("PROCEED")
                .to(step(null))
                .end().build();
    }

    @Bean
    public JobExecutionDecider ordersBatchDecider() {
        return (jobExecution, stepExecution) -> {
//			IF LAST ORDER JOB IS RUNNED LESS THAN 1 THAN IT IS FALSE IF IT IS GREATER THAN 1 IT IS TRUE
            boolean haveToRun = batchUpdateOfOrderService.getLastRunnedTimeinHours();
            return haveToRun ? new FlowExecutionStatus("PROCEED") : FlowExecutionStatus.COMPLETED;
        };
    }

}
