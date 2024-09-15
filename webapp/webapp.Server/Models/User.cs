using System.ComponentModel.DataAnnotations.Schema;

namespace webapp.Server.Models
{
    public class User
    {
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public virtual int Id { get; set; }
        public required String Username { get; set; }
        public required String Password { get; set; }
    }
}
