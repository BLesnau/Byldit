using System.Web.Mvc;
using System.Web.Routing;

namespace Byldit.Web.App_Start
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
             name: "Keyword",
             url: "keyword/{keyword}",
             defaults: new { controller = "Home", action = "Keyword" }
         );

         routes.MapRoute(
             name: "User",
             url: "user/{userId}",
             defaults: new { controller = "Home", action = "User" }
         );

         routes.MapRoute(
             name: "ByldTag",
             url: "byldtag/{tagId}",
             defaults: new { controller = "Home", action = "ByldTag" }
         );

         routes.MapRoute(
             name: "Default",
             url: "{controller}/{action}/{id}",
             defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
         );
      }
   }
}