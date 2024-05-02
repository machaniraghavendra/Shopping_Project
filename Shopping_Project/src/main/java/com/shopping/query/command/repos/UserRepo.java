package com.shopping.query.command.repos;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
//import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Repository;

import com.shopping.query.command.entites.UserEntity;

@Repository
public interface UserRepo extends JpaRepository<UserEntity, String> {

	@Query(value = "SELECT * FROM user_story us  where us.user_id = @id", nativeQuery = true)
	UserEntity getuserWithId(@Param("id") UUID id);

//     Optional<UserEntity> findByUserEmail(String userName);
}
