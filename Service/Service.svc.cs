using Service.Entities;
using Service.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;

namespace Service
{
    [ServiceContract]
    public class Service
    {
        //#region Department
        //[OperationContract]
        //[WebInvoke(
        //   Method = "POST",
        //   UriTemplate = "DepartmentInsert",
        //   BodyStyle = WebMessageBodyStyle.WrappedRequest,
        //   ResponseFormat = WebMessageFormat.Json)]
        //public bool DepartmentInsert(Department department, int iManageUserId)
        //{
        //    return Department.DepartmentInsert(department,iManageUserId);
        //}

        //#endregion

        #region ABCBook

        [OperationContract]
        [WebInvoke(
           Method = "POST",
           UriTemplate = "GetAMember",
           BodyStyle = WebMessageBodyStyle.WrappedRequest,
           ResponseFormat = WebMessageFormat.Json)]
        public int GetAMember(int iPersonId)
        {
            return Member.GetAMember(iPersonId);
        }

        [OperationContract]
        [WebInvoke(
           Method = "POST",
           UriTemplate = "GetABCBook",
           BodyStyle = WebMessageBodyStyle.WrappedRequest,
           ResponseFormat = WebMessageFormat.Json)]
        public List<Member> GetABCBook(int iUserId, int iUserType, bool bInCompanionship)
        {
            return Member.GetABCBook(iUserId, iUserType, bInCompanionship);
        }

        [OperationContract]
        [WebInvoke(
           Method = "POST",
           UriTemplate = "GetNewStudents",
           BodyStyle = WebMessageBodyStyle.WrappedRequest,
           ResponseFormat = WebMessageFormat.Json)]
        //int iUserId, int iUserType, bool bInCompanionship
        public List<Member> GetNewStudents(int iCoordinatorId)
        {
            //iUserId, iUserType, bInCompanionship
            return Member.GetNewStudents(iCoordinatorId);
        }

        //
        [OperationContract]
        [WebInvoke(
           Method = "POST",
           UriTemplate = "GetMemberBySearchText",
           BodyStyle = WebMessageBodyStyle.WrappedRequest,
           ResponseFormat = WebMessageFormat.Json)]
        public Member GetMemberBySearchText(string searchText, int iUserId)
        {
            return Member.GetMemberBySearchText(searchText, iUserId);
        }
        #endregion

        #region Companionship
        [OperationContract]
        [WebInvoke(
           Method = "POST",
           UriTemplate = "CreateNewCompanionship",
           BodyStyle = WebMessageBodyStyle.WrappedRequest,
           ResponseFormat = WebMessageFormat.Json)]
        public int? CreateNewCompanionship(Companionship companionship, int iUserId)
        {
            return Companionship.CreateNewCompanionship(companionship, iUserId);
        }

        [OperationContract]
        [WebInvoke(
           Method = "POST",
           UriTemplate = "GetMatchingCompanionships",
           BodyStyle = WebMessageBodyStyle.WrappedRequest,
           ResponseFormat = WebMessageFormat.Json)]
        public List<Member> GetMatchingCompanionships(int iPersonId)
        {
            return Member.GetMatchingCompanionships(iPersonId);
        }

        [OperationContract]
        [WebInvoke(
           Method = "POST",
           UriTemplate = "GetExistingCompanionship",
           BodyStyle = WebMessageBodyStyle.WrappedRequest,
           ResponseFormat = WebMessageFormat.Json)]
        public Companionship GetExistingCompanionship(int? iStudentId, int? iVolunteerId)
        {
            return Companionship.GetExistingCompanionship(iStudentId, iVolunteerId);
        }

        [OperationContract]
        [WebInvoke(
           Method = "POST",
           UriTemplate = "UpdateCompanionshipStatus",
           BodyStyle = WebMessageBodyStyle.WrappedRequest,
           ResponseFormat = WebMessageFormat.Json)]
        public int UpdateCompanionshipStatus(int iCompanionshipId, int iStatusType, string nvDischargedComment, int iStudentStatus, int iVolunteerStatus, int iUserId)
        {
            return Companionship.UpdateCompanionshipStatus(iCompanionshipId, iStatusType,nvDischargedComment,iStudentStatus,iVolunteerStatus, iUserId);
        }

