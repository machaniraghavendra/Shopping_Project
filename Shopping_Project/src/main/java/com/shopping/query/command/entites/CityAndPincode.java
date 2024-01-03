package com.shopping.query.command.entites;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Table(name = "CITY_PINCODE")
public class CityAndPincode {

     @Id
     @GeneratedValue
     private UUID uuid;
     @Column(name = "CIRCLE_NAME")
     private String circleName;
     @Column(name = "REGION_NAME")
     private String regionName;
     @Column(name = "DIVISION_NAME")
     private String divisionName;
     @Column(name = "OFFICE_NAME")
     private String officeName;
     @Column(name = "STATE_NAME")
     private String stateName;
     @Column(name = "DISTRICT")
     private String district;
     @Column(name = "PINCODE")
     private Integer pincode;
     @Column(name = "OFFICE_TYPE")
     private String officeType;
     @Column(name = "DELIVERY")
     private boolean delivery;
}
