package com.shopping.query.command.entites;

import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Entity
public class ReviewImages {

	@Id
	private UUID imageId;
	@Column(length = 4300000)
	private String imageUrl;
	private int itemId;
	private UUID reviewId;
	
}
