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
	public class Product
	{
		[DataMember]
		public int iProductId;
		[DataMember]
		public int iProductTypeId;
		[DataMember]
		public string nvProductTypeId;
		[DataMember]
		public string nvPruductName;
		public static List<Product> GetProduct()
		{
			try
			{
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
				return lProducts;
			}
			catch (Exception ex)
			{
				Log.ExceptionLog(ex.Message, "GetProduct");
				return null;
			}
		}
		public static int? ProductUpdate(Product product, int iUserManagerId)
		{
			try
			{

				List<SqlParameter> parameters = new List<SqlParameter>();
				parameters.Add(new SqlParameter("iProductId", product.iProductId));
				parameters.Add(new SqlParameter("iProductTypeId", product.iProductTypeId));
				parameters.Add(new SqlParameter("nvPruductName", product.nvPruductName));
				parameters.Add(new SqlParameter("iUserManagerId", iUserManagerId));
				DataSet ds = SqlDataAccess.ExecuteDatasetSP("TProduct_UPD", parameters);
				return int.Parse(ds.Tables[0].Rows[0][0].ToString());
			}
			catch (Exception ex)
			{
				Log.ExceptionLog(ex.Message, "ProductUpdate");
				return -1;
			}
		}

		public static int? ProductInsert(Product product, int iUserManagerId)
		{
			try
			{

				List<SqlParameter> parameters = new List<SqlParameter>();
				parameters.Add(new SqlParameter("iProductTypeId", product.iProductTypeId));
				parameters.Add(new SqlParameter("nvPruductName", product.nvPruductName));
				parameters.Add(new SqlParameter("iUserManagerId", iUserManagerId));
				DataSet ds = SqlDataAccess.ExecuteDatasetSP("TProduct_INS", parameters);
				return int.Parse(ds.Tables[0].Rows[0][0].ToString());
			}
			catch (Exception ex)
			{
				Log.ExceptionLog(ex.Message, "ProductUpdate");
				return -1;
			}
		}
	}
}