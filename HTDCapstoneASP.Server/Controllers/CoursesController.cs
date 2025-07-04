﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HTDCapstoneASP.Server.Model;
using Microsoft.AspNetCore.Authorization;
using System.Text.Json;

namespace HTDCapstoneASP.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CoursesController : ControllerBase
    {
        private readonly NoodemyContext _context;

        public CoursesController(NoodemyContext context)
        {
            _context = context;
        }

        // GET: api/Courses
        [HttpGet]
        public ActionResult<List<Course>> GetCourses()
        {
            var list = _context.Courses.Include(c => c.Category).ToList();
            return Ok(list);
        }

        [HttpGet("{id}/comments")]
        public ActionResult<IEnumerable<Comment>> GetCourseComments(int id)
        {
            var list = _context.Comments.Include(c => c.Enrollment).Include(c => c.Enrollment.User).Include(c => c.Enrollment.User.appUser).Where(comm => comm.Enrollment.CourseId == id).ToList();
            foreach (var v in list)
                v.postedBy = v.Enrollment.User.appUser.UserName;
            return list;
        }

        // GET: api/Courses/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Course>> GetCourse(int id)
        {
            var course = await _context.Courses.FindAsync(id);

            if (course == null)
            {
                return NotFound();
            }

            return course;
        }

        // PUT: api/Courses/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize(Roles = "ADMIN")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCourse(int id, [FromBody]Course course)
        {
            if (id != course.CourseId)
            {
                return BadRequest();
            }

            _context.Entry(course).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CourseExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok();
        }

        // POST: api/Courses
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize(Roles = "ADMIN")]
        [HttpPost]
        public async Task<ActionResult<Course>> PostCourse([FromBody]Course course)
        {
            _context.Courses.Add(course);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCourse", new { id = course.CourseId }, course);
        }

        // DELETE: api/Courses/5
        [Authorize(Roles = "ADMIN")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCourse(int id)
        {
            var course = await _context.Courses.FindAsync(id);
            if (course == null)
            {
                return NotFound();
            }

            _context.Courses.Remove(course);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CourseExists(int id)
        {
            return _context.Courses.Any(e => e.CourseId == id);
        }
    }
}
