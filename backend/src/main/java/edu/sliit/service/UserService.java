package edu.sliit.service;

import edu.sliit.dto.request.LoginRequestDTO;
import edu.sliit.dto.request.RegisterRequestDTO;
import edu.sliit.dto.response.LoginResponseDTO;
import edu.sliit.dto.response.UserResponseDTO;
import edu.sliit.dto.request.UpdateUserRequestDTO;
import edu.sliit.dto.request.ChangePasswordRequestDTO;
import edu.sliit.dto.request.CreateUserRequestDTO;
import java.util.List;

public interface UserService {

    UserResponseDTO register(RegisterRequestDTO request);

    LoginResponseDTO login(LoginRequestDTO request);

    List<UserResponseDTO> getAllUsers();

    UserResponseDTO getUserById(Integer id);

    UserResponseDTO updateUser(Integer id, UpdateUserRequestDTO request);

    UserResponseDTO createUser(CreateUserRequestDTO request);

    void changePassword(Integer id, ChangePasswordRequestDTO request);

    void deleteUser(Integer id);
}