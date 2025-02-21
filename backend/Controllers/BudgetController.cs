using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using backend.Database;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [ApiController]
    [Route("api")]
    //We inherit the HTTP methods from the ControllerBase class. Make Budget Controller class to make all the methods in.
    public class BudgetController : ControllerBase
    {
        private readonly AppDBContext db;
        //initialize the db so we can use it locally

        public BudgetController(AppDBContext context)
        {
            db = context;
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
                Console.WriteLine($"❌ Error fetching transactions: {ex.Message}");
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }
        //add a transaction
        [HttpPost]
        [Route("add")]
        public async Task<IActionResult> SaveToDatabase([FromForm] TransactionRequestForm form)
        {
            try
            {
                //automatically categorization
                APICall call = new APICall();
                string response = await call.GetChatResponseAsync(form.description);
                //make the new object with the model
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
                //returning it as JSON
                return Ok(newTransaction);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error adding transaction: {ex.Message}");
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
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
                    return NotFound($"Transaction with ID {id} not found.");
                }

                db.Transactions.Remove(transaction);
                await db.SaveChangesAsync();

                Console.WriteLine($"✅ Deleted transaction with ID: {id}");
                //returning it as JSON
                return Ok($"Transaction with ID {id} deleted.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error deleting transaction: {ex.Message}");
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }
    }
    //helps automatically parse data from the frontend
    public class TransactionRequestForm
    {
        public string description { get; set; }
        public string amount { get; set; }
    }
}
