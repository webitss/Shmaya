using Service.Utilities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Runtime.Serialization;
using System.Linq;
using System.Web;

namespace Service.Entities
{
    [DataContract]
    public class Person
    {
        #region Members
        [DataMember]
        public int iPersonId { get; set; }
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
        public string nvFacebookName { get; set; }
        [DataMember]
        public DateTime? dtDateBirth { get; set; }
        [DataMember]
        [NoSendToSQL]
        public int iAge { get; set; }
        [DataMember]
        public string nvEmail { get; set; }
        [DataMember]
        public int iMaritalStatusType { get; set; }
        [NoSendToSQL]
        [DataMember]
        public string nvMaritalStatusType { get; set; }
        [DataMember]
        public int iGenderType { get; set; }
        [NoSendToSQL]
        [DataMember]
        public string nvGenderType { get; set; }
        [DataMember]
        public int iCityType { get; set; }
        [NoSendToSQL]
        [DataMember]
        public string nvCityType { get; set; }
        #endregion
    }
}