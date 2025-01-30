using System.Globalization;

namespace backend.Models.Entities
{
    public class Transaction
    {
        public int Id { get; set; }
        public String description { get; set; }
        public String category {  get; set; }
        public double amount { get; set; }
        public String date { get; set; }
    }
}
