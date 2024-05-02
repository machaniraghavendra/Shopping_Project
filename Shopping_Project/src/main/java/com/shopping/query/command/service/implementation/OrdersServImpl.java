package com.shopping.query.command.service.implementation;

import java.io.IOException;
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.*;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.shopping.query.command.configuration.OrderScheduler;
import com.shopping.query.command.entites.Notification;
import com.shopping.query.command.entites.dto.*;
import com.shopping.query.command.entites.enums.NotificationType;
import com.shopping.query.command.exceptions.*;
import com.shopping.query.command.repos.OrderSchedulerRepo;
import com.shopping.query.command.service.*;
import jakarta.annotation.Nonnull;
import org.quartz.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.expression.ExpressionParser;
import org.springframework.expression.spel.standard.SpelExpressionParser;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.shopping.query.command.entites.AddressEntity;
import com.shopping.query.command.entites.OrdersEntity;
import com.shopping.query.command.mapper.MappersClass;
import com.shopping.query.command.repos.OrderRepo;

import lombok.extern.slf4j.Slf4j;

import static com.shopping.query.command.configuration.Constants.*;

@Service
@Slf4j
@EnableAsync
public class OrdersServImpl implements OrderService {

     private GlobalExceptionHandler globalExceptionHandler;

     @Autowired
     private OrderRepo orderRepo;

     @Autowired
     private MappersClass mapper;

     @Autowired
     private EmailService emailService;

     @Autowired
     private AddressService addressService;

     private List<Object> order = new ArrayList<>();

     @Autowired
     private ItemService itemService;

     @Autowired
     private Scheduler scheduler;

     @Autowired
     OrderSchedulerRepo orderSchedulerRepo;

     @Autowired
     NotificationService notificationService;

     @Override
     public boolean saveOrderByCheckingAddress(OrdersEntity ordersEntity) throws UserException {
          AddressDto addressDto = mapper.mapAddressDtoWithOrdersEntity(ordersEntity);
          Optional<AddressEntity> entity = addressService.getAddressWithUserIdandAddress(
               addressDto.getUserId(), addressDto.getDeliveryAddressUuid());
          if (entity.isPresent()) {
               return Boolean.TRUE;
          }
          return Boolean.FALSE;
     }

     @Override
     public String saveOrderDetails(OrdersEntity ordersEntity)
          throws OrderNotFoundException, ItemNotFoundException, OrderWithSameItemExistsException, MailingException {
          boolean exists = getAllOrders().stream().filter(a -> a.getOrderId().equals(ordersEntity.getOrderId()))
               .findFirst().isPresent();
          if (!exists) {
               OrdersEntity detailsEntity = OrdersEntity.builder().deliveryAddress(ordersEntity.getDeliveryAddress())
                    .emailAddress(ordersEntity.getEmailAddress()).firstName(ordersEntity.getFirstName())
                    .itemId(ordersEntity.getItemId()).lastName(ordersEntity.getLastName())
                    .paymentType(ordersEntity.getPaymentType()).phoneNumber(ordersEntity.getPhoneNumber())
                    .pincode(ordersEntity.getPincode()).orderedAt(getTime(LocalDateTime.now()))
                    .orderedOn(getDate(LocalDateTime.now()))
                    .orderQuantity(
                         Objects.isNull(ordersEntity.getOrderQuantity()) ? 1 : ordersEntity.getOrderQuantity())
                    .orderStatus(STATUS_SUCCESS).deliveryDate(getDate(LocalDateTime.now().plusDays(5)))
                    .orderUUIDId(UUID.randomUUID()).userId(ordersEntity.getUserId()).build();
               if (detailsEntity.getOrderUUIDId().toString().startsWith("1")) {
                    saveOrderDetails(ordersEntity);
               }
               ItemsDto item = mapper.getItemDtoById(detailsEntity.getItemId());
               detailsEntity.setTotalOrderAmount(String.valueOf(Math.multiplyExact(
                    Long.parseLong(item.getItemPrice().replace(",", "").replace("₹", "").replace(".00", "")),
                    detailsEntity.getOrderQuantity())));
               sendMailOfOrderStatus(detailsEntity, detailsEntity.getOrderStatus());
               orderRepo.save(detailsEntity);
               return "Saved order";
          }
          return "Not saved";
     }

