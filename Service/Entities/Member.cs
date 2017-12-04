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
    public class Member : Person
    {
        #region Members

        #region Student
        [DataMember]
        public int? iStudentId { get; set; }
        [DataMember]
        public bool bSampleCompanionship { get; set; }
        //[DataMember]
        //public int iMYPersonId { get; set; }
        //[NoSendToSQL]
        //[DataMember]
        //public string TMYCustomer { get; set; }
        //[DataMember]
        //public int iMYWorkerId { get; set; }
        [DataMember]
        public string nvFacebook { get; set; }
        [DataMember]
        public int? iPostedByCoordinatorId { get; set; }
        [DataMember]
        public string nvContinueConnection { get; set; }
        [DataMember]
        public string nvSourceComments { get; set; }
        [DataMember]
        public string nvImportantComment { get; set; }
        [DataMember]
        public int? iDonationsType { get; set; }
        [NoSendToSQL]
        [DataMember]
        public string nvDonationsType { get; set; }
        #endregion

        #region Volunteer
        [DataMember]
        public int? iVolunteerId { get; set; }
        [DataMember]
        public string nvTeaching { get; set; }
        [DataMember]
        public int? iExperienceType { get; set; }
        [NoSendToSQL]
        [DataMember]
        public string nvExperienceType { get; set; }
        [DataMember]
        public int? iKollellType { get; set; }
        [NoSendToSQL]
        [DataMember]
        public string nvKollellType { get; set; }
        [DataMember]
        public string nvPriority { get; set; }
        //?
        [NoSendToSQL]
        [DataMember]
        public string iYearType { get; set; }
        [DataMember]
        public int? iFileSourceType { get; set; }
        [NoSendToSQL]
        [DataMember]
        public string nvFileSourceType { get; set; }
        [DataMember]
        public int? iSettingType { get; set; }
        [NoSendToSQL]
        [DataMember]
        public string nvSettingType { get; set; }
        [DataMember]
        public string nvSendBy { get; set; }
        #endregion

        #region Member
        [DataMember]
        public int iCoordinatorId { get; set; }
        [DataMember]
        public int iSeriousnessId { get; set; }
        [NoSendToSQL]
        [DataMember]
        public string nvSeriousness { get; set; }
        [DataMember]
        public int? iEducationType { get; set; }
        [DataMember]
        [NoSendToSQL]
        public string nvEducationType { get; set; }
        [DataMember]
        public string nvEmploymentType { get; set; }
        [DataMember]
        public bool bNotReceivingMessages { get; set; }
        [DataMember]
        public string nvComment { get; set; }
        [DataMember]
        public int? iOccupationType { get; set; }
        [NoSendToSQL]
        [DataMember]
        public string nvOccupationType { get; set; }
        [NoSendToSQL]
        [DataMember]
        public DateTime? dtRegistrationDate { get; set; }
        [DataMember]
        public DateTime? tAvailableConversationFrom { get; set; }
        [DataMember]
        public DateTime? tAvailableConversationTo { get; set; }
        [DataMember]
        public int iDepartmentId { get; set; }
        [NoSendToSQL]
        [DataMember]
        public string nvDepartmentName { get; set; }
        [DataMember]
        public int? iNameSourceType { get; set; }
        [NoSendToSQL]
        [DataMember]
        public string nvNameSourceType { get; set; }
        //todo: send this parameter to sql?
        [NoSendToSQL]
        [DataMember]
        public string nvStatusType { get; set; }
        [DataMember]
        public int iStatusType { get; set; }
        [NoSendToSQL]
        [DataMember]
        public bool bIsTodayConversation { get; set; }
        [DataMember]
        [NoSendToSQL]
        public List<MemberSettings> lLanguage { get; set; }
        [DataMember]
        [NoSendToSQL]
        public List<MemberSettings> lFieldInterst { get; set; }
        [DataMember]
        [NoSendToSQL]
        public List<MemberSettings> lStyle { get; set; }
        [DataMember]
        [NoSendToSQL]
        public List<Availability> lAvailability { get; set; }
        [DataMember]
        [NoSendToSQL]
        public string nvAvailability { get; set; }
        [DataMember]
        [NoSendToSQL]
        public string nvCompanionshipStatus { get; set; }
        [DataMember]
        [NoSendToSQL]
        public int iCompanionshipStatusType { get; set; }
        
        [DataMember][NoSendToSQL]
        public DateTime? dtNextConversation { get; set; }

        #endregion

        #endregion

        #region Methods

        //
        public static int GetAMember(int iPersonId)
        {
            try
            {
                DataSet ds = SqlDataAccess.ExecuteDatasetSP("TMember_Get", new SqlParameter("iPersonId", iPersonId));
                if (ds.Tables[0].Rows[0] != null)
                    return int.Parse(ds.Tables[0].Rows[0][0].ToString());
                return int.Parse(ds.Tables[1].Rows[0][0].ToString());
            }
            catch (Exception ex)
            {
                Log.ExceptionLog(ex.Message, "GetMember");
                return -1;
            }
        }

        public static List<Member> GetABCBook(int iUserId, int iUserType, bool bInCompanionship)
        {
            try
            {
                DataSet ds = SqlDataAccess.ExecuteDatasetSP("TMembers_SLCT", new List<SqlParameter>() {
                new SqlParameter("iUserId",iUserId),
                new SqlParameter("iUserType",iUserType),
                new SqlParameter("bInCompanionship",bInCompanionship)
                });
                List<Member> lMembers = new List<Member>();
                lMembers = ObjectGenerator<Member>.GeneratListFromDataRowCollection(ds.Tables[0].Rows);
                return lMembers;
            }
            catch (Exception ex)
            {
                Log.ExceptionLog(ex.Message, "GetABCBook");
                return null;
            }
        }

        public static List<Member> GetNewStudents(int iCoordinatorId)
        {
            try
            {
                DataSet ds = SqlDataAccess.ExecuteDatasetSP("TMember_SLCT_New", new SqlParameter("iCoordinatorId", iCoordinatorId));
                List<Member> lMembers = new List<Member>();
                lMembers = ObjectGenerator<Member>.GeneratListFromDataRowCollection(ds.Tables[0].Rows);
                return lMembers;
            }
            catch (Exception ex)
            {
                Log.ExceptionLog(ex.Message, "GetNewStudents");
                return null;
            }
        }

        public static Member GetMemberBySearchText(string searchText, int iUserId)
        {
            try
            {
                DataSet ds = SqlDataAccess.ExecuteDatasetSP("TMember_Search", new List<SqlParameter>() {
                new SqlParameter("searchText",searchText),
                new SqlParameter("iUserId",iUserId)
                });
                Member member = new Member();
                if (ds.Tables[0].Rows.Count != 0)
                {
                    member = ObjectGenerator<Member>.GeneratFromDataRow(ds.Tables[0].Rows[0]);
                    return member;
                }
                if (ds.Tables[1].Rows.Count != 0)
                    member.iDepartmentId = -1;
                return member;
            }
            catch (Exception ex)
            {
                Log.ExceptionLog(ex.Message, "GetMemberBySearchText");
                return null;
            }
        }

        public static int? MemberInsertUpdate(Member member, int iUserId)
        {
            try
            {
                List<MemberSettings> lMemberSettings = new List<MemberSettings>();
                lMemberSettings.AddRange(member.lLanguage);
                lMemberSettings.AddRange(member.lFieldInterst);
                lMemberSettings.AddRange(member.lStyle);

                List<Availability> lMemberAvailabilities = new List<Availability>();
                lMemberAvailabilities.AddRange(member.lAvailability);

                List<SqlParameter> parameters = new List<SqlParameter>() 
                {
                    new SqlParameter("iUserId", iUserId) ,
                    ObjectGenerator<MemberSettings>.GetDataTableParametersFromList("lMemberSettings", lMemberSettings),
                    ObjectGenerator<Availability>.GetDataTableParametersFromList("lMemberAvailabilities", lMemberAvailabilities)
                };
                parameters.AddRange(ObjectGenerator<Member>.GetSqlParametersFromObject(member));
                if (parameters.Contains(parameters.FirstOrDefault(r => r.ParameterName == "dtDateBirth")))
                    parameters.Remove(parameters.Single(r => r.ParameterName == "dtDateBirth"));
                DataSet ds = SqlDataAccess.ExecuteDatasetSP("TMember_INS_UPD", parameters);

                return int.Parse(ds.Tables[0].Rows[0][0].ToString());

            }
            catch (Exception ex)
            {
                Log.ExceptionLog(ex.Message, "MemberInsertUpdate");
                return -1;
            }
        }

        public static int CheckMemberExist(string nvMobileNumber)
        {
            try
            {
                DataSet ds = SqlDataAccess.ExecuteDatasetSP("TMember_CheckExist_SLCT", new SqlParameter("nvMobileNumber", nvMobileNumber));
                return ds.Tables[0].Rows.Count;
            }
            catch (Exception ex)
            {
                Log.ExceptionLog(ex.Message, "CheckMemberExist");
                return -1;
            }
        }

        public static List<Member> GetMatchingCompanionships(int iPersonId)
        {
            try
            {
                DataSet ds = SqlDataAccess.ExecuteDatasetSP("TMembers_MatchingCompanionship_SLCT", new List<SqlParameter>() {

                new SqlParameter("iPersonId",iPersonId)
                });
                //List<Member> matchingComntactsList = ObjectGenerator<Member>.GeneratListFromDataRowCollection(ds.Tables[0].Rows); ;
                //return matchingComntactsList;
                List<Member> lMember = new List<Member>();
                lMember = ObjectGenerator<Member>.GeneratListFromDataRowCollection(ds.Tables[0].Rows);
                return lMember;
            }
            catch (Exception ex)
            {
                Log.ExceptionLog(ex.Message, "GetMatchingCompanionships");
                return null;
            }
        }

        public static Member GetMemberDetails(int iPersonId)
        {
            try
            {
                DataSet ds = SqlDataAccess.ExecuteDatasetSP("TMemberDetails_SLCT", new List<SqlParameter>() {
                new SqlParameter("iPersonId",iPersonId)
                });
                Member member = ObjectGenerator<Member>.GeneratFromDataRow(ds.Tables[0].Rows[0]);
                return member;
            }
            catch (Exception ex)
            {
                Log.ExceptionLog(ex.Message, "GetMemberDetails");
                return null;
            }
        }

        public static Dictionary<string, List<CodeTable>> GetMemberCodeTables(int iUserId)
        {
            return CodeTable.GetListCodeTables("TMember_CodeTables_SLCT", new List<SqlParameter>() { new SqlParameter("iUserId", iUserId) });
        }

        public static Member GetMember(int? iStudentId, int? iVolunteerId)
        {
            try
            {
                DataSet ds = SqlDataAccess.ExecuteDatasetSP("TMember_SLCT", new List<SqlParameter>() {
                new SqlParameter("iStudentId",iStudentId),
                new SqlParameter("iVolunteerId",iVolunteerId)
                });
                Member member = new Member();
                member = ObjectGenerator<Member>.GeneratFromDataRow(ds.Tables[0].Rows[0]);
                member.lLanguage = ObjectGenerator<MemberSettings>.GeneratListFromDataRowCollection(new DataView(ds.Tables[1], "iSettingType=23", "", DataViewRowState.CurrentRows).ToTable().Rows);
                member.lStyle = ObjectGenerator<MemberSettings>.GeneratListFromDataRowCollection(new DataView(ds.Tables[1], "iSettingType=17", "", DataViewRowState.CurrentRows).ToTable().Rows);
                member.lFieldInterst = ObjectGenerator<MemberSettings>.GeneratListFromDataRowCollection(new DataView(ds.Tables[1], "iSettingType=18", "", DataViewRowState.CurrentRows).ToTable().Rows);
                member.lAvailability = ObjectGenerator<Availability>.GeneratListFromDataRowCollection(ds.Tables[2].Rows);
                return member;
            }
            catch (Exception ex)
            {
                Log.ExceptionLog(ex.Message, "GetMember");
                return null;
            }
        }

        public static bool DeleteMember(int iPersonId, int iUserId)
        {
            try
            {
                DataSet ds = SqlDataAccess.ExecuteDatasetSP("TMember_DEL", new List<SqlParameter>() {
                new SqlParameter("iPersonId",iPersonId),
                 new SqlParameter("iUserId",iUserId),
                });

                return true;
            }
            catch (Exception ex)
            {
                Log.ExceptionLog(ex.Message, "DeleteMember");
                return false;
            }
        }

        #endregion
    }
}

