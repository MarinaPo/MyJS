using System;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;
using Microsoft.AspNet.Identity.EntityFramework;
using FreeShop.Model;
using System.Collections.Generic;
using FreeShop.DAL;

namespace FreeShop.SPA.Models
{
    // Models used as parameters to AccountController actions.

    public class AddExternalLoginBindingModel
    {
        [Required]
        [Display(Name = "External access token")]
        public string ExternalAccessToken { get; set; }
    }

    public class ChangePasswordBindingModel
    {
        [Required]
        [DataType(DataType.Password)]
        [Display(Name = "Current password")]
        public string OldPassword { get; set; }

        [Required]
        [StringLength(100, ErrorMessage = "The {0} must be at least {2} characters long.", MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Display(Name = "New password")]
        public string NewPassword { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "Confirm new password")]
        [Compare("NewPassword", ErrorMessage = "The new password and confirmation password do not match.")]
        public string ConfirmPassword { get; set; }
    }

    public class RegisterBindingModel
    {
        [Display(Name = "Login Name")]
        [Required(ErrorMessage = "{0} cannot be blank")]
        [StringLength(20, ErrorMessage = "{0} is too long")]
        public string UserName { get; set; }

        [Required]
        [StringLength(100, ErrorMessage = "The {0} must be at least {2} characters long.", MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Display(Name = "Password")]
        public string Password { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "Confirm password")]
        [Compare("Password", ErrorMessage = "Confirm Password is not equal to Password")]
        public string ConfirmPassword { get; set; }

        [Display(Name = "First Name")]
        [Required(ErrorMessage = "{0} cannot be blank")]
        [StringLength(50, ErrorMessage = "{0} is too long")]
        public string FirstName { get; set; }
        [Display(Name = "Last Name")]
        [Required(ErrorMessage = "{0} cannot be blank")]
        [StringLength(50, ErrorMessage = "{0} is too long")]

        public string LastName { get; set; }
        [Display(Name = "Email Address")]
        [Required(ErrorMessage = "{0} cannot be blank")]
        [DataType(DataType.EmailAddress, ErrorMessage = "Incorrect format of Email Address")]
        public string Email { get; set; }

        [Display(Name = "Region")]
        [Required(ErrorMessage = "Select {0}")]
        public Region? Region { get; set; }

        [Display(Name = "Role")]
        [Required(ErrorMessage = "Select {0}")]
        public Role Role { get; set; }
        // Return a pre-poulated instance of User:
        public User GetUser()
        {
            var user = new User()
            {
                UserName = this.UserName,
                FirstName = this.FirstName,
                LastName = this.LastName,
                Email = this.Email,
                Region = this.Region,
            };
            return user;
        }
    }

    public class UpdateBindingModel : RegisterBindingModel
    {
        public string PreviousUserName;
    }

    //public class RegisterExternalBindingModel
    //{
    //    [Required]
    //    [Display(Name = "User name")]
    //    public string UserName { get; set; }
    //}

    public class RemoveLoginBindingModel
    {
        [Required]
        [Display(Name = "Login provider")]
        public string LoginProvider { get; set; }

        [Required]
        [Display(Name = "Provider key")]
        public string ProviderKey { get; set; }
    }

    //public class SetPasswordBindingModel
    //{
    //    [Required]
    //    [StringLength(100, ErrorMessage = "The {0} must be at least {2} characters long.", MinimumLength = 6)]
    //    [DataType(DataType.Password)]
    //    [Display(Name = "New password")]
    //    public string NewPassword { get; set; }

    //    [DataType(DataType.Password)]
    //    [Display(Name = "Confirm new password")]
    //    [Compare("NewPassword", ErrorMessage = "The new password and confirmation password do not match.")]
    //    public string ConfirmPassword { get; set; }
    //}
    public class SelectUserRolesViewModel
    {
        public SelectUserRolesViewModel() 
        {
            this.Roles = new List<SelectRoleEditorViewModel>();
        }
  
  
        // Enable initialization with an instance of ApplicationUser:
        //public SelectUserRolesViewModel(User user) : this()
        //{
        //    this.UserName = user.UserName;
        //    this.FirstName = user.FirstName;
        //    this.LastName = user.LastName;

        //    var Db = new FreeShopDbContext();
  
        //    // Add all available roles to the list of EditorViewModels:
        //    var allRoles = Db.Roles;
        //    foreach(var role in allRoles)
        //    {
        //        // An EditorViewModel will be used by Editor Template:
        //        var rvm = new SelectRoleEditorViewModel(role);
        //        this.Roles.Add(rvm);
        //    }
  
        //    // Set the Selected property to true for those roles for 
        //    // which the current user is a member:
        //    foreach(var userRole in user.Roles)
        //    {
        //        var checkUserRole = 
        //            this.Roles.Find(r => r.RoleName == userRole.Role.Name);
        //        checkUserRole.Selected = true;
        //    }
        //}
  
        public string UserName { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public List<SelectRoleEditorViewModel> Roles { get; set; }
    }
  
    // Used to display a single role with a checkbox, within a list structure:
    public class SelectRoleEditorViewModel
    {
        public SelectRoleEditorViewModel() {}
        public SelectRoleEditorViewModel(IdentityRole role)
        {
            this.RoleName = role.Name;
        }
  
        public bool Selected { get; set; }
  
        [Required]
        public string RoleName { get; set;}
    }
}

