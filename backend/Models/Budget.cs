using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    [Table("Budgets")]
    public class Budget
    {
        [Key] // ✅ Set Category as the primary key
        [Column("category")]
        [Required]
        [StringLength(50)]
        public string Category { get; set; } = string.Empty;

        [Column("amount")]
        [Required]
        public decimal Amount { get; set; }
    }
}
