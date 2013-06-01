using System;
using System.IO;
using System.Linq;

namespace TestConfigSetterUpper
{
   class Program
   {
      static int Main( string[] args )
      {
         foreach ( var arg in args )
         {
            var splitArg = arg.Split( ':' );
            if ( splitArg.Count() == 2 )
            {
               var fileToCopy = splitArg[0];
               var fileToReplace = splitArg[1];
               if ( File.Exists( fileToCopy ) && File.Exists( fileToReplace ) )
               {
                  try
                  {
                     File.Copy( fileToCopy, fileToReplace, true );
                     Console.WriteLine( "Copied test config: " + fileToCopy + " -> " + fileToReplace );
                  }
                  catch ( Exception ex )
                  {
                     Console.WriteLine( "Failed to copy test config: " + fileToCopy + " -> " + fileToReplace + ", Exception: " + ex.Message );
                     return 0;
                  }
               }
               else
               {
                  Console.WriteLine( "Failed to copy test config: " + fileToCopy + " -> " + fileToReplace + ", One of the config files does not exist");
                  return 0;
               }
            }
            else
            {
               Console.WriteLine( "Failed to copy test configs: Arguments are incorrect" );
               return 0;
            }
         }

         return 1;
      }
   }
}
