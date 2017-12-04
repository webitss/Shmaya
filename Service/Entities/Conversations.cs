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
    public class Conversations
    {
        #region Members
        [DataMember]
        public int? iCompanionshipId { get; set; }
        [DataMember]
        public int iConversationId { get; set; }
        [DataMember]
        public int iCoordinatorId { get; set; }
        [DataMember]
        [NoSendToSQL]
        public string nvCoordinatorName { get; set; }
        [DataMember]
        [NoSendToSQL]
        public string nvMemberName { get; set; }
        [DataMember]
        public int? iVolunteerId { get; set; }
        [DataMember]
        public int? iStudentId { get; set; }
        [DataMember]
        public DateTime? dtConversationDate { get; set; }
        [DataMember]
        public string nvSubject { get; set; }
        [DataMember]
        public string nvComment { get; set; }
        [DataMember]
        public DateTime? dtNextConversation { get; set; }
        [DataMember]
        public int iStatusConversationType { get; set; }
        [DataMember]
        [NoSendToSQL]
        public string nvStatusConversation { get; set; }
        #endregion

        #region Functions

        public static List<Conversations> GetAllConversations(int? iStudentId, int? iVolunteerId, int? iCompanionshipId)
        {
            try
            {
                DataSet ds = SqlDataAccess.ExecuteDatasetSP("TConversations_SLCT", new List<SqlParameter>() {
                new SqlParameter("iStudentId",iStudentId),
                new SqlParameter("iVolunteerId",iVolunteerId),
                new SqlParameter("iCompanionshipId",iCompanionshipId)
                });
                List<Conversations> lConversations = new List<Conversations>();
                lConversations = ObjectGenerator<Conversations>.GeneratListFromDataRowCollection(ds.Tables[0].Rows);
                return lConversations;
            }
            catch (Exception ex)
            {
                Log.ExceptionLog(ex.Message, "GetAllConversations");
                return null;
            }
        }

        public static Conversations GetConversation(int iConversationId)
        {
            try
            {
                DataSet ds = SqlDataAccess.ExecuteDatasetSP("T1Conversation_SLCT", new List<SqlParameter>() {
                new SqlParameter("iConversationId",iConversationId)
                });

                Conversations Conversation = new Conversations();
                Conversation = ObjectGenerator<Conversations>.GeneratFromDataRow(ds.Tables[0].Rows[0]);
                return Conversation;
            }
            catch (Exception ex)
            {
                Log.ExceptionLog(ex.Message, "GetConversation");
                return null;
            }
        }

        public static bool CreateNewConversation(Conversations conversation, int iUserId)
        {
            try
            {
                List<SqlParameter> parameters = new List<SqlParameter>() { new SqlParameter("iUserId", iUserId) };
                parameters.AddRange(ObjectGenerator<Conversations>.GetSqlParametersFromObject(conversation));
                DataSet ds = SqlDataAccess.ExecuteDatasetSP("TConversation_INS_UPD", parameters);
                return true;
            }
            catch (Exception ex)
            {
                Log.ExceptionLog(ex.Message, "CreateNewConversation");
                return false;
            }
        }

        //public static List<Conversations> GetCompanionshipConversations(int iCompanionshipId)
        //{
        //    try
        //    {
        //        DataSet ds = SqlDataAccess.ExecuteDatasetSP("ConversationsToCompanionship_SLCT", new List<SqlParameter>() {
        //        new SqlParameter("iCompanionshipId",iCompanionshipId)
        //        });
        //        List<Conversations> lConversations = new List<Conversations>();
        //        lConversations = ObjectGenerator<Conversations>.GeneratListFromDataRowCollection(ds.Tables[0].Rows);
        //        return lConversations;
        //    }
        //    catch (Exception ex)
        //    {
        //        Log.ExceptionLog(ex.Message, "GetCompanionshipConversations");
        //        return null;
        //    }
        //}

        #endregion
    }

    [DataContract]
    public class NextConversation
    {
        [DataMember]
        public int iCompanionshipId { get; set; }
        [DataMember]
        public int iStatusType { get; set; }
        [DataMember]
        [NoSendToSQL]
        public string nvStatusType { get; set; }
        [DataMember]
        public int iNumDays { get; set; }

        public static int GetNextConversation(int iCompanionshipId)
        {
            try
            {
                DataSet ds = SqlDataAccess.ExecuteDatasetSP("TNumDaysForContactStatus_ByICompanionshipId_SLCT", new List<SqlParameter>() {
                new SqlParameter("iCompanionshipId",iCompanionshipId)
                });
                if (ds.Tables[0].Rows.Count == 0)
                    return -100;
                NextConversation conversation = new NextConversation();
                conversation = ObjectGenerator<NextConversation>.GeneratFromDataRow(ds.Tables[0].Rows[0]);
                return conversation.iNumDays;
            }
            catch (Exception ex)
            {
                Log.ExceptionLog(ex.Message, "GetNextConversation");
                return -1;
            }
        }

        public static List<NextConversation> GetNumDays()
        {
            try
            {
                DataSet ds = SqlDataAccess.ExecuteDatasetSP("TNumDaysForContactStatus_SLCT");
                List<NextConversation> lConversation = new List<NextConversation>();
                lConversation = ObjectGenerator<NextConversation>.GeneratListFromDataRowCollection(ds.Tables[0].Rows);
                return lConversation;
            }
            catch (Exception ex)
            {
                Log.ExceptionLog(ex.Message, "GetNumDays");
                return null;
            }
        }

        public static bool SetNumDays(NextConversation setting, int iUserId)
        {
            try
            {
                List<SqlParameter> parameters = new List<SqlParameter>() 
                    { 
                        new SqlParameter("iStatusType", setting.iStatusType),
                        new SqlParameter("iNumDays", setting.iNumDays),//iUserId
                        new SqlParameter("iUserId", iUserId)
                    };
                DataSet ds = SqlDataAccess.ExecuteDatasetSP("TNumDaysForContactStatus_INS", parameters);
                return true;
            }
            catch (Exception ex)
            {
                Log.ExceptionLog(ex.Message, "SetNumDays");
                return false;
            }
        }

    }
}