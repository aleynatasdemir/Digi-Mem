using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using DigitalMemory.Models;

namespace DigitalMemory.Services;

public class ApiService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;

    public ApiService(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _configuration = configuration;
        _httpClient.BaseAddress = new Uri(_configuration["ApiSettings:BaseUrl"] ?? "");
    }

    public async Task<MemoryListResponse?> GetMemoriesAsync(
        int page = 1,
        int pageSize = 20,
        string? search = null,
        string? type = null,
        string? sortBy = null,
        string? sortOrder = null)
    {
        var queryParams = new List<string>
        {
            $"page={page}",
            $"pageSize={pageSize}"
        };

        if (!string.IsNullOrEmpty(search))
            queryParams.Add($"search={Uri.EscapeDataString(search)}");
        if (!string.IsNullOrEmpty(type))
            queryParams.Add($"type={type}");
        if (!string.IsNullOrEmpty(sortBy))
            queryParams.Add($"sortBy={sortBy}");
        if (!string.IsNullOrEmpty(sortOrder))
            queryParams.Add($"sortOrder={sortOrder}");

        var query = string.Join("&", queryParams);
        var response = await _httpClient.GetAsync($"/memories?{query}");
        
        if (response.IsSuccessStatusCode)
        {
            var content = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<MemoryListResponse>(content, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });
        }

        return null;
    }

    public async Task<Memory?> GetMemoryAsync(int id)
    {
        var response = await _httpClient.GetAsync($"/memories/{id}");
        
        if (response.IsSuccessStatusCode)
        {
            var content = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<Memory>(content, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });
        }

        return null;
    }

    public async Task<Memory?> CreateMemoryAsync(Memory memory)
    {
        var json = JsonSerializer.Serialize(memory);
        var content = new StringContent(json, Encoding.UTF8, "application/json");
        
        var response = await _httpClient.PostAsync("/memories", content);
        
        if (response.IsSuccessStatusCode)
        {
            var responseContent = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<Memory>(responseContent, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });
        }

        return null;
    }

    public async Task<bool> UpdateMemoryAsync(int id, Memory memory)
    {
        var json = JsonSerializer.Serialize(memory);
        var content = new StringContent(json, Encoding.UTF8, "application/json");
        
        var response = await _httpClient.PutAsync($"/memories/{id}", content);
        return response.IsSuccessStatusCode;
    }

    public async Task<bool> DeleteMemoryAsync(int id)
    {
        var response = await _httpClient.DeleteAsync($"/memories/{id}");
        return response.IsSuccessStatusCode;
    }

    public async Task<User?> GetCurrentUserAsync()
    {
        var response = await _httpClient.GetAsync("/user/me");
        
        if (response.IsSuccessStatusCode)
        {
            var content = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<User>(content, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });
        }

        return null;
    }

    public async Task<bool> UpdateUserAsync(User user)
    {
        var json = JsonSerializer.Serialize(user);
        var content = new StringContent(json, Encoding.UTF8, "application/json");
        
        var response = await _httpClient.PutAsync("/user/me", content);
        return response.IsSuccessStatusCode;
    }
}
