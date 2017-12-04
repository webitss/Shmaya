using Service.Entities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace Service.Utilities
{
    public class SysTableRow
    {
        #region DataMember
        public int iSysTableRowId { get; set; }
        public int iSysTableId { get; set; }
        public string nvSysTableNameEng { get; set; }
        public string nvValue { get; set; }
        public int iUserId { get; set; }
        #endregion

        #region Methods


        public static bool InsertSysTableRow(SysTableRow sysTableContent, string nvGuide)
        {
            try
            {
                SqlParameter[] param = {                                           new SqlParameter("iSysTableId", sysTableContent.nvSysTableNameEng),
                                           new SqlParameter("nvValue", sysTableContent.nvValue),
                                           new SqlParameter("iUserId", sysTableContent.iUserId)
                                       };
                DataSet ds = SqlDataAccess.ExecuteDatasetSP("TSysTableRow_INS", param);
                return true;
            }
            catch (Exception ex)
            {
                Log.ExceptionLog(ex.Message, "InsertSysTableRow");
                return false;
            }
        }

        public static List<SysTableRow> GetSysTableRow(string nvSysTableNameEng)
        {
            try
            {
                SqlParameter[] param = { new SqlParameter("nvSysTableNameEng", nvSysTableNameEng) };

                DataTable dt = SqlDataAccess.ExecuteDatasetSP("TSysTableRow_SLCT", param).Tables[0];
                return ObjectGenerator<SysTableRow>.GeneratListFromDataRowCollection(dt.Rows);
            }
            catch (Exception ex)
            {
                Log.ExceptionLog(ex.Message, "GetSysTableRow");
                return null;
            }

        }

        public static bool UpdateSysTableRow(SysTableRow sysTableContent)
        {
            try
            {
                SqlParameter[] param = {  
                                           new SqlParameter("iSysTableRowId", sysTableContent.iSysTableRowId),
                                           new SqlParameter("nvValue", sysTableContent.nvValue),
                                           new SqlParameter("iUserId", sysTableContent.iUserId)
                                       };
                DataSet ds = SqlDataAccess.ExecuteDatasetSP("TSysTableRow_UPD", param);
                return true;
            }
            catch (Exception ex)
            {
                Log.ExceptionLog(ex.Message, "UpdateSysTableRow");
                return false;
            }
        }

        public static bool DeleteSysTableRow(SysTableRow sysTableContent)
        {
            try
            {
                SqlParameter[] param = {  
                                            new SqlParameter("iSysTableRowId", sysTableContent.iSysTableRowId),
                                            new SqlParameter("iUserId", 1)
                                       };
                DataSet ds = SqlDataAccess.ExecuteDatasetSP("TSysTableRow_DEL", param);
                return true;
            }
            catch (Exception ex)
            {
                Log.ExceptionLog(ex.Message, "DeleteSysTableRow");
                return false;
            }
        }

        public static List<SysTableRow> GetSysTables()
        {
            try
            {

                DataTable dt = SqlDataAccess.ExecuteDatasetSP("TSysTables_SLCT").Tables[0];
                return ObjectGenerator<SysTableRow>.GeneratListFromDataRowCollection(dt.Rows);
            }
            catch (Exception ex)
            {
                Log.ExceptionLog(ex.Message, "GetSysTables");
                return null;
            }

        }
        #endregion
    }
}