     @Override
     public OrdersEntity findByDeliveryDetailId(Integer id) {
          if (orderRepo.existsById(id)) {
               return orderRepo.findById(id).get();
          } else {
               return null;
          }
     }

     @Override
     public List<OrdersEntity> getAllOrders() {
          return orderRepo.findAll();
     }

     @Override
     public String deleteDetailsWithId(Integer id) {
          if (orderRepo.existsById(id)) {
               orderRepo.delete(findByDeliveryDetailId(id));
               return "Deleted";
          } else {
               return "Not deleted";
          }
     }

     @Override
     public OrdersDto getOrderDtowithOrderUUID(UUID orderId) throws ItemNotFoundException {
          return mapper.deliveryDetailsMapper(getWithUUID(orderId));
     }

     @Override
     public List<Object> updateOrder(UUID orderUUID, String orderStatus)
          throws OrderNotFoundException, ItemNotFoundException {
          List<Object> value = new ArrayList<>();
          try {
               OrdersEntity detailsEntity = getWithUUID(orderUUID);
               if (!Objects.isNull(orderStatus) && !Objects.isNull(detailsEntity)) {
                    switch (orderStatus.toLowerCase()) {
                         case STATUS_SUCCESS:
                              detailsEntity.setOrderStatus(STATUS_SUCCESS);
                              break;
                         case STATUS_DISPATCH:
                              if (!Objects.equals(detailsEntity.getOrderStatus(), STATUS_DISPATCH)) {
                                   sendMailOfOrderStatus(detailsEntity, STATUS_DISPATCH);
                              }
                              detailsEntity.setOrderStatus(STATUS_DISPATCH);
                              break;
                         case STATUS_NEARBYHUB:
                              if (!Objects.equals(detailsEntity.getOrderStatus(), STATUS_NEARBYHUB)) {
                                   sendMailOfOrderStatus(detailsEntity, STATUS_NEARBYHUB);
                              }
                              detailsEntity.setOrderStatus(STATUS_NEARBYHUB);
                              break;
                         case STATUS_CANCELLED:
                              if (!Objects.equals(detailsEntity.getOrderStatus(), STATUS_CANCELLED)) {
                                   sendMailOfOrderStatus(detailsEntity, STATUS_CANCELLED);
                              }
                              itemService.updateItemData(detailsEntity.getItemId(), -1, ORDER);
                              detailsEntity.setOrderStatus(STATUS_CANCELLED);
                              break;
                         case STATUS_DELIVERED:
                              if (!detailsEntity.getOrderStatus().equalsIgnoreCase(STATUS_DELIVERED)) {
                                   sendMailOfOrderStatus(detailsEntity, STATUS_DELIVERED);
                                   sendEBillOfOrderToUser(detailsEntity);
                              }
                              itemService.updateItemData(detailsEntity.getItemId(), 1, ORDER);
                              detailsEntity.setOrderStatus(STATUS_DELIVERED);
                              break;
                    }
                    orderRepo.save(detailsEntity);
                    sendNotificationToUser(detailsEntity, detailsEntity.getOrderStatus());
                    value.add(detailsEntity);
               } else {
                    throw new OrderNotFoundException("There is no order with id " + orderUUID);
               }
          } catch (OrderNotFoundException | MailingException e) {
               if (e instanceof OrderNotFoundException)
                    value.add(globalExceptionHandler.orderNotFoundException((OrderNotFoundException) e));
          }
          return value;
     }

