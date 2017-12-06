using Service.Utilities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace Service.Entities
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

	}
}