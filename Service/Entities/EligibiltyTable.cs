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
				//data table שולף טבלה
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
				//פונקציה שהופכת את הטבלה לרשימה
				//lPayment = ObjectGenerator<Payment>.GeneratListFromDataRowCollection(dt.Rows);
				return lEligibiltyTable;
			}
			catch (Exception ex)
			{
				Log.ExceptionLog(ex.Message, "GetEligibiltyTable");
				return null;
			}
		}
	}
}