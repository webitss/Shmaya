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
	public class Payment
	{
		[DataMember]
		public int iPaymentId;
		[DataMember]
		public string nvPaymentType;
		[DataMember]
		public double nTariff;
		public static List<Payment> GetPayments()
		{
			try
			{
				//data table שולף טבלה
				DataTable dt = SqlDataAccess.ExecuteDatasetSP("TSysPayment_SLCT").Tables[0];
				List<Payment> lPayment = new List<Payment>();
				for (int i = 0; i < dt.Rows.Count; i++)
				{
					Payment payment = new Payment();
					payment.iPaymentId = int.Parse(dt.Rows[i]["iPaymentId"].ToString());
					payment.nvPaymentType = dt.Rows[i]["nvPaymentType"].ToString();
					payment.nTariff = double.Parse(dt.Rows[i]["nTariff"].ToString());
					lPayment.Add(payment);
				}
				//פונקציה שהופכת את הטבלה לרשימה
				//lPayment = ObjectGenerator<Payment>.GeneratListFromDataRowCollection(dt.Rows);
				return lPayment;
			}
			catch (Exception ex)
			{
				Log.ExceptionLog(ex.Message, "GetPayments");
				return null;
			}
		}
		public static int? PaymentUpdate(Payment payment, int iUserManagerId)
		{
			try
			{

				List<SqlParameter> parameters = new List<SqlParameter>(); 
				parameters.Add(new SqlParameter("iPaymentId", payment.iPaymentId));
				parameters.Add(new SqlParameter("nvPaymentType", payment.nvPaymentType));
				parameters.Add(new SqlParameter("nTariff", payment.nTariff));
				parameters.Add(new SqlParameter("iUserManagerId", iUserManagerId));
				DataSet ds = SqlDataAccess.ExecuteDatasetSP("TPayment_UPD", parameters);
				return int.Parse(ds.Tables[0].Rows[0][0].ToString());
			}
			catch (Exception ex)
			{
				Log.ExceptionLog(ex.Message, "PaymentUpdate");
				return -1;
			}
		}

		public static int? PaymentInsert(Payment payment, int iUserManagerId)
		{
			try
			{

				List<SqlParameter> parameters = new List<SqlParameter>();
				parameters.Add(new SqlParameter("iPaymentId", payment.iPaymentId));
				parameters.Add(new SqlParameter("nvPaymentType", payment.nvPaymentType));
				parameters.Add(new SqlParameter("nTariff", payment.nTariff));
				parameters.Add(new SqlParameter("iUserManagerId", iUserManagerId));
				DataSet ds = SqlDataAccess.ExecuteDatasetSP("TPayment_INS", parameters);
				return int.Parse(ds.Tables[0].Rows[0][0].ToString());
			}
			catch (Exception ex)
			{
				Log.ExceptionLog(ex.Message, "PaymentInsert");
				return -1;
			}
		}

	}
}