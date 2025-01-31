using backend.Data;
using backend.Models.Entities;
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

        [HttpPost]
        [Route("add")]
        public async Task<IActionResult> saveToDatabase([FromForm] TransactionRequestForm form)
        {
            APICall call = new APICall();
            string response = await call.GetChatResponseAsync(form.description);
            var newTransaction = new Transaction { description = form.description, category = response, amount = Convert.ToDouble(form.amount), date = "hey" };
            db.Transactions.Add(newTransaction);
            db.SaveChanges();
            var new_response = db.Transactions.ToList();
            return Ok(new_response);
        }

        [HttpPost]
        [Route("delete")]
        public IActionResult deleteFromDatabase([FromForm] int id)
        {
            var transaction = db.Transactions.Find(id);
            if (transaction != null)
            {
                db.Transactions.Remove(transaction);
                db.SaveChanges();
                var new_response = db.Transactions.ToList();
                return Ok(new_response);
            }
            else
            {
                return NotFound("Transaction not found.");
            }
        }
    }

    public class TransactionRequestForm
    {
        public string description { get; set; }
        public string amount { get; set; }
    }
}
