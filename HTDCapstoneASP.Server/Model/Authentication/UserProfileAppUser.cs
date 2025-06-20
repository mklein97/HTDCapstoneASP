
public class UserProfileAppUser {
    public required int userId { get; set; }
    public required String firstName { get; set; }
    public required String lastName { get; set; }
    public required String email { get; set; }
    public required DateOnly dob { get; set; }
    public required String username { get; set; }
    public required bool disabled { get; set; }
    public required int appUserId { get; set; }
}
