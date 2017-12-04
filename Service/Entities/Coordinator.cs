using Service.Utilities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Runtime.Serialization;
using System.Data;

using System.Data.SqlClient;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace Service.Entities
{
    [DataContract]
    public class Coordinator:Person
    {
        #region Members
        [DataMember]
        public int iCoordinatorId { get; set; }
        [DataMember]
        public Boolean bIsScheduller { get; set; }
        [DataMember]
        public int iDepartmentId { get; set; }      
        #endregion

        #region Methods

        public static List<Coordinator> GetCoordinators(int iDepartmentId)
        {             
            try
            {
                DataSet ds = SqlDataAccess.ExecuteDatasetSP("TCoordinator_SLCT", new List<SqlParameter>() {
                new SqlParameter("iDepartmentId",iDepartmentId)
                });
                List<Coordinator> coordinatorList = new List<Coordinator>();
                coordinatorList = ObjectGenerator<Coordinator>.GeneratListFromDataRowCollection(ds.Tables[0].Rows);
                return coordinatorList;
            }
            catch (Exception ex)
            {
                Log.ExceptionLog(ex.Message, "GetCoordinators");
                return null;
            }
        }


        public static Dictionary<string, List<CodeTable>> GetCoordinatorsCodeTable(int iDepartmentId)
        {
            return CodeTable.GetListCodeTables("TCoordinator_SLCT", new List<SqlParameter>() { new SqlParameter("iDepartmentId", iDepartmentId) });          
        }

        #endregion
    }
}