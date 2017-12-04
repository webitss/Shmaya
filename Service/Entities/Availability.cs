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
    public class Availability
    {
        #region Members

        [DataMember]
        public int iDayType { get; set; }
        [DataMember]
        public int iDayPartType { get; set; }

        #endregion


    }
}