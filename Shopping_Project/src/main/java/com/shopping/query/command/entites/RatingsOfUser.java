package com.shopping.query.command.entites;

import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@ToString
@Builder
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = RatingsOfUser.TABLE_NAME)
public class RatingsOfUser {

	protected final static String TABLE_NAME="Rating_Of_User";
	
	@Id
	private UUID ratingId;
	private int itemId;
	private UUID userId;
	private int rating;
	
}
