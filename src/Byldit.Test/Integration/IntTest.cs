using System;
using System.Configuration;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Byldit.Test.Integration
{
   [TestClass]
   public class IntTest
   {
      [TestMethod, TestCategory("Integration")]
      public void TestMethod1()
      {
         var setting = ConfigurationManager.AppSettings["TestSetting"];
         Console.WriteLine( setting );
      }

      [TestMethod, TestCategory( "Integration" )]
      public void TestMethod2()
      {

      }

      [TestMethod, TestCategory( "Integration" )]
      public void TestMethod3()
      {

      }
   }
}
