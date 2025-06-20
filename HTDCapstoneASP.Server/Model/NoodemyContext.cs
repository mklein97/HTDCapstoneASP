using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace HTDCapstoneASP.Server.Model;

public partial class NoodemyContext : DbContext
{
    public NoodemyContext()
    {
    }

    public NoodemyContext(DbContextOptions<NoodemyContext> options)
        : base(options)
    {
    }

    public virtual DbSet<AppRole> AppRoles { get; set; }

    public virtual DbSet<AppUser> AppUsers { get; set; }

    public virtual DbSet<Category> Categories { get; set; }

    public virtual DbSet<Comment> Comments { get; set; }

    public virtual DbSet<Course> Courses { get; set; }

    public virtual DbSet<Enrollment> Enrollments { get; set; }

    public virtual DbSet<UserProfile> UserProfiles { get; set; }


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AppRole>(entity =>
        {
            entity.HasKey(e => e.RoleId).HasName("PK__app_role__760965CC3D205BAA");
        });

        modelBuilder.Entity<AppUser>(entity =>
        {
            entity.HasKey(e => e.AppUserId).HasName("PK__app_user__06D526142951854F");
        });

        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(e => e.CategoryId).HasName("PK__category__D54EE9B45BA39238");
        });

        modelBuilder.Entity<Comment>(entity =>
        {
            entity.HasKey(e => e.commentId).HasName("PK__comment__E7957687112C163E");

        });

        modelBuilder.Entity<Course>(entity =>
        {
            entity.HasKey(e => e.CourseId).HasName("PK__course__8F1EF7AE1AED0976");
        });

        modelBuilder.Entity<Enrollment>(entity =>
        {
            entity.HasKey(e => e.EnrollmentId).HasName("PK__enrollme__6D24AA7A74E6F6A8");

        });

        modelBuilder.Entity<UserProfile>(entity =>
        {
            entity.HasKey(e => e.userId).HasName("PK__user_pro__B9BE370FBF694475");

        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
