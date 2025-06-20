using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HTDCapstoneASP.Server.Model;

[Table("app_user")]
public partial class AppUser
{
    [Key]
    [Column("app_user_id")]
    public int AppUserId { get; set; }

    [Column("username")]
    [StringLength(255)]
    [Unicode(false)]
    [Required]
    public string UserName { get; set; } = null!;

    [Column("password_hash")]
    [StringLength(255)]
    [Unicode(false)]
    [Required]
    public string PasswordHash { get; set; } = null!;

    [Column("disabled")]
    public short Disabled { get; set; }

    [Column("role_id")]
    public int RoleId { get; set; }

    [ForeignKey("RoleId")]
    public virtual AppRole Role { get; set; }
}
