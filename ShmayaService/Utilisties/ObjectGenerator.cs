
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Reflection;
using System.Web;

namespace ShmayaService.Utilities
{
    public abstract class ObjectGenerator<T> where T : new()
    {


        //return T object full data from DataRow
        //Good for select queries
        public static T GeneratFromDataRow(DataRow dr)
        {
            T obj = new T();
            //all T object members repeat
            foreach (PropertyInfo property in obj.GetType().GetProperties())
            {
                //if the DataRow contain the current member
                if (dr.Table.Columns.Contains(property.Name))
                {
                    //specific cel contain the value
                    object cell = dr[property.Name];
                    //if for avoid exceptions and make sure that no defined "NoGetFromSQL" Attribute
                    if (cell != DBNull.Value && !Attribute.IsDefined(property, typeof(NoGetFromSQL)))
                    {
                        if (dr[property.Name].GetType().Name == "DateTime")
                            property.SetValue(obj, Convert.ChangeType(((DateTime)cell), typeof(DateTime)), null);
                        //else if (dr[property.Name].GetType().Name == "TimeSpan")
                        //    property.SetValue(obj, Convert.ChangeType(cell, typeof(TimeSpan)), null);

                            //http://stackoverflow.com/questions/9428333/how-to-convert-a-string-to-a-nullable-type-which-is-determined-at-runtime

                        else
                        //put DataRow specific cell value in the macth T object member, Note! write mach members name
                        //property.SetValue(obj, Convert.ChangeType(cell, property.PropertyType), null);
                        {
                            Type t = Nullable.GetUnderlyingType(property.PropertyType) ?? property.PropertyType;
                            property.SetValue(obj, Convert.ChangeType(cell, t));
                        }
                    }

                }
            }
            return obj;
        }

        //generate parameters list mach your T object members
        //Good for insert / update queries
        public static List<SqlParameter> GetSqlParametersFromObject(T obj)
        {
            List<SqlParameter> paremeters = new List<SqlParameter>();

            object safeValue = null;
            //all T object members repeat
            foreach (PropertyInfo property in obj.GetType().GetProperties())
            {
                //make sure that no defined "NoSendToSQL" Attribute
                if (!Attribute.IsDefined(property, typeof(NoSendToSQL)))
                //add parameter to list, Key is specific member name, Note! write mach procedure in SQL
                {

                    var prop = property.GetType().GetProperty(property.Name);
                    if (property != null)
                    {
                        Type t = Nullable.GetUnderlyingType(property.PropertyType) ?? property.PropertyType;

                        safeValue = (property.GetValue(obj, null) == null) ? null : Convert.ChangeType(property.GetValue(obj, null), t);

                        //property.SetValue(property, safeValue, null);
                    }



                    // type = property.PropertyType;
                    paremeters.Add(new SqlParameter(property.Name, safeValue));
                }
            }
            //optional, use it if your WS and DB support sessions
            //paremeters.Add(new SqlParameter("nvGuide", nvGuide));
            return paremeters;
        }

        public static SqlParameter GetDataTableParametersFromList(string parameterName, List<T> collection)
        {
            DataTable dt = new DataTable();
            Dictionary<string, Type> data = new Dictionary<string, Type>();
            List<T> objects = new List<T>();

            T obj = new T();
            //all T object members repeat
            foreach (PropertyInfo property in obj.GetType().GetProperties())
            {
                if (!Attribute.IsDefined(property, typeof(NoSendToSQL)))
                {
                    data.Add(property.Name == "date" ? "dDate" : property.Name, Nullable.GetUnderlyingType(property.PropertyType) ?? property.PropertyType);
                }
            }

            foreach (KeyValuePair<string, Type> item in data)
            {
                dt.Columns.Add(item.Key, item.Value);
            }


            foreach (T item in collection)
            {
                DataRow dr = dt.NewRow();
                foreach (KeyValuePair<string, Type> field in data)
                {
                    dr[field.Key.ToString()] = item.GetType().GetProperty(field.Key == "dDate" ? "date" : field.Key).GetValue(item, null);
                }

                dt.Rows.Add(dr);
            }

            return new SqlParameter(parameterName, dt);
        }

        //get DataSet, call GeneratFromDataRow() in repeat and return list T
        public static List<T> GeneratListFromDataRowCollection(DataRowCollection collection)
        {
            Dictionary<string, Type> data = new Dictionary<string, Type>();
            List<T> objects = new List<T>();
            if (collection.Count == 0) return objects;
            T obj = new T();
            //all T object members repeat
            foreach (PropertyInfo property in obj.GetType().GetProperties())
            {
                if (collection[0].Table.Columns.Contains(property.Name) && !Attribute.IsDefined(property, typeof(NoGetFromSQL)))
                {
                    //data.Add(property.Name, property.PropertyType);
                    data.Add(property.Name, Nullable.GetUnderlyingType(property.PropertyType) ?? property.PropertyType);
                }
            }

            foreach (DataRow dr in collection)
            {
                obj = new T();
                foreach (KeyValuePair<string, Type> item in data)
                {
                    object cell = dr[item.Key];
                    if (cell != DBNull.Value)
                    {
                        //property.SetValue(obj, Convert.ChangeType(((DateTime)cell), typeof(DateTime)), null);
                        //obj.item
                        //         Convert.ChangeType((dr[item.Key]),);
                        if (item.Value == typeof(DateTime))
                            obj.GetType().GetProperty(item.Key).SetValue(obj, Convert.ChangeType(((DateTime)dr[item.Key]), item.Value), null);
                        else
                            obj.GetType().GetProperty(item.Key).SetValue(obj, Convert.ChangeType(dr[item.Key], item.Value), null);
                        // object safeValue = (value == null) ? null : Convert.ChangeType(value, t);
                        //                    item.Key
                    }
                }
                objects.Add(obj);
            }





            ////optional, use it if your WS and DB support sessions
            //if (Convert.ToInt32(ds.Tables[0].Rows[0][0]) == 0)
            //    return null;
            //List<T> list = new List<T>();
            //foreach (DataRow dr in ds.Tables[1].Rows)
            //{
            //    list.Add(ObjectGenerator<T>.GeneratFromDataRow(dr));
            //}
            return objects;
        }

        public static List<T> GenerateSimpleIntList(DataRowCollection ds, string fieldName){
             List<T> result = new List<T>();
                foreach (DataRow dr in ds)
                    result.Add((T)Convert.ChangeType(dr[fieldName].ToString(), typeof(T)));
                    //result.Add(int.Parse(dr[].ToString()));
                return result;
        }

        public static SqlParameter GenerateSimpleDataTableFromList(List<T> collection, string typeName, string parameterName)
        {
            DataTable dt = new DataTable();
            dt.Columns.Add(typeName, typeof(T));

            foreach (T item in collection)
            {
                DataRow dr = dt.NewRow();
                dr[typeName] = item;
                dt.Rows.Add(dr);
            }
            return new SqlParameter(parameterName, dt);
        }
    }
}