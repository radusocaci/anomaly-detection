package ro.tuc.ds2020.controllers;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import ro.tuc.ds2020.dtos.LoginResponseDto;
import ro.tuc.ds2020.dtos.UserLoginDto;
import ro.tuc.ds2020.services.UserService;

import javax.validation.Valid;

@RestController
@CrossOrigin
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("login")
    public LoginResponseDto login(@Valid @RequestBody final UserLoginDto userLoginDto) {
        return userService.login(userLoginDto);
    }
}