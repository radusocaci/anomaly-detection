package ro.tuc.ds2020.config.jwt;

import io.jsonwebtoken.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import ro.tuc.ds2020.entities.security.UserDetailsImpl;

import java.util.Date;

@Component
public final class JwtUtils {

    @Value("${medical-system.app.jwtSecret}")
    private String jwtSecret;

    @Value("${medical-system.app.jwtExpirationMs}")
    private int jwtExpirationMs;

    public String generateJwtToken(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        return Jwts.builder()
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
                .signWith(SignatureAlgorithm.HS512, jwtSecret)
                .compact();
    }

    public String getUserNameFromJwtToken(String token) {
        return Jwts.parser()
                .setSigningKey(jwtSecret)
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parser()
                    .setSigningKey(jwtSecret)
                    .parseClaimsJws(authToken);

            return true;
        } catch (SignatureException e) {
            System.err.printf("Invalid JWT signature: %s", e.getMessage());
        } catch (MalformedJwtException e) {
            System.err.printf("Invalid JWT token: %s", e.getMessage());
        } catch (ExpiredJwtException e) {
            System.err.printf("JWT token is expired: %s", e.getMessage());
        } catch (UnsupportedJwtException e) {
            System.err.printf("JWT token is unsupported: %s", e.getMessage());
        } catch (IllegalArgumentException e) {
            System.err.printf("JWT claims string is empty: %s", e.getMessage());
        }

        return false;
    }
}