        [OperationContract]
        [WebInvoke(
           Method = "POST",
           UriTemplate = "getCompanionshipsHistory",
           BodyStyle = WebMessageBodyStyle.WrappedRequest,
           ResponseFormat = WebMessageFormat.Json)]
        public List<Companionship> getCompanionshipsHistory(int? iStudentId, int? iVolunteerId)
        {
            return Companionship.getCompanionshipsHistory(iStudentId, iVolunteerId);
        }


        [OperationContract]
        [WebInvoke(
           Method = "POST",
           UriTemplate = "companionshipChekExists",
           BodyStyle = WebMessageBodyStyle.WrappedRequest,
           ResponseFormat = WebMessageFormat.Json)]
        public int companionshipChekExists(int? iStudentId, int? iVolunteerId)
        {
            return Companionship.companionshipChekExists(iStudentId, iVolunteerId);
        }

        //[OperationContract]
        //[WebInvoke(
        //   Method = "POST",
        //   UriTemplate = "GetCompanionshipConversations",
        //   BodyStyle = WebMessageBodyStyle.WrappedRequest,
        //   ResponseFormat = WebMessageFormat.Json)]
        //public List<Conversations> GetCompanionshipConversations(int iCompanionshipId)
        //{
        //    return Conversations.GetCompanionshipConversations(iCompanionshipId);
        //}

        //SetCompanionshipPositive
        #endregion

        #region Conversations
        [OperationContract]
        [WebInvoke(
           Method = "POST",
           UriTemplate = "GetAllConversations",
           BodyStyle = WebMessageBodyStyle.WrappedRequest,
           ResponseFormat = WebMessageFormat.Json)]
        public List<Conversations> GetAllConversations(int? iStudentId, int? iVolunteerId, int? iCompanionshipId)
        {
            return Conversations.GetAllConversations(iStudentId, iVolunteerId, iCompanionshipId);
        }

        [OperationContract]
        [WebInvoke(
           Method = "POST",
           UriTemplate = "GetConversation",
           BodyStyle = WebMessageBodyStyle.WrappedRequest,
           ResponseFormat = WebMessageFormat.Json)]
        public Conversations GetConversation(int iConversationId)
        {
            return Conversations.GetConversation(iConversationId);
        }

        [OperationContract]
        [WebInvoke(
           Method = "POST",
           UriTemplate = "CreateNewConversation",
           BodyStyle = WebMessageBodyStyle.WrappedRequest,
           ResponseFormat = WebMessageFormat.Json)]
        public bool CreateNewConversation(Conversations conversation, int iUserId)
        {
            return Conversations.CreateNewConversation(conversation, iUserId);
        }
        #endregion

        #region NextConversation

        [OperationContract]
        [WebInvoke(
           Method = "POST",
           UriTemplate = "GetNextConversation",
           BodyStyle = WebMessageBodyStyle.WrappedRequest,
           ResponseFormat = WebMessageFormat.Json)]
        public int GetNextConversation(int iCompanionshipId)
        {
            return NextConversation.GetNextConversation(iCompanionshipId);
        }

        [OperationContract]
        [WebInvoke(
           Method = "POST",
           UriTemplate = "GetNumDays",
           BodyStyle = WebMessageBodyStyle.WrappedRequest,
           ResponseFormat = WebMessageFormat.Json)]
        public List<NextConversation> GetNumDays()
        {
            return NextConversation.GetNumDays();
        }

        [OperationContract]
        [WebInvoke(
           Method = "POST",
           UriTemplate = "SetNumDays",
           BodyStyle = WebMessageBodyStyle.WrappedRequest,
           ResponseFormat = WebMessageFormat.Json)]
        public bool SetNumDays(NextConversation setting, int iUserId)
        {
            return NextConversation.SetNumDays(setting, iUserId);
        }
        //
        #endregion

        #region Member
        [OperationContract]
        [WebInvoke(
           Method = "POST",
           UriTemplate = "GetMemberCodeTables",
           BodyStyle = WebMessageBodyStyle.WrappedRequest,
           ResponseFormat = WebMessageFormat.Json)]
        public Dictionary<string, List<CodeTable>> GetMemberCodeTables(int iUserId)
        {
            return Member.GetMemberCodeTables(iUserId);
        }

