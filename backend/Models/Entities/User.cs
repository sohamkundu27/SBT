namespace backend.Models.Entities
{
    public class Budget
    {
        public string Category { get; set; }
        public decimal BudgetAmount { get; set; }
        public decimal Spent { get; set; }
    }
    public class User
    {
        public int UserId { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string PhoneNumber { get; set; }

        public string BudgetJson { get; set; }
    }
}
