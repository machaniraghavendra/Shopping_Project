package com.shopping.query.command.repos;

import com.shopping.query.command.entites.OtpEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OtpRepository extends JpaRepository<OtpEntity, Integer> {

    OtpEntity findByUserId(String userId);
}
