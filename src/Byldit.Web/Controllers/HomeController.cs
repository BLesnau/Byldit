using System.Collections;
using System.Linq;
using System.Web.Mvc;
using Byldit.Web.Models;
using Microsoft.WindowsAzure;
using Microsoft.WindowsAzure.ServiceRuntime;
using Microsoft.WindowsAzure.Storage;
using TechSmith.Hyde;
using TechSmith.Hyde.Table;

namespace Byldit.Web.Controllers
{
   public class HomeController : Controller
   {
      public ActionResult Index()
      {
         ViewBag.Message = "Modify this template to jump-start your ASP.NET MVC application.";

         return View();
      }

      [HttpPost]
      public ActionResult Index( EmailModel model )
      {
         if ( ModelState.IsValid )
         {
            var connectionString = CloudConfigurationManager.GetSetting( "BylditStorageAccountConnectionString" );
            var storageAccount = CloudStorageAccount.Parse( connectionString );
            var tableStorageProvider = new AzureTableStorageProvider( new CloudStorageAccountAdapter( storageAccount ) );
            var emailTableName = CloudConfigurationManager.GetSetting( "SubmitEmailTableName" );

            storageAccount.CreateCloudTableClient().GetTableReference( emailTableName ).CreateIfNotExists();

            tableStorageProvider.Upsert( emailTableName, model );
            tableStorageProvider.Save();

            model.Submitted = true;
         }

         return View( model );
      }

      public ActionResult About()
      {
         ViewBag.Message = "Your app description page.";

         return View();
      }

      public ActionResult Contact()
      {
         ViewBag.Message = "Your contact page.";

         return View();
      }

      public ActionResult Beta()
      {
         ViewBag.Message = "This is Byldit!";

         return View();
      }
   }
}
