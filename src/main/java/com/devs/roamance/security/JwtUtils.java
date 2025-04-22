package com.devs.roamance.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import java.security.Key;
import java.util.Date;
import java.util.List;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

@Component
public class JwtUtils {

  @Value("${application.security.jwt.secret}")
  private String jwtSecret;

  @Value("${application.security.jwt.access-token-expiration}")
  private int accessTokenExpiration;

  @Value("${application.security.jwt.refresh-token-expiration}")
  private int refreshTokenExpiration;

  private Key key() {

    return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
  }

  public String generateAccessToken(Authentication authentication) {

    return generateToken(authentication, accessTokenExpiration, "access");
  }

  public String generateRefreshToken(Authentication authentication) {

    return generateToken(authentication, refreshTokenExpiration, "refresh");
  }

  private String generateToken(Authentication authentication, int expiresIn, String tokenType) {

    return Jwts.builder()
        .subject(authentication.getName())
        .issuer("roamance.com")
        .claim("type", tokenType)
        .claim(
            "roles",
            authentication.getAuthorities().stream().map(GrantedAuthority::getAuthority).toList())
        .issuedAt(new Date())
        .expiration(new Date((new Date()).getTime() + expiresIn))
        .signWith(key())
        .compact();
  }

  public String getTokenFromHeader(String header) {

    if (header != null && header.startsWith("Bearer ")) {

      return header.substring(7);
    }

    return null;
  }

  public void validateToken(String token) {

    Jwts.parser().verifyWith((SecretKey) key()).build().parseSignedClaims(token);
  }

  public String getEmailFromToken(String token) {

    return getTokenPayload(token).getSubject();
  }

  public String getTokenType(String token) {

    return getTokenPayload(token).get("type", String.class);
  }

  @SuppressWarnings("unchecked")
  public List<String> getRolesFromToken(String token) {

    return getTokenPayload(token).get("roles", List.class);
  }

  private Claims getTokenPayload(String token) {

    return Jwts.parser()
        .verifyWith((SecretKey) key())
        .build()
        .parseSignedClaims(token)
        .getPayload();
  }
}
