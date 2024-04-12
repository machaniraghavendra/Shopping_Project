package com.shopping.query.command.entites.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class OrderSchedulerResponseDto {
     private Boolean orderScheduled;
     private String message;
     private UUID jobId;
     private String groupId;
     private LocalDateTime scheduledAt;
}
