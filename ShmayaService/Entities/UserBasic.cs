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
	public class UserBasic
	{
		[DataMember]
		public int iUserId { get; set; }
		[DataMember]
		public string nvFirstName { get; set; }
		[DataMember]
		public string nvLastName { get; set; }
		[DataMember]
		public string nvAdress { get; set; }
		[DataMember]
		public string nvMobileNum { get; set; }
		[DataMember]
		public string nvPhoneNum { get; set; }
		[DataMember]
		public string nvEmail { get; set; }
		[DataMember]
		public string nvID { get; set; }
		[DataMember]
		public double nBankHours { get; set; }
		[DataMember]
		public string nvEntitlementType { get; set; }
		[DataMember]
		public string nvWorkerType { get; set; }
		[DataMember]
		public double nNumHours { get; set; }
		[DataMember]
		public List<int> lOrderType { get; set; }


		public static List<UserBasic> GetUsersBasic(int? iUserType)
		{
			try
			{
				//data set שולף אוסף של טבלאות
				DataSet ds = SqlDataAccess.ExecuteDatasetSP("TSysUserBasic_SLCT", new SqlParameter("iUserType", iUserType));

				List<UserBasic> lUsers = new List<UserBasic>();
				DataView dv;
				//מעבר על כל שורה מתוך הטבלה הראשונה שבאוסף
				foreach (DataRow dr in ds.Tables[0].Rows)
				{
					UserBasic user = new UserBasic();
					//הפיכת כל יוזר לפריט בליסט
					user = ObjectGenerator<UserBasic>.GeneratFromDataRow(dr);
					//יצירת הטבלה השניה כדינאמית שמחזירה רק שורות התואמות לתנאי מסוים
					dv = new DataView(ds.Tables[1],
					 "iUserId = " + user.iUserId.ToString(),
					 "", DataViewRowState.CurrentRows);
					user.lOrderType = new List<int>();
					//הכנסת הערכים מהטבלה השניה לתוך הליסט המתאים להם באובייקט
					for (int j = 0; j < dv.Count; j++)
					{
						user.lOrderType.Add(int.Parse(ds.Tables[1].Rows[j]["iTypeId"].ToString()));
					}
					lUsers.Add(user);
				}
				return lUsers;
			}
			catch (Exception ex)
			{
				Log.ExceptionLog(ex.Message, "GetUsersBasic");
				return null;
			}
		}
	}
}