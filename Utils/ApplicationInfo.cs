using System;
using System.Configuration;

namespace FreeShop.SPA.Utils
{
    public class ApplicationInfo
    {
        private string applicationName;
        private string releaseNumber;
        private string versionNumber;
        private string buildDate;

        private static volatile ApplicationInfo instance;
        private static object syncRoot = new Object();

        public ApplicationInfo()
        {
            applicationName = ConfigurationManager.AppSettings["applicationName"];
            releaseNumber = ConfigurationManager.AppSettings["ReleaseNumber"];
            versionNumber = ConfigurationManager.AppSettings["VersionNumber"];
            buildDate = ConfigurationManager.AppSettings["BuildDate"];
        }

        public static ApplicationInfo GetApplicationInfo()
        {
            lock (syncRoot)
            {
                if (instance == null)
                {
                    instance = new ApplicationInfo();
                }
            }
            return instance;
        }

        public static ApplicationInfo UpdateApplicationInfo()
        {
            lock (syncRoot)
            {

                instance = new ApplicationInfo();

            }
            return instance;
        }


        public override string ToString()
        {
            return String.Format("{0}, Release {1}, Version {2}, {3}",
                applicationName, releaseNumber, versionNumber, buildDate);
        }

    }
}