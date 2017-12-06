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
	public class Product
	{
		[DataMember]
		public int iProductId;
		[DataMember]
		public int iProductTypeId;
		[DataMember]
		[NoSendToSQL]
		public string nvProductTypeId;
		[DataMember]
		public string nvPruductName;
		public static List<Product> GetProduct()
		{
			try
			{
				//data table שולף טבלה
				DataTable dt = SqlDataAccess.ExecuteDatasetSP("TSysProduct_SLCT").Tables[0];
				List<Product> lProducts = new List<Product>();
				for (int i = 0; i < dt.Rows.Count; i++)
				{
					Product product = new Product();
					product.iProductId = int.Parse(dt.Rows[i]["iProductId"].ToString());
					if(dt.Rows[i]["iProductTypeId"].ToString() != string.Empty)
						product.iProductTypeId = int.Parse(dt.Rows[i]["iProductTypeId"].ToString());
					product.nvPruductName = dt.Rows[i]["nvPruductName"].ToString();
					product.nvProductTypeId = dt.Rows[i]["nvProductTypeId"].ToString();
					lProducts.Add(product);
				}
				//פונקציה שהופכת את הטבלה לרשימה
				//lProducts = ObjectGenerator<Product>.GeneratListFromDataRowCollection(dt.Rows);
				return lProducts;
			}
			catch (Exception ex)
			{
				Log.ExceptionLog(ex.Message, "GetProduct");
				return null;
			}
		}
	}
}