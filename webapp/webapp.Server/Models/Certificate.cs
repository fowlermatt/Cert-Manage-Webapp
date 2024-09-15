using System.ComponentModel.DataAnnotations;

namespace webapp.Server.Models
{
    public class Certificate
    {
        [Key]
        public required string Name { get; set; }
        public required string Level { get; set; }
        public required string Category { get; set; }
    }
}
