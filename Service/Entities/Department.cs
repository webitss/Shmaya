using Service.Utilities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace Service.Entities
{
    public class Department
    {
        #region Members
        public int iDepartmentId { get; set; }
        public string nvDepartmentName { get; set; }
        public string nvDepartmentMobileNumber { get; set; }
        public string nvDepartmentEmail { get; set; }
        #endregion

        #region Functions

        //public static bool DepartmentInsert(Department department, int iManageUserId)
        //{
        //    try
        //    {
        //        List<SqlParameter> parameters = new List<SqlParameter>()
        //        {
        //            new SqlParameter("iManageUserId", iManageUserId)
        //        };
        //        parameters.AddRange(ObjectGenerator<Department>.GetSqlParametersFromObject(department));
        //        DataSet ds = SqlDataAccess.ExecuteDatasetSP("TDepartment_INS", parameters);
        //        return true;
        //    }
        //    catch (Exception ex)
        //    {
        //        Log.ExceptionLog(ex.Message, "DepartmentInsert");
        //        return false;
        //    }
        //}

        public static int checkDepartmentExists(string nvDepartmentName)
        {
            try
            {
                DataSet ds = SqlDataAccess.ExecuteDatasetSP("TDepartment_CheckExist_SLCT", new SqlParameter("nvDepartmentName", nvDepartmentName));
                return ds.Tables[0].Rows.Count;
            }
            catch (Exception ex)
            {
                Log.ExceptionLog(ex.Message, "CheckDepartmentExist");
                return -1;
            }
        }

        #endregion
    }
}