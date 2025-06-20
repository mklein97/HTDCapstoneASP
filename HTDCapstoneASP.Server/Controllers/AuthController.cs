using AuthCore.Services;
using HTDCapstoneASP.Server.Model;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.Net;

namespace HTDCapstoneASP.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly NoodemyContext _context;

        public AuthController(NoodemyContext context)
        {
            _context = context;
        }

        [HttpPost("login")]
        public ActionResult LogIn([FromBody]LoginRequestDTO request)
        {
            AppUser user = null;
            var errors = new List<string>();
            foreach (var v in _context.AppUsers.Include(a => a.Role).ToList())
            {
                if (string.Equals(v.UserName, request.UserName, StringComparison.OrdinalIgnoreCase))
                {
                    if (v.PasswordHash == request.password)
                    {
                        user = v; 
                        break;
                    }
                    else
                    {
                        errors.Add("Incorrect password");
                        break;
                    }
                }
            }
            if (user == null)
            {
                errors.Add("User not found");
                return BadRequest(errors);
            }
            else
            {
                var jwt = new AuthService();
                var response = new LoginResponseDTO()
                {
                    jwtToken = jwt.GenerateToken(user),
                    roleName = user.Role.RoleName,
                    userId = user.AppUserId,
                    username = user.UserName
                };
                return Ok(response);
            }    
        }

        private class RegisterResponseDTO
        {
            public int userId { get; set; }
            public string username { get; set; }
        }

        [HttpPost("register")]
        public ActionResult Register([FromBody]RegisterRequestDTO request)
        {
            var newAppUser = new AppUser() { UserName = request.UserName, PasswordHash = request.password, RoleId = request.roleId };

            var context = new ValidationContext(newAppUser, serviceProvider: null, items: null);
            var validationResults = new List<ValidationResult>();

            bool isValid = Validator.TryValidateObject(newAppUser, context, validationResults, true);

            if (isValid)
            {
                var newUserProfile = new UserProfile()
                {
                    firstName = request.firstName,
                    lastName = request.lastName,
                    dob = request.dob,
                    Email = request.email,
                };

                context = new ValidationContext(newUserProfile, serviceProvider: null, items: null);
                if (!Validator.TryValidateObject(newUserProfile, context, validationResults, true))
                    return BadRequest(validationResults);

                var addResult = _context.AppUsers.Add(newAppUser);
                newUserProfile.appUserId = addResult.CurrentValues.GetValue<int>("AppUserId");
                _context.UserProfiles.Add(newUserProfile);
                _context.SaveChanges();

                return Created("https://localhost:7130", new RegisterResponseDTO() { userId = newUserProfile.userId, username = request.UserName });

            }

            return BadRequest(validationResults);
        }
    }
}
