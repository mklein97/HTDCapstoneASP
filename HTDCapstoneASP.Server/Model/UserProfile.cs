using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using HTDCapstoneASP.Server.Model.Validation;
using Microsoft.EntityFrameworkCore;

namespace HTDCapstoneASP.Server.Model;

[Table("user_profile")]
[Index("Email", Name = "user_profile_email_unique", IsUnique = true)]
public partial class UserProfile
{
    [Key]
    [Column("user_id")]
    public int userId { get; set; }

    [Column("first_name")]
    [StringLength(255)]
    [Unicode(false)]
    [Required(ErrorMessage = "First Name is required")]
    public string firstName { get; set; } = null!;

    [Column("last_name")]
    [StringLength(255)]
    [Unicode(false)]
    [Required(ErrorMessage = "Last Name is required")]
    public string lastName { get; set; } = null!;

    [Column("dob")]
    [VerifyAge(13, ErrorMessage = "You must be {1} years or older to join Noodemy")]
    [Required(ErrorMessage = "Date of Birth is required")]
    public DateOnly dob { get; set; }

    [Column("email")]
    [StringLength(255)]
    [Unicode(false)]
    [EmailAddress(ErrorMessage = "Must enter a valid email address")]
    [Required(ErrorMessage = "Email address is required")]
    public string Email { get; set; } = null!;

    [Column("app_user_id")]
    public int appUserId { get; set; }

    [ForeignKey("appUserId")]
    public virtual AppUser appUser { get; set; } = null!;

    [NotMapped]
    public List<Enrollment>? enrollmentList { get; set; }
}
