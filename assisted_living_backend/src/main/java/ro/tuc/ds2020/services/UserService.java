package ro.tuc.ds2020.services;

import lombok.AllArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import ro.tuc.ds2020.config.jwt.JwtUtils;
import ro.tuc.ds2020.dtos.LoginResponseDto;
import ro.tuc.ds2020.dtos.UserLoginDto;
import ro.tuc.ds2020.entities.security.UserDetailsImpl;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public final class UserService {

    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    public LoginResponseDto login(final UserLoginDto userLoginRequestDto) {

        final Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(userLoginRequestDto.getUsername(), userLoginRequestDto.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        final String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        return LoginResponseDto.builder()
                .token(jwt)
                .type(userDetails.getUserType())
                .address(userDetails.getAddress())
                .birthDate(userDetails.getBirthDate())
                .gender(userDetails.getGender())
                .name(userDetails.getName())
                .username(userDetails.getUsername())
                .build();
    }
}