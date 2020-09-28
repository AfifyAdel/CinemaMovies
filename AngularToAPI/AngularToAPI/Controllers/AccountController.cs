using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;
using AngularToAPI.Models;
using AngularToAPI.ModelViews;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace AngularToAPI.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly ApplicationDb _db;
        private readonly UserManager<ApplicationUser> _manger;

        public AccountController(ApplicationDb db,UserManager<ApplicationUser> manager)
        {
            _db = db;
            _manger = manager;
        }
        [HttpPost]
        [Route("Register")]
        public async Task<IActionResult> Register(RegisterModel model)
        {
            if (model == null)
            {
                return NotFound();
            }
            if (ModelState.IsValid)
            {
                if (EmailExist(model.Email))
                {
                    return BadRequest("Email is used");
                }
                if (UserNameExist(model.UserName))
                {
                    return BadRequest("Username is used");
                }
                var newUser = new ApplicationUser();
                newUser.Email = model.Email;
                newUser.UserName = model.UserName;
                var result = await _manger.CreateAsync(newUser,model.Password);
                if (result.Succeeded)
                {
                    return StatusCode(StatusCodes.Status200OK);
                }
                else
                {
                    return BadRequest(result.Errors);
                }
            }
            return StatusCode(StatusCodes.Status400BadRequest);
        }

        private bool UserNameExist(string username)
        {
            return _db.Users.Any(x => x.UserName == username);
        }

        private bool EmailExist(string email)
        {
            return _db.Users.Any(x => x.Email == email);
        }
    }
}
