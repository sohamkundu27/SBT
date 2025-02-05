using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Database
{
    public class AppDBContext : DbContext
    {
        public AppDBContext(DbContextOptions<AppDBContext> options) : base(options) { }

        // ✅ DbSet for Regular Transactions
        public DbSet<Transaction> Transactions { get; set; }

        // ✅ DbSet for Recurring Transactions
        public DbSet<RecurringTransaction> RecurringTransactions { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // ✅ Mapping for Regular Transactions
            modelBuilder.Entity<Transaction>(entity =>
            {
                entity.ToTable("Transaction"); // Maps to the 'Transaction' table
                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.Description).HasColumnName("description");
                entity.Property(e => e.Amount).HasColumnName("amount");
                entity.Property(e => e.Category).HasColumnName("category");
                entity.Property(e => e.Date).HasColumnName("date");
            });

            // ✅ Mapping for Recurring Transactions
            modelBuilder.Entity<RecurringTransaction>(entity =>
            {
                entity.ToTable("recurring_transactions"); // Maps to the 'recurring_transactions' table
                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.Description).HasColumnName("description");
                entity.Property(e => e.Amount).HasColumnName("amount");
                entity.Property(e => e.Category).HasColumnName("category");
                entity.Property(e => e.Frequency).HasColumnName("frequency"); // daily, weekly, monthly, yearly
                entity.Property(e => e.DateCreated).HasColumnName("date_created");
            });
        }
    }
}
