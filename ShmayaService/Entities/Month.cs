using ShmayaService.Utilities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace ShmayaService.Entities
{
	public class Month
	{
		public DateTime? dtGlobalDateBegin { get; set; }
		public DateTime? dtGlobalDateEnd { get; set; }

		public static int? MonthUpdate(int iMonthId,DateTime? dtGlobalDateBegin, DateTime? dtGlobalDateEnd, int iUserManagerId)
		{
			try
			{

				List<SqlParameter> parameters = new List<SqlParameter>();
				parameters.Add(new SqlParameter("iMonthId", iMonthId));
				parameters.Add(new SqlParameter("dtGlobalDateBegin", dtGlobalDateBegin));
				parameters.Add(new SqlParameter("dtGlobalDateEnd", dtGlobalDateEnd));
				parameters.Add(new SqlParameter("iUserManagerId", iUserManagerId));
				DataSet ds = SqlDataAccess.ExecuteDatasetSP("TMonth_UPD", parameters);
				return int.Parse(ds.Tables[0].Rows[0][0].ToString());
			}
			catch (Exception ex)
			{
				Log.ExceptionLog(ex.Message, "MonthUpdate");
				return -1;
			}
		}

		public static int? MonthInsert(int iMonthId, DateTime? dtGlobalDateBegin, DateTime? dtGlobalDateEnd, int iUserManagerId)
		{
			try
			{

				List<SqlParameter> parameters = new List<SqlParameter>();
				parameters.Add(new SqlParameter("iMonthId", iMonthId));
				parameters.Add(new SqlParameter("dtGlobalDateBegin", dtGlobalDateBegin));
				parameters.Add(new SqlParameter("dtGlobalDateEnd", dtGlobalDateEnd));
				parameters.Add(new SqlParameter("iUserManagerId", iUserManagerId));
				DataSet ds = SqlDataAccess.ExecuteDatasetSP("TMonth_INS", parameters);
				return int.Parse(ds.Tables[0].Rows[0][0].ToString());
			}
			catch (Exception ex)
			{
				Log.ExceptionLog(ex.Message, "MonthUpdate");
				return -1;
			}
		}
	}
}