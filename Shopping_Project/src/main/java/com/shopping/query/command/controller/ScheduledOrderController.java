package com.shopping.query.command.controller;

import com.shopping.query.command.service.ScheduledOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/scheduled")
public class ScheduledOrderController {

     @Autowired
     ScheduledOrderService scheduledOrderService;

     @GetMapping("/orders")
     public ResponseEntity<Object> getAllScheduledOrdersOfUser(@RequestParam("userId")UUID userId){
          var response = scheduledOrderService.getAllScheduledOrdersOfUser(userId);
          return response==null?ResponseEntity.badRequest().body("UserId is not valid: "+userId):ResponseEntity.ok(response);
     }

     @DeleteMapping("/delete/order")
     public ResponseEntity<Object> deleteScheduledOrder(@RequestParam("scheduledId")UUID scheduledId) {
          var response = scheduledOrderService.deleteScheduledOrder(scheduledId);
          return response==null?ResponseEntity.badRequest().body("ScheduledId is not valid: "+scheduledId):ResponseEntity.ok(response);
     }

}
