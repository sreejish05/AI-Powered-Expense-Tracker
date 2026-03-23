package authservice.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AuthRequestDTO {
    @NotBlank(message = "Username is required")
    @Size(min = 4,max = 20, message = "Username must be 4 to 20 characters long")
    private String username;
    @NotBlank(message = "Password is required")
    @Size(min = 10, max = 15, message = "Password must be 10 to 15 characters long")
    @Pattern(
            regexp = "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d!@#$%^&*()_+]{10,15}$",
            message = "Password must include letters and numbers"
    )
    private String password;
}
