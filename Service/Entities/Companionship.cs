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
    public class Companionship
    {
        #region Members

        [DataMember]
        [NoSendToSQL]
        public int iCompanionshipId { get; set; }
        [DataMember]
        public int iCoordinatorId { get; set; }
        [DataMember]
        [NoSendToSQL]
        public string nvStatus { get; set; }
        [DataMember]
        public int iStatusType { get; set; }
        [DataMember]
        [NoSendToSQL]
        public string nvCoordinatorName { get; set; }
        [DataMember]
        [NoSendToSQL]
        public string nvName { get; set; }
        [DataMember]
        public string nvSchedulingComment { get; set; }
        [DataMember]
        public string nvDischargedComment { get; set; }
        [DataMember]
        public DateTime? dtStartDate { get; set; }
        [DataMember]
        public DateTime? dtEndDate { get; set; }
        [DataMember]
        public int iStudentId { get; set; }
        [DataMember]
        public int iVolunteerId { get; set; }
        [DataMember]
        [NoSendToSQL]
        public string nvStudentName { get; set; }
        [DataMember]
        [NoSendToSQL]
        public string nvVolunteerName { get; set; }

        #endregion

        #region Functions

        public static List<Companionship> getCompanionshipsHistory(int? iStudentId, int? iVolunteerId)
        {
            try
            {
                DataSet ds = SqlDataAccess.ExecuteDatasetSP("TCompanionship_SLCT", new List<SqlParameter>() {
                new SqlParameter("iStudentId",iStudentId),
                new SqlParameter("iVolunteerId",iVolunteerId)
                });
                List<Companionship> lCompanionship = new List<Companionship>();
                lCompanionship = ObjectGenerator<Companionship>.GeneratListFromDataRowCollection(ds.Tables[0].Rows);
                return lCompanionship;
            }
            catch (Exception ex)
            {
                Log.ExceptionLog(ex.Message, "getCompanionshipsHistory");
                return null;
            }
        }

        public static Companionship GetExistingCompanionship(int? iStudentId, int? iVolunteerId)
        {
            try
            {
                DataSet ds = SqlDataAccess.ExecuteDatasetSP("TCompanionshipActive_SLCT", new List<SqlParameter>() {
                new SqlParameter("iStudentId",iStudentId),
                new SqlParameter("iVolunteerId",iVolunteerId)
                });
                Companionship Companionship = new Companionship();
                if (ds.Tables[0].Rows.Count == 0)
                    return null;
                Companionship = ObjectGenerator<Companionship>.GeneratFromDataRow(ds.Tables[0].Rows[0]);
                return Companionship;
            }
            catch (Exception ex)
            {
                Log.ExceptionLog(ex.Message, "GetExistingCompanionship");
                return null;
            }
        }

        public static bool SetCompanionshipPositive(int iCompanionshipId, int iUserId)
        {
            try
            {
                DataSet ds = SqlDataAccess.ExecuteDatasetSP("TCompanionship_UPDT", new List<SqlParameter>() {
                new SqlParameter("iCompanionshipId",iCompanionshipId),
                new SqlParameter("iUserId",iUserId)
                });
                return true;
            }
            catch (Exception ex)
            {
                Log.ExceptionLog(ex.Message, "SetCompanionshipPositive");
                return false;
            }
        }

        public static bool SetCompanionshipActive(int iCompanionshipId, int iUserId)
        {
            try
            {
                DataSet ds = SqlDataAccess.ExecuteDatasetSP("TCompanionship_UPDT_Restore", new List<SqlParameter>() {
                new SqlParameter("iCompanionshipId",iCompanionshipId),
                new SqlParameter("iUserId",iUserId)
                });
                return true;
            }
            catch (Exception ex)
            {
                Log.ExceptionLog(ex.Message, "SetCompanionshipActive");
                return false;
            }
        }

        public static int? CreateNewCompanionship(Companionship companionship,int iUserId)
        {
            try
            {
                List<SqlParameter> parameters = new List<SqlParameter>();
                parameters.Add(new SqlParameter("iCoordinatorId", companionship.iCoordinatorId));
                parameters.Add(new SqlParameter("iStatusType", companionship.iStatusType));
                parameters.Add(new SqlParameter("nvSchedulingComment", companionship.nvSchedulingComment));
                parameters.Add(new SqlParameter("iStudentId", companionship.iStudentId));
                parameters.Add(new SqlParameter("iVolunteerId", companionship.iVolunteerId));
                parameters.Add(new SqlParameter("iUserId", iUserId));
                //Range(ObjectGenerator<Companionship>.GetSqlParametersFromObject(companionship));
                DataSet ds = SqlDataAccess.ExecuteDatasetSP("TCompanionship_INS", parameters);
                if (ds.Tables.Count == 0)
                    return -100;
                return int.Parse(ds.Tables[0].Rows[0][0].ToString());
            }
            catch (Exception ex)
            {
                Log.ExceptionLog(ex.Message, "CreateNewCompanionship");
                return -1;
            }
        }

        public static int UpdateCompanionshipStatus(int iCompanionshipId, int iStatusType, string nvDischargedComment, int iStudentStatus, int iVolunteerStatus, int iUserId)
        {
            try
            {
                List<SqlParameter> parameters = new List<SqlParameter>();
                parameters.Add(new SqlParameter("iCompanionshipId", iCompanionshipId));
                parameters.Add(new SqlParameter("iStatusType", iStatusType));
                parameters.Add(new SqlParameter("nvDischargedComment", nvDischargedComment));
                parameters.Add(new SqlParameter("iStudentStatus", iStudentStatus));
                parameters.Add(new SqlParameter("iVolunteerStatus", iVolunteerStatus));
                parameters.Add(new SqlParameter("iUserId", iUserId));
                DataSet ds = SqlDataAccess.ExecuteDatasetSP("TCompanionship_Status_UPD", parameters);
                return int.Parse(ds.Tables[0].Rows[0][0].ToString());
            }
            catch (Exception ex)
            {
                Log.ExceptionLog(ex.Message, "UpdateCompanionshipStatus");
                return 0;
            }
        }

        public static int companionshipChekExists(int? iStudentId, int? iVolunteerId)
        {
            try
            {
                List<SqlParameter> parameters = new List<SqlParameter>();
                parameters.Add(new SqlParameter("iStudentId", iStudentId));
                parameters.Add(new SqlParameter("iVolunteerId", iVolunteerId));
                DataSet ds = SqlDataAccess.ExecuteDatasetSP("TCompanionship_Check_Exists", parameters);
                int i = int.Parse(ds.Tables[0].Rows[0][0].ToString());
                return i;
            }
            catch (Exception ex)
            {
                Log.ExceptionLog(ex.Message, "companionshipChekExists");
                return 0;
            }
        }

        #endregion
    }
}