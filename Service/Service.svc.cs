using GanimWS.Entities;
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

		#region User

		[OperationContract]
		[WebInvoke(
		   Method = "POST",
		   UriTemplate = "GetUsers",
		   BodyStyle = WebMessageBodyStyle.WrappedRequest,
		   ResponseFormat = WebMessageFormat.Json)]
		public List<User> GetUsers(int? iUserType)
		{
			return User.GetUsers(iUserType);
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

		//[OperationContract]
		//[WebInvoke(
		//   Method = "POST",
		//   UriTemplate = "UserUpdate",
		//   BodyStyle = WebMessageBodyStyle.WrappedRequest,
		//   ResponseFormat = WebMessageFormat.Json)]
		//public bool UserUpdate(UserDetailes newUser, int iManageUserId)
		//{
		//    return UserDetailes.UserUpdate(newUser, iManageUserId);
		//}

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
		#endregion

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
		   UriTemplate = "GetOrdersByStatus",
		   BodyStyle = WebMessageBodyStyle.WrappedRequest,
		   ResponseFormat = WebMessageFormat.Json)]
		public List<Orders> GetOrdersByStatus(int iUserId)
		{
			return Orders.GetOrdersByStatus(iUserId);
		}

		[OperationContract]
		[WebInvoke(
		   Method = "POST",
		   UriTemplate = "GetOrdersByUser",
		   BodyStyle = WebMessageBodyStyle.WrappedRequest,
		   ResponseFormat = WebMessageFormat.Json)]
		public List<Orders> GetOrdersByUser(int iUserId,int iUserType)
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
		public int? OrderUpdate(Orders order, int iUserManagerId)
		{
			return Orders.OrderUpdate(order, iUserManagerId);
		}

		[OperationContract]
		[WebInvoke(
		  Method = "POST",
		  UriTemplate = "OrderInsert",
		  BodyStyle = WebMessageBodyStyle.WrappedRequest,
		  ResponseFormat = WebMessageFormat.Json)]
		public int? OrderInsert(Orders order, int iUserManagerId)
		{
			return Orders.OrderInsert(order, iUserManagerId);
		}

		[OperationContract]
		[WebInvoke(
		  Method = "POST",
		  UriTemplate = "ChangeStatus",
		  BodyStyle = WebMessageBodyStyle.WrappedRequest,
		  ResponseFormat = WebMessageFormat.Json)]
		public int? ChangeStatus(int iStatusId,int iOrderId)
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

		//[OperationContract]
		//[WebInvoke(
		// Method = "POST",
		// UriTemplate = "ConversationInsert",
		// BodyStyle = WebMessageBodyStyle.WrappedRequest,
		// ResponseFormat = WebMessageFormat.Json)]
		//public int? ConversationInsert(Conversations conversation, int iCreateUserId, int iUserId)
		//{
		//	return Conversations.ConversationInsert(conversation, iCreateUserId, iUserId);
		//}

		//[OperationContract]
		//[WebInvoke(
		//   Method = "POST",
		//   UriTemplate = "GetAllConversations",
		//   BodyStyle = WebMessageBodyStyle.WrappedRequest,
		//   ResponseFormat = WebMessageFormat.Json)]
		//public List<Conversations> GetAllConversations(int iUserId)
		//{
		//    return Conversations.GetAllConversations(iUserId);
		//}

		//[OperationContract]
		//[WebInvoke(
		//   Method = "POST",
		//   UriTemplate = "GetConversation",
		//   BodyStyle = WebMessageBodyStyle.WrappedRequest,
		//   ResponseFormat = WebMessageFormat.Json)]
		//public Conversations GetConversation(int iConversationId)
		//{
		//    return Conversations.GetConversation(iConversationId);
		//}

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

		//[OperationContract]
  //      [WebInvoke(
  //         Method = "POST",
  //         UriTemplate = "SendEmailToOne",
  //         BodyStyle = WebMessageBodyStyle.WrappedRequest,
  //         ResponseFormat = WebMessageFormat.Json)]
  //      public bool sendEmailToOne(Messages message,int iUserId)
  //      {
  //          return Messages.SendEmailToOne(message, iUserId);
  //      }

        [OperationContract]
        [WebInvoke(
           Method = "POST",
           UriTemplate = "SendEmailToGroup",
           BodyStyle = WebMessageBodyStyle.WrappedRequest,
           ResponseFormat = WebMessageFormat.Json)]
        public bool sendEmailToGroup(List<User> lMember, Messages message, int iUserId)
        {
            return Messages.SendEmailToGroup(lMember, message, iUserId);
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
		public static bool SendEmailToOne(Messages message)
		{
			return Messages.SendEmailToOne(message);
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
		public string RefundUpdate(Refund refund, int iUserManagerId)
		{
			return Refund.RefundUpdate(refund, iUserManagerId);
		}

		[OperationContract]
		[WebInvoke(
		  Method = "POST",
		  UriTemplate = "RefundInsert",
		  BodyStyle = WebMessageBodyStyle.WrappedRequest,
		  ResponseFormat = WebMessageFormat.Json)]
		public int? RefundInsert(Refund refund, int iUserManagerId,int iUserId)
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
		public int? MonthUpdate(int iMonthId,DateTime? dtGlobalDateBegin, DateTime? dtGlobalDateEnd, int iUserManagerId)
		{
			return Month.MonthUpdate(iMonthId,dtGlobalDateBegin, dtGlobalDateEnd, iUserManagerId);
		}

		[OperationContract]
		[WebInvoke(
		  Method = "POST",
		  UriTemplate = "MonthInsert",
		  BodyStyle = WebMessageBodyStyle.WrappedRequest,
		  ResponseFormat = WebMessageFormat.Json)]
		public int? MonthInsert(int iMonthId,DateTime? dtGlobalDateBegin, DateTime? dtGlobalDateEnd, int iUserManagerId)
		{
			return Month.MonthInsert(iMonthId,dtGlobalDateBegin, dtGlobalDateEnd, iUserManagerId);
		}
		#endregion

		#region Reports

		[OperationContract]
		[WebInvoke(
		   Method = "POST",
		   UriTemplate = "GetReports",
		   BodyStyle = WebMessageBodyStyle.WrappedRequest,
		   ResponseFormat = WebMessageFormat.Json)]
		public List<Report> GetReports(int iMonthId, int iTypeOrder)
		{
			return Report.GetReports(iMonthId,iTypeOrder);
		}

		[OperationContract]
		[WebInvoke(
		   Method = "POST",
		   UriTemplate = "GetReportsCustomer",
		   BodyStyle = WebMessageBodyStyle.WrappedRequest,
		   ResponseFormat = WebMessageFormat.Json)]
		public List<Report> GetReportsCustomer(int iMonthId, int iTypeOrder)
		{
			return Report.GetReportsCustomer(iMonthId, iTypeOrder);
		}

		[OperationContract]
		[WebInvoke(
	   Method = "POST",
	   UriTemplate = "GetReportsProduct",
	   BodyStyle = WebMessageBodyStyle.WrappedRequest,
	   ResponseFormat = WebMessageFormat.Json)]
		public List<Report> GetReportsProduct(int iMonthId)
		{
			return Report.GetReportsProduct(iMonthId);
		}

		[OperationContract]
		[WebInvoke(
	   Method = "POST",
	   UriTemplate = "GetReportscryingDetector",
	   BodyStyle = WebMessageBodyStyle.WrappedRequest,
	   ResponseFormat = WebMessageFormat.Json)]
		public List<Report> GetReportscryingDetector(int iMonthId)
		{
			return Report.GetReportscryingDetector(iMonthId);
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

		#region MessageToProvider



		//[OperationContract]
		//[WebInvoke(
		//  Method = "POST",
		//  UriTemplate = "GetMessageToProvider",
		//  BodyStyle = WebMessageBodyStyle.WrappedRequest,
		//  ResponseFormat = WebMessageFormat.Json)]
		//public static List<MessageToProvider> GetMessageToProvider(int iUserId,DateTime? dtBeginDate,DateTime? dtEndDate)
		//{
		//	return MessageToProvider.GetMessageToProvider(iUserId, dtBeginDate, dtEndDate);
		//}

		[OperationContract]
		[WebInvoke(
	   Method = "POST",
	   UriTemplate = "GetMessageToProvider",
	   BodyStyle = WebMessageBodyStyle.WrappedRequest,
	   ResponseFormat = WebMessageFormat.Json)]
		public List<MessageToProvider> GetMessageToProvider(int iUserId, DateTime? dtBeginDate, DateTime? dtEndDate)
		{
			return MessageToProvider.GetMessageToProvider(iUserId, dtBeginDate, dtEndDate);
		}

		[OperationContract]
		[WebInvoke(
	   Method = "POST",
	   UriTemplate = "SendSumMessage",
	   BodyStyle = WebMessageBodyStyle.WrappedRequest,
	   ResponseFormat = WebMessageFormat.Json)]
		public string SendSumMessage(string folderName, string url)
		{
			return MessageToProvider.SendSumMessage(folderName, url);
		}

		#endregion

	}
}
