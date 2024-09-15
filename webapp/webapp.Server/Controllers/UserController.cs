using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using webapp.Server.Data;
using webapp.Server.Models;
using webapp.Server.Services;


namespace webapp.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly EmployeeContext _employeeContext;
        private readonly UserService _usersService;
        private readonly ILogger<UserController> _logger;

        public UserController(EmployeeContext employeeContext, UserService userService, ILogger<UserController> logger)
        {
            _employeeContext = employeeContext;
            _usersService = userService;
            _logger = logger;
        }


        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            if (_employeeContext.Users == null)
            {
                return NotFound();
            }
            return await _employeeContext.Users.ToListAsync();
        }

        [HttpPost("login")]
        public async Task<ActionResult<User>> Login([FromForm] string username, [FromForm] string password)
        {
            try
            {
                var user = await _usersService.Login(username, password);
                return Ok(user);
            }
            catch
            {
                throw;
            }
        }

        [HttpGet("{username}/id")]
        public async Task<ActionResult<int>> GetUserId(string username)
        {
            try
            {
                var userId = await _usersService.GetUserId(username);

                return Ok(userId);
            }
            catch
            {
                throw;
            }
        }

        [HttpPost("verifyPassword")]
        public async Task<ActionResult<Boolean>> VerifyPassword([FromForm] int id, [FromForm] string password)
        {
            try
            {
                var isPassCorrect = await _usersService.VerifyPassword(id, password);

                if (isPassCorrect)
                {
                    return Ok(true);
                } else
                {
                    return Ok(false);
                }
            }
            catch
            {
                throw;
            }
        }

        [HttpPost("changePassword")]
        public async Task<ActionResult<Boolean>> ChangePassword([FromForm] int id, [FromForm] string password)
        {
            try
            {
                var isPassChanged = await _usersService.ChangePassword(id, password);

                if (isPassChanged)
                {
                    return Ok(true);
                }
                else
                {
                    return Ok(false);
                }
            }
            catch
            {
                throw;
            }
        }

        [HttpPost("upload")]
        public async Task<string> UploadImage(IFormFile file, [FromForm]String userId) {
            try {
                await _usersService.UploadImage(file, userId);
                return "Ok";
            }
            catch
            {
                throw;
            }
        }
    }
}
