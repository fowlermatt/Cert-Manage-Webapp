using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using webapp.Server.Data;
using webapp.Server.Models;

namespace webapp.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class EmployeeController : ControllerBase
    {
        private readonly EmployeeContext _employeeContext;
        private readonly ILogger<EmployeeController> _logger;

        public EmployeeController(EmployeeContext employeeContext, ILogger<EmployeeController> logger)
        {
            _employeeContext = employeeContext;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Employee>>> GetEmployees()
        {
            if (_employeeContext.Employees == null)
            {
                return NotFound();
            }
            return await _employeeContext.Employees.Include(employee => employee.Achievements).ThenInclude(achievement => achievement.Certificate).ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Employee>> GetEmployee(int id)
        {
            if (_employeeContext.Employees == null)
            {
                return NotFound();
            }
            var employee = await _employeeContext.Employees.Include(employee => employee.Achievements).ThenInclude(achievement => achievement.Certificate).FirstOrDefaultAsync(employee => employee.ID == id);
            if (employee == null) 
            {
                return NotFound();
            }
            return employee;
        }

        [HttpGet("{id}/name")]
        public async Task<ActionResult<string>> GetEmployeeName(int id)
        {
            if (_employeeContext.Employees == null)
            {
                return NotFound();
            }
            var employee = await _employeeContext.Employees.FirstOrDefaultAsync(employee => employee.ID == id);
            if (employee == null)
            {
                return NotFound();
            }
            return employee.FullName!;
        }
    }
}
