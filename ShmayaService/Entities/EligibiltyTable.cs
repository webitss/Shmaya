using Infra.DL;
using ShmayaService.Utilities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace ShmayaService.Entities
{
	[DataContract]
	public class EligibiltyTable
	{
		[DataMember]
		public int iEntitlementTypeId { get; set; }
		[DataMember]
		public string nvEntitlementType { get; set; }
		[DataMember]
		public double nNumHours { get; set; }
		public static List<EligibiltyTable> GetEligibiltyTable()
		{
			try
			{
				DataTable dt = SqlDataAccess.ExecuteDatasetSP("TSysEntitlementTable_SLCT").Tables[0];
				List<EligibiltyTable> lEligibiltyTable = new List<EligibiltyTable>();
				for (int i = 0; i < dt.Rows.Count; i++)
				{
					EligibiltyTable eligibiltyTable = new EligibiltyTable();
					eligibiltyTable.iEntitlementTypeId = int.Parse(dt.Rows[i]["iEntitlementTypeId"].ToString());
					eligibiltyTable.nvEntitlementType = dt.Rows[i]["nvEntitlementType"].ToString();
					eligibiltyTable.nNumHours = double.Parse(dt.Rows[i]["nNumHours"].ToString());
					lEligibiltyTable.Add(eligibiltyTable);
				}
				return lEligibiltyTable;
			}
			catch (Exception ex)
			{
				Log.ExceptionLog(ex.Message, "GetEligibiltyTable");
				return null;
			}
		}
		public static int? EligibilityUpdate(EligibiltyTable eligibility, int iUserManagerId)
		{
			try
			{

				List<SqlParameter> parameters = new List<SqlParameter>();
				parameters.Add(new SqlParameter("iEntitlementTypeId", eligibility.iEntitlementTypeId));
				parameters.Add(new SqlParameter("nvEntitlementType", eligibility.nvEntitlementType));
				parameters.Add(new SqlParameter("nNumHours", eligibility.nNumHours));
				parameters.Add(new SqlParameter("iUserManagerId", iUserManagerId));
				DataSet ds = SqlDataAccess.ExecuteDatasetSP("TEntitlement_UPD", parameters);
				return int.Parse(ds.Tables[0].Rows[0][0].ToString());
			}
			catch (Exception ex)
			{
				Log.ExceptionLog(ex.Message, "EligibilityUpdate");
				return -1;
			}
		}

		public static int? EligibilityInsert(EligibiltyTable eligibility, int iUserManagerId)
		{
			try
			{

				List<SqlParameter> parameters = new List<SqlParameter>();
				parameters.Add(new SqlParameter("iEntitlementTypeId", eligibility.iEntitlementTypeId));
				parameters.Add(new SqlParameter("nvEntitlementType", eligibility.nvEntitlementType));
				parameters.Add(new SqlParameter("nNumHours", eligibility.nNumHours));
				parameters.Add(new SqlParameter("iUserManagerId", iUserManagerId));
				DataSet ds = SqlDataAccess.ExecuteDatasetSP("TEntitlement_INS", parameters);
				return int.Parse(ds.Tables[0].Rows[0][0].ToString());
			}
			catch (Exception ex)
			{
				Log.ExceptionLog(ex.Message, "EligibilityInsert");
				return -1;
			}
		}
	}
	
}