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
	public class Orders
	{
		[DataMember]
		public int iOrderId { get; set; }
		[DataMember]
		[NoSendToSQL]
		public string nameCustomer { get; set; }
		[DataMember]
		[NoSendToSQL]
		public string nameTranslator { get; set; }
		[DataMember]
		[NoSendToSQL]
		public string typeOrder { get; set; }
		[DataMember]
		[NoSendToSQL]
		public string typeTranslation { get; set; }
		[DataMember]
		[NoSendToSQL]
		public string area { get; set; }
		[DataMember]
		[NoSendToSQL]
		public DateTime? timeTranslation { get; set; }
		public int iUserId { get; set; }
		[DataMember]
		public int iTypeOrder { get; set; }
		[DataMember]
		[NoSendToSQL]
		public string nvTypeOrder { get; set; }
		[DataMember]
		public int iTypeTranslation { get; set; }
		[DataMember]
		public int iGenderTraslator { get; set; }
		[DataMember]
		public int iArea { get; set; }
		[DataMember]
		public int iCityId { get; set; }
		[DataMember]
		public string nvStreet { get; set; }
		[DataMember]
		public string nvNumberHouse { get; set; }
		[DataMember]
		public DateTime? dtDateTraslation { get; set; }
		[DataMember]
		public DateTime? dtTimeBegin { get; set; }
		[DataMember]
		public DateTime? dtTimeEnd { get; set; }
		[DataMember]
		public int iFavoriteTranslator { get; set; }
		[DataMember]
		public int iSelectedTranslator { get; set; }
		[DataMember]
		public int iStatusId { get; set; }
		[DataMember]
		public string nvTypeTranslation { get; set; }
		[DataMember]
		public int iStatusByDeaf { get; set; }
		[DataMember]
		public int iStatusByTranslator { get; set; }
		[DataMember]
		public string nvReason { get; set; }
		[DataMember]
		public int iLanguageId { get; set; }
		[DataMember]
		public bool isQwickOrder { get; set; }

		public static List<Orders> GetOrders()
		{
			try
			{
				//data table שולף טבלה
				DataTable dt = SqlDataAccess.ExecuteDatasetSP("TSysOrders_SLCT").Tables[0];
				List<Orders> lOrders = new List<Orders>();
				lOrders = ObjectGenerator<Orders>.GeneratListFromDataRowCollection(dt.Rows);
				//פונקציה שהופכת את הטבלה לרשימה
				//lPayment = ObjectGenerator<Payment>.GeneratListFromDataRowCollection(dt.Rows);
				return lOrders;
			}
			catch (Exception ex)
			{
				Log.ExceptionLog(ex.Message, "GetOrders");
				return null;
			}
		}





	}

}