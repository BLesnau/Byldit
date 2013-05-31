using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Text.RegularExpressions;
using System.Web.Hosting;

namespace Byldit.Configs
{
   public static class GlobalConfig
   {
      private static Dictionary<string, string> Settings = new Dictionary<string, string>();

      public static void SetEnvironment( string environment )
      {
         Settings.Clear();

         try
         {
            var filePath = HostingEnvironment.MapPath( "~/Configs/" + environment + ".mysettings" );
            if ( !string.IsNullOrWhiteSpace( filePath ) )
            {
               var streamReader = new StreamReader( filePath );
               var settingString = streamReader.ReadToEnd();
               var settingsSplit = settingString.Split( new[] { "\r\n", "\n" }, StringSplitOptions.None );

               var regex = new Regex( "<(.*)> (.*)" );

               foreach ( var setting in settingsSplit )
               {
                  var match = regex.Match( setting );
                  if ( match.Success && match.Groups.Count == 3 )
                  {
                     if ( !Settings.ContainsKey( match.Groups[1].Value ) )
                     {
                        Settings[match.Groups[1].Value] = match.Groups[2].Value;
                     }
                  }
               }

               streamReader.Close();
            }
         }
         catch ( Exception )
         {
         }
      }

      public static string GetString( string setting )
      {
         var value = string.Empty;
         if ( Settings.TryGetValue( setting, out value ) )
         {
            return value;
         }

         return null;
      }
   }
}