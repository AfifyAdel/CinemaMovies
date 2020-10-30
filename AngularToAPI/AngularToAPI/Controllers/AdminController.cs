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
        
        [HttpGet]
        [Route("GetAllRoles")]
        public async Task<IEnumerable<ApplicationRole>> GetAllRoles()
        {
            return await _repo.GetAllRoles();
        }

        [HttpPut]
        [Route("EditUserRole")]
        public async Task<ActionResult<bool>> EditUserRole(UserRoleModel model)
        {
            if (string.IsNullOrEmpty(model.UserId) || string.IsNullOrEmpty(model.RoleId))
            {
                return BadRequest();
            }
            if (await _repo.EditUserRole(model.UserId, model.RoleId))
                return Ok();
            return BadRequest();
        }

        [HttpGet]
        [Route("GetAllCategories")]
        public async Task<IEnumerable<Category>> GetAllCategories()
        {
            return await _repo.GetAllCategories();
        }

        [HttpPost]
        [Route("AddCategory")]
        public async Task<IActionResult> AddCategory(Category category)
        {
            if (ModelState.IsValid)
            {
                if (string.IsNullOrEmpty(category.CategoryName))
                    return BadRequest();

                if (await _repo.AddCategory(category) != null)
                    return Ok();
            }
            return BadRequest();
        }

        [HttpGet]
        [Route("GetCategory/{id}")]
        public async Task<ActionResult<Category>> GetCategory(string id)
        {
            var category = await _repo.GetCategory(int.Parse(id));
            if (category != null)
                return category;
            return BadRequest();
        }

        [HttpPut]
        [Route("EditCategory")]
        public async Task<ActionResult<Category>> EditCategory(Category category)
        {
            if (ModelState.IsValid)
            {
                if (await _repo.EditCategory(category))
                    return Ok();
            }
            return BadRequest();
        }

        [HttpPost]
        [Route("DeleteCategory")]
        public async Task<IActionResult> DeleteCategory(Category category)
        {
            if (ModelState.IsValid)
            {
                if (await _repo.DeleteCategory(category))
                    return Ok();
            }
            return BadRequest();
        }

        [HttpGet]
        [Route("GetSubCategories")]
        public async Task<IEnumerable<SubCategory>> GetSubCategories()
        {
            return await _repo.GetSubCategoriesAsync();
        }

        [HttpPost]
        [Route("AddSubCategory")]
        public async Task<IActionResult> AddSubCategory(SubCategory model)
        {
            if (model == null)
            {
                return BadRequest();
            }
            var cat = await _repo.AddSubCategoryAsync(model);
            if (cat != null)
            {
                return Ok();
            }
            return BadRequest();
        }

        [HttpPut]
        [Route("EditSubCategory")]
        public async Task<IActionResult> EditSubCategory(SubCategory model)
        {
            if (model == null)
            {
                return BadRequest();
            }
            var cat = await _repo.EditSubCategoryAsync(model);
            if (cat != null)
            {
                return Ok();
            }
            return BadRequest();
        }

        [HttpPost]
        [Route("DeleteSubCategory")]
        public async Task<IActionResult> DeleteSubCategory(SubCategory model)
        {
            if (model == null)
            {
                return BadRequest();
            }

            var result = await _repo.DeleteSubCategory(model);
            if (result)
            {
                return Ok();
            }
            return BadRequest();
        }
    }
}