        [OperationContract]
        [WebInvoke(
           Method = "POST",
           UriTemplate = "GetMemberDetails",
           BodyStyle = WebMessageBodyStyle.WrappedRequest,
           ResponseFormat = WebMessageFormat.Json)]
        public Member GetMemberDetails(int iPersonId)
        {
            return Member.GetMemberDetails(iPersonId);
        }

        [OperationContract]
        [WebInvoke(
           Method = "POST",
           UriTemplate = "GetMember",
           BodyStyle = WebMessageBodyStyle.WrappedRequest,
           ResponseFormat = WebMessageFormat.Json)]
        public Member GetMember(int? iStudentId, int? iVolunteerId)
        {
            return Member.GetMember(iStudentId, iVolunteerId);
        }

        [OperationContract]
        [WebInvoke(
           Method = "POST",
           UriTemplate = "MemberInsertUpdate",
           BodyStyle = WebMessageBodyStyle.WrappedRequest,
           ResponseFormat = WebMessageFormat.Json)]
        public int? MemberInsertUpdate(Member member, int iUserId)
        {
            return Member.MemberInsertUpdate(member, iUserId);
        }

        [OperationContract]
        [WebInvoke(
           Method = "POST",
           UriTemplate = "DeleteMember",
           BodyStyle = WebMessageBodyStyle.WrappedRequest,
           ResponseFormat = WebMessageFormat.Json)]
        public bool DeleteMember(int iPersonId, int iUserId)
        {
            return Member.DeleteMember(iPersonId, iUserId);
        }

        [OperationContract]
        [WebInvoke(
           Method = "POST",
           UriTemplate = "CheckMemberExist",
           BodyStyle = WebMessageBodyStyle.WrappedRequest,
           ResponseFormat = WebMessageFormat.Json)]
        public int CheckMemberExist(string nvMobileNumber)
        {
            return Member.CheckMemberExist(nvMobileNumber);
        }

        #endregion

        //#region MemberSetting
        ////[OperationContract]
        ////[WebInvoke(
        ////   Method = "POST",
        ////   UriTemplate = "getSettings",
        ////   BodyStyle = WebMessageBodyStyle.WrappedRequest,
        ////   ResponseFormat = WebMessageFormat.Json)]
        ////public List<MemberSettings> getSettings()
        ////{
        ////    return MemberSettings.getSettings();
        ////}
        //#endregion

        #region Department

        [OperationContract]
        [WebInvoke(
           Method = "POST",
           UriTemplate = "checkDepartmentExists",
           BodyStyle = WebMessageBodyStyle.WrappedRequest,
           ResponseFormat = WebMessageFormat.Json)]
        public int checkDepartmentExists(string nvDepartmentName)
        {
            return Department.checkDepartmentExists(nvDepartmentName);
        }
        //checkDepartmentExists(string nvDepartmentName)

        #endregion

        #region Cities
        [OperationContract]
        [WebInvoke(
           Method = "POST",
           UriTemplate = "GetCities",
           BodyStyle = WebMessageBodyStyle.WrappedRequest,
           ResponseFormat = WebMessageFormat.Json)]
        public List<CodeTable> GetCities()
        {
            return CodeTable.GetCities();
        }
        #endregion

        #region Coordinators
        [OperationContract]
        [WebInvoke(
           Method = "POST",
           UriTemplate = "GetCoordinators",
           BodyStyle = WebMessageBodyStyle.WrappedRequest,
           ResponseFormat = WebMessageFormat.Json)]
        List<Coordinator> GetCoordinators(int iDepartmentId)
        {
            return Coordinator.GetCoordinators(iDepartmentId);

        }

        [OperationContract]
        [WebInvoke(
           Method = "POST",
           UriTemplate = "GetCoordinatorsCodeTable",
           BodyStyle = WebMessageBodyStyle.WrappedRequest,
           ResponseFormat = WebMessageFormat.Json)]
        Dictionary<string, List<CodeTable>> GetCoordinatorsCodeTable(int iDepartmentId)
        {
            return Coordinator.GetCoordinatorsCodeTable(iDepartmentId);
        }
		#endregion

		#region User

