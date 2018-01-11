using ShmayaService.Utilities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace ShmayaService.Entities
{
	public class Report
	{
		public int iSelectedTranslator { get; set; }
		public string nvFirstName { get; set; }
		public string nvLastName { get; set; }
		public double nBankHours { get; set; }
		public int nvId { get; set; }
		public string nvTypeOrder { get; set; }
		public int iUserId { get; set; }
		public double nNumHours { get; set; }
		public string nvGender { get; set; }
		public string nvMobileNum { get; set; }
		public string nvPruductName { get; set; }
		public DateTime? dtPurchase { get; set; }
		public double nPayment { get; set; }
		public double nRefund { get; set; }
		public DateTime? dtCreateDate { get; set; }

		public static List<Report> GetReports(int iMonthId,int iTypeOrder)
		{
			try
			{
				List<SqlParameter> parameters = new List<SqlParameter>();
				parameters.Add(new SqlParameter("iMonthId", iMonthId));
				parameters.Add(new SqlParameter("iTypeOrder", iTypeOrder));
				//data table שולף טבלה
				DataTable dt = SqlDataAccess.ExecuteDatasetSP("TReportProvider_SLCT",parameters).Tables[0];
				List<Report> lReports = new List<Report>();
				lReports = ObjectGenerator<Report>.GeneratListFromDataRowCollection(dt.Rows);
				return lReports;
			}
			catch (Exception ex)
			{
				Log.ExceptionLog(ex.Message, "GetReports");
				return null;
			}
		}

		public static List<Report> GetReportsCustomer(int iMonthId, int iTypeOrder)
		{
			try
			{
				List<SqlParameter> parameters = new List<SqlParameter>();
				parameters.Add(new SqlParameter("iMonthId", iMonthId));
				parameters.Add(new SqlParameter("iTypeOrder", iTypeOrder));
				//data table שולף טבלה
				DataTable dt = SqlDataAccess.ExecuteDatasetSP("TReportCustomer_SLCT", parameters).Tables[0];
				List<Report> lReports = new List<Report>();
				lReports = ObjectGenerator<Report>.GeneratListFromDataRowCollection(dt.Rows);
				return lReports;
			}
			catch (Exception ex)
			{
				Log.ExceptionLog(ex.Message, "GetReportsCustomer");
				return null;
			}
		}

		public static List<Report> GetReportsProduct(int iMonthId)
		{
			try
			{
				List<SqlParameter> parameters = new List<SqlParameter>();
				parameters.Add(new SqlParameter("iMonthId", iMonthId));
				//data table שולף טבלה
				DataTable dt = SqlDataAccess.ExecuteDatasetSP("TReportProducts_SLCT", parameters).Tables[0];
				List<Report> lReports = new List<Report>();
				lReports = ObjectGenerator<Report>.GeneratListFromDataRowCollection(dt.Rows);
				return lReports;
			}
			catch (Exception ex)
			{
				Log.ExceptionLog(ex.Message, "GetReportsProduct");
				return null;
			}
		}

		public static List<Report> GetReportscryingDetector(int iMonthId)
		{
			try
			{
				List<SqlParameter> parameters = new List<SqlParameter>();
				parameters.Add(new SqlParameter("iMonthId", iMonthId));
				//data table שולף טבלה
				DataTable dt = SqlDataAccess.ExecuteDatasetSP("TReportcryingDetector_SLCT", parameters).Tables[0];
				List<Report> lReports = new List<Report>();
				lReports = ObjectGenerator<Report>.GeneratListFromDataRowCollection(dt.Rows);
				return lReports;
			}
			catch (Exception ex)
			{
				Log.ExceptionLog(ex.Message, "GetReportscryingDetector");
				return null;
			}
		}

	}

}