package com.shopping.query.command.service.implementation;

import com.shopping.query.command.entites.OtpEntity;
import com.shopping.query.command.repos.OtpRepository;
import com.shopping.query.command.service.OtpService;
import jakarta.validation.constraints.NotNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.Objects;

@Service
@Slf4j
public class OtpServiceImpl implements OtpService {

    @Autowired
    private OtpRepository otpRepository;

    @Override
    public String addOtp(@NotNull String userId, @NotNull String otp) {
        var otpEntity = getOtpWithUser(userId);
        if (Objects.isNull(otpEntity)) {
            saveOtp(userId, otp);
            return "OTP sent to "+userId;
        } else {
            Instant whenTried = otpEntity.getOtpGeneratedOn();
            if ((int) (Math.abs(ChronoUnit.MINUTES.between(whenTried, new Date().toInstant()))) > 10||Objects.isNull(otpEntity.getOtp())) {
                updateOtp(otpEntity.getId(), otpEntity.getUserId(), otp);
                return "Old OTP expired and again new OTP sent to "+userId;
            }
        }
        return "OTP sending failed";
    }

    @Override
    public String verifyOtp(@NotNull String userId, String otp) {
        var otpEntity = getOtpWithUser(userId);
        if (Objects.nonNull(otpEntity) && Objects.nonNull(otpEntity.getOtp()) && otpEntity.getOtp().equals(otp)) {
            Instant whenTried = otpEntity.getOtpGeneratedOn();
            if ((int) (Math.abs(ChronoUnit.MINUTES.between(whenTried, new Date().toInstant()))) < 10) {
                return "OTP is valid";
            } else {
                updateOtp(otpEntity.getId(), userId, null);
                return "The OTP is expired and try to regenerate";
            }
        } else{
            return "OTP not matched";
        }
    }

    private void updateOtp(int id, String userId, String otp) {
        otpRepository.save(OtpEntity.builder().id(id).otp(otp).userId(userId).build());
    }

    private void saveOtp(String userId, String otp) {
        otpRepository.save(OtpEntity.builder().otp(otp).userId(userId).build());
    }

    private OtpEntity getOtpWithUser(String userId) {
        return otpRepository.findByUserId(userId);
    }
}
