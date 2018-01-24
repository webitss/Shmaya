using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ServiceModel;
using System.Runtime.Serialization;
using System.Data.SqlClient;
using System.Data;
//using Infra.DL;
using System.Net.Mail;
using System.Net;
using System.Text;
using System.IO;
using System.Web.Script.Serialization;
using System.Runtime.Serialization.Json;

namespace ShmayaService.Utilities
{
    public class Result
    {
        #region DataMember
        [DataMember]
        public bool bResult { get; set; }
        [DataMember]
        public int iResult { get; set; }
        [DataMember]
        public string sResult { get; set; }
        [DataMember]
        public int iGuideStatusId { get; set; }
        #endregion

        #region Constractors

        public Result() { }

        public Result(int guideStatusId)
        {
            iGuideStatusId = guideStatusId;
        }
        public Result(bool result, int guideStatusId)
        {
            bResult = result;
            iGuideStatusId = guideStatusId;
        }

        public Result(bool result, int guideStatusId, string sVarResult)
        {
            bResult = result;
            iGuideStatusId = guideStatusId;
            sResult = sVarResult;
        }

        public Result(int result, int guideStatusId)
        {
            iResult = result;
            iGuideStatusId = guideStatusId;
        }


        public Result(string result, int guideStatusId)
        {
            sResult = result;
            iGuideStatusId = guideStatusId;
        }

        #endregion

        #region Methods

        #endregion
    }
}