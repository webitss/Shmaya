using System;
using System.Data;
using System.Xml;
using System.Data.SqlClient;
using System.Collections;
using System.Configuration;
using System.Reflection;
using System.Threading;
using System.Collections.Generic;


namespace Service.Utilities
{
    public sealed class SpParams
    {
        public SpParams() { }
        public string SpName;
        public SqlParameter[] commandParameters;
    }

    public sealed class SqlDataAccess
    {
        #region private utility methods & constructors

        // Since this class provides only static methods, make the default constructor private to prevent 
        // instances from being created with "new SqlDataAccess()"
        private SqlDataAccess() { }

        /// <summary>
        /// This method is used to attach array of SqlParameters to a SqlCommand.
        /// 
        /// This method will assign a value of DbNull to any parameter with a direction of
        /// InputOutput and a value of null.  
        /// 
        /// This behavior will prevent default values from being used, but
        /// this will be the less common case than an intended pure output parameter (derived as InputOutput)
        /// where the user provided no input value.
        /// </summary>
        /// <param name="command">The command to which the parameters will be added</param>
        /// <param name="commandParameters">An array of SqlParameters to be added to command</param>
        private static void AttachParameters(SqlCommand command, SqlParameter[] commandParameters)
        {
            if (command == null) throw new ArgumentNullException("command");
            if (commandParameters != null)
                foreach (SqlParameter p in commandParameters)
                    if (p != null)
                    {
                        // Check for derived output value with no value assigned
                        if ((p.Direction == ParameterDirection.InputOutput ||
                            p.Direction == ParameterDirection.Input) &&
                            (p.Value == null))
                            p.Value = DBNull.Value;
                        command.Parameters.Add(p);
                    }
        }

        /// <summary>
        /// This method assigns dataRow column values to an array of SqlParameters
        /// </summary>
        /// <param name="commandParameters">Array of SqlParameters to be assigned values</param>
        /// <param name="dataRow">The dataRow used to hold the stored procedure's parameter values</param>
        private static void AssignParameterValues(SqlParameter[] commandParameters, DataRow dataRow)
        {
            // Do nothing if we get no data
            if ((commandParameters == null) || (dataRow == null)) return;

            int i = 0;
            // Set the parameters values
            foreach (SqlParameter commandParameter in commandParameters)
            {
                // Check the parameter name
                if (commandParameter.ParameterName == null ||
                    commandParameter.ParameterName.Length <= 1)
                    throw new Exception(
                        string.Format(
                            "Please provide a valid parameter name on the parameter #{0}, the ParameterName property has the following value: '{1}'.",
                            i, commandParameter.ParameterName));
                if (dataRow.Table.Columns.IndexOf(commandParameter.ParameterName.Substring(1)) != -1)
                    commandParameter.Value = dataRow[commandParameter.ParameterName.Substring(1)];
                i++;
            }
        }

        /// <summary>
        /// This method assigns an array of values to an array of SqlParameters
        /// </summary>
        /// <param name="commandParameters">Array of SqlParameters to be assigned values</param>
        /// <param name="parameterValues">Array of objects holding the values to be assigned</param>
        private static void AssignParameterValues(SqlParameter[] commandParameters, object[] parameterValues)
        {
            // Do nothing if we get no data
            if ((commandParameters == null) || (parameterValues == null)) return;

            // We must have the same number of values as we pave parameters to put them in
            if (commandParameters.Length != parameterValues.Length)
                throw new ArgumentException("Parameter count does not match Parameter Value count.");

            // Iterate through the SqlParameters, assigning the values from the corresponding position in the 
            // value array
            for (int i = 0, j = commandParameters.Length; i < j; i++)
            {
                // If the current array value derives from IDbDataParameter, then assign its Value property
                Object param = parameterValues[i];
                if (param is IDbDataParameter)
                    param = ((IDbDataParameter)param).Value;
                commandParameters[i].Value = (param == null ? DBNull.Value : param);
            }
        }

        /// <summary>
        /// This method opens (if necessary) and assigns a connection, transaction, command type and parameters 
        /// to the provided command
        /// </summary>
        /// <param name="command">The SqlCommand to be prepared</param>
        /// <param name="connection">A valid SqlConnection, on which to execute this command</param>
        /// <param name="transaction">A valid SqlTransaction, or 'null'</param>
        /// <param name="commandType">The CommandType (stored procedure, text, etc.)</param>
        /// <param name="commandText">The stored procedure name or T-SQL command</param>
        /// <param name="commandParameters">An array of SqlParameters to be associated with the command or 'null' if no parameters are required</param>
        /// <param name="mustCloseConnection"><c>true</c> if the connection was opened by the method, otherwose is false.</param>
        private static void PrepareCommand(SqlCommand command, SqlConnection connection,
            SqlTransaction transaction, CommandType commandType, string commandText,
            SqlParameter[] commandParameters, out bool mustCloseConnection)
        {
            if (command == null) throw new ArgumentNullException("command");
            if (commandText == null || commandText.Length == 0)
                throw new ArgumentNullException("commandText");

            // If the provided connection is not open, we will open it
            if (connection.State != ConnectionState.Open)
            {
                mustCloseConnection = true;
                connection.Open();
            }
            else
                mustCloseConnection = false;

            // Associate the connection with the command
            command.Connection = connection;

            // Set the command text (stored procedure name or SQL statement)
            command.CommandText = commandText;

            // If we were provided a transaction, assign it
            if (transaction != null)
            {
                if (transaction.Connection == null)
                    throw new ArgumentException("The transaction was rollbacked or commited, please provide an open transaction.", "transaction");
                command.Transaction = transaction;
            }

            command.CommandType = commandType;  // Set the command type

            // Attach the command parameters if they are provided
            if (commandParameters != null)
                AttachParameters(command, commandParameters);
            return;
        }

        private static void PrepareCommand(SqlCommand command, SqlConnection connection,
            SqlTransaction transaction, CommandType commandType, string commandText,
            List<SqlParameter> commandParameters, out bool mustCloseConnection)
        {
            if (command == null) throw new ArgumentNullException("command");
            if (commandText == null || commandText.Length == 0)
                throw new ArgumentNullException("commandText");

            // If the provided connection is not open, we will open it
            if (connection.State != ConnectionState.Open)
            {
                mustCloseConnection = true;
                connection.Open();
            }
            else
                mustCloseConnection = false;

            // Associate the connection with the command
            command.Connection = connection;

            // Set the command text (stored procedure name or SQL statement)
            command.CommandText = commandText;

            // If we were provided a transaction, assign it
            if (transaction != null)
            {
                if (transaction.Connection == null)
                    throw new ArgumentException("The transaction was rollbacked or commited, please provide an open transaction.", "transaction");
                command.Transaction = transaction;
            }

            command.CommandType = commandType;  // Set the command type

            // Attach the command parameters if they are provided
            if (commandParameters != null)
                AttachParameters(command, commandParameters);
            return;
        }


