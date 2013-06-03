using System.Web.Mvc;
using Byldit.DataModel;
using Byldit.Web.Configs;
using Microsoft.WindowsAzure.Storage;
using TechSmith.Hyde;
using TechSmith.Hyde.Table;

namespace Byldit.Web.Controllers
{
   public class HomeController : Controller
   {
      public ActionResult Index()
      {
         return View();
      }

      [HttpPost]
      public ActionResult Index( SubmitEmail model )
      {
         if ( ModelState.IsValid )
         {
            var connectionString = GlobalConfig.GetString( "BylditStorageAccountConnectionString" );
            var storageAccount = CloudStorageAccount.Parse( connectionString );
            var tableStorageProvider = new AzureTableStorageProvider( new CloudStorageAccountAdapter( storageAccount ) );
            var emailTableName = GlobalConfig.GetString( "SubmitEmailTableName" );

            storageAccount.CreateCloudTableClient().GetTableReference( emailTableName ).CreateIfNotExists();

            tableStorageProvider.Upsert( emailTableName, model );
            tableStorageProvider.Save();

            model.Submitted = true;
         }

         return View( model );
      }

      public ActionResult Beta()
      {
         ViewBag.AzureMobileServiceUrl = GlobalConfig.GetString( "AzureMobileServiceUrl" );
         ViewBag.AzureMobileServiceKey = GlobalConfig.GetString( "AzureMobileServiceKey" );

         return View();
      }
   }
}
