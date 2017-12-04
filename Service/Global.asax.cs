using System;
using System.Collections.Generic;
using System.Data;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Security;
using System.Web.SessionState;
using Newtonsoft.Json.Linq;
using Service.Utilities;


namespace Service
{
    public class Global : System.Web.HttpApplication
    {

        protected void Application_Start(object sender, EventArgs e)
        {

        }

        protected void Session_Start(object sender, EventArgs e)
        {

        }

        protected void Application_BeginRequest(object sender, EventArgs e)
        {
            HttpContext.Current.Response.AddHeader("Access-Control-Allow-Origin", "*");

            if (HttpContext.Current.Request.HttpMethod == "OPTIONS")
            {
                HttpContext.Current.Response.AddHeader("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
                HttpContext.Current.Response.AddHeader("Access-Control-Allow-Headers", "Content-Type, Accept,cache-control");
                HttpContext.Current.Response.AddHeader("Access-Control-Max-Age", "1728000");
                HttpContext.Current.Response.End();
            }
        }

        //protected void Application_AuthenticateRequest(object sender, EventArgs e)
        //{
        //    string[] noGuideFunctions = new string[] { "/Login" };
        //    if (Request.PathInfo != "" && !noGuideFunctions.Contains(Request.PathInfo))
        //    {
        //        var bytes = new byte[Request.InputStream.Length];
        //        Request.InputStream.Read(bytes, 0, bytes.Length);
        //        Request.InputStream.Position = 0;

        //        string result = System.Text.Encoding.UTF8.GetString(bytes);

        //        string nvGuide = "";
        //        if (result != "" && result.Contains("nvGuide"))
        //            nvGuide = JObject.Parse(result)["nvGuide"].ToString();

        //        List<SqlParameter> parameters = new List<SqlParameter>();
        //        parameters.Add(new SqlParameter("nvGuide", nvGuide));
        //        DataTable dt = SqlDataAccess.ExecuteDatasetSP("TGuide_UPD", parameters).Tables[0];
        //        if (int.Parse(dt.Rows[0][0].ToString()) == 0)
        //        {
        //            Response.Write("<h2>Guide is Expired</h2>\n");
        //            Response.Write(
        //                "<p>The guide is not available, please force logout</p>\n");
        //            Response.StatusCode = 998;
        //            Response.StatusDescription = "GuideExpired";
        //        }
        //    }
        //}

        protected void Application_Error(object sender, EventArgs e)
        {

        }

        protected void Session_End(object sender, EventArgs e)
        {

        }

        protected void Application_End(object sender, EventArgs e)
        {

        }
    }
}