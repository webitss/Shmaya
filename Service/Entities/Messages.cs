using Service.Entities;
using Service.Utilities;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Text;
using System.Web;

namespace Service.Entities
{
	public class Messages
	{
		#region Members

		[NoSendToSQL]
		public int iMessageId { get; set; }
		public string nvSubject { get; set; }
		public string nvMessage { get; set; }
		public string nvFrom { get; set; }
		public string nvTo { get; set; }

		#endregion

		#region Functions

		#region Mail

		public static bool SendEmailToOne(Messages message)
		{

			MailMessage mailMessage = new MailMessage();
			mailMessage.From = new MailAddress(message.nvFrom);
			mailMessage.To.Add(new MailAddress(message.nvTo));
			mailMessage.Subject = message.nvSubject;
			mailMessage.IsBodyHtml = true;
			mailMessage.Body = message.nvMessage;
			try
			{
				using (SmtpClient smtpClient = new SmtpClient())
				{
					smtpClient.Send(mailMessage);
					return true;
				}
			}
			catch (Exception ex)
			{
				Log.ExceptionLog(ex.Message, "sendEmailToOne");
				return false;
			}
			//try
			//{
			//    List<SqlParameter> parameters = new List<SqlParameter>() 
			//        {
			//            new SqlParameter("iUserId", iUserId) ,
			//            new SqlParameter("iPersonId", member.iPersonId) ,
			//            new SqlParameter("nvName", member.nvName) ,
			//            new SqlParameter("nvEmail", member.nvEmail) 
			//        };
			//    parameters.AddRange(ObjectGenerator<Messages>.GetSqlParametersFromObject(message));
			//    DataSet ds = SqlDataAccess.ExecuteDatasetSP("TMessages_INS", parameters);
			//    return true;
			//}
			//catch (Exception ex)
			//{
			//    Log.ExceptionLog(ex.Message, "sendEmailToOne, DB");
			//    return false;
			//}

		}

		public static bool SendEmailToGroup(List<All> lMember, Messages message, int iUserId)
		{

			MailMessage mailMessage = new MailMessage();
			//if (message.nvFrom == null)
			//    mailMessage.From = new MailAddress("saram@webit-sys.com");//new MailAddress(message.nvMailFrom);//ConfigurationManager.AppSettings["mailFrom"].ToString());
			//else
			mailMessage.From = new MailAddress(message.nvFrom);
			mailMessage.Subject = message.nvSubject;
			mailMessage.Body = message.nvMessage;
			for (int i = 0; i < lMember.Count; i++)
			{
				if (lMember[i].nvEmail != null && lMember[i].nvEmail != "")
					mailMessage.To.Add(new MailAddress(lMember[i].nvEmail));
			}
			try
			{
				using (SmtpClient smtpClient = new SmtpClient())
				{
					smtpClient.Send(mailMessage);
				}
			}
			catch (Exception ex)
			{
				Log.ExceptionLog(ex.Message, "sendEmailToGroup, Email");
				return false;
			}
			try
			{
				for (int i = 0; i < lMember.Count; i++)
				{
					List<SqlParameter> parameters = new List<SqlParameter>()
						{
							new SqlParameter("iUserId", iUserId) ,
							new SqlParameter("iPersonId", lMember[i].iPersonId) ,
							new SqlParameter("nvName", lMember[i].nvName),
							new SqlParameter("nvEmail", lMember[i].nvEmail)
						};
					parameters.AddRange(ObjectGenerator<Messages>.GetSqlParametersFromObject(message));
					DataSet ds = SqlDataAccess.ExecuteDatasetSP("TMessages_INS", parameters);
				}
				return true;
			}
			catch (Exception ex)
			{
				Log.ExceptionLog(ex.Message, "sendEmailToGroup, DB");
				return false;
			}
		}

		#endregion

		#region SMS

		public static bool SendSMSToGroup(List<All> lMember, Messages message, int iUserId)
		{
			foreach (var member in lMember)
			{
				try
				{
					message.nvTo = member.nvMobileNumber;
					SendSMSToOne(member, message, iUserId);
				}
				catch (Exception ex)
				{
					Log.ExceptionLog(ex.Message, "sendESMSToGroup, member:" + member.nvName + ", " + member.nvMobileNumber);
				}
			}
			return true;
		}

