using Infra.DL;
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
	public class Orders
	{
		#region members
		[DataMember]
		public int iOrderId { get; set; }
		[DataMember]
		[NoSendToSQL]
		public string nameCustomer { get; set; }
		[DataMember]
		[NoSendToSQL]
		public string nameTranslator { get; set; }
		[DataMember]
		[NoSendToSQL]
		public string typeOrder { get; set; }
		[DataMember]
		[NoSendToSQL]
		public string typeTranslation { get; set; }
		[DataMember]
		[NoSendToSQL]
		public string area { get; set; }
		[DataMember]
		public DateTime? dtTimeTranslation { get; set; }
		[DataMember]
		[NoSendToSQL]
		public string nvTimeTranslation { get; set; }
		[DataMember]
		[NoSendToSQL]
		public int iTimeTranslation { get; set; }
		[DataMember]
		[NoSendToSQL]
		public int iTimeWaiting { get; set; }
		[DataMember]
		public int iUserId { get; set; }
		[DataMember]
		public int iTypeOrder { get; set; }
		[DataMember]
		[NoSendToSQL]
		public string nvTypeOrder { get; set; }
		[DataMember]
		public int iTypeTranslation { get; set; }
		[DataMember]
		[NoSendToSQL]
		public int iGenderTraslator { get; set; }
		[DataMember]
		public int iAreaId { get; set; }
		[DataMember]
		public int iCityId { get; set; }
		[DataMember]
		public string nvStreet { get; set; }
		[DataMember]
		[NoSendToSQL]
		public string nvNumberHouse { get; set; }
		[DataMember]
		[NoSendToSQL]
		public string nvCity { get; set; }
		[DataMember]
		public DateTime? dtTimeBegin { get; set; }
		[DataMember]
		public DateTime? dtTimeWaiting { get; set; }
		[DataMember]
		public DateTime? dtTimeTravel { get; set; }
		[DataMember]
		public DateTime? dtTimeEnd { get; set; }
		[DataMember]
		public DateTime? dtDateTraslation { get; set; }
		[DataMember]
		[NoSendToSQL]
		public DateTime? dtCreateDate { get; set; }
		[DataMember]
		public int iFavoriteTranslator { get; set; }
		[DataMember]
		public int iSelectedTranslator { get; set; }
		[DataMember]
		public int iStatusId { get; set; }
		[DataMember]
		[NoSendToSQL]
		public string status { get; set; }
		[DataMember]
		[NoSendToSQL]
		public string nvTypeTranslation { get; set; }
		[DataMember]
		[NoSendToSQL]
		public int iStatusByDeaf { get; set; }
		[DataMember]
		[NoSendToSQL]
		public int iStatusByTranslator { get; set; }
		[DataMember]
		[NoSendToSQL]
		public string nvReason { get; set; }
		[DataMember]
		[NoSendToSQL]
		public int iLanguageId { get; set; }
		[DataMember]
		[NoSendToSQL]
		public bool isQwickOrder { get; set; }
		[DataMember]
		[NoSendToSQL]
		public DateTime? dtLastModifyDate { get; set; }
		[DataMember]
		[NoSendToSQL]
		public string nvCreateUserId { get; set; }
		[DataMember]
		public int iMonthYearId { get; set; }
		[DataMember]
		[NoSendToSQL]
		public string nvMonthName { get; set; }
		[DataMember]
		[NoSendToSQL]
		public int iCustomerId { get; set; }
		[DataMember]
		[NoSendToSQL]
		public int iTranslatorId { get; set; }
		[DataMember]
		[NoSendToSQL]
		public int iGlobalId { get; set; }
		[DataMember]
		public string nvRemark { get; set; }
		[DataMember]
		public string nvProviderSignature { get; set; }
		[DataMember]
		public string nvCustomerSignature { get; set; }
		[DataMember]
		public string nvLocationSignature { get; set; }

		#endregion

		#region methods

		public static List<Orders> GetOrders()
		{
			try
			{
				DataTable dt = SqlDataAccess.ExecuteDatasetSP("TSysOrders_SLCT").Tables[0];
				List<Orders> lOrders = new List<Orders>();
				lOrders = ObjectGenerator<Orders>.GeneratListFromDataRowCollection(dt.Rows);
				return lOrders;
			}
			catch (Exception ex)
			{
				Log.ExceptionLog(ex.Message, "GetOrders");
				return null;
			}
		}
		public static List<Orders> GetOrdersByUser(int iUserId, int iUserType)
		{
			try
			{
				List<SqlParameter> parameters = new List<SqlParameter>();
				parameters.Add(new SqlParameter("iUserId", iUserId));
				parameters.Add(new SqlParameter("iUserType", iUserType));
				DataTable dt = SqlDataAccess.ExecuteDatasetSP("TSysOrdersByUser_SLCT", parameters).Tables[0];
				List<Orders> lOrders = new List<Orders>();
				lOrders = ObjectGenerator<Orders>.GeneratListFromDataRowCollection(dt.Rows);
				return lOrders;
			}
			catch (Exception ex)
			{
				Log.ExceptionLog(ex.Message, "GetOrdersByUser");
				return null;
			}
		}

		public static bool DeleteOrder(int iOrderId)
		{
			try
			{
				DataSet ds = SqlDataAccess.ExecuteDatasetSP("TOrder_DLT",
				new SqlParameter("iOrderId", iOrderId)
				);

				return true;
			}
			catch (Exception ex)
			{
				Log.ExceptionLog(ex.Message, "DeleteOrder");
				return false;
			}
		}

		public static Orders OrderUpdate(Orders order, int iUserManagerId, DateTime? prevTimeTranslation)
		{
			try
			{
				List<SqlParameter> parameters = ObjectGenerator<Orders>.GetSqlParametersFromObject(order);
				parameters.Add(new SqlParameter("iUserManagerId", iUserManagerId));
				parameters.Add(new SqlParameter("prevTimeTranslation", prevTimeTranslation));
				DataSet ds = SqlDataAccess.ExecuteDatasetSP("TOrder_UPD", parameters);
				order.iOrderId = int.Parse(ds.Tables[0].Rows[0][0].ToString());
				return order;
			}
			catch (Exception ex)
			{
				Log.ExceptionLog(ex.Message, "OrderUpdate");
				return null;
			}
		}



		public static Orders OrderInsert(Orders order, int iUserManagerId, int? isFromSite, User customer = null, bool inValidOrder = false)
		{
			try
			{
				if (order.nvProviderSignature != null)
					order.nvProviderSignature = new FileManageCtrl().SaveFile(order.nvProviderSignature.Substring(order.nvProviderSignature.LastIndexOf(",") + 1), "signatures", "png", iUserManagerId, "s1");
				if (order.nvCustomerSignature != null)
					order.nvCustomerSignature = new FileManageCtrl().SaveFile(order.nvCustomerSignature.Substring(order.nvCustomerSignature.LastIndexOf(",") + 1), "signatures", "png", iUserManagerId, "s2");
				if (order.nvLocationSignature != null)
					order.nvLocationSignature = new FileManageCtrl().SaveFile(order.nvLocationSignature.Substring(order.nvLocationSignature.LastIndexOf(",") + 1), "signatures", "png", iUserManagerId, "s3");

				List<SqlParameter> parameters = ObjectGenerator<Orders>.GetSqlParametersFromObject(order);

				parameters.Add(new SqlParameter("nvAdressCustomer", customer == null ? null : customer.nvAdress));
				parameters.Add(new SqlParameter("nvEmailCustomer", customer == null ? null : customer.nvEmail));
				parameters.Add(new SqlParameter("nvMobileNumCustomer", customer == null ? null : customer.nvMobileNum));

				parameters.Add(new SqlParameter("statusOrder", inValidOrder));

				parameters.Add(new SqlParameter("iUserManagerId", iUserManagerId));
				parameters.Add(new SqlParameter("isFromSite", isFromSite));
				DataSet ds = SqlDataAccess.ExecuteDatasetSP("TOrder_INS", parameters);
				order.iOrderId = int.Parse(ds.Tables[0].Rows[0][0].ToString());
				if(customer != null && ( customer.nvAdress != null || customer.nvEmail != null || customer.nvMobileNum != null))
				{
					User user = new User();
					if( ds.Tables.Count > 2)
						user = ObjectGenerator<User>.GeneratFromDataRow(ds.Tables[3].Rows[0]);
					else
						user = ObjectGenerator<User>.GeneratFromDataRow(ds.Tables[1].Rows[0]);
					if (customer != null && (user.nvAdress != customer.nvAdress || (user.nvEmail != customer.nvEmail && user.nvEmail != "simanim@shmaya.org.il")
						|| (user.nvMobileNum != customer.nvMobileNum && user.nvMobileNum != "0543376333")))
					{
						Messages message = new Messages();
						message.nvFrom = System.Configuration.ConfigurationManager.AppSettings["mailFrom"];
						message.nvTo = System.Configuration.ConfigurationManager.AppSettings["mailFrom"];
						message.nvSubject = "עודכנו פרטים עבור הלקוח " + user.nvFirstName + " " + user.nvLastName;
						message.nvMessage = "";
						if (user.nvAdress != customer.nvAdress)
							message.nvMessage += "כתובת קודמת: " + user.nvAdress + ", כתובת מעודכנת: " + customer.nvAdress;
						if (user.nvEmail != customer.nvEmail && user.nvEmail != "simanim@shmaya.org.il")
							message.nvMessage += "\nמייל קודם: " + user.nvEmail + ", מייל מעודכן: " + customer.nvEmail;
						if (user.nvMobileNum != customer.nvMobileNum && user.nvMobileNum != "0543376333")
							message.nvMessage += "\nנייד קודם: " + user.nvMobileNum + ", נייד מעודכן: " + customer.nvMobileNum;
						Messages.SendEmailToOne(message, null, true);
					}
				}
				return order;

			}
			catch (Exception ex)
			{
				Log.ExceptionLog(ex.Message, "OrderInsert");
				return null;
			}
		}

		public static int? ChangeStatus(int iStatusId, int iOrderId)
		{
			try
			{
				List<SqlParameter> parameters = new List<SqlParameter>();
				parameters.Add(new SqlParameter("iStatusId", iStatusId));
				parameters.Add(new SqlParameter("iOrderId", iOrderId));
				DataSet ds = SqlDataAccess.ExecuteDatasetSP("TChangeStatus_UPD", parameters);
				return int.Parse(ds.Tables[0].Rows[0][0].ToString());
			}
			catch (Exception ex)
			{
				Log.ExceptionLog(ex.Message, "ChangeStatus");
				return -1;
			}
		}



		#endregion

	}
}