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
	public class Refund
	{
		#region members
		[DataMember]
		public int iRefundId { get; set; }
		[DataMember]
		[NoSendToSQL]
		public string productType { get; set; }
		[DataMember]
		[NoSendToSQL]
		public string nvPruductName { get; set; }
		[DataMember]
		public DateTime? dtPurchase { get; set; }
		[DataMember]
		public double nPayment { get; set; }
		[DataMember]
		public double nRefund { get; set; }
		[DataMember]
		[NoSendToSQL]
		public DateTime? dtCreateDate { get; set; }
		[DataMember]
		[NoSendToSQL]
		public int iCreatedByUserId { get; set; }
		[DataMember]
		public int iProductId { get; set; }
		[DataMember]
		public int iMonthYearId { get; set; }
		[DataMember]
		[NoSendToSQL]
		public string nvMonthName { get; set; }
		[DataMember]
		[NoSendToSQL]
		public string nvCreatedByUser { get; set; }
		[DataMember]
		public string nvDocPath { get; set; }
		[DataMember]
		[NoSendToSQL]
		public string nvDocName { get; set; }
		[DataMember]
		public int? iBuyCryingDetector { get; set; }


		#endregion

		#region methods
		public static List<Refund> GetRefunds(int iUserId)
		{
			try
			{
				DataTable dt = SqlDataAccess.ExecuteDatasetSP("TRefunds_SLCT",new SqlParameter("iUserId",iUserId)).Tables[0];
				List<Refund> lRefunds = new List<Refund>();
				lRefunds = ObjectGenerator<Refund>.GeneratListFromDataRowCollection(dt.Rows);
				return lRefunds;
			}
			catch (Exception ex)
			{
				Log.ExceptionLog(ex.Message, "GetRefunds");
				return null;
			}
		}

		public static string RefundUpdate(Refund refund, int iUserManagerId, bool isDelete)
		{
			try
			{
				if (refund.nvDocPath!=null)
				{ 
					if (isDelete == false)
						refund.nvDocPath = new FileManageCtrl().SaveFile(refund.nvDocPath.Substring(refund.nvDocPath.LastIndexOf(",") + 1),"reference", refund.nvDocPath.Substring(refund.nvDocPath.IndexOf('/') + 1, refund.nvDocPath.LastIndexOf(';') - refund.nvDocPath.IndexOf('/') - 1), iUserManagerId);
					else
					{
						refund.nvDocPath = refund.nvDocPath.Split('/')[4];
						new FileManageCtrl().DeleteFile(refund.nvDocPath, "reference");
						refund.nvDocPath = null;
					}
				}
				List<SqlParameter> parameters = ObjectGenerator<Refund>.GetSqlParametersFromObject(refund);
				parameters.Add(new SqlParameter("iUserManagerId", iUserManagerId));
				DataSet ds = SqlDataAccess.ExecuteDatasetSP("TRefund_UPD", parameters);
				return "success";
			}
			catch (Exception ex)
			{
				Log.ExceptionLog(ex.Message, "RefundUpdate");
				return null;
			}
		}

		public static int? RefundInsert(Refund refund, int iUserManagerId,int iUserId)
		{
			try
			{
				if (refund.nvDocPath != null)
					refund.nvDocPath = new FileManageCtrl().SaveFile(refund.nvDocPath.Substring(refund.nvDocPath.LastIndexOf(",") + 1), "reference", refund.nvDocPath.Substring(refund.nvDocPath.IndexOf('/') + 1, refund.nvDocPath.LastIndexOf(';') - refund.nvDocPath.IndexOf('/') - 1), iUserManagerId);
				List<SqlParameter> parameters = ObjectGenerator<Refund>.GetSqlParametersFromObject(refund);
				parameters.Add(new SqlParameter("iUserManagerId", iUserManagerId));
				parameters.Add(new SqlParameter("iUserId", iUserId));
				DataSet ds = SqlDataAccess.ExecuteDatasetSP("TRefund_INS", parameters);
				return int.Parse(ds.Tables[0].Rows[0][0].ToString());
			}
			catch (Exception ex)
			{
				Log.ExceptionLog(ex.Message, "RefundInsert");
				return -1;
			}
		}
		
		#endregion

	}
}