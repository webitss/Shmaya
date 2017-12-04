using Service.Utilities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace Service.Entities
{
    [DataContract]
    public class Year
    {
        #region Members
        [DataMember]
        public int iYearId { get; set; }
        [DataMember]
        public string nvHebrewName { get; set; }
        [DataMember]
        public DateTime? dtOpenDate { get; set; }
        [DataMember]
        public DateTime? dtEndDate { get; set; }
        #endregion

        #region Methods

        public static List<CodeTable> GetYearCodeTables()
        {
            try
            {
                DataSet ds = SqlDataAccess.ExecuteDatasetSP("TYear_SLCT");
                return ObjectGenerator<CodeTable>.GeneratListFromDataRowCollection(ds.Tables[0].Rows);
            }
            catch (Exception ex)
            {
                Log.ExceptionLog(ex.Message, "GetYearCodeTables");
                return null;
            }
        }

        public static CodeTable GetCurrentYear()
        {
            try
            {
                DataSet ds = SqlDataAccess.ExecuteDatasetSP("TYear_CurrentYear_SLCT");
                return new CodeTable() { iId = int.Parse(ds.Tables[0].Rows[0]["iId"].ToString()), nvName = ds.Tables[0].Rows[0]["nvName"].ToString() };
            }
            catch (Exception ex)
            {
                Log.ExceptionLog(ex.Message, "GetCurrentYear");
                return null;
            }
        }


        #endregion
    }
}
