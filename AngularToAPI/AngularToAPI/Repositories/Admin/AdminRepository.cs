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

        public async Task<IEnumerable<ApplicationRole>> GetAllRoles()
        {
            return await _db.Roles.ToListAsync();
        }

        public async Task<bool> EditUserRole(string userId, string roleId)
        {
            if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(roleId))
                return false;
            var user = await _db.Users.FirstOrDefaultAsync(x => x.Id == userId);
            if (user == null)
                return false;

            var currentUserRoleId = await _db.UserRoles.Where(x => x.UserId == userId).Select(s => s.RoleId).FirstOrDefaultAsync();
            var currentRole = await _db.Roles.FirstOrDefaultAsync(x => x.Id == currentUserRoleId);
            if (currentRole == null)
                return false;

            if (await _userManager.IsInRoleAsync(user, currentRole.Name))
            {
                var result = await _userManager.RemoveFromRoleAsync(user, currentRole.Name);
                if (result.Succeeded)
                {
                    var role = await _db.Roles.FirstOrDefaultAsync(x => x.Id == roleId);
                    if (role == null)
                        return false;

                    var response = await _userManager.AddToRoleAsync(user, role.Name);
                    if (response.Succeeded)
                    {
                        return true;
                    }
                }
            }
            return false;
        }

        public async Task<IEnumerable<Category>> GetAllCategories()
        {
            return await _db.Categories.ToListAsync();
        }

        public async Task<Category> AddCategory(Category category)
        {
         
            var newCategory = new Category()
            {
                CategoryName = category.CategoryName
            };
            _db.Categories.Add(newCategory);
            await _db.SaveChangesAsync();
            return newCategory;
        }

        public async Task<Category> GetCategory(int id)
        {
            var category = await _db.Categories.FirstOrDefaultAsync(x => x.Id == id);
            if (category != null)
                return category;
            return null;
        }

        public async Task<bool> EditCategory(Category category)
        {
            if (category == null || string.IsNullOrEmpty(category.CategoryName))
                return false;
            var curCategory = await _db.Categories.FirstOrDefaultAsync(x => x.Id == category.Id);
            if (curCategory == null)
                return false;

            _db.Categories.Attach(curCategory);

            curCategory.CategoryName = category.CategoryName;
           
            _db.Entry(curCategory).Property(x => x.CategoryName).IsModified = true;

            await _db.SaveChangesAsync();

            return true;
        }

        public async Task<bool> DeleteCategory(Category category)
        {
            if (category.Id < 0)
                return false;
            var currentCategory = await _db.Categories.FirstOrDefaultAsync(x => x.Id == category.Id);
            if (currentCategory != null)
            {
                _db.Categories.Remove(currentCategory);
                await _db.SaveChangesAsync();
                return true;
            }
            return false;
        }
        public async Task<IEnumerable<SubCategory>> GetSubCategoriesAsync()
        {
            return await _db.SubCategories.Include(x => x.Category).ToListAsync();
        }

        public async Task<SubCategory> AddSubCategoryAsync(SubCategory model)
        {
            var subCategory = new SubCategory
            {
                SubCategoryName = model.SubCategoryName,
                CategoryId = model.CategoryId
            };
            _db.SubCategories.Add(subCategory);
            await _db.SaveChangesAsync();
            return subCategory;
        }

        public async Task<SubCategory> EditSubCategoryAsync(SubCategory model)
        {
            if (model == null || model.Id < 1)
            {
                return null;
            }

            var subCategory = await _db.SubCategories.FirstOrDefaultAsync(x => x.Id == model.Id);
            if (subCategory == null)
            {
                return null;
            }
            _db.SubCategories.Attach(subCategory);
            subCategory.SubCategoryName = model.SubCategoryName;
            subCategory.CategoryId = model.CategoryId;

            _db.Entry(subCategory).Property(x => x.SubCategoryName).IsModified = true;
            _db.Entry(subCategory).Property(x => x.CategoryId).IsModified = true;

            await _db.SaveChangesAsync();
            return subCategory;
        }
        public async Task<bool> DeleteSubCategory(SubCategory subCategory)
        {
            if (subCategory.Id < 0)
                return false;
            var currentSubCategory = await _db.SubCategories.FirstOrDefaultAsync(x => x.Id == subCategory.Id);
            if (currentSubCategory != null)
            {
                _db.SubCategories.Remove(currentSubCategory);
                await _db.SaveChangesAsync();
                return true;
            }
            return false;
        }

    }
}
