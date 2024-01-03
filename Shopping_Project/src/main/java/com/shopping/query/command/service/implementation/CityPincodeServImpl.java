package com.shopping.query.command.service.implementation;

import com.shopping.query.command.entites.CityAndPincode;
import com.shopping.query.command.exceptions.AddressNotFoundException;
import com.shopping.query.command.repos.CityPincodeRepo;
import com.shopping.query.command.service.CityPincodeService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@Slf4j
public class CityPincodeServImpl implements CityPincodeService {

     @Autowired
     private CityPincodeRepo cityPincodeRepo;

     @Override
     public List<String> getAllStateNames() {
          try {
               var list = cityPincodeRepo.findAllBYDistinct();
               Set<String> allNames = new TreeSet<>();
               for (String state : list) {
                    allNames.add(state.toUpperCase());
               }
               return allNames.stream().toList();
          } catch (Exception e) {
               log.error(e.getMessage());
               return Collections.emptyList();
          }
     }

     @Override
     public List<String> getAllDistrictsByStateName(String stateName) {
          try {
               var list = cityPincodeRepo.findAllDistrictsByStateName(stateName.toLowerCase());
               Set<String> allNames = new TreeSet<>();
               for (String state : list) {
                    allNames.add(state.toUpperCase());
               }
               return allNames.stream().toList();
          } catch (Exception e) {
               log.error(e.getMessage());
               return Collections.emptyList();
          }
     }

     @Override
     public List<CityAndPincode> getAllOfficeNamesByDistrictName(String districtName) {
          try {
               var officeAndPincodes = cityPincodeRepo.findAllOfficesByDistrictName(districtName.toLowerCase());
               return new HashSet<>(officeAndPincodes).stream()
                    .sorted(Comparator.comparing(CityAndPincode::getOfficeName)).toList();
          } catch (Exception e) {
               log.error(e.getMessage());
               return Collections.emptyList();
          }
     }

     @Override
     public CityAndPincode findByUuid(UUID uuid) throws AddressNotFoundException {
          return cityPincodeRepo.findById(uuid).orElseThrow(() -> new AddressNotFoundException("There is no address with id " + uuid));
     }

     @Override
     public String getDeliveryAddressAsStringWithId(UUID id) {
          try {
               CityAndPincode cityAndPincode = findByUuid(id);
               return cityAndPincode.getOfficeName() + ", " + cityAndPincode.getDistrict() + ", " + cityAndPincode.getStateName() + "-" + cityAndPincode.getPincode();
          } catch (Exception e) {
               log.error(e.getMessage());
               return null;
          }
     }

     @Override
     public List<CityAndPincode> getAll(final Integer page, final Integer size) {
          Pageable pageable = PageRequest.of(page, size);
          return cityPincodeRepo.findAll(pageable).stream().toList();
     }
}
