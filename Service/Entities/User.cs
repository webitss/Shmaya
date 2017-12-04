using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Channels;
using System.Web;
using System.Runtime.Serialization;
using Service.Utilities;
using System.Configuration;

namespace Service.Entities
{
    [DataContract]
    public class User
    {
		#region Members
		[DataMember]
		public int iUserId { get; set; }
		[DataMember]
		public string nvUserName { get; set; }
		[DataMember]
		public string nvPassword { get; set; }
		[DataMember]
		public int iUserRoleId { get; set; }
		[DataMember]
		public string nvEmail { get; set; }
		[DataMember]
		public string nvLastName { get; set; }
		[DataMember]
		public string nvFirstName { get; set; }
		[DataMember]
		public string nvID { get; set; }
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
		public int iEntitlementTypeId { get; set; }
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
		public int iCommunicationFee { get; set; }
		[DataMember]
		public double nBankCommunication { get; set; }
		[DataMember]
		public int iWorkerType { get; set; }
		[DataMember]
		public int iBuyCryingDetector { get; set; }
		[DataMember]
		public double nSumPayment { get; set; }
		[DataMember]
		public int iAreaId { get; set; }


		#endregion

		#region Methods
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
                DataSet ds = SqlDataAccess.ExecuteDatasetSP("TUser_DLT", new List<SqlParameter>() {
                new SqlParameter("iUserId",iUserId)
                });
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
					string body = user.nvFirstName + " " + user.nvLastName + "<br/>" +
								 "שם המשתמש שלך הוא:" + " " + user.nvUserName + "<br/>" +
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

		#endregion
	}

}