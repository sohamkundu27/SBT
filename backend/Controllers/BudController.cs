using backend.Database;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/budget")]
    [ApiController]
    public class BudController : ControllerBase
    {
        private readonly AppDBContext _context;

        public BudController(AppDBContext context)
        {
            _context = context;
        }

        // ✅ Get all budgets
        [HttpGet("get-all")]
        public async Task<IActionResult> GetBudgets()
        {
            var budgets = await _context.Budgets.ToListAsync();
            return Ok(budgets);
        }

        // ✅ Update or Insert Budget
        [HttpPost("update")]
        public async Task<IActionResult> UpdateBudget([FromBody] Budget updatedBudget)
        {
            if (updatedBudget == null || string.IsNullOrEmpty(updatedBudget.Category))
            {
                return BadRequest("Invalid budget data.");
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

            await _context.SaveChangesAsync();
            return Ok(budget);
        }

    }
}
