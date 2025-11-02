namespace DigitalMemory.Models;

public class Memory
{
    public int Id { get; set; }
    public string Type { get; set; } = string.Empty;
    public string? Title { get; set; }
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? Date { get; set; }
    public string? Location { get; set; }
    public List<string>? Tags { get; set; }
    public PhotoVideoData? PhotoVideo { get; set; }
    public VoiceData? Voice { get; set; }
    public SongData? Song { get; set; }
}

public class PhotoVideoData
{
    public string Url { get; set; } = string.Empty;
    public string MediaType { get; set; } = string.Empty;
}

public class VoiceData
{
    public string Url { get; set; } = string.Empty;
    public int DurationSeconds { get; set; }
}

public class SongData
{
    public string Title { get; set; } = string.Empty;
    public string Artist { get; set; } = string.Empty;
    public string? Album { get; set; }
    public string? SpotifyUrl { get; set; }
    public string? CoverUrl { get; set; }
}

public class MemoryListResponse
{
    public List<Memory> Items { get; set; } = new();
    public int Total { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
}
