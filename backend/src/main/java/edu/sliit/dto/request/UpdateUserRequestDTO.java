package edu.sliit.dto.request;

import edu.sliit.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateUserRequestDTO {

    private String name;
    private String email;
    private String phoneNum;
    private Role role;
}