using backend.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BudgetController : ControllerBase
    {
        private readonly AppDBContext db;
        public BudgetController(AppDBContext db)
        {
            this.db = db;
        }

        [HttpGet]
        public IActionResult GetUsers()
        {
            var allusers = db.Transactions.ToList();
            return Ok(allusers);
        }
    }
}
