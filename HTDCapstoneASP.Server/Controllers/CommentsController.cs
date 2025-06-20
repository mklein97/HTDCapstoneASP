using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HTDCapstoneASP.Server.Model;
using Microsoft.AspNetCore.Authorization;
using NuGet.Protocol;

namespace HTDCapstoneASP.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommentsController : ControllerBase
    {
        private readonly NoodemyContext _context;

        public CommentsController(NoodemyContext context)
        {
            _context = context;
        }

        // PUT: api/Comments/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        [Authorize(Roles = "USER")]
        public async Task<IActionResult> PutComment(int id, [FromBody]Comment comment)
        {
            if (id != comment.commentId)
            {
                return BadRequest();
            }

            _context.Entry(comment).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CommentExists(id))
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

        // POST: api/Comments
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [Authorize(Roles = "USER")]
        public async Task<ActionResult<Comment>> PostComment([FromBody(EmptyBodyBehavior = Microsoft.AspNetCore.Mvc.ModelBinding.EmptyBodyBehavior.Allow)]Comment comment)
        {
            var result = _context.Comments.Add(comment);
            await _context.SaveChangesAsync();

            return Created("https://localhost:7130", result.ToJson());
        }

        // DELETE: api/Comments/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "USER")]
        public async Task<IActionResult> DeleteComment(int id)
        {
            var comment = await _context.Comments.FindAsync(id);
            if (comment == null)
            {
                return NotFound();
            }

            _context.Comments.Remove(comment);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CommentExists(int id)
        {
            return _context.Comments.Any(e => e.commentId == id);
        }
    }
}
