﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace AngularToAPI.Models.Admin
{
    public class UserModel
    {
        [StringLength(256), Required, EmailAddress]
        public string Email { get; set; }
        [StringLength(256), Required]
        public string UserName { get; set; }
        [Required]
        public string Password { get; set; }
        [DataType(DataType.PhoneNumber)]
        public string PhoneNumber { get; set; }
        public string Country { get; set; }
        [Required]
        public bool EmailConfirmed { get; set; }
    }
}
