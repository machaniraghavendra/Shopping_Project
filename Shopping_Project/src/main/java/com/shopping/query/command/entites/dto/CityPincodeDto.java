package com.shopping.query.command.entites.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class CityPincodeDto {
     private String circleName;
     private String regionName;
     private String divisionName;
     private String officeName;
     private String stateName;
     private String district;
     private Integer pincode;
     private String officeType;
     private boolean delivery;
}
