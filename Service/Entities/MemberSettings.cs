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
    public class MemberSettings
    {
        #region Members

        [DataMember]
        public int iSettingType { get; set; }
        [DataMember]
        public int iValueType { get; set; }

        #endregion


    }
}