using AuthCore.Services;
using HTDCapstoneASP.Server.Model;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
            var addResult = _context.AppUsers.Add(newAppUser);

            var newUserProfile = new UserProfile() {firstName = request.firstName, 
                lastName = request.lastName, dob = request.dob, Email = request.email, appUserId = addResult.CurrentValues.GetValue<int>("AppUserId")};
            _context.UserProfiles.Add(newUserProfile);
            _context.SaveChanges();

            return Created("https://localhost:7130", new RegisterResponseDTO() { userId = newUserProfile.userId, username = request.UserName });
        }
    }
}
