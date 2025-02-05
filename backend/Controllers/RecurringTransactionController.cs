using backend.Database;
using backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("/api/recurring")]
    [ApiController]
    public class RecurringTransactionController : ControllerBase
    {
        private readonly AppDBContext db;

        public RecurringTransactionController(AppDBContext db)
        {
            this.db = db;
        }

        // ✅ GET: Fetch all recurring transactions
        [HttpGet("get-all")]
        public IActionResult GetAllRecurringTransactions()
        {
            try
            {
                var recurringTransactions = db.RecurringTransactions.OrderBy(t => t.Id).ToList();
                return Ok(recurringTransactions);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error fetching recurring transactions: {ex.Message}");
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }

        // ✅ POST: Add a new recurring transaction
        [HttpPost("add")]
        public async Task<IActionResult> AddRecurringTransaction([FromForm] RecurringTransactionForm form)
        {
            try
            {
                // ✅ Get category from OpenAI
                APICall call = new APICall();
                string categoryResponse = await call.GetChatResponseAsync(form.description);

                // ✅ Add to Recurring Transactions Table
                var newRecurringTransaction = new RecurringTransaction
                {
                    Description = form.description,
                    Amount = Convert.ToDecimal(form.amount),
                    Category = categoryResponse ?? "Uncategorized",
                    Frequency = form.frequency,
                    DateCreated = DateTime.UtcNow
                };

                db.RecurringTransactions.Add(newRecurringTransaction);

                // ✅ Add to Normal Transactions Table (as the first charge)
                var newTransaction = new Transaction
                {
                    Description = form.description,
                    Amount = Convert.ToDecimal(form.amount),
                    Category = categoryResponse ?? "Uncategorized",
                    Date = DateTime.UtcNow
                };

                db.Transactions.Add(newTransaction);

                await db.SaveChangesAsync();

                var updatedList = db.RecurringTransactions.OrderBy(t => t.Id).ToList();
                return Ok(updatedList);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error adding recurring transaction: {ex.Message}");
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }

        // ✅ POST: Delete a recurring transaction
        [HttpPost("delete")]
        public async Task<IActionResult> DeleteRecurringTransaction([FromForm] int id)
        {
            try
            {
                var transaction = await db.RecurringTransactions.FindAsync(id);
                if (transaction != null)
                {
                    db.RecurringTransactions.Remove(transaction);
                    await db.SaveChangesAsync();

                    var updatedList = db.RecurringTransactions.OrderBy(t => t.Id).ToList();
                    return Ok(updatedList);
                }
                else
                {
                    return NotFound("Recurring Transaction not found.");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error deleting recurring transaction: {ex.Message}");
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }
    }

    public class RecurringTransactionForm
    {
        public required string description { get; set; }
        public required string amount { get; set; }
        public required string frequency { get; set; }
    }
}
