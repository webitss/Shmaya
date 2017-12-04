using Service.Utilities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace Service.Entities
{
    [DataContract]
    public class Volunteers : Person
    {
        #region Members
        [DataMember]
        public string TEducation { get; set; }
        [DataMember]
        public string nvComment { get; set; }
        [DataMember]
        public string nvteaching { get; set; }
        [DataMember]
        public string TExperience { get; set; }
        [DataMember]
        public string TOccupation { get; set; }
        [DataMember]
        public string TKollell { get; set; }
        [DataMember]
        public string TNameSource { get; set; }
        [DataMember]
        public string dRegistrationDate { get; set; }
        [DataMember]
        public string nvPriority { get; set; }
        [DataMember]
        public string TYear { get; set; }
        [DataMember]
        public string TFileSource { get; set; }
        [DataMember]
        public string TSetting { get; set; }
        [DataMember]
        public string nvSendBy { get; set; }
        //public TimeZone tAvailableConversationFrom { get; set; }
        //public TimeZone tAvailableConversationTo { get; set; }
        [DataMember]
        public string TDepartment { get; set; }
        #endregion

        #region Methods
        public static List<Volunteers> GetAllVolunteers()
        {
            try
            {
                DataSet ds = SqlDataAccess.ExecuteDatasetSP("TVolunteers_SLCT");
                List<Volunteers> lVolunteers = new List<Volunteers>();
                lVolunteers = ObjectGenerator<Volunteers>.GeneratListFromDataRowCollection(ds.Tables[0].Rows);
                return lVolunteers;
            }
            catch (Exception ex)
            {
                Log.ExceptionLog(ex.Message, "GetAllVolunteers");
                return null;
            }
        }

        #endregion
    }
}