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
public class MemoriesController : ControllerBase
{
    private readonly AppDbContext _context;

    public MemoriesController(AppDbContext context)
    {
        _context = context;
    }

    private string GetUserId()
    {
        return User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? throw new UnauthorizedAccessException();
    }

    // GET: api/memories
    [HttpGet]
    public async Task<ActionResult<object>> GetMemories(
        [FromQuery] string? view = null,
        [FromQuery] string? from = null,
        [FromQuery] string? to = null,
        [FromQuery] string? types = null,
        [FromQuery] string? tags = null,
        [FromQuery] string? q = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var userId = GetUserId();
        var query = _context.Memories.Where(m => m.UserId == userId);

        // Filter by date range
        if (!string.IsNullOrEmpty(from) && DateTime.TryParse(from, out var fromDate))
        {
            query = query.Where(m => m.CreatedAt >= fromDate);
        }

        if (!string.IsNullOrEmpty(to) && DateTime.TryParse(to, out var toDate))
        {
            query = query.Where(m => m.CreatedAt <= toDate);
        }

        // Filter by types
        if (!string.IsNullOrEmpty(types))
        {
            var typeList = types.Split(',').Select(t => t.Trim()).ToList();
            query = query.Where(m => typeList.Contains(m.Type));
        }

        // Search query
        if (!string.IsNullOrEmpty(q))
        {
            query = query.Where(m => 
                (m.Title != null && m.Title.Contains(q)) || 
                (m.Description != null && m.Description.Contains(q)));
        }

        var total = await query.CountAsync();
        var memories = await query
            .OrderByDescending(m => m.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return Ok(new
        {
            items = memories,
            total,
            page,
            pageSize,
            totalPages = (int)Math.Ceiling((double)total / pageSize)
        });
    }

    // GET: api/memories/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<Memory>> GetMemory(int id)
    {
        var userId = GetUserId();
        var memory = await _context.Memories
            .FirstOrDefaultAsync(m => m.Id == id && m.UserId == userId);

        if (memory == null)
        {
            return NotFound();
        }

        return Ok(memory);
    }

    // POST: api/memories
    [HttpPost]
    public async Task<ActionResult<Memory>> CreateMemory([FromBody] CreateMemoryRequest request)
    {
        var userId = GetUserId();

        var memory = new Memory
        {
            Type = request.Type,
            Title = request.Title,
            Description = request.Description,
            MemoryDate = request.Date,
            Tags = request.Tags,
            FileUrl = request.FileUrl,
            ThumbnailUrl = request.ThumbnailUrl,
            MimeType = request.MimeType,
            FileSize = request.FileSize,
            DurationSeconds = request.DurationSeconds,
            TranscriptionText = request.TranscriptionText,
            SpotifyTrackId = request.SpotifyTrackId,
            SongTitle = request.SongTitle,
            ArtistName = request.ArtistName,
            AlbumName = request.AlbumName,
            AlbumArtUrl = request.AlbumArtUrl,
            UserId = userId,
            CreatedAt = DateTime.UtcNow
        };

        _context.Memories.Add(memory);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetMemory), new { id = memory.Id }, memory);
    }

    // PUT: api/memories/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateMemory(int id, [FromBody] UpdateMemoryRequest request)
    {
        var userId = GetUserId();
        var memory = await _context.Memories
            .FirstOrDefaultAsync(m => m.Id == id && m.UserId == userId);

        if (memory == null)
        {
            return NotFound();
        }

        memory.Title = request.Title;
        memory.Description = request.Description;
        memory.Tags = request.Tags;
        memory.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(memory);
    }

    // DELETE: api/memories/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMemory(int id)
    {
        var userId = GetUserId();
        var memory = await _context.Memories
            .FirstOrDefaultAsync(m => m.Id == id && m.UserId == userId);

        if (memory == null)
        {
            return NotFound();
        }

        _context.Memories.Remove(memory);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // GET: api/memories/stats
    [HttpGet("stats")]
    public async Task<ActionResult<object>> GetStats([FromQuery] string? period = "all")
    {
        var userId = GetUserId();
        var now = DateTime.UtcNow;

        // Calculate date ranges
        var startOfToday = now.Date;
        var startOfWeek = now.AddDays(-(int)now.DayOfWeek);
        var startOfMonth = new DateTime(now.Year, now.Month, 1);
        var startOfYear = new DateTime(now.Year, 1, 1);

        var query = _context.Memories.Where(m => m.UserId == userId);

        // Total counts
        var totalMemories = await query.CountAsync();
        var todayMemories = await query.CountAsync(m => m.CreatedAt >= startOfToday);
        var weekMemories = await query.CountAsync(m => m.CreatedAt >= startOfWeek);
        var monthMemories = await query.CountAsync(m => m.CreatedAt >= startOfMonth);
        var yearMemories = await query.CountAsync(m => m.CreatedAt >= startOfYear);

        // Format distribution
        var formatDistribution = await query
            .GroupBy(m => m.Type)
            .Select(g => new { type = g.Key, count = g.Count() })
            .ToListAsync();

        // Weekly data (last 7 days)
        var weeklyData = new List<object>();
        for (int i = 6; i >= 0; i--)
        {
            var date = now.AddDays(-i).Date;
            var count = await query.CountAsync(m => m.CreatedAt.Date == date);
            weeklyData.Add(new
            {
                date = date.ToString("yyyy-MM-dd"),
                day = date.ToString("ddd", new System.Globalization.CultureInfo("tr-TR")),
                count
            });
        }

        // Monthly trend (last 4 weeks)
        var monthlyTrend = new List<object>();
        for (int i = 3; i >= 0; i--)
        {
            var weekStart = now.AddDays(-7 * (i + 1));
            var weekEnd = now.AddDays(-7 * i);
            var count = await query.CountAsync(m => m.CreatedAt >= weekStart && m.CreatedAt < weekEnd);
            monthlyTrend.Add(new
            {
                week = $"{i + 1}. Hafta",
                count
            });
        }

        // Averages
        var totalDays = (now - (await query.OrderBy(m => m.CreatedAt).Select(m => m.CreatedAt).FirstOrDefaultAsync())).Days;
        var dailyAverage = totalDays > 0 ? (double)totalMemories / totalDays : 0;
        var weeklyAverage = totalDays >= 7 ? (double)totalMemories / (totalDays / 7.0) : weekMemories;
        var monthlyAverage = totalDays >= 30 ? (double)totalMemories / (totalDays / 30.0) : monthMemories;

        return Ok(new
        {
            totals = new
            {
                all = totalMemories,
                today = todayMemories,
                week = weekMemories,
                month = monthMemories,
                year = yearMemories
            },
            averages = new
            {
                daily = Math.Round(dailyAverage, 1),
                weekly = Math.Round(weeklyAverage, 1),
                monthly = Math.Round(monthlyAverage, 1)
            },
            formatDistribution,
            weeklyData,
            monthlyTrend
        });
    }
}

public record CreateMemoryRequest(
    string Type,
    string? Title,
    string? Description,
    DateTime? Date,
    List<string>? Tags,
    string? FileUrl,
    string? ThumbnailUrl,
    string? MimeType,
    long? FileSize,
    int? DurationSeconds,
    string? TranscriptionText,
    string? SpotifyTrackId,
    string? SongTitle,
    string? ArtistName,
    string? AlbumName,
    string? AlbumArtUrl
);

public record UpdateMemoryRequest(
    string? Title,
    string? Description,
    List<string>? Tags
);
