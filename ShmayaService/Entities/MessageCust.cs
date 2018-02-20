using ShmayaService.Utilities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace ShmayaService.Entities
{
	[DataContract]
	public class MessageCust
	{
		#region Members
		[DataMember]
		public int iMessageId { get; set; }
		[DataMember]
		public string nvSubject { get; set; }
		[DataMember]
		public string nvComment { get; set; }
		[DataMember]
		[NoSendToSQL]
		public DateTime? dtCreateDate { get; set; }
		[DataMember]
		public int iUserId { get; set; }
		[DataMember]
		public int iCreateUserId { get; set; }
		[DataMember]
		[NoSendToSQL]
		public string nvCreateUser { get; set; }

		#endregion
		#region methods

		public static bool CreateNewMessage(MessageCust message)
		{
			try
			{
				List<SqlParameter> parameters = new List<SqlParameter>();
				parameters.AddRange(ObjectGenerator<MessageCust>.GetSqlParametersFromObject(message));
				DataSet ds = SqlDataAccess.ExecuteDatasetSP("TMessage_INS", parameters);
				return true;
			}
			catch (Exception ex)
			{
				Log.ExceptionLog(ex.Message, "CreateNewMessage");
				return false;
			}
		}
		public static List<MessageCust> GetMessages(int iUserId)
		{
			try
			{
				DataTable dt = SqlDataAccess.ExecuteDatasetSP("TSysMessage_SLCT", new SqlParameter("iUserId", iUserId)).Tables[0];
				List<MessageCust> lMessages = new List<MessageCust>();
				lMessages = ObjectGenerator<MessageCust>.GeneratListFromDataRowCollection(dt.Rows);
				return lMessages;
			}
			catch (Exception ex)
			{
				Log.ExceptionLog(ex.Message, "GetMessages");
				return null;
			}
		}


	}

	#endregion
}