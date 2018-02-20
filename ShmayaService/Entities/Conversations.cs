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
    public class Conversations
    {
		#region Members
		[DataMember]
		public int iConversationId { get; set; }
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

		#region Functions

        public static bool CreateNewConversation(Conversations conversation/*, int iUserId*/)
        {
            try
            {
				List<SqlParameter> parameters = new List<SqlParameter>(); //{ new SqlParameter("iUserId", iUserId) };
                parameters.AddRange(ObjectGenerator<Conversations>.GetSqlParametersFromObject(conversation));
                DataSet ds = SqlDataAccess.ExecuteDatasetSP("TConversation_INS", parameters);
                return true;
            }
            catch (Exception ex)
            {
                Log.ExceptionLog(ex.Message, "CreateNewConversation");
                return false;
            }
        }
		public static List<Conversations> GetConversations(int iUserId)
		{
			try
			{
				//data table שולף טבלה
				DataTable dt = SqlDataAccess.ExecuteDatasetSP("TSysConversation_SLCT", new SqlParameter("iUserId", iUserId)).Tables[0];
				List<Conversations> lConversations = new List<Conversations>();
				lConversations = ObjectGenerator<Conversations>.GeneratListFromDataRowCollection(dt.Rows);
				//פונקציה שהופכת את הטבלה לרשימה
				//lPayment = ObjectGenerator<Payment>.GeneratListFromDataRowCollection(dt.Rows);
				return lConversations;
			}
			catch (Exception ex)
			{
				Log.ExceptionLog(ex.Message, "GetConversations");
				return null;
			}
		}


	}

	#endregion
}

 

		