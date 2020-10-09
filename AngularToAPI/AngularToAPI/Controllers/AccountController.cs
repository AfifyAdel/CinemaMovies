using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;
using System.Web;
using AngularToAPI.Models;
using AngularToAPI.ModelViews;
using AngularToAPI.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;
using Microsoft.Extensions.Logging;

namespace AngularToAPI.Controllers
{
    [Route("[controller]")]
    [ApiController]
    [AllowAnonymous]
    public class AccountController : ControllerBase
    {
        private readonly ApplicationDb _db;
        private readonly UserManager<ApplicationUser> _manger;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly RoleManager<ApplicationRole> _roleManager;

        public AccountController(ApplicationDb db, UserManager<ApplicationUser> manager
            , SignInManager<ApplicationUser> signInManager, RoleManager<ApplicationRole> roleManager)
        {
            _db = db;
            _manger = manager;
            _signInManager = signInManager;
            _roleManager = roleManager;
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
                //if (EmailExist(model.Email))
                //{
                //    return BadRequest("Email is used");
                //}
                //if (UserNameExist(model.UserName))
                //{
                //    return BadRequest("Username is used");
                //}
                var newUser = new ApplicationUser();
                newUser.Email = model.Email;
                newUser.UserName = model.UserName;
                var result = await _manger.CreateAsync(newUser, model.Password);
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
                    if (await SendGridAPI.Execute(newUser.Email, newUser.UserName, subject, content, htmlContent))
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



        [HttpGet]
        [Route("UserNameExist/{username}/{id}")]
        public async Task<ActionResult> UserNameExistAsync(string username,int id)
        {
            var user = await _db.Users.AnyAsync(x => x.UserName == username);
            if (user)
                return StatusCode(StatusCodes.Status200OK);
            else
                return StatusCode(StatusCodes.Status400BadRequest);
        }



        [HttpGet]
        [Route("EmailExist")]
        public ActionResult EmailExist(string email)
        {
            var user = _db.Users.Any(x => x.Email == email);
            if (user)
                return StatusCode(StatusCodes.Status200OK);
            else
                return StatusCode(StatusCodes.Status400BadRequest);
        }
        [HttpGet]
        [Route("RegistertionConfirm")]
        public async Task<IActionResult> RegistertionConfirm(string ID, string Token)
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
            await CreateRoles();
            await CreateAdmin();
            if (model == null)
                return NotFound("Email or Password is not correct");
            var user = await _manger.FindByEmailAsync(model.Email);
            if (user == null)
                return NotFound("Email or Password is not correct");
            if (!user.EmailConfirmed)
                return Unauthorized("Email not confirmed yet!!");
            var response = await _signInManager.PasswordSignInAsync(user, model.Password, model.RememberMe, true);
            if (response.Succeeded)
            {
                if (await _roleManager.RoleExistsAsync("User"))
                    if(!await _manger.IsInRoleAsync(user,"User"))
                        await _manger.AddToRoleAsync(user, "User");

                var roleName = await GetRoleNameByUserIdAsync(user.Id);
                if(!string.IsNullOrEmpty(roleName))
                    AddCookies(user.UserName, roleName, user.Id, model.RememberMe, user.Email);
                return Ok();
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

        private async Task<string> GetRoleNameByUserIdAsync(string id)
        {
            var userRole = await _db.UserRoles.FirstOrDefaultAsync(x=>x.UserId==id);
            if(userRole!=null)
                return await _db.Roles.Where(x => x.Id == userRole.RoleId).Select(g=>g.Name).FirstOrDefaultAsync();
            return null;
        }

        [HttpGet]
        [Route("GetRoleName/{email}")]
        public async Task<string> GetRoleName(string email)
        {
            var user = await _db.Users.FirstOrDefaultAsync(x => x.Email == email);
            if (user != null)
            {
                var userRole = await _db.UserRoles.FirstOrDefaultAsync(x => x.UserId == user.Id);
                if (userRole != null)
                    return await _db.Roles.Where(x => x.Id == userRole.RoleId).Select(g => g.Name).FirstOrDefaultAsync();
            }
            return null;
        }

        [Authorize(Roles ="Admin")]
        [HttpGet]
        [Route("GetAllUsers")]
        public async Task<ActionResult<IEnumerable<ApplicationUser>>> GetAllUsers()
        {
            return await _db.Users.ToListAsync();
        }

        private async Task CreateAdmin()
        {
            var admin = await _manger.FindByNameAsync("Admin");
            if (admin == null)
            {
                var newUser = new ApplicationUser();
                newUser.Email = "Admin@Admin.com";
                newUser.UserName = "Admin";
                newUser.EmailConfirmed = true;

                var result = await _manger.CreateAsync(newUser, "123#Aa");
                if (result.Succeeded)
                {
                    if(await _roleManager.RoleExistsAsync("Admin"))
                        await _manger.AddToRoleAsync(newUser, "Admin");
                }
            }
        }
        private async Task CreateRoles()
        {
            if (_roleManager.Roles.Count() < 1)
            {
                var role = new ApplicationRole()
                {
                    Name = "Admin"
                };
                await _roleManager.CreateAsync(role);

                role = new ApplicationRole()
                {
                    Name = "User"
                };
                await _roleManager.CreateAsync(role);
            }
        }

        private async void AddCookies(string username, string roleName, string userId, bool remember, string email)
        {
            var claim = new List<Claim>
            {
                new Claim(ClaimTypes.Name, username),
                new Claim(ClaimTypes.Email, email),
                new Claim(ClaimTypes.NameIdentifier, userId),
                new Claim(ClaimTypes.Role, roleName),
            };

            var claimIdentity = new ClaimsIdentity(claim, CookieAuthenticationDefaults.AuthenticationScheme);

            if (remember)
            {
                var authProperties = new AuthenticationProperties
                {
                    AllowRefresh = true,
                    IsPersistent = true,
                    ExpiresUtc = DateTime.UtcNow.AddDays(10)
                };

                await HttpContext.SignInAsync
                (
                   CookieAuthenticationDefaults.AuthenticationScheme,
                   new ClaimsPrincipal(claimIdentity),
                   authProperties
                );
            }
            else
            {
                var authProperties = new AuthenticationProperties
                {
                    AllowRefresh = true,
                    IsPersistent = false,
                    ExpiresUtc = DateTime.UtcNow.AddMinutes(30)
                };

                await HttpContext.SignInAsync
                (
                   CookieAuthenticationDefaults.AuthenticationScheme,
                   new ClaimsPrincipal(claimIdentity),
                   authProperties
                );
            }
        }


        [HttpGet]
        [Route("Logout")]
        public async Task<IActionResult> Logout()
        {
            var authProperties = new AuthenticationProperties
            {
                AllowRefresh = true,
                IsPersistent = true,
                ExpiresUtc = DateTime.UtcNow.AddDays(10)
            };
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme, authProperties);
            return Ok();
        }

        [Authorize]
        [HttpGet]
        [Route("CheckUserClaims/{email}/{role}")]
        public IActionResult CheckUserClaims(string email,string role)
        {
            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            if(userEmail != null && userRole != null)
            {
                if (email == userEmail && role == userRole)
                     return StatusCode(StatusCodes.Status200OK);
            }
            return StatusCode(StatusCodes.Status203NonAuthoritative);
        }

    }
}
