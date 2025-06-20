using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HTDCapstoneASP.Server.Model;

[Table("comment")]
public partial class Comment
{
    [Key]
    [Column("comment_id")]
    public int commentId { get; set; }

    [Column("enrollment_id")]
    public int enrollmentId { get; set; }

    [Column("created_at")]
    public DateOnly createdAt { get; set; }

    [Column("comment")]
    [StringLength(255)]
    [Unicode(false)]
    [Required]
    public required string comment { get; set; }

    [ForeignKey("enrollmentId")]
    public virtual Enrollment? Enrollment { get; set; }

    [NotMapped]
    public string? postedBy { get; set; }
}