        #endregion private utility methods & constructors

        #region ExecuteDatasetSp with list parameters

        public static DataSet ExecuteDatasetSP(string spName, List<SqlParameter> SPParameters)
        {
            // Create & open a SqlConnection, and dispose of it after we are done
            using (SqlConnection connection = new SqlConnection())
            {
                //ConnectionOpen(connection);
                SqlConnectDB.OpenDBConnection(connection, SqlConnectDB.SessionConnectionID);

                // Call the overload that takes a connection in place of the connection string
                return ExecuteDatasetSP(connection, spName, SPParameters);
            }
        }

        private static DataSet ExecuteDatasetSP(SqlConnection connection, string spName, List<SqlParameter> SPParameters)
        {
            if (connection == null) throw new ArgumentNullException("connection");

            // Create a command and prepare it for execution
            SqlCommand cmd = new SqlCommand();
            bool mustCloseConnection = false;
            PrepareCommand(cmd, connection, (SqlTransaction)null, CommandType.StoredProcedure, spName, SPParameters, out mustCloseConnection);

            // Create the DataAdapter & DataSet
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                DataSet ds = new DataSet();

                // Fill the DataSet using default values for DataTable names, etc
                da.Fill(ds);

                // Detach the SqlParameters from the command object, so they can be used again
                cmd.Parameters.Clear();

                if (mustCloseConnection)
                    connection.Close();

                // Return the dataset
                return ds;
            }
        }

        private static void AttachParameters(SqlCommand command, List<SqlParameter> commandParameters)
        {
            if (command == null) throw new ArgumentNullException("command");
            if (commandParameters != null)
                foreach (SqlParameter p in commandParameters)
                {
                    if (p != null)
                    {
                        // Check for derived output value with no value assigned
                        if ((p.Direction == ParameterDirection.InputOutput ||
                            p.Direction == ParameterDirection.Input) &&
                            (p.Value == null))
                            p.Value = DBNull.Value;
                        command.Parameters.Add(p);
                    }
                }
        }

        #endregion

        # region ExcuteSp with list parameters

        public static int ExecuteSP(string spName, List<SqlParameter> SPParameters)
        {
            using (SqlConnection connection = new SqlConnection())
            {
                //ConnectionOpen(connection);
                SqlConnectDB.OpenDBConnection(connection, SqlConnectDB.SessionConnectionID);

                // Call the overload that takes a connection in place of the connection string
                return ExecuteSP(connection, spName, SPParameters);
            }

        }

        private static int ExecuteSP(SqlConnection connection, string spName, List<SqlParameter> SPParameters)
        {
            if (connection == null) throw new ArgumentNullException("connection");

            // Create a command and prepare it for execution
            SqlCommand cmd = new SqlCommand();
            bool mustCloseConnection = false;
            PrepareCommand(cmd, connection, (SqlTransaction)null, CommandType.StoredProcedure, spName, SPParameters, out mustCloseConnection);

            // Finally, execute the command
            int retval = cmd.ExecuteNonQuery();

            // Detach the SqlParameters from the command object, so they can be used again
            cmd.Parameters.Clear();
            if (mustCloseConnection)
                connection.Close();
            return retval;
        }

        #endregion

        #region ExecuteSP
        #region timeOut
        public static int ExecuteSP(string spName, int timeOut)
        {
            // Pass through the call providing null for the set of SqlParameters
            return ExecuteSP(timeOut, spName, (SqlParameter[])null);
        }

        public static int ExecuteSP(int timeOut, string spName, params SqlParameter[] SPParameters)
        {
            using (SqlConnection connection = new SqlConnection())
            {
                //ConnectionOpen(connection);
                SqlConnectDB.OpenDBConnection(connection, SqlConnectDB.SessionConnectionID);

                // Call the overload that takes a connection in place of the connection string
                return ExecuteSP(timeOut, connection, spName, SPParameters);
            }

        }

        private static int ExecuteSP(int timeOut, SqlConnection connection, string spName, params SqlParameter[] SPParameters)
        {
            if (connection == null) throw new ArgumentNullException("connection");

            // Create a command and prepare it for execution
            SqlCommand cmd = new SqlCommand();
            cmd.CommandTimeout = timeOut;
            bool mustCloseConnection = false;
            PrepareCommand(cmd, connection, (SqlTransaction)null, CommandType.StoredProcedure, spName, SPParameters, out mustCloseConnection);

            // Finally, execute the command
            int retval = cmd.ExecuteNonQuery();

            // Detach the SqlParameters from the command object, so they can be used again
            cmd.Parameters.Clear();
            if (mustCloseConnection)
                connection.Close();
            return retval;
        }

        #endregion

        public static int ExecuteSP(string spName)
        {
            // Pass through the call providing null for the set of SqlParameters
            return ExecuteSP(spName, (SqlParameter[])null);
        }

        public static int ExecuteSP(string spName, params SqlParameter[] SPParameters)
        {
            using (SqlConnection connection = new SqlConnection())
            {
                //ConnectionOpen(connection);
                SqlConnectDB.OpenDBConnection(connection, SqlConnectDB.SessionConnectionID);

                // Call the overload that takes a connection in place of the connection string
                return ExecuteSP(connection, spName, SPParameters);
            }

        }

        private static int ExecuteSP(SqlConnection connection, string spName, params SqlParameter[] SPParameters)
        {
            if (connection == null) throw new ArgumentNullException("connection");

            // Create a command and prepare it for execution
            SqlCommand cmd = new SqlCommand();
            bool mustCloseConnection = false;
            PrepareCommand(cmd, connection, (SqlTransaction)null, CommandType.StoredProcedure, spName, SPParameters, out mustCloseConnection);

            // Finally, execute the command
            int retval = cmd.ExecuteNonQuery();

            // Detach the SqlParameters from the command object, so they can be used again
            cmd.Parameters.Clear();
            if (mustCloseConnection)
                connection.Close();
            return retval;
        }
        #endregion ExecuteSP

