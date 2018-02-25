using ShmayaService.Entities;
using ShmayaService.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;
using System.Net.Mail;

namespace ShmayaService
{
    [ServiceContract]
    public class Service
    {

        #region User

        [OperationContract]
        [WebInvoke(
           Method = "POST",
           UriTemplate = "CheckIdentity",
           BodyStyle = WebMessageBodyStyle.WrappedRequest,
           ResponseFormat = WebMessageFormat.Json)]
        public int CheckIdentity(string nvIdentity)
        {
            return User.CheckIdentity(nvIdentity);
        }

        [OperationContract]
        [WebInvoke(
           Method = "POST",
           UriTemplate = "GetUserByIdentity",
           BodyStyle = WebMessageBodyStyle.WrappedRequest,
           ResponseFormat = WebMessageFormat.Json)]
        public Result GetUserByIdentity(string nvIdentity, int userType)
        {
            return User.GetUserByIdentity(nvIdentity,userType);
        }

        [OperationContract]
        [WebInvoke(
           Method = "POST",
           UriTemplate = "GetUsers",
           BodyStyle = WebMessageBodyStyle.WrappedRequest,
           ResponseFormat = WebMessageFormat.Json)]
        public List<User> GetUsers(int iUserId)
        {
            return User.GetUsers(iUserId);
        }

        [OperationContract]
        [WebInvoke(
           Method = "POST",
           UriTemplate = "GetUserCodeTables",
           BodyStyle = WebMessageBodyStyle.WrappedRequest,
           ResponseFormat = WebMessageFormat.Json)]
        public Dictionary<string, List<CodeTable>> GetUserCodeTables(int iUserId)
        {
            return User.GetUserCodeTables(iUserId);
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
          UriTemplate = "UserInsert",
          BodyStyle = WebMessageBodyStyle.WrappedRequest,
          ResponseFormat = WebMessageFormat.Json)]
        public int? UserInsert(User user, int iUserManagerId, int userType)
        {
            return User.UserInsert(user, iUserManagerId, userType);
        }

        [OperationContract]
        [WebInvoke(
          Method = "POST",
          UriTemplate = "UserUpdate",
          BodyStyle = WebMessageBodyStyle.WrappedRequest,
          ResponseFormat = WebMessageFormat.Json)]
        public int? UserUpdate(User user, int iUserManagerId)
        {
            return User.UserUpdate(user, iUserManagerId);
        }

		[OperationContract]
		[WebInvoke(
		 Method = "POST",
		UriTemplate = "GetUsersCode",
		BodyStyle = WebMessageBodyStyle.WrappedRequest,
		ResponseFormat = WebMessageFormat.Json)]
		public List<KeyValue<int, string>> GetUsersCode(int? iUserType, int iStatusId, int? iTypeTranslation)
		{
			return User.GetUsersCode(iUserType, iStatusId, iTypeTranslation);
		}

		[OperationContract]
		[WebInvoke(
		 Method = "POST",
		 UriTemplate = "YearOfRenewalUpdate",
		 BodyStyle = WebMessageBodyStyle.WrappedRequest,
		 ResponseFormat = WebMessageFormat.Json)]
		public void YearOfRenewalUpdate()
		{
			User.YearOfRenewalUpdate();
		}

		[OperationContract]
		[WebInvoke(
		 Method = "POST",
		 UriTemplate = "BankHoursUpdate",
		 BodyStyle = WebMessageBodyStyle.WrappedRequest,
		 ResponseFormat = WebMessageFormat.Json)]
		public string BankHoursUpdate()
		{
			return User.BankHoursUpdate();
		}
		

		#endregion
				[OperationContract]
		[WebInvoke(
		 Method = "POST",
		 UriTemplate = "UpdateVat",
		 BodyStyle = WebMessageBodyStyle.WrappedRequest,
		 ResponseFormat = WebMessageFormat.Json)]
		public void UpdateVat(int vat)
		{
			 SysTableRow.UpdateVat(vat);
		}

		#region Order

		[OperationContract]
        [WebInvoke(
           Method = "POST",
           UriTemplate = "GetOrders",
           BodyStyle = WebMessageBodyStyle.WrappedRequest,
           ResponseFormat = WebMessageFormat.Json)]
        public List<Orders> GetOrders()
        {
            return Orders.GetOrders();
        }

