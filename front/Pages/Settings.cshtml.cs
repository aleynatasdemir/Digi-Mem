using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace DigitalMemory.Pages;

public class SettingsModel : PageModel
{
    private readonly IConfiguration _configuration;

    public SettingsModel(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public string ApiBaseUrl => _configuration["ApiSettings:BaseUrl"] ?? "";

    public void OnGet()
    {
    }

    public IActionResult OnPostLogout()
    {
        // TODO: Implement logout logic
        return RedirectToPage("/Index");
    }
}
