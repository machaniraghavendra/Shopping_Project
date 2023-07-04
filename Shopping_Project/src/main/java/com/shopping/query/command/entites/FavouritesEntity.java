package com.shopping.query.command.entites;

import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
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
@Table(name = "FavouritesDetails")
public class FavouritesEntity {

    @Id
    @GeneratedValue (strategy = GenerationType.AUTO)
    private int favId;
    private int ItemId;
    private UUID userId;
    
}
