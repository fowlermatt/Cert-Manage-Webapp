using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Azure.Messaging.ServiceBus;
using webapp.Server.Data;
using webapp.Server.Models;
using Newtonsoft.Json;

namespace webapp.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AchievementController : ControllerBase
    {
        private readonly EmployeeContext _employeeContext;
        private readonly ServiceBusClient _client;
        private readonly ILogger<AchievementController> _logger;

        public AchievementController(EmployeeContext employeeContext, ServiceBusClient client, ILogger<AchievementController> logger)
        {
            _employeeContext = employeeContext;
            _logger = logger;
            _client = client;
        }

        // GET: /achievement
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Achievement>>> GetAchievements()
        {
            if (_employeeContext.Achievements == null)
            {
                return NotFound();
            }
            return await _employeeContext.Achievements.ToListAsync();
        }

        // GET: /achievement/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Achievement>> GetAchievement(int id)
        {
            var achievement = await _employeeContext.Achievements.FindAsync(id);
            if (achievement == null)
            {
                return NotFound();
            }
            return achievement;
        }

        // POST: /achievement
        [HttpPost]
        public async Task<ActionResult<Achievement>> CreateAchievement(Achievement achievement)
        {
            // Get employee and certificate
            var employee = await _employeeContext.Employees.FindAsync(achievement.EmployeeId);
            if (employee == null)
            {
                return NotFound();
            }

            var certificate = await _employeeContext.Certificates.FindAsync(achievement.CertificateName);
            if (certificate == null)
            {
                return NotFound();
            }

            achievement.Certificate = certificate;
            achievement.Employee = employee;

            // Save achievement to database
            _employeeContext.Achievements.Add(achievement);
            await _employeeContext.SaveChangesAsync();

            // Send congratulations email
            var email = new EmailMessage
            {
                Email = employee.Email!,
                Subject = "Congratulations on your new certificate!",
                Body = $"Congratulations {employee.FullName}!<br><br> On behalf of the Conscea Team, we would like to congratulate you on your continued hard work and success with your completion of <br><br> <strong>{certificate.Name}</strong><br><br>Keep up the great work!<br><br>Conscea Team"
            };
            var sender = _client.CreateSender("emails");
            var message = JsonConvert.SerializeObject(email);
            var serviceBusMessage = new ServiceBusMessage(message);
            await sender.SendMessageAsync(serviceBusMessage);

            return CreatedAtAction(nameof(GetAchievement), new { id = achievement.Id }, achievement);
        }

        // PUT: api/achievement/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAchievement(int id, Achievement achievement)
        {
            if (id != achievement.Id)
            {
                return BadRequest();
            }

            _employeeContext.Entry(achievement).State = EntityState.Modified;

            try
            {
                await _employeeContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AchievementExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: achievement/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAchievement(int id)
        {
            var achievement = await _employeeContext.Achievements.FindAsync(id);
            if (achievement == null)
            {
                return NotFound();
            }

            _employeeContext.Achievements.Remove(achievement);
            await _employeeContext.SaveChangesAsync();

            return NoContent();
        }

        private bool AchievementExists(int id)
        {
            return _employeeContext.Achievements.Any(e => e.Id == id);
        }
    }
}