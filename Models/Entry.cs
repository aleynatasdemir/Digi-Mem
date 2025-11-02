using DigiMem.Data;

namespace DigiMem.Models;

public class Entry
{
    public int Id { get; set; }
    public required string Title { get; set; }
    public required string Content { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public string? Category { get; set; }
    public List<string>? Tags { get; set; }
    
    // Foreign key
    public required string UserId { get; set; }
    public ApplicationUser User { get; set; } = null!;
}
