using AngularToAPI.Models;
using AngularToAPI.Models.Admin;
using AngularToAPI.ModelViews.Admin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AngularToAPI.Repositories.Admin
{
    public interface IAdminRepository
    {
        Task<IEnumerable<ApplicationUser>> GetAllUsers();
        Task<ApplicationUser> AddUser(UserModel model);
        Task<ApplicationUser> GetUser(string id);
        Task<ApplicationUser> EditUser(EditUserModel model);
        Task<bool> DeleteUsers(List<string> ids);
    }
}
