package com.shopping.query.command.batch;

import com.shopping.query.command.entites.BatchUpdateOfOrder;
import com.shopping.query.command.service.BatchUpdateOfOrderService;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.ExitStatus;
import org.springframework.batch.core.StepExecution;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;


@Component
@Data
@Slf4j
public class StepExecutionListener implements org.springframework.batch.core.StepExecutionListener {

    @Autowired
    private BatchUpdateOfOrderService batchUpdateOfOrderService;

    private int count= 0;

    private LocalDateTime startDate;

    private LocalDateTime endDate;

    private String BatchName;

        @Override
        public ExitStatus afterStep(StepExecution stepExecution) {
            setCount ((int) stepExecution.getWriteCount());
            setStartDate(stepExecution.getStartTime());
            setEndDate(stepExecution.getEndTime());
            setBatchName(stepExecution.getStepName());
            batchUpdateOfOrderService.save(updateOfOrder(getBatchName(),getCount(), getStartDate(), getEndDate()));
            log.info("Saved batch update order data in table {}",stepExecution.getWriteCount());
            return ExitStatus.COMPLETED;
    }

    private BatchUpdateOfOrder updateOfOrder(String batchName, int total, LocalDateTime starDate, LocalDateTime endDate){
        return BatchUpdateOfOrder.builder()
                .BatchRunID(batchUpdateOfOrderService.getCount()+1)
                .batchName(batchName)
                .TotalOrdersUpdated(total)
                .StartDate(Date.from(starDate.atZone(ZoneId.systemDefault()).toInstant()))
                .EndDate(endDate==null?new Date(): Date.from(endDate.atZone(ZoneId.systemDefault()).toInstant()))
                .build();
    }


}