     private void sendNotificationToUser(OrdersEntity order, String orderStatus){
          log.info("Sending notification to user");
          try {
               var item = mapper.getItemDtoById(order.getItemId());
               var notification = Notification.builder().isNotificationViewed(Boolean.FALSE).notificationType(NotificationType.INFO).link("http://localhost:3000/orderdetails")
                    .message("Your order status changed to "+orderStatus+" for item " + getItemNameWith30Chars(item.getItemName(), 20))
                    .userUuid(String.valueOf(order.getUserId())).build();
               notificationService.sendNotification(notification);
               saveOrderToView(order.getOrderUUIDId());
          }catch (Exception e){
               log.error(e.getMessage());
          }
     }

     private void sendEBillOfOrderToUser(OrdersEntity order) {
          log.info("Sending order e-bill mail to user");
          try {
               ItemsDto item = mapper.getItemDtoById(order.getItemId());
               EmailDto emailDto = EmailDto.builder()
                    .msgBody("Hi " + order.getFirstName() + " " + order.getLastName() + ",\n" +
                         "\tHere is the invoice bill attached to this mail you can use it for reference.\n" +
                         "\t\tThank you for shopping with us.")
                    .subject("Order details of " + getItemNameWith30Chars(item.getItemName(), 30))
                    .recipient(order.getEmailAddress()).build();
               emailService.sendMailWithImageUrl(emailDto, "http://localhost:8083/pdf/generate/" + order.getOrderUUIDId(), item.getItemName());
               log.info("Sent order e-bill mail to user " + order.getEmailAddress());
          } catch (ItemNotFoundException | IOException e) {
               log.error(e.getMessage());
          }
     }

     private void sendMailOfOrderStatus(OrdersEntity order, String status) throws ItemNotFoundException, MailingException {
          log.info("Sending order update mail to user");
          ItemsDto item = mapper.getItemDtoById(order.getItemId());
          DateTimeFormatter fromFormat = DateTimeFormatter.ofPattern("dd-MM-yyyy");
          DateTimeFormatter toFormat = DateTimeFormatter.ofPattern("MMMM dd, yyyy");
          try {
               emailService.sendSimplemail(EmailDto.builder().subject("Update for order of " + getItemNameWith30Chars(item.getItemName(), 30))
                    .msgBody("Hi " + order.getFirstName() + ",\n" + "\t Your order of " + item.getItemName()
                         + " has updated with status of " + status.toUpperCase() + " and its order id is "
                         + order.getOrderUUIDId() + ", the payment type is " + order.getPaymentType()
                         + " and its total amount of order is ₹" + order.getTotalOrderAmount() + ".00"
                         .concat(
                              (!status.equalsIgnoreCase(STATUS_CANCELLED)
                                   ? ", the order may be delivered by " + LocalDate.parse(order.getDeliveryDate(), fromFormat).format(toFormat)
                                   : "")
                         )
                    )
                    .recipient(order.getEmailAddress()).build());
               log.info("Sent order update mail to user");
          } catch (Exception e) {
               throw new MailingException(e.getMessage());
          }
     }

     private static String getItemNameWith30Chars(@Nonnull String itemName, int charsCount) {
          return itemName.length() > charsCount ? itemName.substring(0, charsCount) + "..." : itemName;
     }

     @Override
     public OrdersDto findItemDetailsWithId(Integer id) throws ItemNotFoundException {
          return mapper.deliveryDetailsMapper(findByDeliveryDetailId(id));
     }

     @Override
     public List<Object> saveOrderToView(UUID id) throws ItemNotFoundException {
          order = new ArrayList<>();
          try {
               OrdersEntity detailsOfUser = getWithUUID(id);
               if (!Objects.isNull(detailsOfUser)) {
                    order.add(findItemDetailsWithId(detailsOfUser.getOrderId()));
               } else {
                    throw new OrderNotFoundException("No order with id " + id);
               }
          } catch (OrderNotFoundException e) {
               order.add(globalExceptionHandler.orderNotFoundException(e));
          }
          return order;
     }

