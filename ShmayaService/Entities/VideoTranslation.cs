using Infra.DL;
using ShmayaService.Utilities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace ShmayaService.Entities
{
    public class VideoTranslation
    {
        public static double GetNumHours(string nvIdentity)
        {
            try
            {
                DataSet ds = SqlDataAccess.ExecuteDatasetSP("GetNumHours_ByIdentity", new SqlParameter("nvIdentity", nvIdentity));
                if (ds.Tables[0].Rows.Count > 0 && ds.Tables[0].Rows[0][0].ToString() != string.Empty)
                {
                    double iNumHours = double.Parse(ds.Tables[0].Rows[0][0].ToString());
                    return iNumHours;
                }
                return 0;
            }
            catch (Exception e)
            {
                Log.ExceptionLog(e.Message, "GetNumHours");
                return -1;
            }
        }

        public static int NewVideoTranslation(DateTime dtTimeBegin, DateTime dtTimeTranslation, string nvTranslatorIdentity, string nvUserIdentity)
        {
            try
            {
                List<SqlParameter> lParams = new List<SqlParameter>()
                {
                    new SqlParameter("dtTimeBegin",dtTimeBegin),
                    new SqlParameter("dtTimeTranslation",dtTimeTranslation),
                    new SqlParameter("nvTranslatorIdentity",nvTranslatorIdentity),
                    new SqlParameter("nvUserIdentity",nvUserIdentity)
                };
                DataSet ds = SqlDataAccess.ExecuteDatasetSP("TOrder_Video_INS", lParams);
                if (ds.Tables[0].Rows.Count > 0)
                {
                    int iOrderId = int.Parse(ds.Tables[0].Rows[0][0].ToString());
                    return iOrderId;
                }
                return 0;
            }
            catch (Exception e)
            {
                Log.ExceptionLog(e.Message, "NewVideoTranslation");
                return -1;
            }
        }
    }
}