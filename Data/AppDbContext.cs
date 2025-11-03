using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using DigiMem.Models;

namespace DigiMem.Data
{
    public class ApplicationUser : IdentityUser
    {
        public ICollection<Entry> Entries { get; set; } = new List<Entry>();
    }

    public class AppDbContext : IdentityDbContext<ApplicationUser>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Entry> Entries { get; set; }
        public DbSet<Memory> Memories { get; set; }
        public DbSet<UserIntegration> UserIntegrations { get; set; }
        public DbSet<SpotifyTrack> SpotifyTracks { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Entry>()
                .HasOne<ApplicationUser>(e => e.User!)
                .WithMany(u => u.Entries)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Memory>()
                .HasOne<ApplicationUser>(m => m.User!)
                .WithMany()
                .HasForeignKey(m => m.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<UserIntegration>()
                .HasOne<ApplicationUser>(ui => ui.User!)
                .WithMany()
                .HasForeignKey(ui => ui.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<UserIntegration>()
                .HasIndex(ui => new { ui.UserId, ui.Provider })
                .IsUnique();

            builder.Entity<SpotifyTrack>()
                .HasOne<ApplicationUser>(st => st.User!)
                .WithMany()
                .HasForeignKey(st => st.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<SpotifyTrack>()
                .HasIndex(st => new { st.UserId, st.SpotifyTrackId });
        }
    }
}
