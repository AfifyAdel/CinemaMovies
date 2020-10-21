using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AngularToAPI.Models;
using AngularToAPI.Models.Admin;
using AngularToAPI.Repositories.Admin;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AngularToAPI.Controllers
{
    [Route("[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly IAdminRepository _repo;
        public AdminController(IAdminRepository repo)
        {
            _repo = repo;
        }
        [HttpGet]
        [Route("GetAllUsers")]
        public async Task<IEnumerable<ApplicationUser>> GetAllUsers()
        {
            return await _repo.GetAllUsers(); 
        }
        [HttpPost]
        [Route("AddNewUser")]
        public async Task<IActionResult> AddNewUser(UserModel model)
        {
            if (ModelState.IsValid)
            {
                if (await _repo.AddUser(model) != null)
                    return Ok();
            }
            return BadRequest();
        }
    }
}
