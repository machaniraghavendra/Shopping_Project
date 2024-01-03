package com.shopping.query.command.repos;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shopping.query.command.entites.AddressEntity;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface AddressRepo extends JpaRepository<AddressEntity, Integer>{

    @Query(value = "SELECT * FROM ADDRESS_DETAILS ad" +
            " WHERE ad.USER_ID = ?1 " +
            "AND ad.DELIVERY_ADDRESS =?2", nativeQuery = true)
    AddressEntity getAddressWithUserIdandAddress(UUID userId, String address);


     AddressEntity findByReferenceId(UUID referenceId);
}
