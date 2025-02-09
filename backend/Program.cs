using backend.Database;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = WebApplication.CreateBuilder(args);

// ✅ Fix: Ensure correct connection string name
var connectionString = builder.Configuration.GetConnectionString("DB_Connection");

// ✅ Allow CORS for React frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins",
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyMethod()
                  .AllowAnyHeader();
        });
});

// ✅ Use Pomelo MySQL (Fix MySQL version mismatch)
builder.Services.AddDbContext<AppDBContext>(options =>
    options.UseMySql(
        connectionString,
        ServerVersion.AutoDetect(connectionString) // ✅ Automatically detect MySQL version
    ));

// ✅ Add Controllers
builder.Services.AddControllers();

var app = builder.Build();

// ✅ Fix: CORS must come before Routing
app.UseCors("AllowAllOrigins");

app.UseRouting();
app.UseAuthorization();

// ✅ Enable Controllers
app.MapControllers();

// ✅ Default Route (API Health Check)
app.MapGet("/", () => Results.Ok("Smart Budget Tracker API is running 🚀"));

app.Run();
