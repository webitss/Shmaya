using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ShmayaService.Utilities
{
    public class Config
    {
        public static string hostName = System.Web.Hosting.HostingEnvironment.ApplicationHost.GetSiteName();

        public static string GetConfigSettingByHost(string key)
        {
            //return key;
            switch (hostName)
            {
                case "Default Web Site":
                    return key + "-local";
                case "Service(1)":
                    return key + "-local";
                case "Service(2)":
                    return key + "-local";
                case "QA":
                    return key + "-qa";

                case "WS":
                    return key + "-live";

            }
            return "";
        }


        private static HttpRequest request = HttpContext.Current.Request;
        private static string applicationPath = request.ApplicationPath;//	"/ShtileyArieAfterSchoolWS"	string
        private static int indexOfApplicationPath = request.Url.ToString().IndexOf(applicationPath);//	16	int
        private static int applicationPathLength = request.ApplicationPath.Length; //25	int

        public static string serviceAddress = request.Url.ToString().Substring(0, indexOfApplicationPath + applicationPathLength);//	"http://localhost/ShtileyArieAfterSchoolWS"	string

    }
}