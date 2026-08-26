package edu.sliit.dto.response;
import edu.sliit.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserResponseDTO {
    private Integer userId;
    private String name;
    private String email;
    private String phoneNum;
    private Role role;
}
