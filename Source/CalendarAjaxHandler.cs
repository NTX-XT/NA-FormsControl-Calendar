using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Web;
using System.Text;
using System.Xml;
using System.Data;
using System.IO;
using System.Runtime.Serialization.Json;
using System.Runtime.Serialization;
using SourceCode.SmartObjects.Client;
using SourceCode.SmartObjects.Client.Filters;
using SourceCode.Forms.Controls.Web.SDK.Attributes;
using SourceCode.Forms.Controls.Web.Utilities;

namespace SourceCodeANZ.Forms.Controls
{
    [ClientAjaxHandler("CalendarAjaxHandler.handler")]
    public class CalendarAjaxHandler : IHttpHandler
    {
        #region IHttpHandler Members

        public bool IsReusable
        {
            get { return false; }
        }


        private string command;
        private Single utcoffset;
        private bool useServerZone;
        private string controlisreadonly;
        private string loaddataoninit;
        private string smartobjectname;
        private string smartobjectmethod;
        private string smartobjectvalueproperty;
        private string smartobjectdisplaytemplate;

        private string eventtitlefield;
        private string eventstartfield;
        private string eventendfield;
        private string eventalldayfield;
        private string eventeditablefield;
        private string eventsizeablefield;
        private string eventcolorfield;
        private string eventtypefield;
        private string eventdatasourcefield;
        private string eventdatasourceidfield;
        private string filterspec;
        private string methodparameters;

        private DateTime dStart;
        private DateTime dEnd;

        private string id;
        private string idfieldname;
        private string data_source;
        private string so_meth;
        private string title;
        private string sStart;
        private string sEnd;
        private string sAllDay;
        private string color;

        public void ProcessRequest(HttpContext context)
        {
            
            try
            {
                command = context.Request["command"];
                utcoffset = Convert.ToSingle(string.IsNullOrEmpty(context.Request["utcoffset"])?"0": context.Request["utcoffset"]);
                useServerZone = Convert.ToBoolean(string.IsNullOrEmpty(context.Request["useserverzone"]) ? "false" : context.Request["useserverzone"]);
                smartobjectname = context.Request["SmartObjectName"];
                smartobjectmethod = context.Request["SmartObjectMethod"];
                smartobjectvalueproperty = context.Request["SmartObjectValueProp"];
                smartobjectdisplaytemplate = context.Request["SmartObjectDisplayTemplate"];

                eventtitlefield = context.Request["EventTitleField"];
                eventstartfield = context.Request["EventStartField"];
                eventendfield = context.Request["EventEndField"];
                eventalldayfield = context.Request["EventAllDayField"];
                eventeditablefield = context.Request["EventEditableField"];
                eventsizeablefield = context.Request["EventSizeableField"];
                eventcolorfield = context.Request["EventColorField"];
                eventtypefield = context.Request["EventTypeField"];
                eventdatasourcefield = context.Request["EventDataSourceField"];
                eventdatasourceidfield = context.Request["EventDataSourceIDfield"];

                if (smartobjectname == null)
                    throw new Exception("No DataSource was specified.");
                if (command == "GetList")
                {
                    dStart = Convert.ToDateTime(context.Request["start"]);
                    dEnd = Convert.ToDateTime(context.Request["end"]);

                    controlisreadonly = context.Request["ControlIsReadOnly"];
                    loaddataoninit = context.Request["LoadDataOnInt"];
                    filterspec = context.Request["FilterSpec"];
                    methodparameters = context.Request["MethodParameters"];
                    if (loaddataoninit.ToLower() == "true")
                    {
                        context.Response.Write(getListData());
                    }
                    else
                    {
                        context.Response.Write(string.Empty);
                    }
                }
                if (command == "Create" || command == "Update")
                {
                    id = (command == "Create") ? null : context.Request["id"];
                    idfieldname = context.Request["idfieldname"];
                    data_source = context.Request["data_source"];
                    so_meth = (command == "Create") ? context.Request["SOCreateMethod"] : context.Request["SOSaveMethod"];
                    title = context.Request["title"];
                    sStart = context.Request["startAsDate"];
                    sEnd = string.IsNullOrEmpty(context.Request["endAsDate"]) ? sStart : context.Request["endAsDate"];
                    sAllDay = context.Request["allDayAsBool"];
                    color = context.Request["color"];
                    context.Response.Write(saveData());
                }
            }
            catch (Exception ex)
            {
                context.Response.StatusCode = 500;
                context.Response.Write(ex.Message);
            }
        }


