package com.shopping.query.command.service;

public interface OtpService {

    String addOtp(String userId, String otp);

    String verifyOtp(String userId, String otp);

}
