package com.devs.roamance.security;

import java.security.Key;
import java.util.Date;
import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

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
                .claim("type", tokenType)
                .issuer("roamance.com")
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

        return Jwts.parser()
                .verifyWith((SecretKey) key())
                .build().parseSignedClaims(token)
                .getPayload().getSubject();
    }

    public String getTokenType(String token) {

        return Jwts.parser()
                .verifyWith((SecretKey) key())
                .build().parseSignedClaims(token)
                .getPayload().get("type", String.class);
    }
}
