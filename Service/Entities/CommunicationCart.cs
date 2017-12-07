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
	public class CommunicationCart
	{
		[DataMember]
		public int iCommunicationCart;
		[DataMember]
		public string nvCommunicationCart;
		[DataMember]
		public double nTariff;
		public static List<CommunicationCart> GetCommunicationCart()
		{
			try
			{
				//data table שולף טבלה
				DataTable dt = SqlDataAccess.ExecuteDatasetSP("TSysCommunicationCart_SLCT").Tables[0];
				List<CommunicationCart> lCommunicationCart = new List<CommunicationCart>();
				for (int i = 0; i < dt.Rows.Count; i++)
				{
					CommunicationCart communicationCart = new CommunicationCart();
					communicationCart.iCommunicationCart = int.Parse(dt.Rows[i]["iCommunicationCart"].ToString());
					communicationCart.nvCommunicationCart = dt.Rows[i]["nvCommunicationCart"].ToString();
					communicationCart.nTariff = double.Parse(dt.Rows[i]["nTariff"].ToString());
					lCommunicationCart.Add(communicationCart);
				}
				//פונקציה שהופכת את הטבלה לרשימה
				//lPayment = ObjectGenerator<Payment>.GeneratListFromDataRowCollection(dt.Rows);
				return lCommunicationCart;
			}
			catch (Exception ex)
			{
				Log.ExceptionLog(ex.Message, "GetCommunicationCart");
				return null;
			}
		}
	}
}