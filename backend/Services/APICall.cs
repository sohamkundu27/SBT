using System.Net.Http;
using System.Text.Json;
using System.Text;

//this belongs to the backend project
namespace backend
{
    public class APICall
    {
        //instance used to send API requests
        private readonly HttpClient http;
        private readonly string apiKey;

        public APICall(IConfiguration configuration)
        {
            http = new HttpClient();
            apiKey = configuration["OpenAI:ApiKey"] ?? "";
        }
        //this function is called everytime 
        public async Task<string> GetChatResponseAsync(string prompt)
        {
            //function to get the category from openAI
            var requestBody = new
            {
                model = "gpt-4o-mini",
                messages = new[]
                {
                    new { role = "system", content = "You are a budgeting assistant. Always categorize transactions into: Groceries, Dining, Entertainment, Rent, Utilities, or Other. Respond only with the category." },
                    new { role = "user", content = prompt }
                },
                max_tokens = 150
            };
            //here we convert it to JSON
            var requestContent = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");

            http.DefaultRequestHeaders.Clear();
            http.DefaultRequestHeaders.Add("Authorization", $"Bearer {apiKey}");
            //send the http request
            var response = await http.PostAsync("https://api.openai.com/v1/chat/completions", requestContent);
            response.EnsureSuccessStatusCode();
            //reads and parses api
            var responseBody = await response.Content.ReadAsStringAsync();
            Console.WriteLine(responseBody); // Debug output
            //extract transaction category
            using var jsonDoc = JsonDocument.Parse(responseBody);
            //if its ever null then we can return a empty string
            return jsonDoc.RootElement
                          .GetProperty("choices")[0]
                          .GetProperty("message")
                          .GetProperty("content")
                          .GetString() ?? string.Empty;
        }
    }
}
