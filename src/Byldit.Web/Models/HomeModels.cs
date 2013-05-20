using System.ComponentModel.DataAnnotations;
using TechSmith.Hyde.Common.DataAnnotations;

namespace Byldit.Web.Models
{
   public class EmailModel
   {
      public EmailModel()
      {
         Version = 1;
         Submitted = false;
      }

      [PartitionKey, RowKey]
      [Display( Name = "Email:" ), EmailAddress( ErrorMessage = "*" ), Required( ErrorMessage = "*" )]
      public string Email { get; set; }

      [Display( Name = "Name:" )]
      public string Name { get; set; }

      [DontSerializeAttribute]
      public bool Submitted { get; set; }

      public int Version { get; private set; }
   }
}