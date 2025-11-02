using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DigiMem.Data;
using DigiMem.Models;
using System.Security.Claims;

namespace DigiMem.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class EntriesController : ControllerBase
{
    private readonly AppDbContext _context;

    public EntriesController(AppDbContext context)
    {
        _context = context;
    }

    private string GetUserId()
    {
        return User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? throw new UnauthorizedAccessException();
    }

    // GET: api/entries
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Entry>>> GetEntries(
        [FromQuery] string? category = null,
        [FromQuery] string? search = null)
    {
        var userId = GetUserId();
        var query = _context.Entries.Where(e => e.UserId == userId);

        if (!string.IsNullOrEmpty(category))
        {
            query = query.Where(e => e.Category == category);
        }

        if (!string.IsNullOrEmpty(search))
        {
            query = query.Where(e => 
                e.Title.Contains(search) || 
                e.Content.Contains(search));
        }

        var entries = await query
            .OrderByDescending(e => e.CreatedAt)
            .ToListAsync();

        return Ok(entries);
    }

    // GET: api/entries/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<Entry>> GetEntry(int id)
    {
        var userId = GetUserId();
        var entry = await _context.Entries
            .FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId);

        if (entry == null)
        {
            return NotFound();
        }

        return Ok(entry);
    }

    // POST: api/entries
    [HttpPost]
    public async Task<ActionResult<Entry>> CreateEntry([FromBody] CreateEntryRequest request)
    {
        var userId = GetUserId();

        var entry = new Entry
        {
            Title = request.Title,
            Content = request.Content,
            Category = request.Category,
            Tags = request.Tags,
            UserId = userId,
            CreatedAt = DateTime.UtcNow
        };

        _context.Entries.Add(entry);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetEntry), new { id = entry.Id }, entry);
    }

    // PUT: api/entries/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateEntry(int id, [FromBody] UpdateEntryRequest request)
    {
        var userId = GetUserId();
        var entry = await _context.Entries
            .FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId);

        if (entry == null)
        {
            return NotFound();
        }

        entry.Title = request.Title;
        entry.Content = request.Content;
        entry.Category = request.Category;
        entry.Tags = request.Tags;
        entry.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(entry);
    }

    // DELETE: api/entries/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteEntry(int id)
    {
        var userId = GetUserId();
        var entry = await _context.Entries
            .FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId);

        if (entry == null)
        {
            return NotFound();
        }

        _context.Entries.Remove(entry);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // GET: api/entries/stats
    [HttpGet("stats")]
    public async Task<ActionResult<object>> GetStats()
    {
        var userId = GetUserId();
        var now = DateTime.UtcNow;
        var startOfMonth = new DateTime(now.Year, now.Month, 1);

        var totalEntries = await _context.Entries
            .CountAsync(e => e.UserId == userId);

        var thisMonthEntries = await _context.Entries
            .CountAsync(e => e.UserId == userId && e.CreatedAt >= startOfMonth);

        var categories = await _context.Entries
            .Where(e => e.UserId == userId && e.Category != null)
            .Select(e => e.Category)
            .Distinct()
            .CountAsync();

        return Ok(new
        {
            totalEntries,
            thisMonthEntries,
            categories
        });
    }
}

public record CreateEntryRequest(
    string Title,
    string Content,
    string? Category,
    List<string>? Tags
);

public record UpdateEntryRequest(
    string Title,
    string Content,
    string? Category,
    List<string>? Tags
);
