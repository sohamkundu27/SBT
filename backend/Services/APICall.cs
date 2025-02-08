using System.Net.Http;
using System.Text.Json;
using System.Text;

namespace backend
{
    public class APICall
    {
        private readonly HttpClient http;
        private readonly string apiKey;

        public APICall()
        {
            http = new HttpClient();
            apiKey = "";
        }

        public async Task<string> GetChatResponseAsync(string prompt)
        {
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

            var requestContent = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");

            http.DefaultRequestHeaders.Clear();
            http.DefaultRequestHeaders.Add("Authorization", $"Bearer {apiKey}");

            var response = await http.PostAsync("https://api.openai.com/v1/chat/completions", requestContent);
            response.EnsureSuccessStatusCode();

            var responseBody = await response.Content.ReadAsStringAsync();
            Console.WriteLine(responseBody); // Debug output

            using var jsonDoc = JsonDocument.Parse(responseBody);
            return jsonDoc.RootElement
                          .GetProperty("choices")[0]
                          .GetProperty("message")
                          .GetProperty("content")
                          .GetString();
        }
    }
}
