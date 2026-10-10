package edu.sliit.service.impl;

import edu.sliit.dto.request.CreateUserRequestDTO;
import edu.sliit.dto.request.LoginRequestDTO;
import edu.sliit.dto.request.RegisterRequestDTO;
import edu.sliit.dto.response.LoginResponseDTO;
import edu.sliit.dto.response.UserResponseDTO;
import edu.sliit.entity.Role;
import edu.sliit.entity.UserEntity;
import edu.sliit.exception.EmailAlreadyExistsException;
import edu.sliit.exception.InvalidCredentialsException;
import edu.sliit.exception.ValidationException;
import edu.sliit.repository.UserRepository;
import edu.sliit.repository.EventRepository;
import edu.sliit.service.UserService;
import edu.sliit.util.ValidationUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import edu.sliit.dto.request.UpdateUserRequestDTO;
import edu.sliit.dto.request.ChangePasswordRequestDTO;
import edu.sliit.security.JwtService;

import java.util.List;

@RequiredArgsConstructor
@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Override
    public UserResponseDTO register(RegisterRequestDTO request) {

        // ---- Validation checks
        if (request.getName() == null || request.getName().trim().isEmpty()) {
            throw new ValidationException("Name is required");
        }

        if (!ValidationUtil.isValidEmail(request.getEmail())) {
            throw new ValidationException("Invalid email format");
        }

        if (!ValidationUtil.isValidPassword(request.getPassword())) {
            throw new ValidationException("Password must be at least 6 characters");
        }

        if (request.getPhoneNum() != null && !request.getPhoneNum().isEmpty()
                && !ValidationUtil.isValidPhoneNumber(request.getPhoneNum())) {
            throw new ValidationException("Phone number must be exactly 10 digits");
        }



        // ---- Duplicate email check
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException(
                    "Email already registered: " + request.getEmail()
            );
        }

        // ---- Password encryption
        String encryptedPassword =
                passwordEncoder.encode(request.getPassword());

        // ---- Save entity
        UserEntity user = new UserEntity();

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(encryptedPassword);
        user.setPhoneNum(request.getPhoneNum());
        user.setRole(request.getRole() != null ? request.getRole() : Role.CUSTOMER);

        UserEntity savedUser = userRepository.save(user);

        return new UserResponseDTO(
                savedUser.getUserId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getPhoneNum(),
                savedUser.getRole()
        );
    }
    @Override
    public UserResponseDTO createUser(CreateUserRequestDTO request) {

        if (request.getName() == null || request.getName().trim().isEmpty()) {
            throw new ValidationException("Name is required");
        }

        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            throw new ValidationException("Email is required");
        }

        if (!ValidationUtil.isValidEmail(request.getEmail())) {
            throw new ValidationException("Invalid email format");
        }

        if (request.getPassword() == null || request.getPassword().length() < 6) {
            throw new ValidationException("Password must be at least 6 characters");
        }

        if (request.getPhoneNum() != null &&
                !request.getPhoneNum().trim().isEmpty() &&
                !ValidationUtil.isValidPhoneNumber(request.getPhoneNum())) {
            throw new ValidationException("Invalid phone number");
        }

        if (request.getRole() == null) {
            throw new ValidationException("Role is required");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException("Email already exists");
        }

        UserEntity user = new UserEntity();

        user.setName(request.getName().trim());
        user.setEmail(request.getEmail().trim());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhoneNum(request.getPhoneNum());
        user.setRole(request.getRole());

        UserEntity savedUser = userRepository.save(user);

        return new UserResponseDTO(
                savedUser.getUserId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getPhoneNum(),
                savedUser.getRole()
        );
    }
    // ================= LOGIN =================

    @Override
    public LoginResponseDTO login(LoginRequestDTO request) {

        if (!ValidationUtil.isValidEmail(request.getEmail())) {
            throw new ValidationException("Invalid email format");
        }

        if (request.getPassword() == null
                || request.getPassword().trim().isEmpty()) {

            throw new ValidationException("Password is required");
        }

        // Hard-coded admin credentials
        if ("admin@gmail.com".equals(request.getEmail()) && "admin123".equals(request.getPassword())) {
            String adminToken = jwtService.generateToken("admin@gmail.com");
            return new LoginResponseDTO(0, "Admin", "admin@gmail.com", null, Role.ADMIN, adminToken);
        }

        UserEntity user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new InvalidCredentialsException(
                                "Invalid email or password"
                        )
                );

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {

            throw new InvalidCredentialsException(
                    "Invalid email or password"
            );
        }

        // Generate JWT token
        String token = jwtService.generateToken(user.getEmail());

        return new LoginResponseDTO(
                user.getUserId(),
                user.getName(),
                user.getEmail(),
                user.getPhoneNum(),
                user.getRole(),
                token
        );
    }
    @Override
    public List<UserResponseDTO> getAllUsers() {

        List<UserEntity> users = userRepository.findAll();

        return users.stream()
                .map(user -> new UserResponseDTO(
                        user.getUserId(),
                        user.getName(),
                        user.getEmail(),
                        user.getPhoneNum(),
                        user.getRole()
                ))
                .toList();
    }

    @Override
    public UserResponseDTO getUserById(Integer id) {

        UserEntity user = userRepository.findById(id)
                .orElseThrow(() ->
                        new ValidationException("User not found with ID: " + id)
                );

        return new UserResponseDTO(
                user.getUserId(),
                user.getName(),
                user.getEmail(),
                user.getPhoneNum(),
                user.getRole()
        );
    }

    @Override
    public void deleteUser(Integer id) {

        if (!userRepository.existsById(id)) {
            throw new ValidationException(
                    "User not found with ID: " + id
            );
        }

        // Check if user is assigned to any events
        long eventCount = eventRepository.findByCoordinator_UserId(id).size();
        if (eventCount > 0) {
            throw new ValidationException(
                    "Cannot delete user: This user is assigned as coordinator to " + eventCount + " event(s). Please reassign or delete those events first."
            );
        }

        userRepository.deleteById(id);
    }
    @Override
    public void changePassword(
            Integer id,
            ChangePasswordRequestDTO request) {

        // Find user
        UserEntity user = userRepository.findById(id)
                .orElseThrow(() ->
                        new ValidationException(
                                "User not found with ID: " + id
                        )
                );

        // Validate new password
        if (!ValidationUtil.isValidPassword(request.getNewPassword())) {
            throw new ValidationException(
                    "New password must be at least 6 characters"
            );
        }

        // Encrypt new password
        String encryptedPassword =
                passwordEncoder.encode(request.getNewPassword());

        // Update password
        user.setPassword(encryptedPassword);

        // Save updated user
        userRepository.save(user);
    }
    @Override
    public UserResponseDTO updateUser(
            Integer id,
            UpdateUserRequestDTO request) {

        UserEntity user = userRepository.findById(id)
                .orElseThrow(() ->
                        new ValidationException(
                                "User not found with ID: " + id
                        )
                );

        // Update name
        if (request.getName() != null
                && !request.getName().trim().isEmpty()) {
            user.setName(request.getName().trim());
        }

        // Update email
        if (request.getEmail() != null
                && !request.getEmail().trim().isEmpty()) {

            if (!ValidationUtil.isValidEmail(request.getEmail())) {
                throw new ValidationException("Invalid email format");
            }

            String newEmail = request.getEmail().trim();

            // Check whether another user already uses this email
            if (!newEmail.equalsIgnoreCase(user.getEmail())
                    && userRepository.existsByEmail(newEmail)) {

                throw new EmailAlreadyExistsException(
                        "Email already registered: " + newEmail
                );
            }

            user.setEmail(newEmail);
        }

        // Update phone number
        if (request.getPhoneNum() != null
                && !request.getPhoneNum().trim().isEmpty()) {

            if (!ValidationUtil.isValidPhoneNumber(
                    request.getPhoneNum())) {

                throw new ValidationException(
                        "Phone number must be exactly 10 digits"
                );
            }

            user.setPhoneNum(request.getPhoneNum().trim());
        }

        // Update role
        if (request.getRole() != null) {
            user.setRole(request.getRole());
        }

        UserEntity updatedUser = userRepository.save(user);

        return new UserResponseDTO(
                updatedUser.getUserId(),
                updatedUser.getName(),
                updatedUser.getEmail(),
                updatedUser.getPhoneNum(),
                updatedUser.getRole()
        );
    }
}