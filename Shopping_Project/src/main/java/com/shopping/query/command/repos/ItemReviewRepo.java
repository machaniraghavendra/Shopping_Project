package com.shopping.query.command.repos;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.shopping.query.command.entites.ItemReview;

@Repository
public interface ItemReviewRepo extends JpaRepository<ItemReview, UUID>{

}
