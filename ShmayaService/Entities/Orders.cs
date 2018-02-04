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
        /**/
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
        [NoSendToSQL]
        public string nvStreet { get; set; }
        [DataMember]
        [NoSendToSQL]
        public string nvNumberHouse { get; set; }
        [DataMember]
        /**/
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
        /**/
        public int iFavoriteTranslator { get; set; }
        [DataMember]
        /**/
        public int iSelectedTranslator { get; set; }
        [DataMember]
        /**/
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
        /**/
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

		#endregion

		#region methods

		public static List<Orders> GetOrders()
        {
            try
            {
                //data table שולף טבלה
                DataTable dt = SqlDataAccess.ExecuteDatasetSP("TSysOrders_SLCT").Tables[0];
                List<Orders> lOrders = new List<Orders>();
                lOrders = ObjectGenerator<Orders>.GeneratListFromDataRowCollection(dt.Rows);
                //פונקציה שהופכת את הטבלה לרשימה
                //lPayment = ObjectGenerator<Payment>.GeneratListFromDataRowCollection(dt.Rows);
                return lOrders;
            }
            catch (Exception ex)
            {
                Log.ExceptionLog(ex.Message, "GetOrders");
                return null;
            }
        }

        public static List<Orders> GetOrdersByStatus(int iUserId)
        {
            try
            {
                //data table שולף טבלה
                DataTable dt = SqlDataAccess.ExecuteDatasetSP("TOrdersByStatus_SLCT", new SqlParameter("iUserId", iUserId)).Tables[0];
                List<Orders> lOrders = new List<Orders>();
                lOrders = ObjectGenerator<Orders>.GeneratListFromDataRowCollection(dt.Rows);
                //פונקציה שהופכת את הטבלה לרשימה
                //lPayment = ObjectGenerator<Payment>.GeneratListFromDataRowCollection(dt.Rows);
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

                //data table שולף טבלה
                DataTable dt = SqlDataAccess.ExecuteDatasetSP("TSysOrdersByUser_SLCT", parameters).Tables[0];
                List<Orders> lOrders = new List<Orders>();
                lOrders = ObjectGenerator<Orders>.GeneratListFromDataRowCollection(dt.Rows);
                //פונקציה שהופכת את הטבלה לרשימה
                //lPayment = ObjectGenerator<Payment>.GeneratListFromDataRowCollection(dt.Rows);
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

        public static int? OrderUpdate(Orders order, int iUserManagerId)
        {
            try
            {
                List<SqlParameter> parameters = ObjectGenerator<Orders>.GetSqlParametersFromObject(order);
                parameters.Add(new SqlParameter("iUserManagerId", iUserManagerId));
                DataSet ds = SqlDataAccess.ExecuteDatasetSP("TOrder_UPD", parameters);
                return int.Parse(ds.Tables[0].Rows[0][0].ToString());
            }
            catch (Exception ex)
            {
                Log.ExceptionLog(ex.Message, "OrderUpdate");
                return -1;
            }
        }

        public static int? OrderInsert(Orders order, int iUserManagerId)
        {
            try
            {
                //order.dtTimeTranslation = new DateTime(order.dtTimeTranslation);
                List<SqlParameter> parameters = ObjectGenerator<Orders>.GetSqlParametersFromObject(order);
                parameters.Add(new SqlParameter("iUserManagerId", iUserManagerId));
                DataSet ds = SqlDataAccess.ExecuteDatasetSP("TOrder_INS", parameters);
                return int.Parse(ds.Tables[0].Rows[0][0].ToString());
            }
            catch (Exception ex)
            {
                Log.ExceptionLog(ex.Message, "OrderInsert");
                return -1;
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