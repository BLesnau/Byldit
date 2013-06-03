using System.ComponentModel.DataAnnotations;
using TechSmith.Hyde.Common.DataAnnotations;

namespace Byldit.DataModel
{
   public class SubmitEmail
   {
      public SubmitEmail()
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
