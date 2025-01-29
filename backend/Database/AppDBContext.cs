using backend.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace backend.Data;

public class AppDBContext : DbContext
{
    public AppDBContext(DbContextOptions<AppDBContext> options) : base(options)
    {
        
    }
    public DbSet<Employee> Employees { get; set; }
}
