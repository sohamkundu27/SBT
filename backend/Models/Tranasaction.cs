namespace backend.Models
{
    public class Transaction
    {
        public int Id { get; set; }
        public required string Description { get; set; }
        public required decimal Amount { get; set; }
        public string? Category { get; set; }
        public DateTime Date { get; set; } = DateTime.Now;
    }
}