		public static string SendSMSToOne(All member, Messages message, int iUserId)
		{
			//UpdateLog("SendSMS", "start", "");
			StringBuilder sbXml = new StringBuilder();
			sbXml.Append("<Inforu>");
			sbXml.Append("<User>");
			sbXml.Append("<Username>" + "webit" + "</Username>");
			sbXml.Append("<Password>" + "2222953 " + "</Password>");
			sbXml.Append("</User>");
			sbXml.Append("<Content Type=\"sms\">");
			sbXml.Append("<Message>" + "<![CDATA[" + message.nvMessage + "]]>" + "</Message>");
			sbXml.Append("</Content>");
			sbXml.Append("<Recipients>");
			sbXml.Append("<PhoneNumber>" + message.nvTo + "</PhoneNumber>");
			sbXml.Append("</Recipients>");
			sbXml.Append("<Settings>");
			sbXml.Append("<SenderNumber>" + message.nvFrom + "</SenderNumber>");


			sbXml.Append("<MessageInterval>" + 0 + "</MessageInterval>");

			sbXml.Append("</Settings>");
			sbXml.Append("</Inforu>");
			string strXML = HttpUtility.UrlEncode(sbXml.ToString(), System.Text.Encoding.UTF8);
			string result = PostDataToURL("http://api.inforu.co.il/SendMessageXml.ashx", "InforuXML=" + strXML);
			//UpdateLog("SendSMS", result, "");
			List<SqlParameter> parameters = new List<SqlParameter>()
						{
							new SqlParameter("iUserId", iUserId) ,
							new SqlParameter("iPersonId", member.iPersonId) ,
							new SqlParameter("nvName", member.nvName),
							new SqlParameter("nvMobileNumber",member.nvMobileNumber)
						 };
			parameters.AddRange(ObjectGenerator<Messages>.GetSqlParametersFromObject(message));
			DataSet ds = SqlDataAccess.ExecuteDatasetSP("TMessages_INS", parameters);
			return result;
		}

		static string PostDataToURL(string szUrl, string szData)
		{
			//Setup the web request
			string szResult = string.Empty;
			WebRequest Request = WebRequest.Create(szUrl);
			Request.Timeout = 30000;
			Request.Method = "POST";
			Request.ContentType = "application/x-www-form-urlencoded";
			//Set the POST data in a buffer
			byte[] PostBuffer;
			try
			{
				// replacing " " with "+" according to Http post RPC
				szData = szData.Replace(" ", "+");
				//Specify the length of the buffer
				PostBuffer = Encoding.UTF8.GetBytes(szData);
				Request.ContentLength = PostBuffer.Length;
				//Open up a request stream
				Stream RequestStream = Request.GetRequestStream();
				//Write the POST data
				RequestStream.Write(PostBuffer, 0, PostBuffer.Length);
				//Close the stream
				RequestStream.Close();
				//Create the Response object
				WebResponse Response;
				Response = Request.GetResponse();
				//Create the reader for the response
				StreamReader sr = new StreamReader(Response.GetResponseStream(), Encoding.UTF8);
				//Read the response
				szResult = sr.ReadToEnd();
				//Close the reader, and response
				sr.Close();
				Response.Close();
				return szResult;
			}
			catch (Exception)
			{
				return szResult;
			}
		}

		#endregion

		#endregion
	}

	public class All
	{
		#region Members

		public int iId { get; set; }
		public int iPersonId { get; set; }
		public string nvName { get; set; }
		public string nvEmail { get; set; }
		public string nvMobileNumber { get; set; }
		public bool bNotReceivingMessages { get; set; }
		public int iGenderType { get; set; }

		#endregion

		#region Functions

		public static List<All> GetAllVolunteers(int iUserId)
		{
			try
			{
				DataSet ds = SqlDataAccess.ExecuteDatasetSP("TVolunteers_SLCT", new SqlParameter("iUserId", iUserId));
				List<All> lVolunteers = new List<All>();
				lVolunteers = ObjectGenerator<All>.GeneratListFromDataRowCollection(ds.Tables[0].Rows);
				return lVolunteers;
			}
			catch (Exception ex)
			{
				Log.ExceptionLog(ex.Message, "GetAllVolunteers");
				return null;
			}
		}

		public static List<All> GetAllStudents(int iUserId)
		{
			try
			{
				DataSet ds = SqlDataAccess.ExecuteDatasetSP("TStudents_SLCT", new SqlParameter("iUserId", iUserId));
				List<All> lVolunteers = new List<All>();
				lVolunteers = ObjectGenerator<All>.GeneratListFromDataRowCollection(ds.Tables[0].Rows);
				return lVolunteers;
			}
			catch (Exception ex)
			{
				Log.ExceptionLog(ex.Message, "GetAllStudents");
				return null;
			}
		}

		public static List<All> GetAllCoordinators(int iUserId)
		{
			try
			{
				DataSet ds = SqlDataAccess.ExecuteDatasetSP("TCoordinators_SLCT", new SqlParameter("iUserId", iUserId));
				List<All> lVolunteers = new List<All>();
				lVolunteers = ObjectGenerator<All>.GeneratListFromDataRowCollection(ds.Tables[0].Rows);
				return lVolunteers;
			}
			catch (Exception ex)
			{
				Log.ExceptionLog(ex.Message, "GetAllCoordinators");
				return null;
			}
		}

		public static List<All> GetAll(int iUserId)
		{
			try
			{
				DataSet ds = SqlDataAccess.ExecuteDatasetSP("TAll_SLCT", new SqlParameter("iUserId", iUserId));
				List<All> lVolunteers = new List<All>();
				lVolunteers = ObjectGenerator<All>.GeneratListFromDataRowCollection(ds.Tables[0].Rows);
				return lVolunteers;
			}
			catch (Exception ex)
			{
				Log.ExceptionLog(ex.Message, "GetAll");
				return null;
			}
		}

		#endregion
	}
}