        #region ExecuteSPTransaction

        public static int ExecuteSPTransaction(string TransactionName, SpParams[] SpAndParmasList)
        {

            // Create & open a SqlConnection, and dispose of it after we are done
            using (SqlConnection connection = new SqlConnection())
            {
                // connection.Open();
                SqlConnectDB.OpenDBConnection(connection, SqlConnectDB.SessionConnectionID);


                // Call the overload that takes a connection in place of the connection string
                return ExecuteSPTransaction(connection, TransactionName, SpAndParmasList);
            }
        }

        private static int ExecuteSPTransaction(SqlConnection connection, string TransactionName, SpParams[] SpAndParmasList)
        {
            if (connection == null) throw new ArgumentNullException("connection");

            if (SpAndParmasList.Length == 0)
                return 0;

            int i = 0;
            bool mustCloseConnection = false;
            int retval = 0;
            SqlCommand cmd;

            SqlTransaction tran = connection.BeginTransaction(TransactionName);
            for (i = 0; i < SpAndParmasList.Length; i++)
            {
                try
                {
                    cmd = new SqlCommand();
                    // Create a command and prepare it for execution
                    PrepareCommand(cmd, connection, tran, CommandType.StoredProcedure, SpAndParmasList[i].SpName, SpAndParmasList[i].commandParameters, out mustCloseConnection);

                    // Finally, execute the command
                    retval = cmd.ExecuteNonQuery();
                }
                catch (Exception ex)
                {
                    tran.Rollback(TransactionName);
                    throw (ex);
                }
                // Detach the SqlParameters from the command object, so they can be used again
                cmd.Parameters.Clear();
            }

            tran.Commit();
            if (mustCloseConnection)
                connection.Close();
            return retval;
        }

        #endregion ExecuteSPTransaction

        #region ExecuteDatasetSP

        #region TimeOut
        public static DataSet ExecuteDatasetSP(int timeOut, string spName)
        {
            // Pass through the call providing null for the set of SqlParameters
            return ExecuteDatasetSP(timeOut, spName, (SqlParameter[])null);
        }

        public static DataSet ExecuteDatasetSP(int timeOut, string spName, params SqlParameter[] SPParameters)
        {
            // Create & open a SqlConnection, and dispose of it after we are done
            using (SqlConnection connection = new SqlConnection())
            {
                //ConnectionOpen(connection);
                SqlConnectDB.OpenDBConnection(connection, SqlConnectDB.SessionConnectionID);

                // Call the overload that takes a connection in place of the connection string
                return ExecuteDatasetSP(timeOut, connection, spName, SPParameters);
            }
        }

