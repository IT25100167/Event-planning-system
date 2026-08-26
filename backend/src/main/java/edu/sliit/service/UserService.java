package edu.sliit.service;

import edu.sliit.dto.request.RegisterRequestDTO;
import edu.sliit.dto.response.UserResponseDTO;

public interface UserService {
    UserResponseDTO register(RegisterRequestDTO request);
}