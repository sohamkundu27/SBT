using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using backend.Database;
using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration; // Required for config

namespace backend.Controllers
{
    [ApiController]
    [Route("api")]
    //We inherit the HTTP methods from the ControllerBase class. Make Budget Controller class to make all the methods in.
    public class BudgetController : ControllerBase
    {
        //this the the local db
        private readonly AppDBContext db;
        private readonly APICall apiCall; // APICall instance

        // DB Context & Configuration
        public BudgetController(AppDBContext context, IConfiguration configuration)
        {
            db = context;
            apiCall = new APICall(configuration); // Initialize APICall with API Key
        }

        //gets everything from the DB
        [HttpGet]
        [Route("get-all")]
        public async Task<IActionResult> GetAllTransactions()
        {
            //get the full transaction list
            try
            {
                var transactions = await db.Transactions.ToListAsync();
                return Ok(transactions);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching transactions: {ex.Message}");
                return StatusCode(500, new { message = "Internal Server Error", error = ex.Message });
            }
        }

        //add a transaction
        [HttpPost]
        [Route("add")]
        public async Task<IActionResult> SaveToDatabase([FromForm] TransactionRequestForm form)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(form.Description) || string.IsNullOrWhiteSpace(form.Amount))
                {
                    return BadRequest(new { message = "Description and Amount are required." });
                }

                //automatically categorization
                string category = await apiCall.GetChatResponseAsync(form.Description);
                //make the new object with the model
                var newTransaction = new Transaction
                {
                    Description = form.Description,
                    Category = category ?? "Uncategorized",
                    Amount = Convert.ToDecimal(form.Amount),
                    Date = DateTime.UtcNow
                };

                db.Transactions.Add(newTransaction);
                await db.SaveChangesAsync();

                Console.WriteLine($"Added new transaction with ID: {newTransaction.Id}");
                //returning it as JSON
                return Ok(newTransaction);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error adding transaction: {ex.Message}");
                return StatusCode(500, new { message = "Internal Server Error", error = ex.Message });
            }
        }

        [HttpPost]
        [Route("delete")]
        public async Task<IActionResult> DeleteTransaction([FromForm] int id)
        {
            try
            {
                var transaction = await db.Transactions.FindAsync(id);
                if (transaction == null)
                {
                    return NotFound(new { message = $"Transaction with ID {id} not found." });
                }

                db.Transactions.Remove(transaction);
                await db.SaveChangesAsync();

                Console.WriteLine($"Deleted transaction with ID: {id}");
                //returning it as JSON
                return Ok(new { message = $"Transaction with ID {id} deleted." });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deleting transaction: {ex.Message}");
                return StatusCode(500, new { message = "Internal Server Error", error = ex.Message });
            }
        }
    }

    //helps automatically parse data from the frontend
    public class TransactionRequestForm
    {
        public string Description { get; set; } = string.Empty;
        public string Amount { get; set; } = string.Empty;
    }
}