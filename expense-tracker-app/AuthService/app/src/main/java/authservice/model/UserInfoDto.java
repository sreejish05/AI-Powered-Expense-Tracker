package authservice.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class UserInfoDto {

    @NotNull(message = "Username is required")
    @Size(min = 4,max = 20, message = "Username must be between 4 and 20 characters")
    private String username;

    @NotNull(message = "Password is required")
    @Size(min = 10, max = 15)
    @Pattern(
            regexp = "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d!@#$%^&*()_+]{10,15}$",
            message = "Password must include letters and numbers"
    )
    private String password;


    @NotNull(message = "Name cannot be null")
    private String firstName;
    @NotNull(message = "Name cannot be null")
    private String lastName;
    @Email(message = "Email should be valid")
    private String email;


}
