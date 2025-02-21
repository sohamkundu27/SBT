using backend.Database;
using backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{

    //this is the endpoint
    [Route("/api/recurring")]
    [ApiController]
    //use inheritance to get ControllerBase, this class has all the HTTP methods
    public class RecurringTransactionController : ControllerBase
    {
        private readonly AppDBContext db;
        //local use of AppDBContext db
        public RecurringTransactionController(AppDBContext db)
        {
            this.db = db;
        }

        // Http get to fetch all recurring transactions from the DB
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

        // POST: Add a new recurring transaction
        [HttpPost("add")]
        public async Task<IActionResult> AddRecurringTransaction([FromForm] RecurringTransactionForm form)
        {
            try
            {
                // Get category from OpenAI API
                APICall call = new APICall();
                string categoryResponse = await call.GetChatResponseAsync(form.description);

                // Add to Recurring Transactions Table. Use the model
                var newRecurringTransaction = new RecurringTransaction
                {
                    Description = form.description,
                    Amount = Convert.ToDecimal(form.amount),
                    Category = categoryResponse ?? "Uncategorized",
                    Frequency = form.frequency,
                    DateCreated = DateTime.UtcNow
                };

                db.RecurringTransactions.Add(newRecurringTransaction);

                // Add to Normal Transactions Table as well. use the model
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
                //return as JSON
                return Ok(updatedList);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error adding recurring transaction: {ex.Message}");
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }

        // POST: Delete a recurring transaction
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
    //helps automatically parse data from the frontend

    public class RecurringTransactionForm
    {
        public required string description { get; set; }
        public required string amount { get; set; }
        public required string frequency { get; set; }
    }
}
