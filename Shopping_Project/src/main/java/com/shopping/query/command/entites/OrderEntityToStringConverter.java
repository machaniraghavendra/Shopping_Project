package com.shopping.query.command.entites;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class OrderEntityToStringConverter implements AttributeConverter<OrdersEntity, String> {
     @Override
     public String convertToDatabaseColumn(OrdersEntity orderData) {
          final ObjectMapper objectMapper = new ObjectMapper();
          String specificationJson = null;
          try{
               specificationJson = objectMapper.writeValueAsString(orderData);
          }
          catch(Exception e){
               log.warn("JSON writing error "+e);
          }
          return specificationJson;
     }

     @Override
     public OrdersEntity convertToEntityAttribute(String orderData) {
          OrdersEntity orderEntity = null;
          final ObjectMapper objectMapper = new ObjectMapper();
          objectMapper.findAndRegisterModules();
          try{
               if(orderData != null){
                    orderEntity = objectMapper.readValue(orderData, new TypeReference<OrdersEntity>() {
                    });
               }
          }
          catch (Exception e){
               log.warn("JSON reading error "+e);
          }
          return orderEntity;
     }
}
