package com.shopping.query.command.repos;

import com.shopping.query.command.entites.CityAndPincode;
import com.shopping.query.command.entites.dto.CityPincodeDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CityPincodeRepo extends JpaRepository<CityAndPincode, UUID> {

     @Query(value = "SELECT DISTINCT STATE_NAME FROM CITY_PINCODE ORDER BY STATE_NAME ASC", nativeQuery = true)
     List<String> findAllBYDistinct();

     @Query(value = "SELECT DISTINCT DISTRICT FROM CITY_PINCODE where LOWER(STATE_NAME) = ?1 ORDER BY DISTRICT ASC", nativeQuery = true)
     List<String> findAllDistrictsByStateName(String stateName);

     @Query(value = "SELECT DISTINCT * FROM CITY_PINCODE where LOWER(DISTRICT) = ?1 AND DELIVERY = true ORDER BY OFFICE_NAME ASC", nativeQuery = true)
     List<CityAndPincode> findAllOfficesByDistrictName(String districtName);
}
