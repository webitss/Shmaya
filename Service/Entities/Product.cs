using Service.Utilities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace Service.Entities
{
	public class Product
	{
		public int iProductId;
		public int iProductTypeId;
		public string nvPruductName;
		public static List<Product> GetProduct()
		{
			try
			{
				//data table שולף טבלה
				DataTable dt = SqlDataAccess.ExecuteDatasetSP("TSysProduct_SLCT").Tables[0];
				List<Product> lProducts = new List<Product>();
				//פונקציה שהופכת את הטבלה לרשימה
				lProducts = ObjectGenerator<Product>.GeneratListFromDataRowCollection(dt.Rows);
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