package com.shopping.query.command.entites;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class FavouritesEntity {

    @Id
    private int favId;
    private int ItemId;
    private String ItemType;
    private String itemName;
    private String ItemImgUrl;
    private String ItemPrice;
    private String ItemDesc;
    private String ItemSpec;
    private String ItemDimensions;
    private String userId;
    
}
