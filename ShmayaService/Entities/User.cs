using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Channels;
using System.Web;
using System.Runtime.Serialization;
using ShmayaService.Utilities;
using System.Configuration;

namespace ShmayaService.Entities
{
    [DataContract]
    public class User
    {
        #region Members
        [DataMember]
        public int iUserId { get; set; }
        [DataMember]
        [NoSendToSQL]
        public string nvUserName { get; set; }
        [DataMember]
        public string nvPassword { get; set; }
        [DataMember]
        public string nvId { get; set; }
        [DataMember]
        [NoSendToSQL]
        public int iUserRoleId { get; set; }
        [DataMember]
        public string nvEmail { get; set; }
        [DataMember]
        public string nvLastName { get; set; }
        [DataMember]
        public string nvFirstName { get; set; }
        [DataMember]
        public string nvAdress { get; set; }
        [DataMember]
        public string nvPhoneNum { get; set; }
        [DataMember]
        public string nvMobileNum { get; set; }
        [DataMember]
        public string nvFaxNum { get; set; }
        [DataMember]
        public int iGenderId { get; set; }
        [DataMember]
        public double nBankHours { get; set; }
        [DataMember]
        public int? iEntitlementTypeId { get; set; }
        [DataMember]
        public DateTime? dtResetHours { get; set; }
        [DataMember]
        public DateTime? dtResetCommunication { get; set; }
        [DataMember]
        public DateTime? dtBirthDate { get; set; }
        [DataMember]
        public bool isWorker { get; set; }
        [DataMember]
        public double nNumHours { get; set; }
        [DataMember]
        public int iCommunicationCart { get; set; }
        [DataMember]
        [NoSendToSQL]
        public int iCommunicationFee { get; set; }
        [DataMember]
        [NoSendToSQL]
        public double nBankCommunication { get; set; }
        [DataMember]
        [NoSendToSQL]
        public int iWorkerType { get; set; }

        [DataMember]
        [NoSendToSQL]
        public string nvWorkerType { get; set; }

        [DataMember]
        [NoSendToSQL]
        public int? iBuyCryingDetector { get; set; }
        [DataMember]
        [NoSendToSQL]
        public double nSumPayment { get; set; }
        [DataMember]
        [NoSendToSQL]
        public int iAreaId { get; set; }
        [DataMember]
        [NoSendToSQL]
        public string nvEntitlementType { get; set; }
        [NoSendToSQL]
        [DataMember]
        public List<int> lLanguage { get; set; }
        [DataMember]
        [NoSendToSQL]
        public List<int> lOrderType { get; set; }
        [DataMember]
        [NoSendToSQL]
        public int iLastModifyUserId { get; set; }
        [DataMember]
        [NoSendToSQL]
        public string nvFullName { get; set; }
        [NoSendToSQL]
        [DataMember]
        public string nvOrdersType { get; set; }
        [NoSendToSQL]
        [DataMember]
        public string nvLanguage { get; set; }
        [NoSendToSQL]
        [DataMember]
        public DateTime? dtCreateDate { get; set; }

        #endregion

        #region Methods

        public static int CheckIdentity(string nvIdentity)
        {
            try
            {
                DataSet ds = SqlDataAccess.ExecuteDatasetSP("TUser_CheckIdentity", new SqlParameter("nvIdentity", nvIdentity));
                if (ds.Tables[0].Rows.Count > 0)
                {
                    int result = int.Parse(ds.Tables[0].Rows[0][0].ToString());
                    return result;
                }
                return 0;
            }
            catch (Exception e)
            {
                Log.ExceptionLog(e.Message, "CheckIdentity");
                return -1;
            }
        }

        public static User Login(string nvUserName, string nvPassword)
        {
            try
            {
                SqlParameter[] param = {
										new SqlParameter("nvUserName",nvUserName),
										new SqlParameter("nvPassword",nvPassword)
										};
                DataSet ds = SqlDataAccess.ExecuteDatasetSP("TUser_Login", param);
                if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                {
                    User user = ObjectGenerator<User>.GeneratFromDataRow(ds.Tables[0].Rows[0]);
                    return user;
                }
                return new User { iUserId = -1 };
            }
            catch (Exception ex)
            {
                Log.ExceptionLog(ex.Message, "Login");
                return null;
            }
        }

        public static bool DeleteUser(int iUserId)
        {
            try
            {
                DataSet ds = SqlDataAccess.ExecuteDatasetSP("TUser_DLT",
                new SqlParameter("iUserId", iUserId)
                );
                return true;
            }
            catch (Exception ex)
            {
                Log.ExceptionLog(ex.Message, "DeleteUser");
                return false;
            }
        }

