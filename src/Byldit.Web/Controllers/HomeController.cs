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
         var model = new ByldTagViewModel
         {
            TagId = null
         };

         return View( model );
      }

      public ActionResult ByldTag( string tagId )
      {
         var model = new ByldTagViewModel
         {
            TagId = tagId
         };

         return View( "Beta", model );
      }

      public ActionResult Keyword( string keyword )
      {
         var model = new KeywordViewModel
         {
            Keyword = keyword
         };

         return View( "ComingSoon" );
      }

      public ActionResult User( string userId )
      {
         var model = new UserViewModel
         {
            UserId = userId
         };

         return View( "ComingSoon" );
      }
   }
}