		[OperationContract]
		[WebInvoke(
		   Method = "POST",
		   UriTemplate = "GetUsers",
		   BodyStyle = WebMessageBodyStyle.WrappedRequest,
		   ResponseFormat = WebMessageFormat.Json)]
		public List<User> GetUsers(int iUserType)
		{
			return User.GetUsers(iUserType);
		}

		[OperationContract]
		[WebInvoke(
		   Method = "POST",
		   UriTemplate = "GetProduct",
		   BodyStyle = WebMessageBodyStyle.WrappedRequest,
		   ResponseFormat = WebMessageFormat.Json)]
		public List<Product> GetProduct()
		{
			return Product.GetProduct();
		}

		[OperationContract]
		[WebInvoke(
		   Method = "POST",
		   UriTemplate = "ResetUserPassword",
		   BodyStyle = WebMessageBodyStyle.WrappedRequest,
		   ResponseFormat = WebMessageFormat.Json)]
		public int ResetUserPassword(string nvMail)
		{
			return User.ResetUserPassword(nvMail);
		}


		[OperationContract]
        [WebInvoke(
           Method = "POST",
           UriTemplate = "Login",
           BodyStyle = WebMessageBodyStyle.WrappedRequest,
           ResponseFormat = WebMessageFormat.Json)]
        public User Login(string userName, string password)
        {
            return User.Login(userName, password);
        }

        //[OperationContract]
        //[WebInvoke(
        //   Method = "POST",
        //   UriTemplate = "getUsers",
        //   BodyStyle = WebMessageBodyStyle.WrappedRequest,
        //   ResponseFormat = WebMessageFormat.Json)]
        //public List<UserDetailes> getUsers(int iUserType)
        //{
        //    return UserDetailes.getUsers(iUserType);
        //}

        [OperationContract]
        [WebInvoke(
           Method = "POST",
           UriTemplate = "getUser",
           BodyStyle = WebMessageBodyStyle.WrappedRequest,
           ResponseFormat = WebMessageFormat.Json)]
        public UserDetailes GetUser(int iUserId)
        {
            return UserDetailes.GetUser(iUserId);
        }

        [OperationContract]
        [WebInvoke(
           Method = "POST",
           UriTemplate = "DeleteUser",
           BodyStyle = WebMessageBodyStyle.WrappedRequest,
           ResponseFormat = WebMessageFormat.Json)]
        public bool DeleteUser(int iUserId)
        {
            return User.DeleteUser(iUserId);
        }

        [OperationContract]
        [WebInvoke(
           Method = "POST",
           UriTemplate = "UserInsertUpdate",
           BodyStyle = WebMessageBodyStyle.WrappedRequest,
           ResponseFormat = WebMessageFormat.Json)]
        public bool UserInsertUpdate(UserDetailes newUser, int iManageUserId)
        {
            return UserDetailes.UserInsertUpdate(newUser, iManageUserId);
        }

        [OperationContract]
        [WebInvoke(
           Method = "POST",
           UriTemplate = "CheckUserNameExist",
           BodyStyle = WebMessageBodyStyle.WrappedRequest,
           ResponseFormat = WebMessageFormat.Json)]
        public int CheckUserNameExist(string nvUserName)
        {
            return UserDetailes.CheckUserNameExist(nvUserName);
        }
        #endregion

        #region Messages

        [OperationContract]
        [WebInvoke(
           Method = "POST",
           UriTemplate = "SendEmailToOne",
           BodyStyle = WebMessageBodyStyle.WrappedRequest,
           ResponseFormat = WebMessageFormat.Json)]
        public bool sendEmailToOne(Messages message)
        {
            return Messages.SendEmailToOne(message);
        }

        [OperationContract]
        [WebInvoke(
           Method = "POST",
           UriTemplate = "SendEmailToGroup",
           BodyStyle = WebMessageBodyStyle.WrappedRequest,
           ResponseFormat = WebMessageFormat.Json)]
        public bool sendEmailToGroup(List<All> lMember, Messages message, int iUserId)
        {
            return Messages.SendEmailToGroup(lMember, message, iUserId);
        }

