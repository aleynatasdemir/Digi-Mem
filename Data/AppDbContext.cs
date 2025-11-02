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

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Entry>()
                .HasOne<ApplicationUser>(e => e.User!)
                .WithMany(u => u.Entries)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
