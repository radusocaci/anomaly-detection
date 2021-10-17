package ro.tuc.ds2020.services.security;

import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ro.tuc.ds2020.controllers.handlers.exceptions.model.UserNotFoundException;
import ro.tuc.ds2020.entities.Users;
import ro.tuc.ds2020.entities.security.UserDetailsImpl;
import ro.tuc.ds2020.repositories.UsersRepository;

@Service
@AllArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UsersRepository usersRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        final Users user = usersRepository.findByUsername(username)
                .orElseThrow(UserNotFoundException::new);

        return UserDetailsImpl.build(user);
    }
}
