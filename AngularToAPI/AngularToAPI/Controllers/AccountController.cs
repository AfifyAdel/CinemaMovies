using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;
using System.Web;
using AngularToAPI.Models;
using AngularToAPI.ModelViews;
using AngularToAPI.Services;
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
        private readonly SignInManager<ApplicationUser> _signInManager;

        public AccountController(ApplicationDb db,UserManager<ApplicationUser> manager , SignInManager<ApplicationUser> signInManager)
        {
            _db = db;
            _manger = manager;
            _signInManager = signInManager;
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
                    //Generate Link
                    //http://localhost:60761/Account/RegistertionConfirm?ID=449448&Token=hids56sfs
                    var token = await _manger.GenerateEmailConfirmationTokenAsync(newUser);
                    var confirmLink = Url.Action("RegistertionConfirm", "Account", new
                    { ID = newUser.Id, Token = HttpUtility.UrlEncode(token) }, Request.Scheme);
                    //SendGridAPI
                    var subject = "Registertion Confirm";
                    var content = "Please Confirm your registertion in our site";
                    var htmlContent = "<a href = \"" + confirmLink + "\"> Confirm Registrion</a>";
                    if(await SendGridAPI.Execute(newUser.Email,newUser.UserName, subject, content, htmlContent))
                    {
                        return StatusCode(StatusCodes.Status200OK);
                    }
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
        [HttpGet]
        [Route("RegistertionConfirm")]
        public async Task<IActionResult> RegistertionConfirm(string ID,string Token)
        {
            if (string.IsNullOrEmpty(ID) || string.IsNullOrEmpty(Token))
                return NotFound();
            var user = await _manger.FindByIdAsync(ID);
            if (user == null)
                return NotFound();
            var result = await _manger.ConfirmEmailAsync(user, HttpUtility.UrlDecode(Token));
            if (result.Succeeded)
                return Ok("Registertion Success");
            else
                return BadRequest(result.Errors);
        }


        [HttpPost]
        [Route("Login")]
        public async Task<IActionResult> Login(LoginModel model)
        {
            if (model == null)
                return NotFound();
            var user = await _manger.FindByEmailAsync(model.Email);
            if (user == null)
                return NotFound();
            if (!user.EmailConfirmed)
                return Unauthorized("Email not confirmed yet!!");
            var response = await _signInManager.PasswordSignInAsync(user, model.Password, model.RememberMe, true);
            if (response.Succeeded)
            {
                return Ok("Login Success");
            }
            else if (response.IsLockedOut)
            {
                return Unauthorized("User account is locked");
            }
            else
            {
                return StatusCode(StatusCodes.Status204NoContent);
            }
        }
    }
}
