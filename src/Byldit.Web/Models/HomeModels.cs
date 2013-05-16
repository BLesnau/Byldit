using System.ComponentModel.DataAnnotations;

namespace Byldit.Web.Models
{
   public class EmailModel
   {
      [Required]
      [Display( Name = "Name" )]
      public string Name { get; set; }

      [Required]
      [Display( Name = "Email" )]
      public string Email { get; set; }
   }
}