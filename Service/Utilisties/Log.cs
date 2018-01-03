using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Runtime.Serialization;
using System.Data.SqlClient;
using System.Web.Script.Serialization;
using System.Diagnostics;
using System.IO;

namespace Service.Utilities
{
    public class Log
    {
        #region DataMember
        #endregion

        #region Methods
        public static void ExceptionLog(string exception,string function)
        {
            SqlParameter[] param = {
                                       new SqlParameter("nvException",exception), 
                                       new SqlParameter("nvFunction", function)};
            SqlDataAccess.ExecuteDatasetSP("TSysLog_INS", param);
        }

        public static void LogInfo(string name, string value)
        {
            StreamWriter w = new StreamWriter(AppDomain.CurrentDomain.BaseDirectory + "\\Log.txt", true);
            w.WriteLine(name+" "+value+" at :"+ DateTime.Now );
            w.Close();
        }

        public static int GetExceptionLineNumber(Exception e)
        {
            var st = new StackTrace(e, true);
            // Get the top stack frame
            var frame = st.GetFrame(0);
            // Get the line number from the stack frame
            var line = frame.GetFileLineNumber();
            return line;
        }
        #endregion
    }
}