        [OperationContract]
        [WebInvoke(
           Method = "POST",
           UriTemplate = "GetOrdersByUser",
           BodyStyle = WebMessageBodyStyle.WrappedRequest,
           ResponseFormat = WebMessageFormat.Json)]
        public List<Orders> GetOrdersByUser(int iUserId, int iUserType)
        {
            return Orders.GetOrdersByUser(iUserId, iUserType);
        }

        [OperationContract]
        [WebInvoke(
          Method = "POST",
          UriTemplate = "DeleteOrder",
          BodyStyle = WebMessageBodyStyle.WrappedRequest,
          ResponseFormat = WebMessageFormat.Json)]
        public bool DeleteOrder(int iOrderId)
        {
            return Orders.DeleteOrder(iOrderId);
        }

        [OperationContract]
        [WebInvoke(
      Method = "POST",
      UriTemplate = "OrderUpdate",
      BodyStyle = WebMessageBodyStyle.WrappedRequest,
      ResponseFormat = WebMessageFormat.Json)]
        public Orders OrderUpdate(Orders order, int iUserManagerId, DateTime? prevTimeTranslation)
        {
            return Orders.OrderUpdate(order, iUserManagerId, prevTimeTranslation);
        }

        [OperationContract]
        [WebInvoke(
          Method = "POST",
          UriTemplate = "OrderInsert",
          BodyStyle = WebMessageBodyStyle.WrappedRequest,
          ResponseFormat = WebMessageFormat.Json)]
        public Orders OrderInsert(Orders order, int iUserManagerId, int? isFromSite)
        {
            return Orders.OrderInsert(order, iUserManagerId, isFromSite);
        }

        [OperationContract]
        [WebInvoke(
          Method = "POST",
          UriTemplate = "ChangeStatus",
          BodyStyle = WebMessageBodyStyle.WrappedRequest,
          ResponseFormat = WebMessageFormat.Json)]
        public int? ChangeStatus(int iStatusId, int iOrderId)
        {
            return Orders.ChangeStatus(iStatusId, iOrderId);
        }


        #endregion

        #region conversations
        [OperationContract]
        [WebInvoke(
               Method = "POST",
               UriTemplate = "GetConversations",
               BodyStyle = WebMessageBodyStyle.WrappedRequest,
               ResponseFormat = WebMessageFormat.Json)]
        public List<Conversations> GetConversations(int iUserId)
        {
            return Conversations.GetConversations(iUserId);
        }

        [OperationContract]
        [WebInvoke(
           Method = "POST",
           UriTemplate = "CreateNewConversation",
           BodyStyle = WebMessageBodyStyle.WrappedRequest,
           ResponseFormat = WebMessageFormat.Json)]
        public bool CreateNewConversation(Conversations conversation/*, int iUserId*/)
        {
            return Conversations.CreateNewConversation(conversation/*, iUserId*/);
        }

        #endregion

        #region Messages
        [OperationContract]
        [WebInvoke(
            Method = "POST",
            UriTemplate = "GetMessages",
            BodyStyle = WebMessageBodyStyle.WrappedRequest,
            ResponseFormat = WebMessageFormat.Json)]
        public List<MessageCust> GetMessages(int iUserId)
        {
            return MessageCust.GetMessages(iUserId);
        }
        [OperationContract]
        [WebInvoke(
        Method = "POST",
        UriTemplate = "CreateNewMessage",
        BodyStyle = WebMessageBodyStyle.WrappedRequest,
        ResponseFormat = WebMessageFormat.Json)]
        public bool CreateNewMessage(MessageCust message)
        {
            return MessageCust.CreateNewMessage(message);
        }

        [OperationContract]
        [WebInvoke(
           Method = "POST",
           UriTemplate = "SendEmailToGroup",
           BodyStyle = WebMessageBodyStyle.WrappedRequest,
           ResponseFormat = WebMessageFormat.Json)]
        public bool sendEmailToGroup(List<UserBasic> lMember, Messages message, int iUserId, List<Attachment> lAttach)
        {
            return Messages.SendEmailToGroup(lMember, message, iUserId, lAttach);
        }

        [OperationContract]
        [WebInvoke(
           Method = "POST",
           UriTemplate = "SendSMSToOne",
           BodyStyle = WebMessageBodyStyle.WrappedRequest,
           ResponseFormat = WebMessageFormat.Json)]
        public string SendSMSToOne(User member, Messages message, int iUserId)
        {
            return Messages.SendSMSToOne(member, message, iUserId);
        }

