using AngularToAPI.Models;
using AngularToAPI.Models.Admin;
using AngularToAPI.ModelViews.Admin;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;

namespace AngularToAPI.Repositories.Admin
{
    public class AdminRepository : IAdminRepository
    {
        private readonly ApplicationDb _db;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<ApplicationRole> _roleManager;
        public AdminRepository(ApplicationDb db,UserManager<ApplicationUser> userManager,RoleManager<ApplicationRole> roleManager)
        {
            _db = db;
            _userManager = userManager;
            _roleManager = roleManager;
        }

        public async Task<ApplicationUser> AddUser(UserModel model)
        {
            if (model == null)
                return null;
            var user = new ApplicationUser()
            {
                Email = model.Email,
                PhoneNumber = model.PhoneNumber,
                UserName = model.UserName,
                Country = model.Country,
                EmailConfirmed = model.EmailConfirmed
            };
            var result = await _userManager.CreateAsync(user, model.Password);
            if (result.Succeeded)
            {
                if (await _roleManager.RoleExistsAsync("User"))
                    if (!await _userManager.IsInRoleAsync(user, "User") && !await _userManager.IsInRoleAsync(user, "Admin"))
                        await _userManager.AddToRoleAsync(user, "User");
                return user;
            }
            return null;
        }

        public async Task<ApplicationUser> GetUser(string id)
        {
            if (string.IsNullOrEmpty(id))
                return null;
            var user = await _db.Users.FirstOrDefaultAsync(x => x.Id == id);
            if (user != null)
                return user;
            return null;
        }

        public async Task<IEnumerable<ApplicationUser>> GetAllUsers()
        {
            return await _db.Users.ToListAsync();
        }

        public async Task<ApplicationUser> EditUser(EditUserModel model)
        {
            if (model == null || string.IsNullOrEmpty(model.Id))
                return null;
            var user = await _db.Users.FirstOrDefaultAsync(x => x.Id == model.Id);
            if (user == null)
                return null;

            if (model.Password != user.PasswordHash)
            {
                var result = await _userManager.RemovePasswordAsync(user);
                if(result.Succeeded)
                    await _userManager.AddPasswordAsync(user, model.Password);
            }

            _db.Users.Attach(user);

            user.Email = model.Email;
            user.UserName = model.UserName;
            user.EmailConfirmed = model.EmailConfirmed;
            user.PhoneNumber = model.PhoneNumber;
            user.Country = model.Country;

            _db.Entry(user).Property(x => x.Email).IsModified = true;
            _db.Entry(user).Property(x => x.UserName).IsModified = true;
            _db.Entry(user).Property(x => x.EmailConfirmed).IsModified = true;
            _db.Entry(user).Property(x => x.PhoneNumber).IsModified = true;
            _db.Entry(user).Property(x => x.Country).IsModified = true;

            await _db.SaveChangesAsync();
            
            return user;
        }

        public async Task<bool> DeleteUsers(List<string> ids)
        {
            if (ids.Count < 1)
                return false;
            foreach (var id in ids)
            {
                var user = await _db.Users.FirstOrDefaultAsync(x => x.Id == id);
                if(user != null)
                {
                    await _userManager.DeleteAsync(user);
                }
            }
            await _db.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<UserRoleModel>> GetUsersRoles()
        {
            var query = await (
                    from userRole in _db.UserRoles
                    join users in _db.Users
                    on userRole.UserId equals users.Id
                    join role in _db.Roles
                    on userRole.RoleId equals role.Id
                    select new
                    {
                        userRole.RoleId,
                        userRole.UserId,
                        role.Name,
                        users.UserName
                    }
                ).ToListAsync();
            var usersRoles = new List<UserRoleModel>();
            foreach (var userRole in query)
            {
                var newUserRole = new UserRoleModel()
                {
                    UserId = userRole.UserId,
                    Username = userRole.UserName,
                    RoleId = userRole.RoleId,
                    RoleName = userRole.Name
                };
                usersRoles.Add(newUserRole);
            }
            return usersRoles;
        }
    }
}
