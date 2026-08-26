package edu.sliit.service.impl;

import edu.sliit.dto.request.RegisterRequestDTO;
import edu.sliit.dto.response.UserResponseDTO;
import edu.sliit.entity.UserEntity;
import edu.sliit.exception.EmailAlreadyExistsException;
import edu.sliit.exception.ValidationException;
import edu.sliit.repository.UserRepository;
import edu.sliit.service.UserService;
import edu.sliit.util.ValidationUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

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

        if (request.getRole() == null) {
            throw new ValidationException("Role is required");
        }

        // ---- Duplicate email check ----
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException("Email already registered: " + request.getEmail());
        }

        // ---- Password encryption ----
        String encryptedPassword = passwordEncoder.encode(request.getPassword());

        // ---- Save entity ----
        UserEntity user = new UserEntity();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(encryptedPassword);
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
}