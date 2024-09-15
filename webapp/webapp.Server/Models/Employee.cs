using System.ComponentModel.DataAnnotations.Schema;

namespace webapp.Server.Models
{
    public class Employee
    {
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public virtual int ID { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Email { get; set; }
        public string? FullName { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Role { get; set; }
        public char Grade { get; set; }
        public string? UserType { get; set; }
        public string? Username { get; set; }

        public ICollection<Achievement> Achievements { get; set;} = new List<Achievement>();
    }
}
