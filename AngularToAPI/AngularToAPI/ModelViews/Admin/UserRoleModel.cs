using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace AngularToAPI.ModelViews.Admin
{
    public class UserRoleModel
    {
        [Required]
        public string UserId { get; set; }
        [Required]
        public string Username { get; set; }
        [Required]
        public string RoleId { get; set; }
        [Required]
        public string RoleName { get; set; }
    }
}