        public static int ResetUserPassword(string nvMail)
        {
            try
            {
                DataSet ds = SqlDataAccess.ExecuteDatasetSP("TUser_Password_SLCT", new SqlParameter("nvMail", nvMail));
                if (ds.Tables[0].Rows.Count > 0)
                {
                    User user = ObjectGenerator<User>.GeneratFromDataRow(ds.Tables[0].Rows[0]);
                    string body = user.nvFirstName + " " + user.nvLastName + "\n" +
                                 "שם המשתמש שלך הוא:" + " " + user.nvUserName + "\n" +
                                 "הסיסמה שלך היא:" + " " + user.nvPassword;
                    Messages message = new Messages();
                    message.nvMessage = body;
                    message.nvSubject = "שיחזור סיסמא";
                    message.nvTo = user.nvEmail;
                    message.nvFrom = ConfigurationManager.AppSettings["mailFrom"].ToString();
                    bool b = Messages.SendEmailToOne(message);
                    if (b == false)
                        return -1;
                    //return "שליחת המייל נכשלה";
                    else
                        return 1;
                    //    "הסיסמא נשלחה לכתובת מייל שהזנת";
                }
                return -2;
                // "כתובת המייל לא נמצאה במערכת";
            }
            catch (Exception ex)
            {
                Log.ExceptionLog(ex.Message, "ResetUserPassword");
                return -1;
                //  "שליחת המייל נכשלה";
            }
        }

	public static List<User> GetUsers(int? iUserType,int iStatusId, int? iTypeTranslation)
	{
		try
		{
				List<SqlParameter> parameters = new List<SqlParameter>();
				parameters.Add(new SqlParameter("iUserType", iUserType));
				parameters.Add(new SqlParameter("iStatusId", iStatusId));
				parameters.Add(new SqlParameter("iTypeTranslation", iTypeTranslation));
				//data set שולף אוסף של טבלאות
				DataSet ds = SqlDataAccess.ExecuteDatasetSP("TSysUser_SLCT",parameters);
			
			List<User> lUsers = new List<User>();
				DataView dv;
				//מעבר על כל שורה מתוך הטבלה הראשונה שבאוסף
				foreach (DataRow dr in ds.Tables[0].Rows)
				{
					User user = new User();
					//הפיכת כל יוזר לפריט בליסט
					user = ObjectGenerator<User>.GeneratFromDataRow(dr);
					//יצירת הטבלה השניה כדינאמית שמחזירה רק שורות התואמות לתנאי מסוים
					dv = new DataView(ds.Tables[1],
					 "iUserId = " + user.iUserId.ToString(),
					 "", DataViewRowState.CurrentRows);
					//הכנסת הערכים מהטבלה השניה לתוך הליסט המתאים להם באובייקט
					//user.lLanguage = ObjectGenerator<int>.GeneratListFromDataRowCollection(dv.ToTable().Rows);
					user.lLanguage = new List<int>();
					for (int j = 0; j < dv.Count; j++)
					{
						user.lLanguage.Add(int.Parse(ds.Tables[1].Rows[j]["iTypeId"].ToString()));
					}
					dv = new DataView(ds.Tables[2],
					 "iUserId = " + user.iUserId.ToString(),
					 "", DataViewRowState.CurrentRows);
					user.lOrderType = new List<int>();
					//הכנסת הערכים מהטבלה השניה לתוך הליסט המתאים להם באובייקט
					for (int j = 0; j < dv.Count; j++)
					{
						user.lOrderType.Add(int.Parse(ds.Tables[2].Rows[j]["iTypeId"].ToString()));
					}
					lUsers.Add(user);
				}
				return lUsers;
            }
            catch (Exception ex)
            {
                Log.ExceptionLog(ex.Message, "GetUsers");
                return null;
            }
        }

        public static int? UserUpdate(User user, int iUserManagerId)
        {
            try
            {
                List<SqlParameter> parameters = ObjectGenerator<User>.GetSqlParametersFromObject(user);
                parameters.Add(new SqlParameter("iUserManagerId", iUserManagerId));
                parameters.Add(ObjectGenerator<int>.GenerateSimpleDataTableFromList(user.lLanguage, "int", "lLanguage"));
                parameters.Add(ObjectGenerator<int>.GenerateSimpleDataTableFromList(user.lOrderType, "int", "lOrderType"));
                DataSet ds = SqlDataAccess.ExecuteDatasetSP("User_UPD", parameters);
                return int.Parse(ds.Tables[0].Rows[0][0].ToString());
            }
            catch (Exception ex)
            {
                Log.ExceptionLog(ex.Message, "UserUpdate");
                return -1;
            }
        }

        public static int? UserInsert(User user, int iUserManagerId, int userType)
        {
            try
            {

                List<SqlParameter> parameters = ObjectGenerator<User>.GetSqlParametersFromObject(user);
                parameters.Add(new SqlParameter("iUserManagerId", iUserManagerId));
                parameters.Add(new SqlParameter("userType", userType));
                if (userType == 3)
                {
                    parameters.Add(ObjectGenerator<int>.GenerateSimpleDataTableFromList(user.lLanguage, "int", "lLanguage"));
                    parameters.Add(ObjectGenerator<int>.GenerateSimpleDataTableFromList(user.lOrderType, "int", "lOrderType"));
                }
                if (userType == 1)
                {
                    user.iEntitlementTypeId = null;
                }

                DataSet ds = SqlDataAccess.ExecuteDatasetSP("TUser_INS", parameters);
                return int.Parse(ds.Tables[0].Rows[0][0].ToString());
            }
            catch (Exception ex)
            {
                Log.ExceptionLog(ex.Message, "UserInsert");
                return -1;
            }
        }

        public static Dictionary<string, List<CodeTable>> GetUserCodeTables(int iUserId)
        {
            return CodeTable.GetListCodeTables("TUser_CodeTables_SLCT", new List<SqlParameter>() { new SqlParameter("iUserId", iUserId) });
        }

        #endregion
    }

}