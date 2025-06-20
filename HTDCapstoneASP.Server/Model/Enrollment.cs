using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;

namespace HTDCapstoneASP.Server.Model;

[Table("enrollment")]
public partial class Enrollment
{
    [Key]
    [Column("enrollment_id")]
    public int EnrollmentId { get; set; }

    [Column("user_id")]
    public int UserId { get; set; }

    [Column("course_id")]
    public int CourseId { get; set; }

    [ForeignKey("CourseId")]
    public virtual Course? Course { get; set; }

    [ForeignKey("UserId")]
    [JsonIgnore]
    public virtual UserProfile? User { get; set; }
}
