using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HTDCapstoneASP.Server.Model;

[Table("app_role")]
[Index("RoleName", Name = "app_role_role_name_unique", IsUnique = true)]
public partial class AppRole
{
    [Key]
    [Column("role_id")]
    public int RoleId { get; set; }

    [Column("role_name")]
    [StringLength(255)]
    [Unicode(false)]
    public string RoleName { get; set; } = null!;

    [Column("role_description")]
    [StringLength(255)]
    [Unicode(false)]
    public string RoleDescription { get; set; } = null!;
}
