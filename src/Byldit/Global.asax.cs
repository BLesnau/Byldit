using System.Configuration;
using System.Web.Hosting;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using Byldit.Configs;

namespace Byldit
{
   // Note: For instructions on enabling IIS6 or IIS7 classic mode, 
   // visit http://go.microsoft.com/?LinkId=9394801

   public class MvcApplication : System.Web.HttpApplication
   {
      protected void Application_Start()
      {
         GlobalConfig.SetRoot( HostingEnvironment.MapPath( "~/Configs/" ) ); 

         var environment = ConfigurationManager.AppSettings["Environment"];
         if ( string.IsNullOrWhiteSpace( environment ) )
         {
            GlobalConfig.SetEnvironment( "Local" );
         }
         else
         {
            GlobalConfig.SetEnvironment( environment );
         }

         AreaRegistration.RegisterAllAreas();

         WebApiConfig.Register( GlobalConfiguration.Configuration );
         FilterConfig.RegisterGlobalFilters( GlobalFilters.Filters );
         RouteConfig.RegisterRoutes( RouteTable.Routes );
         BundleConfig.RegisterBundles( BundleTable.Bundles );
      }
   }
}