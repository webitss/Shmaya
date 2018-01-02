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
	[DataContract]
	public class MessageToProvider
	{
		[DataMember]
		public int iOrderId { get; set; }
		[DataMember]
		public DateTime? dtTimeTranslation { get; set; }
		[DataMember]
		public int iSelectedTranslator { get; set; }
		[DataMember]
		public double nSumPayment { get; set; }
		[DataMember]
		public double nTariffToFirst { get; set; }
		[DataMember]
		public double nTariffToSecond { get; set; }

		public static List<MessageToProvider> GetMessageToProvider(int iUserId, DateTime? dtBeginDate, DateTime? dtEndDate)
		{
			try
			{
				List<SqlParameter> parameters = new List<SqlParameter>();
				parameters.Add(new SqlParameter("iUserId", iUserId));
				parameters.Add(new SqlParameter("dtBeginDate", dtBeginDate));
				parameters.Add(new SqlParameter("dtEndDate", dtEndDate));
				//data table שולף טבלה
				DataTable dt = SqlDataAccess.ExecuteDatasetSP("TSumMessage_SLCT",parameters).Tables[0];
				List<MessageToProvider> lToProvider = new List<MessageToProvider>();
				lToProvider = ObjectGenerator<MessageToProvider>.GeneratListFromDataRowCollection(dt.Rows);
				return lToProvider;
			}
			catch (Exception ex)
			{
				Log.ExceptionLog(ex.Message, "GetMessageToProvider");
				return null;
			}
		}





	}
}