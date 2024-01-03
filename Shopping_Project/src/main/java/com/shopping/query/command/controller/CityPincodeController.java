package com.shopping.query.command.controller;

import com.shopping.query.command.entites.CityAndPincode;
import com.shopping.query.command.exceptions.AddressNotFoundException;
import com.shopping.query.command.service.CityPincodeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/city-pincode")
public class CityPincodeController {

     @Autowired
     private CityPincodeService pincodeService;

     @GetMapping("/state-name")
     public ResponseEntity<List<String>>  getAllStateNames(){
          return ResponseEntity.ok(pincodeService.getAllStateNames());
     }
     @GetMapping("/district-name")
     public ResponseEntity<List<String>>  getAllDistrictsByStateName(@RequestParam("statename") String stateName){
          return ResponseEntity.ok(pincodeService.getAllDistrictsByStateName(stateName));
     }
     @GetMapping("/office-name")
     public ResponseEntity< List<CityAndPincode>>  getAllOfficeNamesByDistrictName(@RequestParam("district") String districtName){
          return ResponseEntity.ok(pincodeService.getAllOfficeNamesByDistrictName(districtName));
     }

     @GetMapping("/uuid/{uuid}")
     public ResponseEntity< CityAndPincode>  findByUuid(@PathVariable("uuid") UUID uuid) throws AddressNotFoundException {
          return ResponseEntity.ok(pincodeService.findByUuid(uuid));
     }

     @GetMapping("get-string/{uuid}")
     public ResponseEntity< String>  getDeliveryAddressAsStringWithId(@PathVariable("uuid") UUID uuid) throws AddressNotFoundException {
          return ResponseEntity.ok(pincodeService.getDeliveryAddressAsStringWithId(uuid));
     }
     @GetMapping
     public ResponseEntity<List<CityAndPincode>> getAll(@RequestParam(value = "page",defaultValue = "1") int page, @RequestParam(value = "size", defaultValue = "50") int size){
          return ResponseEntity.ok(pincodeService.getAll(page, size));
     }
}
