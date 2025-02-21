//This file is responsible for the budget table

using backend.Database;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    //Here we define the API endpoint
    [Route("api/budget")]
    [ApiController]
    //make a class(encapsulation) the controllerBase is interheited. it has the HTTP methods that we need.
    public class BudController : ControllerBase
    {
        //here is the database connection
        private readonly AppDBContext _context;
        // Constructor, so we can access the DB locally 

        public BudController(AppDBContext context)
        {
            _context = context;
        }

        // Get all budgets from the DB when we first load the page
        [HttpGet("get-all")]
        public async Task<IActionResult> GetBudgets()
        {
            var budgets = await _context.Budgets.ToListAsync();
            return Ok(budgets);
        }

        // Update a Budget
        [HttpPost("update")]
        public async Task<IActionResult> UpdateBudget([FromBody] Budget updatedBudget)
        {
            //error handling
            if (updatedBudget == null || string.IsNullOrEmpty(updatedBudget.Category))
            {
                return BadRequest("Invalid budget data");
            }

            var budget = await _context.Budgets.FirstOrDefaultAsync(b => b.Category == updatedBudget.Category);

            if (budget == null)
            {
                _context.Budgets.Add(updatedBudget);
            }
            else
            {
                budget.Amount = updatedBudget.Amount;
                _context.Budgets.Update(budget);
            }
            //returned the updated budget as JSON
            await _context.SaveChangesAsync();
            return Ok(budget);
        }

    }
}
