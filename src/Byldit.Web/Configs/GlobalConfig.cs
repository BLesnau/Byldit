using System;
using System.Collections.Generic;
using System.IO;
using System.Text.RegularExpressions;

namespace Byldit.Web.Configs
{
   public static class GlobalConfig
   {
      private static string _rootPath = string.Empty;
      private static readonly Dictionary<string, string> _settings = new Dictionary<string, string>();

      public static void SetRoot( string root )
      {
         _rootPath = root;
      }

      public static void SetEnvironment( string environment )
      {
         _settings.Clear();

         try
         {
            var filePath = _rootPath + environment + ".mysettings";
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
                     if ( !_settings.ContainsKey( match.Groups[1].Value ) )
                     {
                        _settings[match.Groups[1].Value] = match.Groups[2].Value;
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
         if ( _settings.TryGetValue( setting, out value ) )
         {
            return value;
         }

         return null;
      }
   }
}