        private string getListData()
        {
            string retString = string.Empty;
            SmartObjectClientServer smartObjectClient;
            SmartObject smartObject;
            smartObjectClient = ConnectionClass.GetSmartObjectClient();
            List<DisplayTemplateItem> displaystring = new List<DisplayTemplateItem>();
            Guid smoGUID = new Guid(smartobjectname);
            smartObject = smartObjectClient.GetSmartObject(smoGUID);
            if (!smartObject.ListMethods.Contains(smartobjectmethod))
            {
                throw new Exception("Specified List Method was not found on SmartObject.");
            }
            SmartListMethod method = smartObject.ListMethods[smartobjectmethod];
            XmlDocument xDispTemplate = new XmlDocument();
            xDispTemplate.PreserveWhitespace = true;
            xDispTemplate.LoadXml(smartobjectdisplaytemplate);
            XmlNodeList objectpropertynodes = xDispTemplate.GetElementsByTagName("Item");

            foreach (XmlNode item in objectpropertynodes)
            {
                if (item.Attributes["SourceType"].Value.ToLower() == "objectproperty")
                {
                    string smofield = item.Attributes["SourceID"].Value;
                    displaystring.Add(new DisplayTemplateItem("SMOFIELD", smofield));
                }
                else if (item.Attributes["SourceType"].Value.ToLower() == "value")
                {
                    displaystring.Add(new DisplayTemplateItem("TEXT", item.SelectSingleNode("SourceValue").InnerText));
                }
            }

            SmartObjectReader reader = null;
            StringBuilder sb = new StringBuilder();
            sb.Append("[");

            string sqlquery = string.Format("select * from {0}.{1} where {2} between '{4:yyyy-MM-dd HH:mm}' and '{5:yyyy-MM-dd HH:mm}' or {3} between '{4:yyyy-MM-dd HH:mm}' and '{5:yyyy-MM-dd HH:mm}'",
                        smartObject.Name,   //0
                        method.Name,        //1
                        eventstartfield,    //2
                        eventendfield,      //3
                        dStart.AddDays(-1), //4
                        dEnd.AddDays(1));   //5


            string[] stringSep1 = new string[] { "==" };
            string[] stringSep2 = new string[] { "&&" };

            string sqlquery2 = string.Empty;


            if (!string.IsNullOrEmpty(filterspec) && filterspec.Contains("=="))
            {
                string[] filterparts = filterspec.Split(stringSep2, StringSplitOptions.RemoveEmptyEntries);
                foreach (string filterpart in filterparts)
                {
                    string[] opers = filterpart.Trim().Split(stringSep1, StringSplitOptions.RemoveEmptyEntries);
                    string smoProp = opers[0];
                    if (smartObject.Properties.GetIndexbyName(smoProp) >= 0)
                    {
                        if (smartObject.Properties[smoProp].Type == PropertyType.Text || smartObject.Properties[smoProp].Type == PropertyType.Memo)
                        {
                            sqlquery2 += string.Format(" AND {0} like '%{1}%'", opers[0], opers[1]);
                        }
                        else if (smartObject.Properties[smoProp].Type == PropertyType.DateTime)
                        {
                            sqlquery2 += string.Format(" AND {0} = '{1}'", opers[0], opers[1]);
                        }
                        else
                        {
                            sqlquery2 += string.Format(" AND {0} = {1}", opers[0], opers[1]);
                        }

                    }
                 }
            }


            if (!string.IsNullOrEmpty(filterspec) && !filterspec.Contains("=="))
            {
                if (filterspec.ToLower().Substring(0, 6) == "where ")
                    filterspec = filterspec.Substring(6);
                sqlquery2 += " AND (" + filterspec + " )";
            }

            if (!string.IsNullOrEmpty(sqlquery2))
                sqlquery += sqlquery2;



            if (method.Parameters.Count > 0)
            {
                if (!string.IsNullOrEmpty(methodparameters))
                {
                    methodparameters = " having "+methodparameters;
                    methodparameters = methodparameters.Replace("|", " and ");
                    methodparameters = methodparameters.Replace("[CalendarStart]", dStart.ToString("yyyy-MM-dd HH:mm"));
                    methodparameters = methodparameters.Replace("[CalendarEnd]", dEnd.ToString("yyyy-MM-dd HH:mm"));
                    sqlquery += methodparameters;
                }
                else
                    throw new Exception("List Method Requires Parameters but none were specified. ");
            }

            reader = smartObjectClient.ExecuteSQLQueryReader(sqlquery);

            string sUTCoffset = (utcoffset >= 0 ? "+" : "-") + TimeSpan.FromHours(utcoffset).ToString("hh\\:mm");
            TimeZoneInfo clientZone = TimeZoneInfo.CreateCustomTimeZone("clientZone", TimeSpan.FromHours(utcoffset), "clientZone", "clientZone");

            while (reader.Read())
            {
                CalendarResponseItem respitem = new CalendarResponseItem();
                string disp = string.Empty;
                foreach (DisplayTemplateItem dti in displaystring)
                {
                    disp += string.Format("{0}", (dti.ItemType == "SMOFIELD") ? reader[dti.ItemValue] : dti.ItemValue);
                }
                respitem.title = disp;
                respitem.id = reader[smartobjectvalueproperty].ToString();

                if (string.IsNullOrEmpty(eventalldayfield) && eventstartfield.ToLower() != eventendfield.ToLower())
                    respitem.allDay = false;
                else if (string.IsNullOrEmpty(eventalldayfield) && eventstartfield.ToLower() == eventendfield.ToLower())
                    respitem.allDay = true;
                else
                {
                    if (smartObject.Properties.GetIndexbyName(eventalldayfield) >= 0)
                        respitem.allDay = Convert.ToBoolean(string.IsNullOrEmpty(reader[eventalldayfield].ToString()) ? "false" : reader[eventalldayfield].ToString().ToLower());
                    else
                        throw new Exception("Specified Field " + eventalldayfield + " was not found on SmartObject.");
                }

                if (smartObject.Properties.GetIndexbyName(eventstartfield) >= 0)
                {
                    DateTime dStartServer = (DateTime)reader[eventstartfield];
                    DateTime dStartClient = TimeZoneInfo.ConvertTime(dStartServer, TimeZoneInfo.Local, clientZone);
                    respitem.start = string.Format("{0:yyyy-MM-ddTHH:mm}{1}", (useServerZone ? dStartServer : dStartClient), sUTCoffset);
                }
                else
                    throw new Exception("Specified Field " + eventstartfield + " was not found on SmartObject.");

                if (smartObject.Properties.GetIndexbyName(eventendfield) >= 0)
                {
                    DateTime dEndServer = (DateTime)reader[eventendfield];
                    if (respitem.allDay)
                        dEndServer = dEndServer.AddDays(1);
                    DateTime dEndClient = TimeZoneInfo.ConvertTime(dEndServer, TimeZoneInfo.Local, clientZone);
                    respitem.end = string.Format("{0:yyyy-MM-ddTHH:mm}{1}", (useServerZone ? dEndServer : dEndClient), sUTCoffset);
                }
                else
                    throw new Exception("Specified Field " + eventendfield + " was not found on SmartObject.");

                respitem.url = string.Empty;

                
                if (controlisreadonly != "true")
                {
                    if (!string.IsNullOrEmpty(eventeditablefield) && smartObject.Properties.GetIndexbyName(eventeditablefield) >= 0)
                        respitem.editable = Convert.ToBoolean(reader[eventeditablefield]);
                    else
                        respitem.editable = true;

                    if (!string.IsNullOrEmpty(eventsizeablefield) && smartObject.Properties.GetIndexbyName(eventsizeablefield) >= 0)
                        respitem.durationEditable = Convert.ToBoolean(reader[eventsizeablefield]);
                    else
                        respitem.durationEditable = true;
                }
                else
                {
                    respitem.editable = false;
                    respitem.durationEditable = false;
                }

                if (!string.IsNullOrEmpty(eventcolorfield) && smartObject.Properties.GetIndexbyName(eventcolorfield) >= 0 && !string.IsNullOrEmpty(reader[eventcolorfield].ToString()))
                    respitem.color = reader[eventcolorfield].ToString();
                else
                    respitem.color = "#d9e57f";

                if (!string.IsNullOrEmpty(eventtypefield) && smartObject.Properties.GetIndexbyName(eventtypefield) >= 0 && !string.IsNullOrEmpty(reader[eventtypefield].ToString()))
                    respitem.eventtype = reader[eventtypefield].ToString();

                if (!string.IsNullOrEmpty(eventdatasourcefield) && smartObject.Properties.GetIndexbyName(eventdatasourcefield) >= 0 && !string.IsNullOrEmpty(reader[eventdatasourcefield].ToString()))
                    respitem.eventdatasource = reader[eventdatasourcefield].ToString();
                else
                    respitem.eventdatasource = smoGUID.ToString();

                if (!string.IsNullOrEmpty(eventdatasourceidfield) && smartObject.Properties.GetIndexbyName(eventdatasourceidfield) > 0 && !string.IsNullOrEmpty(reader[eventdatasourceidfield].ToString()))
                    respitem.eventdatasourceid = reader[eventdatasourceidfield].ToString();
                else
                    respitem.eventdatasourceid = smartobjectvalueproperty;

                DataContractJsonSerializer ser = new DataContractJsonSerializer(typeof(CalendarResponseItem));
                MemoryStream stream1 = new MemoryStream();
                ser.WriteObject(stream1, respitem);
                stream1.Position = 0;
                StreamReader sr = new StreamReader(stream1);
                sb.Append(sr.ReadToEnd());
                sb.Append(",");
            }
            if (sb.Length > 2)
                sb.Remove(sb.Length - 1, 1);
            sb.Append("]");
            retString = sb.ToString();
            return retString;
        }


