using Microsoft.AspNetCore.Mvc.RazorPages;

namespace DigitalMemory.Pages;

public class TimelineModel : PageModel
{
    private readonly IConfiguration _configuration;

    public TimelineModel(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public string ApiBaseUrl => _configuration["ApiSettings:BaseUrl"] ?? "";

    public void OnGet()
    {
    }
}
