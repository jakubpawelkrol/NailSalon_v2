package com.krol.nail.salon.services.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.AeadAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.*;
import java.util.function.Function;

@Component
public class JwtUtil {

    @Value("${jwt.secret:defaultSecretThatShouldBeLongerThan32Characters}")
    private String jwtSecret;

    @Value("${jwt.expiration:86400000}")
    private Long jwtExpiration;

    @Value("${jwt.issuer:paz.krol.info}")
    private String issuer;

    @Value("${jwt.audience:nail-salon-app}")
    private String audience;

    private final RateLimitingFilter rateLimitingFilter;

    public JwtUtil(RateLimitingFilter rateLimitingFilter) {
        this.rateLimitingFilter = rateLimitingFilter;
    }

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        return claimsResolver.apply(getClaimsFromToken(token));
    }

    private Claims getClaimsFromToken(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public String generateToken(UserDetails user) {
        Map<String, Object> claims = new HashMap<>();

        claims.put("authorities", user.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .toList());
        claims.put("tokenType", "access");

        claims.put("myClaim", List.of("something", "other_val"));
        return createToken(claims, user.getUsername());
    }

    private String createToken(Map<String, Object> claims, String subject) {
        Date now = new Date();
        return Jwts.builder()
                .claims(claims)
                .subject(subject)
                .issuer(issuer)
                .audience().add(audience).and()
                .notBefore(now)
                .id(UUID.randomUUID().toString())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(getSigningKey())
                .compact();
    }

    public Boolean validateToken(String token, UserDetails user) {
        return (extractUsername(token).equals(user.getUsername()) && !isTokenExpired(token)
                && isNotBeforeValid(token) && isIssuerValid(token) && !isTokenBlacklisted(token)
        && isAudienceValid(token));
    }

    private Boolean isNotBeforeValid(String token) {
        try {
            Date notBefore = extractClaim(token, Claims::getNotBefore);
            return notBefore == null || !notBefore.after(new Date());
        } catch (Exception e) {
            return false;
        }
    }

    private Boolean isIssuerValid(String token) {
        try {
            String iss = extractClaim(token, Claims::getIssuer);
            return issuer.equals(iss);
        } catch (Exception e) {
            return false;
        }
    }

    private Boolean isAudienceValid(String token) {
        try {
            Set<String> audset = extractClaim(token, Claims::getAudience);
            for(String aud : audset) {
                if(aud.equals(audience)) return true;
            }
            return false;
        } catch (Exception e) {
            return false;
        }
    }

    private Boolean isTokenBlacklisted(String token) {
        // TODO: Implement token blacklisting (DB / Redis)
        return false;
    }
}
