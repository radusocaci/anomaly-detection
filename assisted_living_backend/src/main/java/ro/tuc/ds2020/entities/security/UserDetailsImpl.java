package ro.tuc.ds2020.entities.security;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import ro.tuc.ds2020.entities.Users;
import ro.tuc.ds2020.entities.util.Gender;
import ro.tuc.ds2020.entities.util.UserType;

import java.util.Collection;
import java.util.Date;
import java.util.List;

import static java.util.Collections.singletonList;

@AllArgsConstructor
@EqualsAndHashCode
@Getter
public final class UserDetailsImpl implements UserDetails {

    private static final long serialVersionUID = 1L;

    private final String username;

    @JsonIgnore
    private final String password;

    private final String name;

    private final UserType userType;

    private final Date birthDate;

    private final Gender gender;

    private final String address;

    private final Collection<? extends GrantedAuthority> authorities;

    public static UserDetailsImpl build(final Users user) {
        List<GrantedAuthority> authorityList =
                singletonList(new SimpleGrantedAuthority("ROLE_" + user.getType().getType().toUpperCase()));

        return new UserDetailsImpl(user.getUsername(),
                user.getPassword(),
                user.getName(),
                user.getType(),
                user.getBirthDate(),
                user.getGender(),
                user.getAddress(),
                authorityList);
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
