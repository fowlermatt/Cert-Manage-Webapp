using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using webapp.Server.Data;
using webapp.Server.Models;
using Azure.Storage.Blobs;
using Azure.Storage;
using Azure.Storage.Blobs.Models;


namespace webapp.Server.Services
{
    public class UserService
    {
        private readonly EmployeeContext _employeeContext;

        public UserService(EmployeeContext employeeContext)
        {
            _employeeContext = employeeContext;
        }

        public Task<User> Login(string username, string password)
        {
            var users = _employeeContext.Users.AsEnumerable();

            try
            {
                var findUser = users
                            .Select(user => user)
                            .Where(user => user.Username == username);

                var user = findUser.FirstOrDefault();

                if (user != null && user.Password == password)
                {
                    return Task.FromResult(user);
                }
                else
                {
                    //wrong password
                    return Task.FromException<User>(new InvalidOperationException($"Login/password is incorrect"));
                }
            }
            catch
            {
                throw;
            }
        }

        public Task<int> GetUserId(string username)
        {
            var users = _employeeContext.Users.AsEnumerable();

            try
            {
                var findUser = users
                            .Select(user => user)
                            .Where(user => user.Username == username);

                var user = findUser.FirstOrDefault();

                if (user != null)
                {
                    return Task.FromResult(user.Id);
                }
                else
                {
                    //wrong password
                    return Task.FromException<int>(new InvalidOperationException($"No such username found"));
                }
            }
            catch
            {
                throw;
            }
        }

        public Task<Boolean> VerifyPassword(int id, string password)
        {
            var users = _employeeContext.Users.AsEnumerable();

            try
            {
                var findUser = users
                            .Select(user => user)
                            .Where(user => user.Id == id);

                var user = findUser.FirstOrDefault();

                if (user != null && user.Password == password)
                {
                    return Task.FromResult(true);
                }
                else
                {
                    //wrong password
                    return Task.FromException<Boolean>(new InvalidOperationException($"Password is incorrect"));
                }
            }
            catch
            {
                throw;
            }
        }

        public Task<Boolean> ChangePassword(int id, string password)
        {
            var users = _employeeContext.Users.AsEnumerable();

            try
            {
                var findUser = users
                            .Select(user => user)
                            .Where(user => user.Id == id);

                var user = findUser.FirstOrDefault();

                if (user != null)
                {
                    user.Password = password;
                    _employeeContext.SaveChanges();
                    return Task.FromResult(true);
                }
                else
                {
                    //wrong password
                    return Task.FromException<Boolean>(new InvalidOperationException($"Error. Password couldn't be changed."));
                }
            }
            catch
            {
                throw;
            }
        }

        public async Task<string> UploadImage(IFormFile file, string userId)
        {

            BlobContainerClient containerClient = new BlobContainerClient("YourConnectionStringHere", "profile-pics");

            await containerClient.CreateIfNotExistsAsync();
            BlobClient blobClient = containerClient.GetBlobClient(userId + ".jpg");
            BlobHttpHeaders httpHeaders = new BlobHttpHeaders()
            {
                ContentType = file.ContentType
            };

            await blobClient.UploadAsync(file.OpenReadStream(), httpHeaders);

            return "OK";
        }




    }
} 