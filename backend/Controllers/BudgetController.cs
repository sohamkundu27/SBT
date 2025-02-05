using backend.Database;
using backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("/api")]
    [ApiController]
    public class BudgetController : ControllerBase
    {
        private readonly AppDBContext db;

        public BudgetController(AppDBContext db)
        {
            this.db = db;
        }

        // ✅ Helper Method to Delete the Last Transaction
        private async Task DeleteLastTransactionAsync()
        {
            var lastTransaction = await db.Transactions.OrderByDescending(t => t.Id).FirstOrDefaultAsync();
            if (lastTransaction != null)
            {
                db.Transactions.Remove(lastTransaction);
                await db.SaveChangesAsync();
                Console.WriteLine($"🗑️ Deleted last transaction with ID: {lastTransaction.Id}");
            }
        }

        // ✅ Add Transaction
        [HttpPost]
        [Route("add")]
        public async Task<IActionResult> SaveToDatabase([FromForm] TransactionRequestForm form)
        {
            try
            {
                await DeleteLastTransactionAsync(); // ✅ Delete the last transaction before adding a new one

                APICall call = new APICall();
                string response = await call.GetChatResponseAsync(form.description);

                var newTransaction = new Transaction
                {
                    Description = form.description,
                    Category = response ?? "Uncategorized",
                    Amount = Convert.ToDecimal(form.amount),
                    Date = DateTime.UtcNow
                };

                db.Transactions.Add(newTransaction);
                await db.SaveChangesAsync();

                Console.WriteLine($"✅ Added new transaction with ID: {newTransaction.Id}");

                return Ok(newTransaction); // ✅ Return only the newly added transaction
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error adding transaction: {ex.Message}");
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }

        // ✅ Delete Transaction (Manually Triggered)
        [HttpPost]
        [Route("delete")]
        public async Task<IActionResult> DeleteFromDatabase([FromForm] int id)
        {
            try
            {
                var transaction = await db.Transactions.FindAsync(id);
                if (transaction != null)
                {
                    db.Transactions.Remove(transaction);
                    await db.SaveChangesAsync();

                    Console.WriteLine($"✅ Transaction with ID {id} deleted.");

                    var updatedTransactions = db.Transactions.OrderBy(t => t.Id).ToList();
                    return Ok(updatedTransactions);
                }
                else
                {
                    Console.WriteLine($"⚠️ Transaction with ID {id} not found.");
                    return NotFound("Transaction not found.");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error deleting transaction: {ex.Message}");
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }

        // ✅ Fetch All Transactions
        [HttpGet]
        [Route("get-all")]
        public IActionResult GetAllTransactions()
        {
            try
            {
                var transactions = db.Transactions.OrderBy(t => t.Id).ToList();
                Console.WriteLine("📥 Fetched all transactions from the database.");
                return Ok(transactions);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error fetching transactions: {ex.Message}");
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }
    }

    public class TransactionRequestForm
    {
        public required string description { get; set; }
        public required string amount { get; set; }
    }
}
