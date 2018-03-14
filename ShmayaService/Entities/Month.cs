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
	public class Month
	{
		[DataMember]
		[NoSendToSQL]
		public int iGlobalId { get; set; }
		[DataMember]
		public DateTime? dtGlobalDateBegin { get; set; }
		[DataMember]
		public DateTime? dtGlobalDateEnd { get; set; }
		[DataMember]
		public int iMonthYearId { get; set; }

		public static int? MonthUpdate(Month month,int iUserManagerId)
		{
			try
			{
				List<SqlParameter> parameters = ObjectGenerator<Month>.GetSqlParametersFromObject(month);
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

		public static int? MonthInsert(Month month, int iUserManagerId)
		{
			try
			{
				List<SqlParameter> parameters = ObjectGenerator<Month>.GetSqlParametersFromObject(month);
				parameters.Add(new SqlParameter("iUserManagerId", iUserManagerId));
				DataSet ds = SqlDataAccess.ExecuteDatasetSP("TMonth_INS", parameters);
				return int.Parse(ds.Tables[0].Rows[0][0].ToString());
			}
			catch (Exception ex)
			{
				Log.ExceptionLog(ex.Message, "MonthInsert");
				return -1;
			}
		}


		public static List<Month> GetMonthes()
		{
			try
			{
				DataTable dt = SqlDataAccess.ExecuteDatasetSP("TGlobalDate_SLCT").Tables[0];
				List<Month> lMonths = new List<Month>();
				lMonths = ObjectGenerator<Month>.GeneratListFromDataRowCollection(dt.Rows);
				return lMonths;
			}
			catch (Exception ex)
			{
				Log.ExceptionLog(ex.Message, "GetMonthes");
				return null;
			}
		}
	}
}