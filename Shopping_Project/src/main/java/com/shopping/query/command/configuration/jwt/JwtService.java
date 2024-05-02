package com.shopping.query.command.configuration.jwt;

//import io.jsonwebtoken.Claims;
//import io.jsonwebtoken.Jwts;
//import io.jsonwebtoken.SignatureAlgorithm;
//import io.jsonwebtoken.io.Decoders;
//import io.jsonwebtoken.security.Keys;
//import lombok.RequiredArgsConstructor;
//import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
//@RequiredArgsConstructor
public class JwtService {
//     private static final String SECRET_KEY = "7aa1c7bbd3bbb39f8f965b6a549d87d1179b8ddb95965a205c323e84c8eaf093";
//     public String extractUserName(String token) {
//          return extractClaim(token, Claims::getSubject);
//     }
//
//     public boolean isValidToken(String token, UserDetails userDetails){
//          String userEmail = extractUserName(token);
//          return (userEmail.equals(userDetails.getUsername()) && !isTokenExpired(token));
//     }
//
//     private boolean isTokenExpired(String token) {
//          return extractExpiration(token).before(new Date());
//     }
//
//     private Date extractExpiration(String token) {
//          return extractClaim(token, Claims::getExpiration);
//     }
//
//     public String generateToken(UserDetails userDetails){
//          return generateToken(new HashMap<>(), userDetails);
//     }
//     public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails){
//          return Jwts.builder().setClaims(extraClaims).setSubject(userDetails.getUsername()).setIssuedAt(new Date(System.currentTimeMillis()))
//               .setExpiration(new Date(System.currentTimeMillis()+1000*60*60)).signWith(getSigningKey(), SignatureAlgorithm.HS256).compact();
//     }
//
//     public <T> T extractClaim(String token, Function<Claims, T> claimsResolver){
//          Claims claims = extractAllClaims(token);
//          return claimsResolver.apply(claims);
//     }
//
//     public Claims extractAllClaims(String token){
//          return Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(token).getBody();
//     }
//
//     private Key getSigningKey() {
//          byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
//          return Keys.hmacShaKeyFor(keyBytes);
//     }
//
//     public String createSecretKey() {
//          SecureRandom secureRandom = new SecureRandom();
//          byte[] secretBytes = new byte[36]; //36*8=288 (>256 bits required for HS256)
//          secureRandom.nextBytes(secretBytes);
//          Base64.Encoder encoder = Base64.getUrlEncoder().withoutPadding();
//          return encoder.encodeToString(secretBytes);
//     }
}
