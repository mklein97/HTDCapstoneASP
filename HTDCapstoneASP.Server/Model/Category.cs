using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HTDCapstoneASP.Server.Model;

[Table("category")]
public partial class Category
{
    [Key]
    [Column("category_id")]
    public int CategoryId { get; set; }

    [Column("category_name")]
    [StringLength(255)]
    [Unicode(false)]
    public string CategoryName { get; set; } = null!;

    [Column("category_description")]
    [StringLength(255)]
    [Unicode(false)]
    public string CategoryDescription { get; set; } = null!;

    [Column("category_code")]
    [StringLength(255)]
    [Unicode(false)]
    public string CategoryCode { get; set; } = null!;
}
