using Service.Utilities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace Service.Entities
{
	#region members
	[DataContract]
	public class CommunicationCart
	{
		[DataMember]
		public int iCommunicationCart;
		[DataMember]
		public string nvCommunicationCart;
		[DataMember]
		public double nTariff;
		#endregion
	#region function
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

		public static int? CommunicationUpdate(CommunicationCart comm, int iUserManagerId)
		{
			try
			{
				List<SqlParameter> parameters = new List<SqlParameter>(); 
				parameters.Add(new SqlParameter("iCommunicationCart", comm.iCommunicationCart));
				parameters.Add(new SqlParameter("nvCommunicationCart", comm.nvCommunicationCart));
				parameters.Add(new SqlParameter("nTariff", comm.nTariff));
				parameters.Add(new SqlParameter("iUserManagerId", iUserManagerId));
				DataSet ds = SqlDataAccess.ExecuteDatasetSP("TCommunication_UPD", parameters);
				return int.Parse(ds.Tables[0].Rows[0][0].ToString());
			}
			catch (Exception ex)
			{
				Log.ExceptionLog(ex.Message, "CommunicationUpdate");
				return -1;
			}
		}

		public static int? CommunicationInsert(CommunicationCart comm, int iUserManagerId)
		{
			try
			{
				List<SqlParameter> parameters = new List<SqlParameter>();
				parameters.Add(new SqlParameter("iCommunicationCart", comm.iCommunicationCart));
				parameters.Add(new SqlParameter("nvCommunicationCart", comm.nvCommunicationCart));
				parameters.Add(new SqlParameter("nTariff", comm.nTariff));
				parameters.Add(new SqlParameter("iUserManagerId", iUserManagerId));
				DataSet ds = SqlDataAccess.ExecuteDatasetSP("TCommunication_INS", parameters);
				return int.Parse(ds.Tables[0].Rows[0][0].ToString());
			}
			catch (Exception ex)
			{
				Log.ExceptionLog(ex.Message, "CommunicationInsert");
				return -1;
			}
		}
	}
	#endregion
}