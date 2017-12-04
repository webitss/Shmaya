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
    public class UserDetailes
    {
        #region Members
        [DataMember]
        public int iUserId { get; set; }
        [DataMember]
        public int iCoordinatorId { get; set; }
        [DataMember]
        public int iPersonId { get; set; }
        [DataMember]
        public int iUserType { get; set; }
        [DataMember][NoSendToSQL]
        public string nvUserType { get; set; }

        //[DataMember]
        //public Boolean bIsScheduller { get; set; }

        [DataMember]
        public string nvIdentityNumber { get; set; }
        [DataMember]
        public string nvFirstName { get; set; }
        [DataMember]
        public string nvLastName { get; set; }
        [DataMember]
        public string nvAddress { get; set; }
        [DataMember]
        public string nvAddressComment { get; set; }
        [DataMember]
        public string nvPhoneNumber { get; set; }
        [DataMember]
        public string nvMobileNumber { get; set; }
        [DataMember]
        public string nvEmail { get; set; }
        [DataMember]
        public int? iMaritalStatusType { get; set; }
        [DataMember]
        [NoSendToSQL]
        public string nvMaritalStatusType { get; set; }
        [DataMember]
        public int? iGenderType { get; set; }
        [DataMember]
        [NoSendToSQL]
        public string nvGenderType { get; set; }
        [DataMember]
        public int? iCityType { get; set; }
        [DataMember]
        [NoSendToSQL]
        public string nvCityType { get; set; }
        [DataMember]
        public int iDepartmentId { get; set; }
        [DataMember]
        [NoSendToSQL]
        public string nvDepartment { get; set; }
        [DataMember]
        public string nvDepartmentName { get; set; }
        [DataMember]
        public string nvDepartmentMobileNumber { get; set; }
        [DataMember]
        public string nvDepartmentEmail { get; set; }
        [DataMember]
        public string nvUserName { get; set; }
        [DataMember]
        public string nvPassword { get; set; }
        #endregion


        #region Functions

        public static List<UserDetailes> getUsers(int iUserType)
        {
            try
            {

                DataSet ds = SqlDataAccess.ExecuteDatasetSP("TUsers_SLCT", new SqlParameter("iUserType", iUserType));
                List<UserDetailes> lUsers = new List<UserDetailes>();
                lUsers = ObjectGenerator<UserDetailes>.GeneratListFromDataRowCollection(ds.Tables[0].Rows);
                return lUsers;
            }
            catch (Exception ex)
            {
                Log.ExceptionLog(ex.Message, "getUsers");
                return null;
            }
        }

        public static bool UserInsertUpdate(UserDetailes newUser, int iManageUserId)
        {
            try
            {
                List<SqlParameter> parameters = new List<SqlParameter>()
                {
                    new SqlParameter("iManageUserId", iManageUserId)
                };
                parameters.AddRange(ObjectGenerator<UserDetailes>.GetSqlParametersFromObject(newUser));
                DataSet ds = SqlDataAccess.ExecuteDatasetSP("TUser_INS_UPDT", parameters);
                return true; 
                    //int.Parse(ds.Tables[0].Rows[0][0].ToString());
            }
            catch (Exception ex)
            {
                Log.ExceptionLog(ex.Message, "UserInsertUpdate");
                return false;
            }
        }

        public static UserDetailes GetUser(int iUserId)
        {
            try
            {
                DataSet ds = SqlDataAccess.ExecuteDatasetSP("TUser_SLCT", new List<SqlParameter>() {
                new SqlParameter("iUserId",iUserId)
                });
                UserDetailes user = new UserDetailes();
                user = ObjectGenerator<UserDetailes>.GeneratFromDataRow(ds.Tables[0].Rows[0]);
                return user;
            }
            catch (Exception ex)
            {
                Log.ExceptionLog(ex.Message, "GetUser");
                return null;
            }
        }

        public static int CheckUserNameExist(string nvUserName)
        {
            try
            {
                DataSet ds = SqlDataAccess.ExecuteDatasetSP("TUser_CheckExist_SLCT", new SqlParameter("nvUserName", nvUserName));
                return ds.Tables[0].Rows.Count;
            }
            catch (Exception ex)
            {
                Log.ExceptionLog(ex.Message, "CheckUserNameExist");
                return -1;
            }
        }

        #endregion
    }
}