        [OperationContract]
        [WebInvoke(
           Method = "POST",
           UriTemplate = "SendSMSToGroup",
           BodyStyle = WebMessageBodyStyle.WrappedRequest,
           ResponseFormat = WebMessageFormat.Json)]
        public bool SendSMSToGroup(List<User> lMember, Messages message, int iUserId)
        {
            return Messages.SendSMSToGroup(lMember, message, iUserId);
        }

        [OperationContract]
        [WebInvoke(
          Method = "POST",
          UriTemplate = "SendSMSToGroup",
          BodyStyle = WebMessageBodyStyle.WrappedRequest,
          ResponseFormat = WebMessageFormat.Json)]
        public static bool SendEmailToOne(Messages message, List<Attachment> lAttach)
        {
            return Messages.SendEmailToOne(message, lAttach);
        }



        #endregion

        #region Eligibility
        [OperationContract]
        [WebInvoke(
       Method = "POST",
       UriTemplate = "GetEligibiltyTable",
       BodyStyle = WebMessageBodyStyle.WrappedRequest,
       ResponseFormat = WebMessageFormat.Json)]
        public List<EligibiltyTable> GetEligibiltyTable()
        {
            return EligibiltyTable.GetEligibiltyTable();
        }

        [OperationContract]
        [WebInvoke(
          Method = "POST",
          UriTemplate = "EligibilityUpdate",
          BodyStyle = WebMessageBodyStyle.WrappedRequest,
          ResponseFormat = WebMessageFormat.Json)]
        public int? EligibilityUpdate(EligibiltyTable eligibility, int iUserManagerId)
        {
            return EligibiltyTable.EligibilityUpdate(eligibility, iUserManagerId);
        }

        [OperationContract]
        [WebInvoke(
      Method = "POST",
      UriTemplate = "EligibilityInsert",
      BodyStyle = WebMessageBodyStyle.WrappedRequest,
      ResponseFormat = WebMessageFormat.Json)]
        public int? EligibilityInsert(EligibiltyTable eligibility, int iUserManagerId)
        {
            return EligibiltyTable.EligibilityInsert(eligibility, iUserManagerId);
        }
        #endregion

        #region Payment

        [OperationContract]
        [WebInvoke(
           Method = "POST",
           UriTemplate = "GetPayments",
           BodyStyle = WebMessageBodyStyle.WrappedRequest,
           ResponseFormat = WebMessageFormat.Json)]
        public List<Payment> GetPayments()
        {
            return Payment.GetPayments();
        }

        [OperationContract]
        [WebInvoke(
          Method = "POST",
          UriTemplate = "PaymentUpdate",
          BodyStyle = WebMessageBodyStyle.WrappedRequest,
          ResponseFormat = WebMessageFormat.Json)]
        public int? PaymentUpdate(Payment payment, int iUserManagerId)
        {
            return Payment.PaymentUpdate(payment, iUserManagerId);
        }

        [OperationContract]
        [WebInvoke(
      Method = "POST",
      UriTemplate = "PaymentInsert",
      BodyStyle = WebMessageBodyStyle.WrappedRequest,
      ResponseFormat = WebMessageFormat.Json)]
        public int? PaymentInsert(Payment payment, int iUserManagerId)
        {
            return Payment.PaymentInsert(payment, iUserManagerId);
        }

        #endregion

