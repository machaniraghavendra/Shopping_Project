package com.shopping.query.command.entites;

import java.util.UUID;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.ToString;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.envers.Audited;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import org.hibernate.envers.RelationTargetAuditMode;

import java.io.IOException;

@Data
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "Orders")
@Audited(withModifiedFlag = true)
@Slf4j
public class OrdersEntity {

     @PrePersist
     void prePersist() {
          if (orderPlacedLocation == null) orderPlacedLocation = getCurrentLocation();
     }

     @Id
     @GeneratedValue(strategy = GenerationType.SEQUENCE)
     private Integer orderId;
     @NonNull
     private UUID userId;
     @NonNull
     private Integer itemId;
     @NonNull
     private String firstName;
     @NonNull
     private String pincode;
     @NonNull
     private UUID deliveryAddress;
     private String lastName;
     private String emailAddress;
     private String phoneNumber;
     private String paymentType;
     private String orderedOn;
     private String orderedAt;
     private Integer orderQuantity;
     private String deliveryDate;
     private String orderStatus;
     @Column(columnDefinition = "binary(16)")
     private UUID orderUUIDId;
     private String totalOrderAmount;
     @Lob
     @Column(columnDefinition = "TEXT", name = "ORDER_PLACED_LOCATION")
     @Audited(targetAuditMode = RelationTargetAuditMode.NOT_AUDITED)
     private String orderPlacedLocation;

     private static String getCurrentLocation() {
          final String API_URL = "https://ipinfo.io/json";
          OkHttpClient client = new OkHttpClient();
          Request request = new Request.Builder()
               .url(API_URL)
               .build();
          try (Response response = client.newCall(request).execute()) {
               if (!response.isSuccessful()) {
                    throw new IOException("Unexpected code " + response);
               }
               return response.body().string();
          } catch (IOException e) {
               log.error(e.getMessage());
               return null;
          }
     }
}