     @Override
     public List<Object> getSavedOrder() {
          return order;
     }

     @Override
     public List<OrdersDto> getOrdersofUser(UUID userId) {
          List<OrdersEntity> ordersEntities = getAllOrders().stream().filter(a -> a.getUserId().equals(userId))
               .sorted(Comparator.comparing(a -> LocalTime.parse(a.getOrderedAt(), DateTimeFormatter.ofPattern("HH:mm:ss")), Comparator.reverseOrder()))
               .sorted(Comparator.comparing(a -> LocalDate.parse(a.getDeliveryDate(), DateTimeFormatter.ofPattern("dd-MM-yyyy")), Comparator.reverseOrder())).toList();
          List<OrdersDto> list = new ArrayList<>();

          if (!ordersEntities.isEmpty()) {
               ordersEntities.forEach(a -> {
                    try {
                         list.add(mapper.deliveryDetailsMapper(a));
                    } catch (ItemNotFoundException e) {
                         log.error(e.getMessage());
                    }
               });
          }
          return list;
     }

     @Override
     public void updateOrderStatus(UUID orderId) throws OrderNotFoundException, ItemNotFoundException {
          OrdersEntity order = getWithUUID(orderId);
          if (!order.getOrderStatus().equalsIgnoreCase(STATUS_CANCELLED)) {
               LocalDate now = LocalDate.now();
               LocalDate dateOfOrder = LocalDate.parse(order.getOrderedOn(), DateTimeFormatter.ofPattern("dd-MM-yyyy"));
               int days = (int) ChronoUnit.DAYS.between(dateOfOrder, now);
               if (days != 0 && days >= 1) {
                    if (days == 1 || 3 > days) {
                         updateOrder(orderId, STATUS_DISPATCH);
                    } else if (days < 2 && days == 3 || 5 > days) {
                         updateOrder(orderId, STATUS_NEARBYHUB);
                    } else if (days == 5 || 5 < days) {
                         updateOrder(orderId, STATUS_DELIVERED);
                    } else {
                         updateOrder(orderId, order.getOrderStatus());
                    }
               }
          }
     }

     @Override
     public List<String> getAllEmailsOfUser(UUID userId) throws UserException {
          Set<String> emails = new HashSet<>();
          String userEmail = mapper.userDetailDtoMapper(userId).getUserEmail();
          if (Objects.nonNull(userId) && StringUtils.hasLength(userEmail)) {
               getAllOrders().stream().filter(order -> order.getUserId().equals(userId)).map(OrdersEntity::getEmailAddress)
                    .forEach(emails::add);
               emails.add(userEmail);
          }
          return emails.stream().filter(email -> Objects.nonNull(email) && StringUtils.hasLength(email)).sorted()
               .toList();
     }

     @Override
     public String getDate(LocalDateTime date) {
          return date == null ? null
               : LocalDate.of(date.getYear(), date.getMonth(), date.getDayOfMonth())
               .format(DateTimeFormatter.ofPattern("dd-MM-yyyy"));
     }

     @Override
     public String getTime(LocalDateTime date) {
          return date == null ? null
               : LocalTime.of(date.getHour(), date.getMinute(), date.getSecond())
               .format(DateTimeFormatter.ofPattern("HH:mm:ss"));
     }

     @Override
     public OrdersEntity getWithUUID(UUID uuid) {
          return getAllOrders().stream().filter(a -> a.getOrderUUIDId().equals(uuid)).findFirst().get();
     }

