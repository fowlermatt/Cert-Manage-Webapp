using Microsoft.EntityFrameworkCore;
using webapp.Server.Models;

namespace webapp.Server.Data
{
    public class EmployeeContext : DbContext
    {
        public EmployeeContext(DbContextOptions<EmployeeContext> options) : base(options)
        {
            
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<Employee>()
                .Property(p => p.FullName)
                .HasComputedColumnSql("(([FirstName]+' ')+[LastName])");
        }

        public DbSet<webapp.Server.Models.Employee> Employees { get; set; } 
        public DbSet<webapp.Server.Models.Certificate> Certificates { get; set; }
        public DbSet<webapp.Server.Models.Achievement> Achievements { get; set; }
        public DbSet<webapp.Server.Models.User> Users { get; set; }

    }
}
