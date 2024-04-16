package com.shopping.query.command.entites.dto;

import com.shopping.query.command.entites.ItemEntity;
import com.shopping.query.command.entites.OrderSchedulerEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderScheduleResponseDto {
     private OrderSchedulerEntity orderScheduler;
     private ItemEntity item;
}