        private string saveData()
        {
            bool lDoExecute = true;
            string retString = string.Empty;
            SmartObjectClientServer smartObjectClient;
            SmartObject smartObject;
            SmartObject soResult;
            smartObjectClient = ConnectionClass.GetSmartObjectClient();
            List<DisplayTemplateItem> displaystring = new List<DisplayTemplateItem>();
            Guid smoGUID = new Guid(data_source);
            smartObject = smartObjectClient.GetSmartObject(smoGUID);
            if (!smartObject.Methods.Contains(so_meth))
            {
                lDoExecute = false;
                //throw new Exception(string.Format("Specified Method ({0}) was not found on SmartObject.",so_meth));
            }
            if (lDoExecute)
            {
                SmartMethod method = smartObject.Methods[so_meth];
                smartObject.MethodToExecute = method.Name;
                if (!string.IsNullOrEmpty(id))
                    smartObject.Properties[idfieldname].Value = id;
                if (command == "Create")
                {
                    if (smartObject.Properties.GetIndexbyName(eventtitlefield) > 0)
                        smartObject.Properties[eventtitlefield].Value = title;

                    if (!string.IsNullOrEmpty(eventcolorfield) && smartObject.Properties.GetIndexbyName(eventcolorfield) > 0)
                        smartObject.Properties[eventcolorfield].Value = color;
                }
                if (smartObject.Properties.GetIndexbyName(eventstartfield) >= 0)
                    smartObject.Properties[eventstartfield].Value = sStart;

                if (smartObject.Properties.GetIndexbyName(eventendfield) >= 0)
                    smartObject.Properties[eventendfield].Value = sEnd;

                if (!string.IsNullOrEmpty(eventalldayfield) && smartObject.Properties.GetIndexbyName(eventalldayfield) >= 0)
                    smartObject.Properties[eventalldayfield].Value = sAllDay;

                if (!string.IsNullOrEmpty(eventeditablefield) && smartObject.Properties.GetIndexbyName(eventeditablefield) > 0)
                    smartObject.Properties[eventeditablefield].Value = true.ToString();

                if (!string.IsNullOrEmpty(eventsizeablefield) && smartObject.Properties.GetIndexbyName(eventsizeablefield) > 0)
                    smartObject.Properties[eventsizeablefield].Value = true.ToString();
                soResult = smartObjectClient.ExecuteScalar(smartObject);
            }
            else
                soResult = null;

            CalendarResponseItem respitem = new CalendarResponseItem();
            respitem.id = soResult != null ? soResult.Properties[idfieldname].Value : id;
            respitem.allDay = Convert.ToBoolean(sAllDay);
            respitem.color = color;
            respitem.end = sEnd;
            respitem.start = sStart;
            respitem.title = title;

            StringBuilder sb = new StringBuilder();
            sb.Append("[");
 
            DataContractJsonSerializer ser = new DataContractJsonSerializer(typeof(CalendarResponseItem));
            MemoryStream stream1 = new MemoryStream();
            ser.WriteObject(stream1, respitem);
            stream1.Position = 0;
            StreamReader sr = new StreamReader(stream1);
            sb.Append(sr.ReadToEnd());

            sb.Append("]");

            retString = sb.ToString();
            return retString;
        }


        #endregion
    }

    [DataContract]
    internal class CalendarResponseItem
    {
        [DataMember]
        internal string id;

        [DataMember]
        internal string title;

        [DataMember]
        internal string start;

        [DataMember]
        internal string end;

        [DataMember]
        internal string url;

        [DataMember]
        internal bool allDay;

        [DataMember]
        internal bool editable;

        [DataMember]
        internal bool durationEditable;

        [DataMember]
        internal string color;

        [DataMember]
        internal string eventtype;

        [DataMember]
        internal string eventdatasource;

        [DataMember]
        internal string eventdatasourceid;

        public CalendarResponseItem()
        {
        }

        public CalendarResponseItem(string newid, string newtitle, string newstart, string newend, string newurl, bool newAllDay)
        {
            id = newid;
            title = newtitle;
            start = newstart;
            end = newend;
            url = newurl;
            allDay = newAllDay;
        }
    }

    

    public class DisplayTemplateItem
    {
        public string ItemType { get; set; }
        public string ItemValue { get; set; }

        public DisplayTemplateItem(string _itemtype, string _itemvalue)
        {
            ItemType = _itemtype;
            ItemValue = _itemvalue;
        }
    }

}
