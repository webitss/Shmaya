using Infra.DL;
using ShmayaService.Utilities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace ShmayaService.Entities
{
    [DataContract]
    public class CodeTable
    {
        #region Members

        [DataMember]
        public int iId { get; set; }
        [DataMember]
        public string nvName { get; set; }

        #endregion

        #region Methods
        
        public static List<CodeTable> GetCodeTable(string tableName, string iId, string nvName)
        {
            try
            {
                string query = "select " + (iId == null ? "iId" : iId) + " as iId, " + (nvName == null ? "nvName" : nvName) + " as nvName from tbl_code_" + tableName;
                query += " where iSysRowStatus=1";
                DataSet ds = SqlDataAccess.ExecuteDataset(query);
                DataTable dt = ds.Tables[0];
                return ObjectGenerator<CodeTable>.GeneratListFromDataRowCollection(ds.Tables[0].Rows);
            }
            catch (Exception ex)
            {
                Log.ExceptionLog(ex.Message, "GetCodeTable");
                return null;
            }
        }

        public static DataTable GenerateDataTableIds(int[] ids)
        {
            DataTable dt = new DataTable();
            dt.Columns.Add("iId", typeof(int));

            foreach (int item in ids)
            {
                DataRow dr = dt.NewRow();
                dr["iId"] = item;
                dt.Rows.Add(dr);
            }
            return dt;
        }
        
        public static List<CodeTable> GetCities()
        //public static Dictionary<string, List<CodeTable>> GetCities()
        {
            //return CodeTable.GetListCodeTables("TSysTableRow_SLCT", null);
            try
            {
                DataSet ds = SqlDataAccess.ExecuteDatasetSP("TCities_SLCT");
                List<CodeTable> citiesList = new List<CodeTable>();
                citiesList = ObjectGenerator<CodeTable>.GeneratListFromDataRowCollection(ds.Tables[0].Rows);
                return citiesList;
            }
            catch (Exception ex)
            {
                Log.ExceptionLog(ex.Message, "GetCities");
                return null;
            }
        }

        public static Dictionary<string, List<CodeTable>> GetListCodeTables(string sProcName, List<SqlParameter> parameters = null)
        {
            try
            {
                DataSet ds;
                if (parameters != null)
                    ds = SqlDataAccess.ExecuteDatasetSP(sProcName, parameters);
                else ds = SqlDataAccess.ExecuteDatasetSP(sProcName);
                Dictionary<string, List<CodeTable>> codeTables = new Dictionary<string, List<CodeTable>>();
                for (int i = 0; i < ds.Tables.Count; i++)
                {
                    codeTables.Add(ds.Tables[i++].Rows[0][0].ToString(), ObjectGenerator<CodeTable>.GeneratListFromDataRowCollection(ds.Tables[i].Rows));
                }
                return codeTables;
            }

            catch (Exception ex)
            {
                Log.ExceptionLog(ex.Message, "GetListCodeTables" + " , sProcName:" + sProcName);
                return null;
            }
        }

        #endregion

    }

    [DataContract]
    public class CodeTableForABCBook
    {
        #region Members
        [DataMember]
        public Dictionary<string, List<CodeTable>> dCodeTable { get; set; }
        #endregion

        #region Methods
        public static CodeTableForABCBook GetCodeTableForActivityDay(int IAbcBookId)
        {
            try
            {
                DataSet ds = SqlDataAccess.ExecuteDatasetSP("TActivityDay_CodeTables_SLCT", new List<SqlParameter>() 
                { new SqlParameter("IAbcBookId", IAbcBookId) });
                CodeTableForABCBook codeTableForStatisticsGoals = new CodeTableForABCBook();
                codeTableForStatisticsGoals.dCodeTable = new Dictionary<string, List<CodeTable>>();
                for (int i = 0; i < 8; i++)
                    codeTableForStatisticsGoals.dCodeTable.Add
                        (ds.Tables[i++].Rows[0][0].ToString(), ObjectGenerator<CodeTable>.GeneratListFromDataRowCollection(ds.Tables[i].Rows));
                return codeTableForStatisticsGoals;
            }

            catch (Exception ex)
            {
                Log.ExceptionLog(ex.Message, "GetCodeTableForStatisticsGoals , IAbcBookId:" + IAbcBookId.ToString());
                return null;
            }
        }

        #endregion
    }

}