package ro.tuc.ds2020.config.jwt;

import lombok.AllArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;
import ro.tuc.ds2020.services.security.UserDetailsServiceImpl;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Optional;

import static org.springframework.util.StringUtils.hasText;

@AllArgsConstructor
public final class AuthTokenFilter extends OncePerRequestFilter {

    private final JwtUtils jwtUtils;
    private final UserDetailsServiceImpl userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            final Optional<String> jwtOptional = parseJwt(request);

            if (jwtOptional.isPresent()) {
                final String authToken = jwtOptional.get();
                if (jwtUtils.validateJwtToken(authToken)) {
                    final String username = jwtUtils.getUserNameFromJwtToken(authToken);

                    final UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                    final UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            }
        } catch (Exception e) {
            System.err.println("Cannot set user authentication: " + e);
        }

        filterChain.doFilter(request, response);
    }

    private Optional<String> parseJwt(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");

        if (hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
            return Optional.of(headerAuth.substring(7));
        }

        return Optional.empty();
    }
}
