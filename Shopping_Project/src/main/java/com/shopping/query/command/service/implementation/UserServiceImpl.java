package com.shopping.query.command.service.implementation;

import java.util.*;

import com.shopping.query.command.entites.dto.EmailDto;
import com.shopping.query.command.service.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;

import com.shopping.query.command.entites.UserEntity;
import com.shopping.query.command.entites.dto.UserDetailDto;
import com.shopping.query.command.exceptions.UserException;
import com.shopping.query.command.repos.UserRepo;

import lombok.extern.slf4j.Slf4j;
import org.springframework.util.StringUtils;

@org.springframework.stereotype.Service
@Slf4j
public class UserServiceImpl extends SecurityServiceImpl implements UserService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    @Lazy
    private CartService cartService;

    @Autowired
    @Lazy
    private FavService favService;

    @Autowired
    @Lazy
    private BotService botService;

    @Autowired
    @Lazy
    private OrderService orderService;

    @Autowired
    @Lazy
    private ItemReviewService itemReviewService;

    @Autowired
    @Lazy
    private AddressService addressService;

    @Autowired
    @Lazy
    private AdminService adminService;

    @Autowired
    @Lazy
    private EmailService emailService;

    @Autowired
    @Lazy
    private OtpService otpService;

    @Override
    public String save(UserEntity userEntity) throws UserException {
        userEntity.setUserEmail(userEntity.getUserEmail().toLowerCase());
        try {
            if (userRepo.existsById(userEntity.getUserName()) || userRepo.existsById(userEntity.getUserEmail())) {
                throw new UserException("You have already created account with us by Username "
                        + userEntity.getUserName() + " go to login and enjoy shopping with us !");
            } else {
                userEntity.setUserId(UUID.randomUUID());
                userEntity.setUserEmail(encrypt(userEntity.getUserEmail()));
                userEntity.setUserPassword(encrypt(userEntity.getUserPassword()));
                userEntity = userRepo.save(userEntity);
                if (userEntity.isAdmin()) adminService.addAdmin(userEntity);
                try {
                    sendMailAfterSuccessfulSignUp(decrypt(userEntity.getUserEmail()), userEntity.getUserName());
                }catch (Exception e) {
                    log.error(e.getMessage());
                }
                return "You are signed-up with name " + userEntity.getUserName();
            }
        } catch (UserException e) {
            log.error(e.getMessage());
        }
        return "You have already created account with us by Username " + userEntity.getUserName()
                + " go to login and enjoy shopping with us !";
    }

    @Override
    public UserDetailDto find(String userEmail) throws UserException {
        userEmail = encrypt(userEmail);
        try {
            if (userRepo.existsById(userEmail)) {
                return mappingToUserDetailDto(userRepo.findById(userEmail).orElseThrow(() -> new UserException("No user found")));
            } else {
                throw new UserException("The user " + userEmail + " does not exists");
            }
        } catch (UserException e) {
            log.error(e.getMessage());
        }
        return null;
    }

    @Override
    public UserDetailDto getUserWithId(UUID userId) throws UserException {
        if (Objects.nonNull(userId)) {
            return mappingToUserDetailDto(findall().stream().filter(user -> Objects.equals(user.getUserId(), userId))
                    .findFirst().orElseThrow(() -> new UserException("No user Found")));
        }
        return null;
    }

    @Override
    public List<UserEntity> findall() {
        List<UserEntity> duplicateEntities = new ArrayList<>();
        userRepo.findAll().forEach(user -> {
            user.setMobileNumber("XXXXXX" + user.getMobileNumber().substring(user.getMobileNumber().length() - 4,
                    user.getMobileNumber().length()));
            duplicateEntities.add(user);
        });
        return duplicateEntities;
    }

    @Override
    public String delete(UUID userId) throws UserException {
        try {
            UserEntity user = getUserEntity(userId);
            if (!userRepo.existsById(user.getUserEmail())) {
                throw new UserException("The user " + user.getUserEmail() + " does not exists");
            } else {
                log.info("Cart deleting of user {}", userId);
                cartService.deleteAllCartItemsOfUser(userId);
                log.info("Cart deletedof user {}", userId);
                log.info("fav deletingof user {}", userId);
                favService.deleteAllCartItemsOfUser(userId);
                log.info("fav deleted of user {}", userId);
                log.info("Bot deleting of user {}", userId);
                botService.listClear(userId);
                log.info("Orders deleting of user {}", userId);
                orderService.deleteAllOrdersofUser(userId);
                log.info("Review deleting of user {}", userId);
                itemReviewService.deleteAllReviews();
                log.info("Address deleting of user {}", userId);
                addressService.deleteAlladdressOfUser(userId);
                log.info("User data deleting of user {}", userId);
                userRepo.deleteById(user.getUserEmail());
                log.info("User deleted of user {}", userId);
                return "The profile has been deleted with email " + user.getUserEmail();
            }
        } catch (UserException e) {
            log.error(e.getMessage());
        }
        return "The profile with " + userId + " does not exists";
    }

    @Override
    public String update(UserEntity userEntity) throws UserException {
        userEntity.setUserEmail(Objects.isNull(decrypt(userEntity.getUserEmail())) ? encrypt(userEntity.getUserEmail())
                : userEntity.getUserEmail());
        try {
            if (!(userRepo.existsById(userEntity.getUserName()) || userRepo.existsById(userEntity.getUserEmail()))) {
                throw new UserException("The user " + userEntity.getUserEmail() + " does not exists");
            } else {
                UserEntity presentUserEntity = getUserEntity(userEntity.getUserId());
                if (Objects.isNull(userEntity.getUserPassword())) {
                    userEntity.setUserPassword(presentUserEntity.getUserPassword());
                } else {
                    userEntity.setUserPassword(Objects.isNull(decrypt(userEntity.getUserPassword())) ? encrypt(userEntity.getUserPassword())
                            : userEntity.getUserPassword());
                }
                userRepo.save(userEntity);
                if (userEntity.isAdmin()) adminService.addAdmin(userEntity);
                return "You are profile has been updated with " + userEntity.getUserName();
            }
        } catch (UserException e) {
            log.error(e.getMessage());
        }
        return "The user with email  " + userEntity.getUserEmail() + " does not exists";
    }

    @Override
    public boolean check(String userEmail, String password) throws UserException {
        userEmail = encrypt(userEmail);
        password = encrypt(password);
        UserEntity user = new UserEntity();
        if (userRepo.existsById(userEmail)) {
            user = userRepo.findById(userEmail).get();
            if (user.getUserPassword().equals(password)) {
                user.setLoggedIn(true);
                update(user);
                return true;
            }
        }
        return false;
    }

    @Override
    public boolean checkIsAdmin(UUID userId) throws UserException {
        if (Objects.nonNull(userId)) {
            return getUserEntity(userId).isAdmin();
        }
        return false;
    }

    private void sendMailAfterSuccessfulSignUp(String decryptedEmail, String userName){
        try {
            emailService.sendSimplemail(EmailDto.builder().recipient(decryptedEmail).subject("Shopping mart")
                    .msgBody("Hello " + userName + ",\n" + "\t You are just signed up with shopping application hoping you will enjoy the services and products of Shopping mart " +
                            "application and we will have a great days further with us." +
                            "\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tThank you" +
                            "\n\t\t\t-----------------Shopping Mart-----------------")
                    .build());
        }catch (Exception e){
            log.error(e.getMessage());
            throw e;
        }
    }

    @Override
    public String sendOtpToUserEmail(String userEmail, String userName) {
        try {
            if (Objects.nonNull(userEmail) && Objects.nonNull(userName) && userRepo.existsById(encrypt(userName)) || userRepo.existsById(encrypt(userEmail))) {
                throw new UserException("You have already created account with us by mail "
                        + userEmail + " go to login and enjoy shopping with us !");
            } else {
                try {
                    if (StringUtils.hasLength(userEmail)) {
                        String otp = generateSixDigitOtp();
                        var checkToSend = otpService.addOtp(userEmail, otp);
                        if (!checkToSend.contains("failed")) {
                            emailService.sendSimplemail(EmailDto.builder().recipient(userEmail).msgBody("Hi " + userName.toUpperCase() + ",\n" +
                                    "\tThe six digit OTP for to signup in shopping mart is '" + otp + "' is valid for 10 minutes.").subject("Shopping mart").build());
                            return checkToSend;
                        }
                    }
                } catch (Exception e) {
                    log.error(e.getMessage());
                    throw e;
                }
                return "OTP sending failed";
            }
        } catch (Exception e) {
            log.error(e.getMessage());
            return e.getMessage();
        }
    }

    @Override
    public String verifyEmailOtpOfUser(String userEmail, String otp) {
        try {
            if (Objects.nonNull(userEmail) && StringUtils.hasLength(userEmail)) {
                return otpService.verifyOtp(userEmail, otp);
            }
        } catch (Exception e) {
            log.error(e.getMessage());
        }
        return "Verification failed";
    }

    private String generateSixDigitOtp() {
        return String.valueOf(new Random().nextInt(900000) + 100000);
    }

    private UserDetailDto mappingToUserDetailDto(UserEntity entity) {
        UserDetailDto detailDto = new UserDetailDto();
        detailDto.setUserEmail(decrypt(entity.getUserEmail()));
        detailDto.setUserId(entity.getUserId());
        detailDto.setUserName(entity.getUserName());
        detailDto.setMobileNumber(entity.getMobileNumber());
        detailDto.setProfileImgUrl(entity.getProfileImgUrl());
        detailDto.setLoggedIn(entity.isLoggedIn());
        detailDto.setAdmin(entity.isAdmin());
        detailDto.setTotalOrdersCountOfUser(getOrdersCountofUser(entity.getUserId()));
        return detailDto;
    }

    private int getOrdersCountofUser(UUID userId) {
        return orderService.getAllOrders().stream().filter(a -> a.getUserId().equals(userId))
                .toList().size();
    }

    private UserEntity getUserEntity(UUID userId) throws UserException {
        return findall().stream().filter(a -> a.getUserId().equals(userId)).findFirst()
                .orElseThrow(() -> new UserException("Not present"));
    }
    
}
