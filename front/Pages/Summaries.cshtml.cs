using Microsoft.AspNetCore.Mvc.RazorPages;

namespace DigitalMemory.Pages;

public class SummariesModel : PageModel
{
    private readonly IConfiguration _configuration;

    public SummariesModel(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public string ApiBaseUrl => _configuration["ApiSettings:BaseUrl"] ?? "";

    public void OnGet()
    {
    }
}
