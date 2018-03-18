using Infra.DL;
using ShmayaService.Utilities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Diagnostics;
using System.Globalization;
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
				FileManageCtrl.DeleteAllFile(AppDomain.CurrentDomain.BaseDirectory + "Files\\reports");


				List <UserBasic> lUser = new List<UserBasic>();
				lUser = UserBasic.GetUsersBasic(3);
				foreach (var user in lUser)
				{
				
						List<SqlParameter> parameters = new List<SqlParameter>();
						parameters.Add(new SqlParameter("iUserId", user.iUserId));
						parameters.Add(new SqlParameter("dtBeginDate", dtBeginDate));
						parameters.Add(new SqlParameter("dtEndDate", dtEndDate));
						//data table שולף טבלה
						DataTable dt = SqlDataAccess.ExecuteDatasetSP("TSumMessage_SLCT", parameters).Tables[0];
						List<MessageToProvider> lToProvider = new List<MessageToProvider>();
						lToProvider = ObjectGenerator<MessageToProvider>.GeneratListFromDataRowCollection(dt.Rows);

						//data table שולף טבלה
						DataTable dt2 = SqlDataAccess.ExecuteDatasetSP("TOrdersByStatus_SLCT", new SqlParameter("iUserId", user.iUserId)).Tables[0];
						List<Orders> lOrders = new List<Orders>();
						lOrders = ObjectGenerator<Orders>.GeneratListFromDataRowCollection(dt2.Rows);

						string sFileName = "פירוט שעות";
						string sFileName2 = "רשימת הזמנות";
						string path = AppDomain.CurrentDomain.BaseDirectory + "Files\\" +"reports\\"+ sFileName + "_" + DateTime.Now.ToFileTime().ToString() + ".xlsx";
						string path2 = AppDomain.CurrentDomain.BaseDirectory + "Files\\" + "reports\\" + sFileName2 + "_" + DateTime.Now.ToFileTime().ToString() + ".xlsx";
						string[] str = { "זמן תרגום", "סהכ לתשלום", "תשלום שעה ראשונה", "תשלום שעה שניה" };
						string[] str2 = { "שם לקוח", "שם מתורגמן", "סוג הזמנה", "סוג תרגום", "תאריך תרגום", "זמן תרגום" };
						Messages message = new Messages();
						message.nvFrom = System.Configuration.ConfigurationManager.AppSettings["mailFrom"];
						message.nvTo = user.nvEmail;
						message.nvSubject = "דוח סיכום חודשי";

						string dtBeginDateString = dtBeginDate != null ? dtBeginDate.Value.ToString("dd-MM-yyyy") : "n/a";
						string dtEndDateString = dtEndDate != null ? dtEndDate.Value.ToString("dd-MM-yyyy") : "n/a";

						if (lToProvider != null && lToProvider.Count != 0 && lOrders != null && lOrders.Count != 0)
							message.nvMessage = " שלום. מצ\"ב פירוט השעות שבצעת מתאריך" + " " + dtBeginDateString + " " + "עד תאריך " + dtEndDateString + " " + "ובנוסף רשימת הזמנות שממתינות לאישור תשלום - לטיפולך";
						else
							if (lToProvider != null && lToProvider.Count != 0)
							message.nvMessage = " שלום. מצ\"ב פירוט השעות שבצעת מתאריך" + " " + dtBeginDateString + " " + "עד תאריך " + dtEndDateString;
						else
							if (lOrders != null && lOrders.Count != 0)
							message.nvMessage = "שלום. מצ\"ב רשימת הזמנות שממתינות לאישור תשלום - לטיפולך";



						ExcelHendler.ExportToExcel(dt, "aaa", str, path);
						ExcelHendler.ExportToExcel(dt2, "aaa", str2, path2);
						List<Attachment> lAttach = new List<Attachment>();
						if (lToProvider != null && lToProvider.Count != 0)
							lAttach.Add(new Attachment(path));
						if (lOrders != null && lOrders.Count != 0)
							lAttach.Add(new Attachment(path2));
						bool isSuccess = Messages.SendEmailToOne(message, lAttach,false);
					
					}
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