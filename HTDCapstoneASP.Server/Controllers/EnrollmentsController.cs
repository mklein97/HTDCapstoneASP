using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HTDCapstoneASP.Server.Model;

namespace HTDCapstoneASP.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EnrollmentsController : ControllerBase
    {
        private readonly NoodemyContext _context;

        public EnrollmentsController(NoodemyContext context)
        {
            _context = context;
        }

        [HttpPost("{courseId}/{userId}")]
        public async Task<ActionResult<Enrollment>> PostEnrollment(int courseId, int userId)
        {
            var enrollment = new Enrollment();
            enrollment.CourseId = courseId;
            enrollment.UserId = userId;
            _context.Enrollments.Add(enrollment);
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEnrollment(int id)
        {
            var enrollment = await _context.Enrollments.FindAsync(id);
            if (enrollment == null)
            {
                return NotFound();
            }

            _context.Enrollments.Remove(enrollment);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool EnrollmentExists(int id)
        {
            return _context.Enrollments.Any(e => e.EnrollmentId == id);
        }
    }
}
