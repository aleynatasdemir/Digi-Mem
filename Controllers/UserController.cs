using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using DigiMem.Data;
using System.Security.Claims;

namespace DigiMem.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UserController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly ILogger<UserController> _logger;

    public UserController(UserManager<ApplicationUser> userManager, ILogger<UserController> logger)
    {
        _userManager = userManager;
        _logger = logger;
    }

    private string GetUserId()
    {
        return User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? throw new UnauthorizedAccessException();
    }

    // GET: api/user/profile
    [HttpGet("profile")]
    public async Task<ActionResult<object>> GetProfile()
    {
        try
        {
            var userId = GetUserId();
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
            {
                return NotFound(new { error = "User not found" });
            }

            return Ok(new
            {
                id = user.Id,
                email = user.Email,
                userName = user.UserName,
                emailConfirmed = user.EmailConfirmed,
                memberSince = user.CreatedAt
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to get user profile");
            return StatusCode(500, new { error = "Failed to get user profile" });
        }
    }

    // PUT: api/user/profile
    [HttpPut("profile")]
    public async Task<ActionResult<object>> UpdateProfile([FromBody] UpdateProfileRequest request)
    {
        try
        {
            var userId = GetUserId();
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
            {
                return NotFound(new { error = "User not found" });
            }

            // Update username if provided and different
            if (!string.IsNullOrWhiteSpace(request.UserName) && request.UserName != user.UserName)
            {
                var setUsernameResult = await _userManager.SetUserNameAsync(user, request.UserName);
                if (!setUsernameResult.Succeeded)
                {
                    return BadRequest(new { errors = setUsernameResult.Errors.Select(e => e.Description) });
                }
            }

            // Update email if provided and different
            if (!string.IsNullOrWhiteSpace(request.Email) && request.Email != user.Email)
            {
                var setEmailResult = await _userManager.SetEmailAsync(user, request.Email);
                if (!setEmailResult.Succeeded)
                {
                    return BadRequest(new { errors = setEmailResult.Errors.Select(e => e.Description) });
                }
            }

            _logger.LogInformation("Profile updated for user {UserId}", userId);

            return Ok(new
            {
                id = user.Id,
                email = user.Email,
                userName = user.UserName,
                emailConfirmed = user.EmailConfirmed,
                memberSince = user.CreatedAt
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to update user profile");
            return StatusCode(500, new { error = "Failed to update user profile" });
        }
    }

    // PUT: api/user/password
    [HttpPut("password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
    {
        try
        {
            var userId = GetUserId();
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
            {
                return NotFound(new { error = "User not found" });
            }

            var result = await _userManager.ChangePasswordAsync(user, request.CurrentPassword, request.NewPassword);

            if (!result.Succeeded)
            {
                return BadRequest(new { errors = result.Errors.Select(e => e.Description) });
            }

            _logger.LogInformation("Password changed for user {UserId}", userId);

            return Ok(new { message = "Password changed successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to change password");
            return StatusCode(500, new { error = "Failed to change password" });
        }
    }
}

public record UpdateProfileRequest(
    string? UserName,
    string? Email
);

public record ChangePasswordRequest(
    string CurrentPassword,
    string NewPassword
);
