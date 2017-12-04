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
    public class Student : Person
    {
        #region Members
        [DataMember]
        public int iStudentId { get; set; }
        [DataMember]
        public int iMYPersonId { get; set; }
        [DataMember]
        public string TMYCustomer { get; set; }
        [DataMember]
        public int iMYWorkerId { get; set; }
        [DataMember]
        public string TiEmployment { get; set; }
        [DataMember]
        public string nvFacebook { get; set; }
        [DataMember]
        public int iPostedByCoordinatorId { get; set; }
        [DataMember]
        public string nvContinueConnection { get; set; }
        [DataMember]
        public string nvSourceComments { get; set; }
        [DataMember]
        public string nvImportantComment { get; set; }
        #endregion
    }
}