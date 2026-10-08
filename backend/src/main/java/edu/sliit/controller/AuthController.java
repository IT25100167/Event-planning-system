package edu.sliit.controller;

import edu.sliit.dto.request.LoginRequestDTO;
import edu.sliit.dto.response.LoginResponseDTO;
import jakarta.validation.Valid;
import edu.sliit.dto.request.RegisterRequestDTO;
import edu.sliit.dto.response.UserResponseDTO;
import edu.sliit.service.UserService;
import edu.sliit.service.monitoring.ActivityLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class AuthController {

    private final UserService userService;
    private final ActivityLogService activityLogService;

    @PostMapping("/register")
    public ResponseEntity<UserResponseDTO> register(
            @Valid @RequestBody RegisterRequestDTO request) {

        UserResponseDTO response = userService.register(request);

        activityLogService.log(
                response.getEmail(),
                "REGISTER",
                "New user registered",
                "INFO"
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(
            @RequestBody LoginRequestDTO request) {

        LoginResponseDTO response = userService.login(request);

        activityLogService.log(
                response.getEmail(),
                "LOGIN",
                "User logged into the system",
                "INFO"
        );

        return ResponseEntity.ok(response);
    }
}