        private static DataSet ExecuteDatasetSP(int timeOut, SqlConnection connection, string spName, params SqlParameter[] SPParameters)
        {
            if (connection == null) throw new ArgumentNullException("connection");

            // Create a command and prepare it for execution
            SqlCommand cmd = new SqlCommand();
            cmd.CommandTimeout = 0;
            bool mustCloseConnection = false;
            PrepareCommand(cmd, connection, (SqlTransaction)null, CommandType.StoredProcedure, spName, SPParameters, out mustCloseConnection);

            // Create the DataAdapter & DataSet
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                DataSet ds = new DataSet();

                // Fill the DataSet using default values for DataTable names, etc
                da.Fill(ds);

                // Detach the SqlParameters from the command object, so they can be used again
                cmd.Parameters.Clear();

                if (mustCloseConnection)
                    connection.Close();

                // Return the dataset
                return ds;
            }
        }
        #endregion

        public static DataSet ExecuteDatasetSP(string spName)
        {
            // Pass through the call providing null for the set of SqlParameters
            return ExecuteDatasetSP(spName, (SqlParameter[])null);
        }

        public static DataSet ExecuteDatasetSP(string spName, params SqlParameter[] SPParameters)
        {
            // Create & open a SqlConnection, and dispose of it after we are done
            using (SqlConnection connection = new SqlConnection())
            {
                //ConnectionOpen(connection);
                SqlConnectDB.OpenDBConnection(connection, SqlConnectDB.SessionConnectionID);

                // Call the overload that takes a connection in place of the connection string
                return ExecuteDatasetSP(connection, spName, SPParameters);
            }
        }

        public static DataSet ExecuteMYDatasetSP(string spName, params SqlParameter[] SPParameters)
        {
            // Create & open a SqlConnection, and dispose of it after we are done
            using (SqlConnection connection = new SqlConnection())
            {
                //ConnectionOpen(connection);
                SqlConnectDB.OpenDBConnection(connection, SqlConnectDB.SessionConnectionID, "AyeletHashachar");

                // Call the overload that takes a connection in place of the connection string
                return ExecuteDatasetSP(connection, spName, SPParameters);
            }
        }

        //הפרוצדורה מקבלת שאילתה ומחזירה את התוצאה 
        public static DataSet ExecuteDataset(string sqName)
        {
            // Create & open a SqlConnection, and dispose of it after we are done
            using (SqlConnection connection = new SqlConnection())
            {
                //ConnectionOpen(connection);
                SqlConnectDB.OpenDBConnection(connection, SqlConnectDB.SessionConnectionID);

                // Call the overload that takes a connection in place of the connection string
                SqlCommand cmd = new SqlCommand();
                bool mustCloseConnection = false;
                PrepareCommand(cmd, connection, (SqlTransaction)null, CommandType.Text, sqName, (SqlParameter[])null, out mustCloseConnection);

                // Create the DataAdapter & DataSet
                using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                {
                    DataSet ds = new DataSet();

                    // Fill the DataSet using default values for DataTable names, etc
                    da.Fill(ds);

                    // Detach the SqlParameters from the command object, so they can be used again
                    cmd.Parameters.Clear();

                    if (mustCloseConnection)
                        connection.Close();

                    // Return the dataset
                    return ds;
                }
            }
        }
        //timeOut הפרוצדורה מקבלת שאילתה ומחזירה את התוצאה עם 
        public static DataSet ExecuteDataset(int timeOut, string sqName)
        {
            // Create & open a SqlConnection, and dispose of it after we are done
            using (SqlConnection connection = new SqlConnection())
            {
                //ConnectionOpen(connection);
                SqlConnectDB.OpenDBConnection(connection, SqlConnectDB.SessionConnectionID);

                // Call the overload that takes a connection in place of the connection string
                SqlCommand cmd = new SqlCommand();
                cmd.CommandTimeout = 0;
                bool mustCloseConnection = false;
                PrepareCommand(cmd, connection, (SqlTransaction)null, CommandType.Text, sqName, (SqlParameter[])null, out mustCloseConnection);

                // Create the DataAdapter & DataSet
                using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                {
                    DataSet ds = new DataSet();

                    // Fill the DataSet using default values for DataTable names, etc
                    da.Fill(ds);

                    // Detach the SqlParameters from the command object, so they can be used again
                    cmd.Parameters.Clear();

                    if (mustCloseConnection)
                        connection.Close();

                    // Return the dataset
                    return ds;
                }
            }
        }

        private static DataSet ExecuteDatasetSP(SqlConnection connection, string spName, params SqlParameter[] SPParameters)
        {
            if (connection == null) throw new ArgumentNullException("connection");

            // Create a command and prepare it for execution
            SqlCommand cmd = new SqlCommand();
            bool mustCloseConnection = false;
            PrepareCommand(cmd, connection, (SqlTransaction)null, CommandType.StoredProcedure, spName, SPParameters, out mustCloseConnection);

            // Create the DataAdapter & DataSet
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                DataSet ds = new DataSet();

                // Fill the DataSet using default values for DataTable names, etc
                da.Fill(ds);

                // Detach the SqlParameters from the command object, so they can be used again
                cmd.Parameters.Clear();

                if (mustCloseConnection)
                    connection.Close();

                // Return the dataset
                return ds;
            }
        }

        #endregion ExecuteDatasetSP

        #region ExecuteReaderSP

        private static SqlDataReader ExecuteReaderSP(SqlConnection connection, SqlTransaction transaction, string spName, SqlParameter[] commandParameters)
        {
            if (connection == null) throw new ArgumentNullException("connection");

            bool mustCloseConnection = false;
            // Create a command and prepare it for execution
            SqlCommand cmd = new SqlCommand();
            try
            {
                PrepareCommand(cmd, connection, transaction, CommandType.StoredProcedure, spName, commandParameters, out mustCloseConnection);

                // Create a reader
                SqlDataReader dataReader;

                dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);

                // Detach the SqlParameters from the command object, so they can be used again.
                // HACK: There is a problem here, the output parameter values are fletched 
                // when the reader is closed, so if the parameters are detached from the command
                // then the SqlReader can´t set its values. 
                // When this happen, the parameters can´t be used again in other command.
                bool canClear = true;
                foreach (SqlParameter commandParameter in cmd.Parameters)
                    if (commandParameter.Direction != ParameterDirection.Input)
                        canClear = false;

                if (canClear)
                    cmd.Parameters.Clear();
                return dataReader;
            }
            catch
            {
                if (mustCloseConnection)
                    connection.Close();
                throw;
            }
        }

        public static SqlDataReader ExecuteReaderSP(string spName)
        {
            return ExecuteReaderSP(spName, (SqlParameter[])null);
        }

        public static SqlDataReader ExecuteReaderSP(string spName, params SqlParameter[] commandParameters)
        {
            SqlConnection connection = null;
            try
            {
                connection = new SqlConnection();
                //connection.Open();
                SqlConnectDB.OpenDBConnection(connection, SqlConnectDB.SessionConnectionID);

                // Call the private overload that takes an internally owned connection in place of the connection string
                return ExecuteReaderSP(connection, null, spName, commandParameters);
            }
            catch
            {
                // If we fail to return the SqlDatReader, we need to close the connection ourselves
                if (connection != null) connection.Close();
                throw;
            }
        }

        private static SqlDataReader ExecuteReaderSP(SqlConnection connection, string spName, params SqlParameter[] commandParameters)
        {
            // Pass through the call to the private overload using a null transaction value and an externally owned connection
            return ExecuteReaderSP(connection, (SqlTransaction)null, spName, commandParameters);
        }

        #endregion ExecuteReaderSP

        #region ExecuteScalarSP

        public static object ExecuteScalarSP(string spName)
        {
            // Pass through the call providing null for the set of SqlParameters
            return ExecuteScalarSP(spName, (SqlParameter[])null);
        }

        public static object ExecuteScalarSP(string spName, params SqlParameter[] commandParameters)
        {
            // Create & open a SqlConnection, and dispose of it after we are done
            using (SqlConnection connection = new SqlConnection())
            {
                //connection.Open();
                SqlConnectDB.OpenDBConnection(connection, SqlConnectDB.SessionConnectionID);

                // Call the overload that takes a connection in place of the connection string
                return ExecuteScalarSP(connection, spName, commandParameters);
            }
        }

        private static object ExecuteScalarSP(SqlConnection connection, string spName, params SqlParameter[] commandParameters)
        {
            if (connection == null) throw new ArgumentNullException("connection");

            // Create a command and prepare it for execution
            SqlCommand cmd = new SqlCommand();

            bool mustCloseConnection = false;
            PrepareCommand(cmd, connection, (SqlTransaction)null, CommandType.StoredProcedure, spName, commandParameters, out mustCloseConnection);

            // Execute the command & return the results
            object retval = cmd.ExecuteScalar();

            // Detach the SqlParameters from the command object, so they can be used again
            cmd.Parameters.Clear();

            if (mustCloseConnection)
                connection.Close();

            return retval;
        }

        #endregion ExecuteScalarSP

        #region ExecuteXmlReaderSP

        public static XmlReader ExecuteXmlReaderSP(string spName, params SqlParameter[] commandParameters)
        {
            // Create & open a SqlConnection, and dispose of it after we are done
            using (SqlConnection connection = new SqlConnection())
            {
                //connection.Open();
                SqlConnectDB.OpenDBConnection(connection, SqlConnectDB.SessionConnectionID);


                // Call the overload that takes a connection in place of the connection string
                return ExecuteXmlReaderSP(connection, spName, commandParameters);
            }
        }

        public static XmlReader ExecuteXmlReaderSP(string spName)
        {

            // Pass through the call providing null for the set of SqlParameters
            return ExecuteXmlReaderSP(spName, (SqlParameter[])null);
        }

        private static XmlReader ExecuteXmlReaderSP(SqlConnection connection, string spName, params SqlParameter[] commandParameters)
        {
            if (connection == null) throw new ArgumentNullException("connection");

            bool mustCloseConnection = false;
            // Create a command and prepare it for execution
            SqlCommand cmd = new SqlCommand();
            try
            {
                PrepareCommand(cmd, connection, (SqlTransaction)null, CommandType.StoredProcedure, spName, commandParameters, out mustCloseConnection);

                // Create the DataAdapter & DataSet
                XmlReader retval = cmd.ExecuteXmlReader();

                // Detach the SqlParameters from the command object, so they can be used again
                cmd.Parameters.Clear();

                return retval;
            }
            catch
            {
                if (mustCloseConnection)
                    connection.Close();
                throw;
            }
        }

        #endregion ExecuteXmlReaderSP

        #region CreateCommand

        /// <summary>
        /// Simplify the creation of a Sql command object by allowing
        /// a stored procedure and optional parameters to be provided
        /// </summary>
        /// <remarks>
        /// e.g.:  
        ///  SqlCommand command = CreateCommand(conn, "AddCustomer", "CustomerID", "CustomerName");
        /// </remarks>
        /// <param name="connection">A valid SqlConnection object</param>
        /// <param name="spName">The name of the stored procedure</param>
        /// <param name="sourceColumns">An array of string to be assigned as the source columns of the stored procedure parameters</param>
        /// <returns>A valid SqlCommand object</returns>
        private static SqlCommand CreateCommand(SqlConnection connection, string spName, params string[] sourceColumns)
        {
            if (connection == null) throw new ArgumentNullException("connection");
            if (spName == null || spName.Length == 0) throw new ArgumentNullException("spName");

            // Create a SqlCommand
            SqlCommand cmd = new SqlCommand(spName, connection);
            cmd.CommandType = CommandType.StoredProcedure;

            // If we receive parameter values, we need to figure out where they go
            if ((sourceColumns != null) && (sourceColumns.Length > 0))
            {
                // Pull the parameters for this stored procedure from the parameter cache (or discover them & populate the cache)
                SqlParameter[] commandParameters = SqlDataAccessParameterCache.GetSpParameterSet(connection, spName);

                // Assign the provided source columns to these parameters based on parameter order
                for (int index = 0; index < sourceColumns.Length; index++)
                    commandParameters[index].SourceColumn = sourceColumns[index];

                // Attach the discovered parameters to the SqlCommand object
                AttachParameters(cmd, commandParameters);
            }
            return cmd;
        }
        #endregion

        /// <summary>
        /// Odeya katz add this method 
        /// </summary>
        /// <param name="parameters">contain list of Ids for multi select from DB</param>
        /// <returns>return the array in string with Commas</returns>
        public static string CreateCommasParameterFromArray(int[] parameters)
        {
            if (parameters == null || parameters.Length == 0)
                return null;
            string s = "";
            foreach (int item in parameters)
            {
                s += item.ToString() + ",";
            }
            return s;
        }
    }

    public sealed class SqlConnectDB
    {

        static SqlConnectDB()
        {
            InitSessionConnection();
            //iSessionConnectionServerId = -1;
        }

        //private static string hostName = System.Web.Hosting.HostingEnvironment.ApplicationHost.GetSiteName();

        public delegate void ReloginHandler();
        public static event ReloginHandler Relogin;
        public static event ReloginHandler ReloginForBackDB;


        private static int iSessionConnectionServerId;

        public static void InitSessionConnection()
        {
            iSessionConnectionServerId = -1;
        }

        public static int SessionConnectionID
        {
            get
            {
                return iSessionConnectionServerId;
            }
            set
            {
                iSessionConnectionServerId = value;
            }
        }

        //private static string GetConfigSettingByHost(string key)
        //{
        //    //return key;
        //    switch (SqlConnectDB.hostName)
        //    {
        //        case "Default Web Site":
        //            return key + "-local";

        //        case "QA":
        //            return key + "-qa";

        //        case "WS":
        //            return key + "-live";

        //    }
        //    return "";
        //}

        private static string GetConnectionString(int iConnectionServerID, bool bKeepSessionConnection, string nvDataBaseName)
        {
            int liConnectionServerID = iConnectionServerID;
            string sLogin = ConfigSettings.ReadSetting("Login");
            string sPassword = ConfigSettings.ReadSetting(Config.GetConfigSettingByHost("Password"));
            string sDBServer = "";
            string sdatabasename = ConfigSettings.ReadSetting(Config.GetConfigSettingByHost(nvDataBaseName));

            //get the relevant ConnectionServerId
            if (iConnectionServerID == -1)
                liConnectionServerID = Convert.ToInt32(ConfigSettings.ReadSetting("ConnectionServerID"));
            if (liConnectionServerID == -1)
                throw new Exception("No Database Configurate to be connected (ConnectionServerID = -1).");


            //get the relevant Server Name
            if (liConnectionServerID == 0)
                sDBServer = ConfigSettings.ReadSetting(Config.GetConfigSettingByHost("DBServer"));
            else
                sDBServer = ConfigSettings.ReadSetting(Config.GetConfigSettingByHost("AlternativeServer" + liConnectionServerID.ToString()));

            //keep the current session server id
            if (bKeepSessionConnection)
                SqlConnectDB.SessionConnectionID = liConnectionServerID;

            //build and return the connection string
            return "Server=" + sDBServer + ";Database=" + sdatabasename +
                ";User ID=" + sLogin + ";Password=" + sPassword + ";Trusted_Connection=False;Connection Timeout=600";

        }

        private static string GetConnectionString(int iConnectionServerID, bool bKeepSessionConnection)
        {
            int liConnectionServerID = iConnectionServerID;
            string sLogin = ConfigSettings.ReadSetting("Login");
            string sPassword = ConfigSettings.ReadSetting("Password");
            string sDBServer = "";
            string sdatabasename = ConfigSettings.ReadSetting("DataBaseName");

            //get the relevant ConnectionServerId
            if (iConnectionServerID == -1)
                liConnectionServerID = Convert.ToInt32(ConfigSettings.ReadSetting("ConnectionServerID"));
            if (liConnectionServerID == -1)
                throw new Exception("No Database Configurate to be connected (ConnectionServerID = -1).");


            //get the relevant Server Name
            if (liConnectionServerID == 0)
                sDBServer = ConfigSettings.ReadSetting(Config.GetConfigSettingByHost("DBServer"));
            else
                sDBServer = ConfigSettings.ReadSetting("AlternativeServer");

            //keep the current session server id
            if (bKeepSessionConnection)
                SqlConnectDB.SessionConnectionID = liConnectionServerID;

            //build and return the connection string
            return "Server=" + sDBServer + ";Database=" + sdatabasename +
                ";User ID=" + sLogin + ";Password=" + sPassword + ";Trusted_Connection=False;Connection Timeout=600";

        }

        public static void OpenDBConnection(SqlConnection connection, int iConnectionServerID)
        {
            string sTryBackToMainServer = "";
            string sConfigConnectionServerID = "";
            int iAlternativeServersNumber;
            int iTryingConnectionServerID;
            bool bShouldRelogin = false;


            //try to back to main server in case of alternative server is the working server
            sTryBackToMainServer = ConfigSettings.ReadSetting("TryBackToMainServer");
            sConfigConnectionServerID = ConfigSettings.ReadSetting("ConnectionServerID");
            Thread workerThread;
            SqlConnectDB oSqlConnectDB = new SqlConnectDB();

            if (Convert.ToInt32(sTryBackToMainServer) == 1 && Convert.ToInt32(sConfigConnectionServerID) > 0)
            {
                workerThread = new Thread(oSqlConnectDB.CheckDBServerAvailability);
                workerThread.Start(0);
            }
            //bDBServerAvailability = CheckDBServerAvailability(0); 
            //change the current server id to main in config only
            //if (bDBServerAvailability)
            //{
            //    ConfigSettings.WriteSetting("ConnectionServerID", "0");
            //    ConfigurationManager.RefreshSection("appSettings");
            //    MessageBox.Show("Application back to work on main Database.Close and Login to application again please.");
            //}

            //try to open connection 
            iAlternativeServersNumber = Convert.ToInt32(ConfigSettings.ReadSetting("AlternativeServersNumber"));
            if (SqlConnectDB.SessionConnectionID == -1)   //first time in session
                iTryingConnectionServerID = Convert.ToInt32(ConfigSettings.ReadSetting("ConnectionServerID"));
            else
                iTryingConnectionServerID = SqlConnectDB.SessionConnectionID;

            for (int i = 0; i < iAlternativeServersNumber + 1; i++)
            {
                try
                {
                    connection.ConnectionString = GetConnectionString(iTryingConnectionServerID, false);
                    //  MessageBox.Show("going connect to ID:  " + iTryingConnectionServerID.ToString());
                    connection.Open();
                    if (SqlConnectDB.SessionConnectionID == -1)// init the session connectionID in case of the first time the open success since the login of user(the session connectionserver ID=-1) 
                        SqlConnectDB.SessionConnectionID = iTryingConnectionServerID;
                    if (SqlConnectDB.SessionConnectionID != iTryingConnectionServerID || iTryingConnectionServerID != Convert.ToInt32(sConfigConnectionServerID))
                    {// is  not the same connectionID that in session so the connection session should be changed and the user should relogin
                        ConfigSettings.WriteSetting("ConnectionServerID", iTryingConnectionServerID.ToString());
                        ConfigurationManager.RefreshSection("appSettings");
                        if (SqlConnectDB.SessionConnectionID != iTryingConnectionServerID)
                            bShouldRelogin = true;
                        //MessageBox.Show("you should close the applicatio and login again because change of Connection ID to " + iTryingConnectionServerID.ToString());
                    }
                    break;
                }

                catch { }

                if ((iTryingConnectionServerID + 1) > iAlternativeServersNumber)
                    iTryingConnectionServerID = 0;
                else
                    iTryingConnectionServerID = iTryingConnectionServerID + 1;
            }

            if (bShouldRelogin)
                if (Relogin != null)
                {
                    Relogin();
                }

            //MessageBox.Show("you should close the applicatio and login again because change of Connection ID to " + iTryingConnectionServerID.ToString());
            //throw new Exception("you should close the applicatio and login again because change of Connection ID to " + iTryingConnectionServerID.ToString());


        }

        #region EEEEEEEEEEEEEEEEEE

        #endregion

        public static void OpenDBConnection(SqlConnection connection, int iConnectionServerID, string nvDataBaseName)
        {
            string sTryBackToMainServer = "";
            string sConfigConnectionServerID = "";
            int iAlternativeServersNumber;
            int iTryingConnectionServerID;
            bool bShouldRelogin = false;


            //try to back to main server in case of alternative server is the working server
            sTryBackToMainServer = ConfigSettings.ReadSetting("TryBackToMainServer");
            sConfigConnectionServerID = ConfigSettings.ReadSetting("ConnectionServerID");
            Thread workerThread;
            SqlConnectDB oSqlConnectDB = new SqlConnectDB();

            if (Convert.ToInt32(sTryBackToMainServer) == 1 && Convert.ToInt32(sConfigConnectionServerID) > 0)
            {
                workerThread = new Thread(oSqlConnectDB.CheckDBServerAvailability);
                workerThread.Start(0);
            }
            //bDBServerAvailability = CheckDBServerAvailability(0); 
            //change the current server id to main in config only
            //if (bDBServerAvailability)
            //{
            //    ConfigSettings.WriteSetting("ConnectionServerID", "0");
            //    ConfigurationManager.RefreshSection("appSettings");
            //    MessageBox.Show("Application back to work on main Database.Close and Login to application again please.");
            //}

            //try to open connection 
            iAlternativeServersNumber = Convert.ToInt32(ConfigSettings.ReadSetting("AlternativeServersNumber"));
            if (SqlConnectDB.SessionConnectionID == -1)   //first time in session
                iTryingConnectionServerID = Convert.ToInt32(ConfigSettings.ReadSetting("ConnectionServerID"));
            else
                iTryingConnectionServerID = SqlConnectDB.SessionConnectionID;

            for (int i = 0; i < iAlternativeServersNumber + 1; i++)
            {
                try
                {
                    connection.ConnectionString = GetConnectionString(iTryingConnectionServerID, false, nvDataBaseName);
                    //  MessageBox.Show("going connect to ID:  " + iTryingConnectionServerID.ToString());
                    connection.Open();
                    if (SqlConnectDB.SessionConnectionID == -1)// init the session connectionID in case of the first time the open success since the login of user(the session connectionserver ID=-1) 
                        SqlConnectDB.SessionConnectionID = iTryingConnectionServerID;
                    if (SqlConnectDB.SessionConnectionID != iTryingConnectionServerID || iTryingConnectionServerID != Convert.ToInt32(sConfigConnectionServerID))
                    {// is  not the same connectionID that in session so the connection session should be changed and the user should relogin
                        ConfigSettings.WriteSetting("ConnectionServerID", iTryingConnectionServerID.ToString());
                        ConfigurationManager.RefreshSection("appSettings");
                        if (SqlConnectDB.SessionConnectionID != iTryingConnectionServerID)
                            bShouldRelogin = true;
                        //MessageBox.Show("you should close the applicatio and login again because change of Connection ID to " + iTryingConnectionServerID.ToString());
                    }
                    break;
                }

                catch { }

                if ((iTryingConnectionServerID + 1) > iAlternativeServersNumber)
                    iTryingConnectionServerID = 0;
                else
                    iTryingConnectionServerID = iTryingConnectionServerID + 1;
            }

            if (bShouldRelogin)
                if (Relogin != null)
                {
                    Relogin();
                }

            //MessageBox.Show("you should close the applicatio and login again because change of Connection ID to " + iTryingConnectionServerID.ToString());
            //throw new Exception("you should close the applicatio and login again because change of Connection ID to " + iTryingConnectionServerID.ToString());


        }

        #region EEEEEEEEEEEEEEEEEE
        
        #endregion

        private void CheckDBServerAvailability(object obConnectionServerID)
        {
            int iConnectionServerID = (int)obConnectionServerID;
            SqlConnection TestConn = new SqlConnection();
            TestConn.ConnectionString = GetConnectionString(iConnectionServerID, false);
            try
            {
                TestConn.Open();
                TestConn.Close();
                ConfigSettings.WriteSetting("ConnectionServerID", iConnectionServerID.ToString());
                ConfigurationManager.RefreshSection("appSettings");
                ReloginForBackDB();
                // MessageBox.Show("Application back to work on main Database.Close and Login to application again please.");

                //return true;
            }
            catch { }

        }
    }

    public class ConfigSettings
    {
        private ConfigSettings() { }

        public static string ReadSetting(string key)
        {
            //return ConfigurationSettings.AppSettings[key];
            return ConfigurationManager.AppSettings[key];
        }

        public static void WriteSetting(string key, string value)
        {
            // load config document for current assembly
            XmlDocument doc = loadConfigDocument();
            // retrieve appSettings node
            XmlNode node = doc.SelectSingleNode("//configuration");



            if (node == null)
            {
                throw new InvalidOperationException("appSettings section not found in config file.");
            }
            try
            {
                // select the 'add' element that contains the key
                XmlElement elem = (XmlElement)node.SelectSingleNode(string.Format("appSettings//add[@key='{0}']", key));

                if (elem != null)
                {
                    // add value for key
                    elem.SetAttribute("value", value);
                }
                else
                {
                    // key was not found so create the 'add' element 
                    // and set it's key/value attributes 
                    elem = doc.CreateElement("add");
                    elem.SetAttribute("key", key);
                    elem.SetAttribute("value", value);
                    node.AppendChild(elem);
                }
                doc.Save(getConfigFilePath());
            }
            catch
            {
                throw;
            }
        }

        public static void RemoveSetting(string key)
        {
            // load config document for current assembly
            XmlDocument doc = loadConfigDocument();

            // retrieve appSettings node
            XmlNode node = doc.SelectSingleNode("//appSettings");

            try
            {
                if (node == null)
                    throw new InvalidOperationException("appSettings section not found in config file.");
                else
                {
                    // remove 'add' element with coresponding key
                    node.RemoveChild(node.SelectSingleNode(string.Format("//add[@key='{0}']", key)));
                    doc.Save(getConfigFilePath());
                }
            }
            catch (NullReferenceException e)
            {
                throw new Exception(string.Format("The key {0} does not exist.", key), e);
            }
        }

        private static XmlDocument loadConfigDocument()
        {
            XmlDocument doc = null;
            try
            {
                doc = new XmlDocument();
                doc.Load(getConfigFilePath());
                return doc;
            }
            catch (System.IO.FileNotFoundException e)
            {
                throw new Exception("No configuration file found.", e);
            }
        }

        private static string getConfigFilePath()
        {
            string sPath = AppDomain.CurrentDomain.SetupInformation.ConfigurationFile;// AppDomain.CurrentDomain.GetData("APP_CONFIG_FILE").ToString();
            //sPath = sPath.Replace(".vshost", "");
            // string sPath = Assembly.GetCallingAssembly().Location + ".config";
            return sPath;
        }
    }

    /// <summary>
    /// SqlDataAccessParameterCache provides functions to leverage a static cache of procedure parameters, and the
    /// ability to discover parameters for stored procedures at run-time.
    /// </summary>
    public sealed class SqlDataAccessParameterCache
    {
        #region private methods, variables, and constructors

        //Since this class provides only static methods, make the default constructor private to prevent 
        //instances from being created with "new SqlDataAccessParameterCache()"
        private SqlDataAccessParameterCache() { }

        private static Hashtable paramCache = Hashtable.Synchronized(new Hashtable());

        /// <summary>
        /// Resolve at run time the appropriate set of SqlParameters for a stored procedure
        /// </summary>
        /// <param name="connection">A valid SqlConnection object</param>
        /// <param name="spName">The name of the stored procedure</param>
        /// <param name="includeReturnValueParameter">Whether or not to include their return value parameter</param>
        /// <returns>The parameter array discovered.</returns>
        private static SqlParameter[] DiscoverSpParameterSet(SqlConnection connection, string spName, bool includeReturnValueParameter)
        {
            if (connection == null) throw new ArgumentNullException("connection");
            if (spName == null || spName.Length == 0) throw new ArgumentNullException("spName");

            SqlCommand cmd = new SqlCommand(spName, connection);
            cmd.CommandType = CommandType.StoredProcedure;

            connection.Open();
            SqlCommandBuilder.DeriveParameters(cmd);
            connection.Close();

            if (!includeReturnValueParameter)
                cmd.Parameters.RemoveAt(0);

            SqlParameter[] discoveredParameters = new SqlParameter[cmd.Parameters.Count];

            cmd.Parameters.CopyTo(discoveredParameters, 0);

            // Init the parameters with a DBNull value
            foreach (SqlParameter discoveredParameter in discoveredParameters)
                discoveredParameter.Value = DBNull.Value;
            return discoveredParameters;
        }

        /// <summary>
        /// Deep copy of cached SqlParameter array
        /// </summary>
        /// <param name="originalParameters"></param>
        /// <returns></returns>
        private static SqlParameter[] CloneParameters(SqlParameter[] originalParameters)
        {
            SqlParameter[] clonedParameters = new SqlParameter[originalParameters.Length];
            for (int i = 0, j = originalParameters.Length; i < j; i++)
                clonedParameters[i] = (SqlParameter)((ICloneable)originalParameters[i]).Clone();
            return clonedParameters;
        }

        #endregion private methods, variables, and constructors

        #region caching functions

        /// <summary>
        /// Add parameter array to the cache
        /// </summary>
        /// <param name="connectionString">A valid connection string for a SqlConnection</param>
        /// <param name="spName">The stored procedure name or T-SQL command</param>
        /// <param name="commandParameters">An array of SqlParamters to be cached</param>
        public static void CacheParameterSet(string connectionString, string spName, params SqlParameter[] commandParameters)
        {
            if (connectionString == null || connectionString.Length == 0) throw new ArgumentNullException("connectionString");
            if (spName == null || spName.Length == 0) throw new ArgumentNullException("spName");
            string hashKey = connectionString + ":" + spName;
            paramCache[hashKey] = commandParameters;
        }

        /// <summary>
        /// Retrieve a parameter array from the cache
        /// </summary>
        /// <param name="connectionString">A valid connection string for a SqlConnection</param>
        /// <param name="spName">The stored procedure name or T-SQL command</param>
        /// <returns>An array of SqlParamters</returns>
        public static SqlParameter[] GetCachedParameterSet(string connectionString, string spName)
        {
            if (connectionString == null || connectionString.Length == 0) throw new ArgumentNullException("connectionString");
            if (spName == null || spName.Length == 0) throw new ArgumentNullException("spName");

            string hashKey = connectionString + ":" + spName;

            SqlParameter[] cachedParameters = paramCache[hashKey] as SqlParameter[];
            if (cachedParameters == null)
                return null;
            else
                return CloneParameters(cachedParameters);
        }

        #endregion caching functions

        #region Parameter Discovery Functions

        /// <summary>
        /// Retrieves the set of SqlParameters appropriate for the stored procedure
        /// </summary>
        /// <remarks>
        /// This method will query the database for this information, and then store it in a cache for future requests.
        /// </remarks>
        /// <param name="connectionString">A valid connection string for a SqlConnection</param>
        /// <param name="spName">The name of the stored procedure</param>
        /// <returns>An array of SqlParameters</returns>
        public static SqlParameter[] GetSpParameterSet(string connectionString, string spName)
        {
            return GetSpParameterSet(connectionString, spName, false);
        }

        /// <summary>
        /// Retrieves the set of SqlParameters appropriate for the stored procedure
        /// </summary>
        /// <remarks>
        /// This method will query the database for this information, and then store it in a cache for future requests.
        /// </remarks>
        /// <param name="connectionString">A valid connection string for a SqlConnection</param>
        /// <param name="spName">The name of the stored procedure</param>
        /// <param name="includeReturnValueParameter">A bool value indicating whether the return value parameter should be included in the results</param>
        /// <returns>An array of SqlParameters</returns>
        public static SqlParameter[] GetSpParameterSet(string connectionString, string spName, bool includeReturnValueParameter)
        {
            if (connectionString == null || connectionString.Length == 0) throw new ArgumentNullException("connectionString");
            if (spName == null || spName.Length == 0) throw new ArgumentNullException("spName");

            using (SqlConnection connection = new SqlConnection(connectionString))
                return GetSpParameterSetInternal(connection, spName, includeReturnValueParameter);
        }

        /// <summary>
        /// Retrieves the set of SqlParameters appropriate for the stored procedure
        /// </summary>
        /// <remarks>
        /// This method will query the database for this information, and then store it in a cache for future requests.
        /// </remarks>
        /// <param name="connection">A valid SqlConnection object</param>
        /// <param name="spName">The name of the stored procedure</param>
        /// <returns>An array of SqlParameters</returns>
        internal static SqlParameter[] GetSpParameterSet(SqlConnection connection, string spName)
        {
            return GetSpParameterSet(connection, spName, false);
        }

        /// <summary>
        /// Retrieves the set of SqlParameters appropriate for the stored procedure
        /// </summary>
        /// <remarks>
        /// This method will query the database for this information, and then store it in a cache for future requests.
        /// </remarks>
        /// <param name="connection">A valid SqlConnection object</param>
        /// <param name="spName">The name of the stored procedure</param>
        /// <param name="includeReturnValueParameter">A bool value indicating whether the return value parameter should be included in the results</param>
        /// <returns>An array of SqlParameters</returns>
        internal static SqlParameter[] GetSpParameterSet(SqlConnection connection, string spName, bool includeReturnValueParameter)
        {
            if (connection == null) throw new ArgumentNullException("connection");
            using (SqlConnection clonedConnection = (SqlConnection)((ICloneable)connection).Clone())
                return GetSpParameterSetInternal(clonedConnection, spName, includeReturnValueParameter);
        }

        /// <summary>
        /// Retrieves the set of SqlParameters appropriate for the stored procedure
        /// </summary>
        /// <param name="connection">A valid SqlConnection object</param>
        /// <param name="spName">The name of the stored procedure</param>
        /// <param name="includeReturnValueParameter">A bool value indicating whether the return value parameter should be included in the results</param>
        /// <returns>An array of SqlParameters</returns>
        private static SqlParameter[] GetSpParameterSetInternal(SqlConnection connection, string spName, bool includeReturnValueParameter)
        {
            if (connection == null) throw new ArgumentNullException("connection");
            if (spName == null || spName.Length == 0) throw new ArgumentNullException("spName");

            string hashKey = connection.ConnectionString + ":" + spName + (includeReturnValueParameter ? ":include ReturnValue Parameter" : "");

            SqlParameter[] cachedParameters;

            cachedParameters = paramCache[hashKey] as SqlParameter[];
            if (cachedParameters == null)
            {
                SqlParameter[] spParameters = DiscoverSpParameterSet(connection, spName, includeReturnValueParameter);
                paramCache[hashKey] = spParameters;
                cachedParameters = spParameters;
            }
            return CloneParameters(cachedParameters);
        }
        #endregion Parameter Discovery Functions
    }
}
