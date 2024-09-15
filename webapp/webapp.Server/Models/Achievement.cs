namespace webapp.Server.Models
{
    public class Achievement
    {
        public int Id { get; set; }
        public DateTime CertifiedDate { get; set; }
        public DateTime? ExpiryDate { get; set; }

        public int EmployeeId { get; set; }
        public virtual Employee? Employee { get; set; }

        public required string CertificateName { get; set; }
        public virtual Certificate? Certificate { get; set; }
    }
}
