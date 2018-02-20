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

				//StringBuilder sbItem = new StringBuilder();

				//sbItem.Append("זמן תרגום");
				//sbItem.Append(" ");
				//sbItem.Append("סהכ לתשלום");
				//sbItem.Append(" ");
				//sbItem.Append("תשלום שעה ראשונה");
				//sbItem.Append(" ");
				//sbItem.Append("תשלום שעה שניה");
				//sbItem.Append(" ");
				//sbItem.Append(Environment.NewLine);
				//for (int i = 0; i < lToProvider.Count; i++)
				//{
				//	sbItem.Append(lToProvider[i].dtTimeTranslation);
				//	sbItem.Append(" ");
				//	sbItem.Append(lToProvider[i].nSumPayment);
				//	sbItem.Append(" ");
				//	sbItem.Append(lToProvider[i].nTariffToFirst);
				//	sbItem.Append(" ");
				//	sbItem.Append(lToProvider[i].nTariffToSecond);
				//	sbItem.Append(" ");
				//	sbItem.Append(Environment.NewLine);
				//}

				string sFileName = "_" + DateTime.Now.ToFileTime().ToString();
				string sFileName2 = "_" + DateTime.Now.ToFileTime().ToString();


				string path = AppDomain.CurrentDomain.BaseDirectory + "Files\\" + sFileName + ".xlsx";
				string path2 = AppDomain.CurrentDomain.BaseDirectory + "Files\\" + sFileName2 + ".xlsx";

				//using (TextWriter tw = new StreamWriter(path, true))
				//{
				//	tw.Write(sbItem.ToString());
				//	tw.Close();
				//}


				string[] str = { "זמן תרגום","סהכ לתשלום","תשלום שעה ראשונה","תשלום שעה שניה" };
				string[] str2 = { "שם לקוח", "שם מתורגמן", "סוג הזמנה", "סוג תרגום" ,"תאריך תרגום","זמן תרגום"};
				Messages message = new Messages();
				message.nvFrom = System.Configuration.ConfigurationManager.AppSettings["mailFrom"];
				message.nvSubject = "דוח סיכום חודשי";
				List<UserBasic> lUser = new List<UserBasic>();
				lUser = UserBasic.GetUsersBasic(3);
				ExcelHendler.ExportToExcel(dt, "aaa", str, path);
				ExcelHendler.ExportToExcel(dt2, "aaa", str2, path2);


				//System.IO.File.Copy(path, "C:\\git.dev\\Shmaya\\ShmayaService\\Files\\reports" + "\\" + "ShmayaReport.xlsx", true);
				//File.SetAttributes(path, FileAttributes.Normal);

				//path = "C:\\git.dev\\Shmaya\\ShmayaService\\Files\\reports" + "\\" + "ShmayaReport.xlsx";



				List<Attachment> lAttach = new List<Attachment>();
				lAttach.Add(new Attachment(path));
				lAttach.Add(new Attachment(path2));
				Messages.SendEmailToGroup(lUser,message,1, lAttach);



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