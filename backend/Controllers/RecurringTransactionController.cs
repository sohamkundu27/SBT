using backend.Database;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration; // Required for config

namespace backend.Controllers
{
    //this is the endpoint
    [Route("/api/recurring")]
    [ApiController]
    //use inheritance to get ControllerBase, this class has all the HTTP methods
    public class RecurringTransactionController : ControllerBase
    {
        private readonly AppDBContext db;
        private readonly APICall apiCall; // APICall instance

        // DB Context and Configuration
        public RecurringTransactionController(AppDBContext context, IConfiguration configuration)
        {
            db = context;
            apiCall = new APICall(configuration); // Initialize APICall with API Key
        }

        // Http get to fetch all recurring transactions from the DB
        [HttpGet("get-all")]
        public async Task<IActionResult> GetAllRecurringTransactions()
        {
            try
            {
                var recurringTransactions = await db.RecurringTransactions.OrderBy(t => t.Id).ToListAsync();
                return Ok(recurringTransactions);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching recurring transactions: {ex.Message}");
                return StatusCode(500, new { message = "Internal Server Error", error = ex.Message });
            }
        }

        // POST: Add a new recurring transaction
        [HttpPost("add")]
        public async Task<IActionResult> AddRecurringTransaction([FromForm] RecurringTransactionForm form)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(form.description) || string.IsNullOrWhiteSpace(form.amount) || string.IsNullOrWhiteSpace(form.frequency))
                {
                    return BadRequest(new { message = "Description, Amount, and Frequency are required." });
                }

                // Get category from OpenAI API
                string categoryResponse = await apiCall.GetChatResponseAsync(form.description);

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

                // Add to Normal Transactions Table as well. Use the model
                var newTransaction = new Transaction
                {
                    Description = form.description,
                    Amount = Convert.ToDecimal(form.amount),
                    Category = categoryResponse ?? "Uncategorized",
                    Date = DateTime.UtcNow
                };

                db.Transactions.Add(newTransaction);
                await db.SaveChangesAsync();

                var updatedList = await db.RecurringTransactions.OrderBy(t => t.Id).ToListAsync();
                //return as JSON
                return Ok(updatedList);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error adding recurring transaction: {ex.Message}");
                return StatusCode(500, new { message = "Internal Server Error", error = ex.Message });
            }
        }

        // POST: Delete a recurring transaction
        [HttpPost("delete")]
        public async Task<IActionResult> DeleteRecurringTransaction([FromForm] int id)
        {
            try
            {
                var transaction = await db.RecurringTransactions.FindAsync(id);
                if (transaction == null)
                {
                    return NotFound(new { message = "Recurring Transaction not found." });
                }

                db.RecurringTransactions.Remove(transaction);
                await db.SaveChangesAsync();
                //need this so we can return the latest data to the frontend
                var updatedList = await db.RecurringTransactions.OrderBy(t => t.Id).ToListAsync();
                return Ok(updatedList);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deleting recurring transaction: {ex.Message}");
                return StatusCode(500, new { message = "Internal Server Error", error = ex.Message });
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