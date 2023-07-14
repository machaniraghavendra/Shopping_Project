package com.shopping.query.command.service.implementation;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.shopping.query.command.entites.BotEntity;
import com.shopping.query.command.entites.OrdersEntity;
import com.shopping.query.command.entites.dto.ItemsDto;
import com.shopping.query.command.exceptions.ItemNotFoundException;
import com.shopping.query.command.exceptions.UserNotFoundException;
import com.shopping.query.command.mapper.MappersClass;
import com.shopping.query.command.repos.OrderRepo;
import com.shopping.query.command.service.BotService;

@Service
public class BotServiceImpl implements BotService {
	private static final String HI = "hi";
	private static final String HI_RESPONSE = "Hello, Ask me anything in shopping application";
	private static final String HELLO = "hello";
	private static final String HOW_ARE_YOU = "how are you";
	private static final String HOW_ARE_YOU_RESPONSE = "Yahh Thanks for asking ! I'm fine and i'm here to help with page links";
	private static final String CART_PAGE = "cart";
	private static final String CART_PAGE_RESPONSE = "Sure! Here is the link tap on it http://localhost:3000/cart";
	private static final String ORDER_PAGE = "orders";
	private static final String ORDER_PAGE_RESPONSE = "Sure! Here is the link tap on it http://localhost:3000/orders";
	private static final String WISHLIST_PAGE = "wishlist";
	private static final String WISHLIST_PAGE_RESPONSE = "Sure! Here is the link tap on it http://localhost:3000/wishlist";
	private static final String SETTING_PAGE = "setting";
	private static final String SETTING_PAGE_RESPONSE = "Sure! Here is the link tap on it http://localhost:3000/profile/settings";
	private static final String ERROR_MSGE = "Sorry I can't able to find with your query !";

	private static OrdersServImpl orderDetailsServImpl = new OrdersServImpl();

	@Autowired
	private OrderRepo orderRepo;

	@Autowired
	private MappersClass mappersClass;

	@Autowired
	private OrdersServImpl ordersServImpl;

	private static List<BotEntity> responses = new ArrayList<>();

	@SuppressWarnings("deprecation")
	@Override
	public void queryReponse(BotEntity incomeBot) throws UserNotFoundException, ItemNotFoundException {
		incomeBot.setUserMessage(incomeBot.getUserMessage().trim());
		if (!StringUtils.isEmpty(incomeBot.getUserMessage())) {
			if (HI.contains(incomeBot.getUserMessage().toLowerCase())
					|| HELLO.contains(incomeBot.getUserMessage().toLowerCase())) {
				botListAdder(botBulider(incomeBot, HI_RESPONSE));
			} else if (CART_PAGE.contains(incomeBot.getUserMessage().toLowerCase())) {
				botListAdder(botBulider(incomeBot, CART_PAGE_RESPONSE));
			} else if (WISHLIST_PAGE.contains(incomeBot.getUserMessage().toLowerCase())) {
				botListAdder(botBulider(incomeBot, WISHLIST_PAGE_RESPONSE));
			} else if (HOW_ARE_YOU.contains(incomeBot.getUserMessage().toLowerCase())) {
				botListAdder(botBulider(incomeBot, HOW_ARE_YOU_RESPONSE));
			} else if (ORDER_PAGE.contains(incomeBot.getUserMessage().toLowerCase())) {
				botListAdder(botBulider(incomeBot, ORDER_PAGE_RESPONSE));
			} else if (SETTING_PAGE.contains(incomeBot.getUserMessage().toLowerCase())) {
				botListAdder(botBulider(incomeBot, SETTING_PAGE_RESPONSE));
			} else if (incomeBot.getUserMessage().length() > 20) {
				botListAdder(
						botBulider(incomeBot, getOrderDetailsWithUUID(UUID.fromString(incomeBot.getUserMessage()))));
			} else {
				botListAdder(botBulider(incomeBot, ERROR_MSGE));
			}
		}
	}

	@SuppressWarnings("static-access")
	private static BotEntity botBulider(BotEntity incomeBot, String message) throws UserNotFoundException {
		try {
			if (!Objects.isNull(incomeBot.getUserDetails().getUserId())) {
				return new BotEntity().builder().id(UUID.randomUUID()).userMessage(incomeBot.getUserMessage())
						.botMessage(message).botReturnedAt(orderDetailsServImpl.getTime(LocalDateTime.now()))
						.userMessagedAt(orderDetailsServImpl.getTime(LocalDateTime.now()))
						.userDetails(incomeBot.getUserDetails()).build();
			} else {
				throw new UserNotFoundException("There is no user with this email ");
			}
		} catch (UserNotFoundException e) {
			e.getStackTrace();
		}
		return null;
	}

	private static void botListAdder(BotEntity incomeBot) {
		responses.add(incomeBot);
	}

	@Override
	public void listClear(UUID userId) {
		responses
				.removeAll(responses.stream().filter(a -> a.getUserDetails().getUserId().equals(userId))
						.collect(Collectors.toList()));
	}

	@Override
	public List<BotEntity> viewAllResponse() {
		return responses;
	}

	@Override
	public String getOrderDetailsWithUUID(UUID id) throws ItemNotFoundException {
		String message = "";
		OrdersEntity detailsOfUser = orderRepo.findAll().stream().filter(a -> a.getOrderUUIDId().equals(id))
				.findFirst().orElse(null);
		OrdersEntity ordersEntity = new OrdersEntity();
		if (!Objects.isNull(detailsOfUser)) {
			ordersEntity = ordersServImpl.findByDeliveryDetailId(detailsOfUser.getOrderId());
		}
		if (!Objects.isNull(detailsOfUser)) {
			ItemsDto entity = mappersClass.itemDtoMapperById(detailsOfUser.getItemId());
			message = "The order details are " + entity.getItemName() + " of price " + entity.getItemPrice()
					+ " of type " + entity.getItemType() + " its status is now "
					+ ordersEntity.getOrderStatus() + " "
					+ (!ordersEntity.getOrderStatus().equalsIgnoreCase("cancelled")&&!ordersEntity.getOrderStatus().equalsIgnoreCase("delivered")
							? "and to be delivered by " + ordersEntity.getDeliveryDate()
							: "")
					+ entity.getItemImgUrl();
		} else {
			message = "There is no order with this id " + id;
		}
		return message;
	}
}
