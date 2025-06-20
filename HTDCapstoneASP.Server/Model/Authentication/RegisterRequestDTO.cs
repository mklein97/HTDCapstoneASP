
public class RegisterRequestDTO {
    public required String UserName { get; set; }
    public required String password { get; set; }
    public required String firstName { get; set; }
    public required String lastName { get; set; }
    public required String email { get; set; }
    public required DateOnly dob { get; set; }
    public required int roleId { get; set; }
}
