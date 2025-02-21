//this file is the main entry point for DB work. interacts with the models and the controllers
//when we get a input on the frontend, we use this to parse it and put it in the right table
using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Database
{
    public class AppDBContext : DbContext
    {
        //Database connection
        public AppDBContext(DbContextOptions<AppDBContext> options) : base(options) { }
        //These sets represent the tables
        // DbSet for Regular Transactions
        public DbSet<Transaction> Transactions { get; set; }

        // DbSet for Recurring Transactions
        public DbSet<RecurringTransaction> RecurringTransactions { get; set; }

        // DbSet for Budgets (with Category as Primary Key)
        public DbSet<Budget> Budgets { get; set; }
        //This function defines how database tables should be structured.
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            //  Mapping for Regular Transactions
            modelBuilder.Entity<Transaction>(entity =>
            {
                entity.ToTable("Transaction");
                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.Description).HasColumnName("description");
                entity.Property(e => e.Amount).HasColumnName("amount");
                entity.Property(e => e.Category).HasColumnName("category");
                entity.Property(e => e.Date).HasColumnName("date");
            });

            // Mapping for Recurring Transactions
            modelBuilder.Entity<RecurringTransaction>(entity =>
            {
                entity.ToTable("recurring_transactions");
                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.Description).HasColumnName("description");
                entity.Property(e => e.Amount).HasColumnName("amount");
                entity.Property(e => e.Category).HasColumnName("category");
                entity.Property(e => e.Frequency).HasColumnName("frequency"); // daily, weekly, monthly, yearly

                // Fix default timestamp value for 'date_created'
                entity.Property(e => e.DateCreated)
                      .HasColumnName("date_created")
                      .HasDefaultValueSql("CURRENT_TIMESTAMP(6)");
            });

            // Mapping for Budgets Table (Category as Primary Key)
            modelBuilder.Entity<Budget>(entity =>
            {
                entity.ToTable("Budgets");

                entity.HasKey(e => e.Category); // Category as primary key

                entity.Property(e => e.Category)
                      .HasColumnName("category")
                      .HasMaxLength(50)
                      .IsRequired();

                entity.Property(e => e.Amount)
                      .HasColumnName("amount")
                      .HasColumnType("DECIMAL(10,2)")
                      .HasDefaultValue(0.00m);
            });
        }
    }
}
