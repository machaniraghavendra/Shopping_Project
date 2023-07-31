package com.shopping.query.command.service.implementation;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.shopping.query.command.entites.AddressEntity;
import com.shopping.query.command.entites.ItemEntity;
import com.shopping.query.command.entites.OrdersEntity;
import com.shopping.query.command.entites.dto.AddressDto;
import com.shopping.query.command.entites.dto.ItemsDto;
import com.shopping.query.command.entites.dto.OrdersDto;
import com.shopping.query.command.exceptions.GlobalExceptionHandler;
import com.shopping.query.command.exceptions.ItemNotFoundException;
import com.shopping.query.command.exceptions.OrderNotFoundException;
import com.shopping.query.command.exceptions.OrderWithSameItemExistsException;
import com.shopping.query.command.exceptions.UserNotFoundException;
import com.shopping.query.command.mapper.MappersClass;
import com.shopping.query.command.repos.OrderRepo;
import com.shopping.query.command.service.AddressService;
import com.shopping.query.command.service.OrderService;

@Service
public class OrdersServImpl implements OrderService {

	private static final String STATUS_SUCCESS = "success";
	private static final String STATUS_DISPATCH = "dispatched";
	private static final String STATUS_NEARBYHUB = "near by hub";
	private static final String STATUS_CANCELLED = "cancelled";
	private static final String STATUS_DELIVERED = "delivered";

	private GlobalExceptionHandler globalExceptionHandler;

	@Autowired
	private OrderRepo orderRepo;

	@Autowired
	private MappersClass mapper;

	@Autowired
	private AddressService addressService;

	private List<Object> order = new ArrayList<>();

	@Override
	public boolean saveOrderByCheckingAddress(OrdersEntity ordersEntity) throws UserNotFoundException {
		AddressDto addressDto = mapper.mapAddressDtoWithOrdersEntity(ordersEntity);
		Optional<AddressEntity> entity = addressService.getAddressWithUserIdandAddress(
				addressDto.getUserDetails().getUserId(), addressDto.getDeliveryAddress());
		if (!entity.isEmpty()) {
			return Boolean.TRUE;
		}
		return Boolean.FALSE;
	}

	@Override
	public String saveOrderDetails(OrdersEntity ordersEntity)
			throws OrderNotFoundException, ItemNotFoundException, OrderWithSameItemExistsException {
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
			ItemsDto item = mapper.itemDtoMapperById(detailsEntity.getItemId());
			detailsEntity.setTotalOrderAmount(String.valueOf(Math.multiplyExact(
					Long.valueOf(item.getItemPrice().replace(",", "").replace("₹", "").replace(".00", "")),
					detailsEntity.getOrderQuantity())));
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
	public List<Object> updateOrder(UUID orderUUID, String orderStatus) throws OrderNotFoundException {
		List<Object> value = new ArrayList<>();
		try {
			OrdersEntity detailsEntity = getWithUUID(orderUUID);
			if (!Objects.isNull(orderStatus) && !Objects.isNull(detailsEntity)) {
				switch (orderStatus.toLowerCase()) {
				case STATUS_SUCCESS:
					detailsEntity.setOrderStatus(STATUS_SUCCESS);
					break;
				case STATUS_DISPATCH:
					detailsEntity.setOrderStatus(STATUS_DISPATCH);
					break;
				case STATUS_NEARBYHUB:
					detailsEntity.setOrderStatus(STATUS_NEARBYHUB);
					break;
				case STATUS_CANCELLED:
					detailsEntity.setOrderStatus(STATUS_CANCELLED);
					break;
				case STATUS_DELIVERED:
					detailsEntity.setOrderStatus(STATUS_DELIVERED);
					break;
				}
				orderRepo.save(detailsEntity);
				value.add(detailsEntity);
			} else {
				throw new OrderNotFoundException("There is no order with id " + orderUUID);
			}
		} catch (OrderNotFoundException e) {
			value.add(globalExceptionHandler.orderNotFoundException(e));
		}
		return value;
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
				.sorted(Comparator.comparing(OrdersEntity::getOrderedAt, Comparator.reverseOrder()))
				.sorted(Comparator.comparing(OrdersEntity::getOrderedOn, Comparator.reverseOrder()))
				.collect(Collectors.toList());
		List<OrdersDto> list = new ArrayList<>();

		if (!ordersEntities.isEmpty()) {
			ordersEntities.forEach(a -> {
				try {
					list.add(mapper.deliveryDetailsMapper(a));
				} catch (ItemNotFoundException e) {
					e.printStackTrace();
				}
			});
		}
		return list;
	}

	@Override
	public void updateOrderStatus(UUID orderId) throws OrderNotFoundException {
		OrdersEntity order = getWithUUID(orderId);
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

	@Override
	public List<String> getAllEmailsOfUser(UUID userId) throws UserNotFoundException {
		Set<String> emails = new HashSet<>();
		String userEmail = mapper.userDetailDtoMapper(userId).getUserEmail();
		if (Objects.nonNull(userId) && StringUtils.hasLength(userEmail)) {
			getAllOrders().stream().filter(order -> order.getUserId().equals(userId))
					.map(order -> order.getEmailAddress()).forEach(email -> emails.add(email));
			emails.add(userEmail);
		}
		return emails.stream().filter(email -> Objects.nonNull(email) && StringUtils.hasLength(email))
				.sorted().toList();
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
}
