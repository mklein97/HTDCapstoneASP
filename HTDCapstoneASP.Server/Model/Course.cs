using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HTDCapstoneASP.Server.Model;

[Table("course")]
public partial class Course
{
    [Key]
    [Column("course_id")]
    public int CourseId { get; set; }

    [Column("course_name")]
    [StringLength(255)]
    [Unicode(false)]
    [Required(ErrorMessage = "Course Name is required")]
    public string CourseName { get; set; } = null!;

    [Column("course_description")]
    [StringLength(255)]
    [Unicode(false)]
    [Required(ErrorMessage = "Course description is required")]
    public string CourseDescription { get; set; } = null!;

    [Column("price", TypeName = "decimal(8, 2)")]
    [Required(ErrorMessage = "price is required")]
    public decimal Price { get; set; }

    [Column("estimate_duration")]
    [Required(ErrorMessage = "Estimated hours is required")]
    public int EstimateDuration { get; set; }

    [Column("category_id")]
    [Required(ErrorMessage = "Category is required")]
    public int CategoryId { get; set; }

    [ForeignKey("CategoryId")]
    public virtual Category? Category { get; set; }
}
