package edu.sliit.controller;

import edu.sliit.dto.response.UserResponseDTO;
import edu.sliit.service.UserService;
import edu.sliit.service.monitoring.ActivityLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import edu.sliit.dto.request.UpdateUserRequestDTO;
import edu.sliit.dto.request.ChangePasswordRequestDTO;
import edu.sliit.dto.request.CreateUserRequestDTO;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    private final UserService userService;
    private final ActivityLogService activityLogService;

    @PostMapping
    public ResponseEntity<UserResponseDTO> createUser(
            @RequestBody CreateUserRequestDTO request) {

        UserResponseDTO response = userService.createUser(request);

        activityLogService.log(
                getCurrentUserEmail(),
                "CREATE_USER",
                "Created user: " + response.getEmail(),
                "INFO"
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // Get all users
    @GetMapping
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // Get user by ID
    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO> getUserById(
            @PathVariable Integer id) {

        return ResponseEntity.ok(userService.getUserById(id));
    }

    // Update user
    @PutMapping("/{id}")
    public ResponseEntity<UserResponseDTO> updateUser(
            @PathVariable Integer id,
            @RequestBody UpdateUserRequestDTO request) {

        UserResponseDTO response = userService.updateUser(id, request);

        activityLogService.log(
                getCurrentUserEmail(),
                "UPDATE_USER",
                "Updated user: " + response.getEmail(),
                "INFO"
        );

        return ResponseEntity.ok(response);
    }

    // Change password
    @PutMapping("/{id}/password")
    public ResponseEntity<String> changePassword(
            @PathVariable Integer id,
            @RequestBody ChangePasswordRequestDTO request) {

        userService.changePassword(id, request);

        activityLogService.log(
                getCurrentUserEmail(),
                "CHANGE_PASSWORD",
                "Changed password for user ID: " + id,
                "SECURITY"
        );

        return ResponseEntity.ok("Password changed successfully");
    }

    // Delete user
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(
            @PathVariable Integer id) {

        userService.deleteUser(id);

        activityLogService.log(
                getCurrentUserEmail(),
                "DELETE_USER",
                "Deleted user ID: " + id,
                "SECURITY"
        );

        return ResponseEntity.ok("User deleted successfully");
    }

    private String getCurrentUserEmail() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.isAuthenticated()) {
            return authentication.getName();
        }

        return "SYSTEM";
    }
}