using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AngularToAPI.Models;
using AngularToAPI.Models.Admin;
using AngularToAPI.ModelViews.Admin;
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
        [HttpGet]
        [Route("GetUser/{id}")]
        public async Task<ActionResult<ApplicationUser>> GetUser(string id)
        {
            if (string.IsNullOrEmpty(id))
                return NotFound();
            var user = await _repo.GetUser(id);
            if (user != null)
                return user;
            return BadRequest();
        }
        [HttpPut]
        [Route("EditUser")]
        public async Task<ActionResult<ApplicationUser>> EditUser(EditUserModel model)
        {
            if (ModelState.IsValid)
            {
                if (await _repo.EditUser(model) != null)
                    return Ok();
            }
            return BadRequest();
        }
        [HttpPost]
        [Route("DeleteUsers")]
        public async Task<IActionResult> DeleteUsers(List<string> ids)
        {
            if (ids.Count < 1)
                return BadRequest();

            if (await _repo.DeleteUsers(ids))
                return Ok();
            return BadRequest();
        }
        [HttpGet]
        [Route("GetUsersRoles")]
        public async Task<IEnumerable<UserRoleModel>> GetUsersRoles()
        {
            return await _repo.GetUsersRoles();
        }
    }
}
