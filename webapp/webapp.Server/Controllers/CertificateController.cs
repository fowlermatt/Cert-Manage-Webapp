using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using webapp.Server.Data;
using webapp.Server.Models;

namespace webapp.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CertificateController : ControllerBase
    {
        private readonly EmployeeContext _employeeContext;
        private readonly ILogger<CertificateController> _logger;

        public CertificateController(EmployeeContext employeeContext, ILogger<CertificateController> logger)
        {
            _employeeContext = employeeContext;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Certificate>>> GetCertificates()
        {
            if (_employeeContext.Certificates == null)
            {
                return NotFound();
            }
            return await _employeeContext.Certificates.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Certificate>> GetCertificate(int id)
        {
            if (_employeeContext.Certificates == null)
            {
                return NotFound();
            }
            var certificate = await _employeeContext.Certificates.FindAsync(id);
            if (certificate == null) 
            {
                return NotFound();
            }
            return certificate;
        }
    }
}
