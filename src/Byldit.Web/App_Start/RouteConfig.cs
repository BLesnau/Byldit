using System.Web.Mvc;
using System.Web.Routing;

namespace Byldit.Web
{
   public class RouteConfig
   {
      public static void RegisterRoutes( RouteCollection routes )
      {
         routes.IgnoreRoute( "{resource}.axd/{*pathInfo}" );

         routes.MapRoute(
             name: "Beta",
             url: "beta",
             defaults: new { controller = "Home", action = "Beta", id = UrlParameter.Optional }
         );

         routes.MapRoute(
             name: "Default",
             url: "{controller}/{action}/{id}",
             defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
         );
      }
   }
}