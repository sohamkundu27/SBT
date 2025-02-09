namespace backend.Models
{
    public class Transaction
    {
        public int Id { get; set; }
        public required string Description { get; set; }  // ✅ Now required
        public required decimal Amount { get; set; }      // ✅ Now required
        public string? Category { get; set; }             // ❌ Nullable (optional)
        public DateTime Date { get; set; } = DateTime.Now;
    }
}
