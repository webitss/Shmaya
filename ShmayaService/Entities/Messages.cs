using ShmayaService.Entities;
using ShmayaService.Utilities;
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

namespace ShmayaService.Entities
{
	public class Messages
	{
		#region Members
		[NoSendToSQL]
		public int iUserId { get; set; }
		[NoSendToSQL]
		public int iMessageId { get; set; }
		public string nvSubject { get; set; }
		public string nvMessage { get; set; }
		public string nvFrom { get; set; }
		public string nvTo { get; set; }

		#endregion

		#region methods

		public static bool SendEmailToOne( Messages message)
		{
			if (message.nvTo != null && message.nvTo != "")
			{
				//reportDetails = new Reports { sFileName = "AttendanceReport", configKey = "AttendanceSheetPath", iMonth = iMonthId, iPersonId = item.iPersonId, iAfterSchoolId = -1, iCoordinatorId = -1 };
				MailMessage mailMessage = new MailMessage();
				//if (message.nvFrom == null)
				//    mailMessage.From = new MailAddress("saram@webit-sys.com");//new MailAddress(message.nvMailFrom);//ConfigurationManager.AppSettings["mailFrom"].ToString());
				//else
				mailMessage.From = new MailAddress(message.nvFrom);
				//mailMessage.From = new MailAddress(message.nvFrom);//ConfigurationManager.AppSettings["mailFrom"].ToString());
				mailMessage.To.Add(new MailAddress(message.nvTo));
				mailMessage.Subject = message.nvSubject;
				mailMessage.Body = message.nvMessage;
				try
				{
					using (SmtpClient smtpClient = new SmtpClient())
					{
						smtpClient.Send(mailMessage);
					}
				}
				catch (Exception ex)
				{
					Log.ExceptionLog(ex.Message, "sendEmailToOne, nvEmail: " + message.nvTo);
					return false;
				}

			}
			return true;
		}


		public static bool SendEmailToGroup(List<User> lMember, Messages message, int iUserId)
		{

			MailMessage mailMessage = new MailMessage();
			mailMessage.From = new MailAddress(message.nvFrom);
			mailMessage.Subject = message.nvSubject;
			mailMessage.Body = message.nvMessage;
            //Attachment oa = new Attachment("ששם הקובץ");
            //mailMessage.Attachments.Add(oa);
			for (int i = 0; i < lMember.Count; i++)
			{
				if (lMember[i].nvEmail != null && lMember[i].nvEmail != "")
					//To ליסט של כתובות מייל
					mailMessage.Bcc.Add(new MailAddress(lMember[i].nvEmail));
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
				Log.ExceptionLog(ex.Message, "sendEmailToGroup, Email, try1");
				return false;
			}
			try
			{

				foreach (var item in lMember)
				{
					MessageCust messageCust = new MessageCust();
					messageCust.iCreateUserId = iUserId;
					messageCust.nvSubject = message.nvSubject;
					messageCust.nvComment = message.nvMessage;
					messageCust.iUserId = item.iUserId;
					bool res = MessageCust.CreateNewMessage(messageCust);
					if (!res)
						return res;
				}
				return true;
			}
			catch(Exception ex)
			{
				Log.ExceptionLog(ex.Message, "sendEmailToGroup, Email, try1");
				return false;
			}
		}

		public static bool SendSMSToGroup(List<User> lMember, Messages message, int iUserId)
		{
			foreach (var member in lMember)
			{
				try
				{
					message.nvTo = member.nvMobileNum;
					SendSMSToOne(member, message, iUserId);
				}
				catch (Exception ex)
				{
					Log.ExceptionLog(ex.Message, "sendESMSToGroup, member:" + member.nvFullName + ", " + member.nvMobileNum);
				}
			}
			return true;
		}

		public static string SendSMSToOne(User member, Messages message, int iUserId)
		{
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

			MessageCust messageCust = new MessageCust();
			messageCust.iCreateUserId = iUserId;
			messageCust.nvSubject = message.nvSubject;
			messageCust.nvComment = message.nvMessage;
			messageCust.iUserId = member.iUserId;
			bool res = MessageCust.CreateNewMessage(messageCust);

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
	}
	
}