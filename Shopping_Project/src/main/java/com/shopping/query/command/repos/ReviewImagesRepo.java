package com.shopping.query.command.repos;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.shopping.query.command.entites.ReviewImages;

@Repository
public interface ReviewImagesRepo extends JpaRepository<ReviewImages, UUID>{

}
