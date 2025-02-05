using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    [Table("recurring_transactions")]
    public class RecurringTransaction
    {
        public int Id { get; set; }
        public required string Description { get; set; }
        public required decimal Amount { get; set; }
        public string? Category { get; set; }
        public required string Frequency { get; set; }  // daily, weekly, monthly, yearly
        public DateTime DateCreated { get; set; } = DateTime.Now;
    }
}