     @Override
     public OrderSchedulerResponseDto scheduleOrder(OrdersEntity order, LocalDateTime scheduleAt, ZoneId zoneId) {
          ZonedDateTime triggerTime = ZonedDateTime.of(scheduleAt, zoneId);
          JobDetail jobDetail = null;
          try {
               if (triggerTime.isBefore(ZonedDateTime.of(LocalDateTime.now(), zoneId))) {
                    log.error("Failed to schedule Order: Selected date and time should be after current date and time");
                    return OrderSchedulerResponseDto.builder().orderScheduled(Boolean.FALSE).message("Failed to schedule Order: Selected date and time should be after current date and time").build();
               }
               jobDetail = buildJobDetail(order, triggerTime);
               scheduler.addJob(jobDetail, true);
               Trigger trigger = buildTrigger(jobDetail, triggerTime);
               scheduler.scheduleJob(trigger);
               log.info("Scheduled order for " + scheduleAt);
               var scheduledOrder = orderSchedulerRepo.save(mapper.getOrderSchedulerEntity(UUID.fromString(jobDetail.getKey().getName()), order, Boolean.FALSE, scheduleAt, Boolean.FALSE));
               ItemsDto item = mapper.getItemDtoById(order.getItemId());
               emailService.sendSimplemail(EmailDto.builder().
                    subject("Scheduled order for item " + getItemNameWith30Chars(item.getItemName(), 30))
                    .recipient(order.getEmailAddress())
                    .msgBody("Hi " + order.getFirstName() + ",\n" + "\t Your order of " + item.getItemName()
                         + " has been scheduled for " + triggerTime).build());

               notificationService.sendNotification(Notification.builder()
                    .notificationType(NotificationType.INFO)
                    .message("Scheduled order for item " + getItemNameWith30Chars(item.getItemName(), 30))
                    .userUuid(String.valueOf(order.getUserId()))
                    .link("http://localhost:3000/orders/scheduled/" + scheduledOrder.getUuid())
                    .isNotificationViewed(Boolean.FALSE).build());
          } catch (Exception e) {
               log.error("Failed to schedule Order");
               return OrderSchedulerResponseDto.builder().orderScheduled(Boolean.FALSE).message("Failed to schedule Order").build();
          }
          return OrderSchedulerResponseDto.builder()
               .orderScheduled(Boolean.TRUE)
               .message("Scheduled order for " + scheduleAt).jobId(UUID.fromString(jobDetail.getKey().getName()))
               .groupId(jobDetail.getKey().getGroup())
               .build();
     }

     @Override
     public void unScheduleOrder(String jobName, String groupName) {
          try {
               JobKey jobKey = new JobKey(jobName, groupName);
               scheduler.deleteJob(jobKey);
          } catch (Exception e) {
               log.error(e.getMessage());
          }
     }

     private Trigger buildTrigger(JobDetail jobDetail, ZonedDateTime triggerTime) {
          return TriggerBuilder.newTrigger()
               .forJob(jobDetail)
               .usingJobData(jobDetail.getJobDataMap())
               .withIdentity(jobDetail.getKey().getName(), "Order jobs")
               .withDescription("Placed Order for scheduled time")
               .startAt(Date.from(triggerTime.toInstant()))
               .withSchedule(SimpleScheduleBuilder.simpleSchedule().withMisfireHandlingInstructionFireNow())
               .build();
     }

     private JobDetail buildJobDetail(OrdersEntity order, ZonedDateTime scheduledAt) throws JsonProcessingException {
          JobDataMap jobDataMap = new JobDataMap();
          jobDataMap.put("orderEntity", new ObjectMapper().writeValueAsString(order));

          return JobBuilder.newJob(OrderScheduler.class)
               .usingJobData(jobDataMap)
               .storeDurably()
               .withIdentity(UUID.randomUUID().toString(), "Order jobs")
               .withDescription("Scheduled order for " + scheduledAt)
               .build();
     }

     @Override
     public void deleteAllOrdersofUser(UUID userId) throws UserException {
          try {
               orderRepo.deleteAll(getAllOrders().stream().filter(a -> Objects.equals(a.getUserId(), userId)).toList());
          } catch (Exception e) {
               throw new UserException(e.getMessage());
          }
     }
}