        [OperationContract]
        [WebInvoke(
           Method = "POST",
           UriTemplate = "SendSMSToOne",
           BodyStyle = WebMessageBodyStyle.WrappedRequest,
           ResponseFormat = WebMessageFormat.Json)]
        public string SendSMSToOne(All member, Messages message, int iUserId)
        {
            return Messages.SendSMSToOne(member, message, iUserId);
        }

        [OperationContract]
        [WebInvoke(
           Method = "POST",
           UriTemplate = "SendSMSToGroup",
           BodyStyle = WebMessageBodyStyle.WrappedRequest,
           ResponseFormat = WebMessageFormat.Json)]
        public bool SendSMSToGroup(List<All> lMember, Messages message, int iUserId)
        {
            return Messages.SendSMSToGroup(lMember, message, iUserId);
        }

        #endregion

        #region All

        [OperationContract]
        [WebInvoke(
           Method = "POST",
           UriTemplate = "GetAllVolunteers",
           BodyStyle = WebMessageBodyStyle.WrappedRequest,
           ResponseFormat = WebMessageFormat.Json)]
        public List<All> GetAllVolunteers(int iUserId)
        {
            return All.GetAllVolunteers(iUserId);
        }

        [OperationContract]
        [WebInvoke(
           Method = "POST",
           UriTemplate = "GetAllStudents",
           BodyStyle = WebMessageBodyStyle.WrappedRequest,
           ResponseFormat = WebMessageFormat.Json)]
        public List<All> GetAllStudents(int iUserId)
        {
            return All.GetAllStudents(iUserId);
        }

        [OperationContract]
        [WebInvoke(
           Method = "POST",
           UriTemplate = "GetAllCoordinators",
           BodyStyle = WebMessageBodyStyle.WrappedRequest,
           ResponseFormat = WebMessageFormat.Json)]
        public List<All> GetAllCoordinators(int iUserId)
        {
            return All.GetAllCoordinators(iUserId);
        }

        [OperationContract]
        [WebInvoke(
           Method = "POST",
           UriTemplate = "GetAll",
           BodyStyle = WebMessageBodyStyle.WrappedRequest,
           ResponseFormat = WebMessageFormat.Json)]
        public List<All> GetAll(int iUserId)
        {
            return All.GetAll(iUserId);
        }
        #endregion

        #region General



        #endregion

        #region Settings
        [OperationContract]
        [WebInvoke(
           Method = "POST",
           UriTemplate = "InsertSysTableRow",
           BodyStyle = WebMessageBodyStyle.WrappedRequest,
           ResponseFormat = WebMessageFormat.Json)]
        public bool InsertSysTableRow(SysTableRow sysTableContent, string nvGuide)
        {
            return SysTableRow.InsertSysTableRow(sysTableContent, nvGuide);
        }

        [OperationContract]
        [WebInvoke(
           Method = "POST",
           UriTemplate = "GetSysTableRow",
           BodyStyle = WebMessageBodyStyle.WrappedRequest,
           ResponseFormat = WebMessageFormat.Json)]
        public List<SysTableRow> GetSysTableRow(string nvSysTableNameEng)
        {
            return SysTableRow.GetSysTableRow(nvSysTableNameEng);
        }


        [OperationContract]
        [WebInvoke(
           Method = "POST",
           UriTemplate = "UpdateSysTableRow",
           BodyStyle = WebMessageBodyStyle.WrappedRequest,
           ResponseFormat = WebMessageFormat.Json)]
        public bool UpdateSysTableRow(SysTableRow sysTableContent)
        {
            return SysTableRow.UpdateSysTableRow(sysTableContent);
        }


        [OperationContract]
        [WebInvoke(
           Method = "POST",
           UriTemplate = "DeleteSysTableRow",
           BodyStyle = WebMessageBodyStyle.WrappedRequest,
           ResponseFormat = WebMessageFormat.Json)]
        public bool DeleteSysTableRow(SysTableRow sysTableContent)
        {
            return SysTableRow.DeleteSysTableRow(sysTableContent);
        }

        [OperationContract]
        [WebInvoke(
           Method = "POST",
           UriTemplate = "GetSysTables",
           BodyStyle = WebMessageBodyStyle.WrappedRequest,
           ResponseFormat = WebMessageFormat.Json)]
        public List<SysTableRow> GetSysTables()
        {
            return SysTableRow.GetSysTables();
        }
        #endregion
    }
}
