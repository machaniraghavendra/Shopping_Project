package com.shopping.query.command.service;

import com.shopping.query.command.entites.CityAndPincode;
import com.shopping.query.command.exceptions.AddressNotFoundException;

import java.util.List;
import java.util.UUID;

public interface CityPincodeService {

     List<String> getAllStateNames();
     List<String> getAllDistrictsByStateName(String stateName);
     List<CityAndPincode> getAllOfficeNamesByDistrictName(String districtName);
     CityAndPincode findByUuid(UUID uuid) throws AddressNotFoundException;
     String getDeliveryAddressAsStringWithId(UUID id);
     List<CityAndPincode> getAll(final Integer page, final Integer size);
}
