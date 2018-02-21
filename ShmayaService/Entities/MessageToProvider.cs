using ShmayaService.Utilities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Net.Mail;
using System.Runtime.Serialization;
using System.Text;
using System.Web;

namespace ShmayaService.Entities
{
	[DataContract]
	public class MessageToProvider
	{
		[DataMember]
		public int iOrderId { get; set; }
		[DataMember]
		public string dtTimeTranslation { get; set; }
		[DataMember]
		public int iSelectedTranslator { get; set; }
		[DataMember]
		public string nSumPayment { get; set; }
		[DataMember]
		public string nTariffToFirst { get; set; }
		[DataMember]
		public string nTariffToSecond { get; set; }


		public static int createDocumentToProviders(int iUserId, DateTime? dtBeginDate, DateTime? dtEndDate)
		{
			try
			{
				List<SqlParameter> parameters = new List<SqlParameter>();
				parameters.Add(new SqlParameter("iUserId", iUserId));
				parameters.Add(new SqlParameter("dtBeginDate", dtBeginDate));
				parameters.Add(new SqlParameter("dtEndDate", dtEndDate));
				//data table שולף טבלה
				DataTable dt = SqlDataAccess.ExecuteDatasetSP("TSumMessage_SLCT", parameters).Tables[0];
				List<MessageToProvider> lToProvider = new List<MessageToProvider>();
				lToProvider = ObjectGenerator<MessageToProvider>.GeneratListFromDataRowCollection(dt.Rows);

				//data table שולף טבלה
				DataTable dt2 = SqlDataAccess.ExecuteDatasetSP("TOrdersByStatus_SLCT", new SqlParameter("iUserId", iUserId)).Tables[0];
				List<Orders> lOrders = new List<Orders>();
				lOrders = ObjectGenerator<Orders>.GeneratListFromDataRowCollection(dt2.Rows);

				string sFileName = "_" + DateTime.Now.ToFileTime().ToString();
				string sFileName2 = "_" + DateTime.Now.ToFileTime().ToString();
				string path = AppDomain.CurrentDomain.BaseDirectory + "Files\\" + sFileName + ".xlsx";
				string path2 = AppDomain.CurrentDomain.BaseDirectory + "Files\\" + sFileName2 + ".xlsx";
				string[] str = { "זמן תרגום","סהכ לתשלום","תשלום שעה ראשונה","תשלום שעה שניה" };
				string[] str2 = { "שם לקוח", "שם מתורגמן", "סוג הזמנה", "סוג תרגום" ,"תאריך תרגום","זמן תרגום"};
				Messages message = new Messages();
				message.nvFrom = System.Configuration.ConfigurationManager.AppSettings["mailFrom"];
				message.nvSubject = "דוח סיכום חודשי";
				message.nvMessage = "שלום. להלן פירוט השעות שבצעת מתאריך" + dtBeginDate + "עד תאריך" + dtEndDate + "ובנוסף רשימת הזמנות שממתינות לאישור תשלום - לטיפולך";
				List<UserBasic> lUser = new List<UserBasic>();
				lUser = UserBasic.GetUsersBasic(3);
				ExcelHendler.ExportToExcel(dt, "aaa", str, path);
				ExcelHendler.ExportToExcel(dt2, "aaa", str2, path2);
				List<Attachment> lAttach = new List<Attachment>();
				lAttach.Add(new Attachment(path));
				lAttach.Add(new Attachment(path2));
				bool isSuccess = Messages.SendEmailToGroup(lUser, message, 1, lAttach);
				if (isSuccess == false)
					return 0;
				return 1;
			}
			catch (Exception ex)
			{

				Log.ExceptionLog(ex.Message, "createDocumentToProviders");
				return 2;
			}
		}

	}
}