        #region Product
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
          UriTemplate = "ProductUpdate",
          BodyStyle = WebMessageBodyStyle.WrappedRequest,
          ResponseFormat = WebMessageFormat.Json)]
        public int? ProductUpdate(Product product, int iUserManagerId)
        {
            return Product.ProductUpdate(product, iUserManagerId);
        }

        [OperationContract]
        [WebInvoke(
            Method = "POST",
            UriTemplate = "ProductInsert",
            BodyStyle = WebMessageBodyStyle.WrappedRequest,
            ResponseFormat = WebMessageFormat.Json)]
        public int? ProductInsert(Product product, int iUserManagerId)
        {
            return Product.ProductInsert(product, iUserManagerId);
        }
        #endregion

        #region Communication

        [OperationContract]
        [WebInvoke(
           Method = "POST",
           UriTemplate = "GetCommunicationCart",
           BodyStyle = WebMessageBodyStyle.WrappedRequest,
           ResponseFormat = WebMessageFormat.Json)]
        public List<CommunicationCart> GetCommunicationCart()
        {
            return CommunicationCart.GetCommunicationCart();
        }

        [OperationContract]
        [WebInvoke(
          Method = "POST",
          UriTemplate = "CommunicationUpdate",
          BodyStyle = WebMessageBodyStyle.WrappedRequest,
          ResponseFormat = WebMessageFormat.Json)]
        public int? CommunicationUpdate(CommunicationCart comm, int iUserManagerId)
        {
            return CommunicationCart.CommunicationUpdate(comm, iUserManagerId);
        }


        [OperationContract]
        [WebInvoke(
          Method = "POST",
          UriTemplate = "CommunicationInsert",
          BodyStyle = WebMessageBodyStyle.WrappedRequest,
          ResponseFormat = WebMessageFormat.Json)]
        public int? CommunicationInsert(CommunicationCart comm, int iUserManagerId)
        {
            return CommunicationCart.CommunicationInsert(comm, iUserManagerId);
        }
        #endregion

        #region Refund

        [OperationContract]
        [WebInvoke(
           Method = "POST",
           UriTemplate = "GetRefunds",
           BodyStyle = WebMessageBodyStyle.WrappedRequest,
           ResponseFormat = WebMessageFormat.Json)]
        public List<Refund> GetRefunds(int iUserId)
        {
            return Refund.GetRefunds(iUserId);
        }

        [OperationContract]
        [WebInvoke(
          Method = "POST",
          UriTemplate = "RefundUpdate",
          BodyStyle = WebMessageBodyStyle.WrappedRequest,
          ResponseFormat = WebMessageFormat.Json)]
        public string RefundUpdate(Refund refund, int iUserManagerId, bool isDelete)
        {
            return Refund.RefundUpdate(refund, iUserManagerId, isDelete);
        }

        [OperationContract]
        [WebInvoke(
          Method = "POST",
          UriTemplate = "RefundInsert",
          BodyStyle = WebMessageBodyStyle.WrappedRequest,
          ResponseFormat = WebMessageFormat.Json)]
        public int? RefundInsert(Refund refund, int iUserManagerId, int iUserId)
        {
            return Refund.RefundInsert(refund, iUserManagerId, iUserId);
        }
        #endregion

        #region Remark

        [OperationContract]
        [WebInvoke(
           Method = "POST",
           UriTemplate = "GetRemarks",
           BodyStyle = WebMessageBodyStyle.WrappedRequest,
           ResponseFormat = WebMessageFormat.Json)]
        public List<Remark> GetRemarks(int iUserId)
        {
            return Remark.GetRemarks(iUserId);
        }

        [OperationContract]
        [WebInvoke(
           Method = "POST",
           UriTemplate = "CreateNewRemark",
           BodyStyle = WebMessageBodyStyle.WrappedRequest,
           ResponseFormat = WebMessageFormat.Json)]
        public bool CreateNewRemark(Remark remark/*, int iUserId*/)
        {
            return Remark.CreateNewRemark(remark/*, iUserId*/);
        }
        #endregion

        #region Month

        [OperationContract]
        [WebInvoke(
          Method = "POST",
          UriTemplate = "MonthUpdate",
          BodyStyle = WebMessageBodyStyle.WrappedRequest,
          ResponseFormat = WebMessageFormat.Json)]
        public int? MonthUpdate(Month month, int iUserManagerId)
        {
            return Month.MonthUpdate(month, iUserManagerId);
        }

        [OperationContract]
        [WebInvoke(
          Method = "POST",
          UriTemplate = "MonthInsert",
          BodyStyle = WebMessageBodyStyle.WrappedRequest,
          ResponseFormat = WebMessageFormat.Json)]
        public int? MonthInsert(Month month, int iUserManagerId)
        {
            return Month.MonthInsert(month, iUserManagerId);
        }
		[OperationContract]
		[WebInvoke(
	  Method = "POST",
	  UriTemplate = "GetMonthes",
	  BodyStyle = WebMessageBodyStyle.WrappedRequest,
	  ResponseFormat = WebMessageFormat.Json)]
		public List<Month> GetMonthes()
		{
			return Month.GetMonthes();
		}
		#endregion

		#region Reports

		[OperationContract]
        [WebInvoke(
           Method = "POST",
           UriTemplate = "GetReports",
           BodyStyle = WebMessageBodyStyle.WrappedRequest,
           ResponseFormat = WebMessageFormat.Json)]
        public List<Report> GetReports(int iMonthYearId, int iTypeOrder)
        {
            return Report.GetReports(iMonthYearId, iTypeOrder);
        }

        [OperationContract]
        [WebInvoke(
           Method = "POST",
           UriTemplate = "GetReportsCustomer",
           BodyStyle = WebMessageBodyStyle.WrappedRequest,
           ResponseFormat = WebMessageFormat.Json)]
        public List<Report> GetReportsCustomer(int iMonthYearId, int iTypeOrder)
        {
            return Report.GetReportsCustomer(iMonthYearId, iTypeOrder);
        }

        [OperationContract]
        [WebInvoke(
       Method = "POST",
       UriTemplate = "GetReportsProduct",
       BodyStyle = WebMessageBodyStyle.WrappedRequest,
       ResponseFormat = WebMessageFormat.Json)]
        public List<Report> GetReportsProduct(int iMonthYearId)
        {
            return Report.GetReportsProduct(iMonthYearId);
        }

        [OperationContract]
        [WebInvoke(
       Method = "POST",
       UriTemplate = "GetReportscryingDetector",
       BodyStyle = WebMessageBodyStyle.WrappedRequest,
       ResponseFormat = WebMessageFormat.Json)]
        public List<Report> GetReportscryingDetector(int iMonthYearId)
        {
            return Report.GetReportscryingDetector(iMonthYearId);
        }


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

		#region user basic
		[OperationContract]
		[WebInvoke(
		Method = "POST",
		UriTemplate = "GetUsersBasic",
		BodyStyle = WebMessageBodyStyle.WrappedRequest,
		ResponseFormat = WebMessageFormat.Json)]
		public  List<UserBasic> GetUsersBasic(int? iUserType)
		{
			return UserBasic.GetUsersBasic(iUserType);
		}

		#endregion

		#region MessageToProvider

		[OperationContract]
			[WebInvoke(
				 Method = "POST",
				 UriTemplate = "createDocumentToProviders",
				 BodyStyle = WebMessageBodyStyle.WrappedRequest,
				 ResponseFormat = WebMessageFormat.Json)]
			public int createDocumentToProviders(int iUserId, DateTime? dtBeginDate, DateTime? dtEndDate)
			{
				return MessageToProvider.createDocumentToProviders(iUserId, dtBeginDate, dtEndDate);
			}
		#endregion

		#region VideoTranslation

		[OperationContract]
        [WebGet(
            ResponseFormat = WebMessageFormat.Json)]
        public double GetNumHours(string nvIdentity)
        {
            return VideoTranslation.GetNumHours(nvIdentity);
        }

        [OperationContract]
        [WebGet(
            ResponseFormat = WebMessageFormat.Json)]
        public int NewVideoTranslation(DateTime dtTimeBegin, DateTime dtTimeTranslation, string nvTranslatorIdentity, string nvUserIdentity)
        {
            return VideoTranslation.NewVideoTranslation(dtTimeBegin, dtTimeTranslation, nvTranslatorIdentity, nvUserIdentity);
        }

        #endregion VideoTranslation

        #region PDF
        [OperationContract]
        [WebInvoke(
         Method = "POST",
         UriTemplate = "GenerateAttendanceReport",
         BodyStyle = WebMessageBodyStyle.WrappedRequest,
         ResponseFormat = WebMessageFormat.Json)]
        public string GenerateAttendanceReport(string folderName, string url)
        {
            return FileManageCtrl.GenerateAttendanceReport(folderName, url);
        }

		[OperationContract]
		[WebInvoke(
	 Method = "POST",
	 UriTemplate = "GeneratePdfFromHtml",
	 BodyStyle = WebMessageBodyStyle.WrappedRequest,
	 ResponseFormat = WebMessageFormat.Json)]
		public string GeneratePdfFromHtml(string title, string html, string css, string sFileName, string identityTranslator)
		{
			return FileManageCtrl.GeneratePdfFromHtml(title, html, css, sFileName, identityTranslator);
		}
		#endregion
	}
}
