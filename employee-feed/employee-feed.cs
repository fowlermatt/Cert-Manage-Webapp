using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Microsoft.Azure.Functions.Worker.Extensions.Sql;
using Azure.Messaging.ServiceBus;
using Newtonsoft.Json;

namespace CSCE590GroupProject.EmployeeFeed
{
    public class employee_feed
    {
        private readonly ILogger<employee_feed> _logger;
        private readonly ServiceBusClient _client;

        public employee_feed(ILogger<employee_feed> logger, ServiceBusClient client)
        {
            _logger = logger;
            _client = client;
        }

        [Function(nameof(employee_feed))]
        public async Task<OutputType> Run([BlobTrigger("employee-feed/{name}", Connection = "csce590groupprojecta025_STORAGE")] Stream stream, string name)
        {
            using var blobStreamReader = new StreamReader(stream);
            _logger.LogInformation($"C# Blob trigger function Processed blob\n Name: {name} \n");
            
            // Skip header
            await blobStreamReader.ReadLineAsync();

            // Start processing employees
            var line = await blobStreamReader.ReadLineAsync();
            List<Employee> employees = new();
            List<User> users = new();

            while (line != null)
            {
                // Create employee record
                var employee = ProcessEmployeeInfo(line);
                // change to upsert ? Maybe
                employees.Add(employee);

                // Create user record
                var user = new User { Id = employee.ID, Username = employee.Username!, Password = PasswordGenerator.GeneratePassword() };
                users.Add(user);

                // Send initial account setup email
                var email = new EmailMessage
                {
                    Email = employee.Email!,
                    Subject = "Welcome to the Conscea!",
                    Body = $"Hello {employee.FirstName},<br><br>Welcome to the team! Your account has been created.<br><br>Username: {user.Username}<br>Temporary Password: {user.Password}<br><br> Please log in <a href='https://webappserver20240328211244.azurewebsites.net/change-password'>here</a> and change your password as soon as possible.<br><br>Thank you,<br>Conscea Team"
                };
                await SendEmail(email);

                _logger.LogInformation($"Processed employee info\n Info: {line} \n");
                line = await blobStreamReader.ReadLineAsync();
            }

            Employee[] employeesToAdd = employees.ToArray();
            User[] usersToAdd = users.ToArray();

            return new OutputType()
            {
                Employees = employeesToAdd,
                Users = usersToAdd
            };
        }

        public static Employee ProcessEmployeeInfo(string employeeInfo)
        {
            // Process employee info
            var info = employeeInfo.Split(',');
            if (info.Length != 8)
            {
                throw new InvalidDataException("Invalid employee info");
            }

            // Create new employee
            return new Employee
            {
                ID = int.Parse(info[0]),
                FirstName = info[1],
                LastName = info[2],
                Email = info[3],
                PhoneNumber = info[4],
                Grade = info[5][0],
                Role = info[6],
                Username = info[7],
                UserType = "User"
            };

        }

        public async Task SendEmail(EmailMessage email)
        {
            var sender = _client.CreateSender("emails");
            var message = JsonConvert.SerializeObject(email);
            var serviceBusMessage = new ServiceBusMessage(message);
            await sender.SendMessageAsync(serviceBusMessage);
        }

    }

    public class Employee
    {
        public int ID { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Role { get; set; }
        public char Grade { get; set; }
        public string? UserType { get; set; }
        public string? Username { get; set; }
    }

    public class User
    {
        public int Id { get; set; }
        public required string Username { get; set; }
        public required string Password { get; set; }
    }

    public class OutputType
    {
        [SqlOutput("dbo.Employees", connectionStringSetting: "SqlConnectionString")]
        public required Employee[] Employees { get; set; }

        [SqlOutput("dbo.Users", connectionStringSetting: "SqlConnectionString")]
        public required User[] Users { get; set; }
    }

    public class EmailMessage {
        public required string Email { get; set; }
        public required string Subject { get; set; }
        public required string Body { get; set; }
    }

}
