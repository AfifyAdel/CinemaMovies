using AngularToAPI.Models;
using AngularToAPI.Models.Admin;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AngularToAPI.Repositories.Admin
{
    public class AdminRepository : IAdminRepository
    {
        private readonly ApplicationDb _db;
        private readonly UserManager<ApplicationUser> _userManager;
        public AdminRepository(ApplicationDb db,UserManager<ApplicationUser> userManager)
        {
            _db = db;
            _userManager = userManager;
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
                return user;
            return null;
        }

        public async Task<IEnumerable<ApplicationUser>> GetAllUsers()
        {
            return await _db.Users.ToListAsync();
        }
    }
}
