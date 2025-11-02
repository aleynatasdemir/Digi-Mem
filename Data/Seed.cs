using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;

namespace DigiMem.Data;

public static class Seed
{
    public static async Task EnsureAdmin(IServiceProvider sp)
    {
        var userMgr = sp.GetRequiredService<UserManager<ApplicationUser>>();
        var email = Environment.GetEnvironmentVariable("ADMIN_EMAIL") ?? "admin@local";
        var pass  = Environment.GetEnvironmentVariable("ADMIN_PASSWORD") ?? "Admin!12345";

        var user = await userMgr.FindByEmailAsync(email);
        if (user == null)
        {
            user = new ApplicationUser { UserName = email, Email = email, EmailConfirmed = true };
            await userMgr.CreateAsync(user, pass);
        }
    }
}
