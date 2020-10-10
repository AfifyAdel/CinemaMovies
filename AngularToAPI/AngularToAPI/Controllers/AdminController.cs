using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AngularToAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AngularToAPI.Controllers
{
    [Route("[controller]")]
    [ApiController]
    [Authorize]
    public class AdminController : ControllerBase
    {
        private readonly ApplicationDb _db;
        public AdminController(ApplicationDb db)
        {
            _db = db;
        }
        [Authorize(Roles = "Admin")]
        [HttpGet]
        [Route("GetAllUsers")]
        public async Task<ActionResult<IEnumerable<ApplicationUser>>> GetAllUsers()
        {
            return await _db.Users.ToListAsync();
        }
    }
}
