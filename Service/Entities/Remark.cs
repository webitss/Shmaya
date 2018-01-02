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
	public class Remark
	{
		#region Members
		[DataMember]
		public int iRemarkId { get; set; }
		[DataMember]
		public string nvSubject { get; set; }
		[DataMember]
		public string nvComment { get; set; }
		[DataMember]
		[NoSendToSQL]
		public DateTime? dtCreateDate { get; set; }
		[DataMember]
		public int iUserId { get; set; }
		[DataMember]
		public int iCreateUserId { get; set; }
		[DataMember]
		[NoSendToSQL]
		public string nvCreateUser { get; set; }

		#endregion
		#region Functions

		public static bool CreateNewRemark(Remark remark)
		{
			try
			{
				List<SqlParameter> parameters = new List<SqlParameter>(); 
				parameters.AddRange(ObjectGenerator<Remark>.GetSqlParametersFromObject(remark));
				DataSet ds = SqlDataAccess.ExecuteDatasetSP("TRemark_INS", parameters);
				return true;
			}
			catch (Exception ex)
			{
				Log.ExceptionLog(ex.Message, "CreateNewRemark");
				return false;
			}
		}
		public static List<Remark> GetRemarks(int iUserId)
		{
			try
			{
				//data table שולף טבלה
				DataTable dt = SqlDataAccess.ExecuteDatasetSP("TRemark_SLCT", new SqlParameter("iUserId", iUserId)).Tables[0];
				List<Remark> lRemarks = new List<Remark>();
				lRemarks = ObjectGenerator<Remark>.GeneratListFromDataRowCollection(dt.Rows);
				//פונקציה שהופכת את הטבלה לרשימה
				//lPayment = ObjectGenerator<Payment>.GeneratListFromDataRowCollection(dt.Rows);
				return lRemarks;
			}
			catch (Exception ex)
			{
				Log.ExceptionLog(ex.Message, "GetRemarks");
				return null;
			}
		}


	}

	#endregion
}
