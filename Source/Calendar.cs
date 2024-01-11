using System;
using System.Collections.Generic;
using System.Xml;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using SourceCode.Forms.Controls.Web.SDK;
using SourceCode.Forms.Controls.Web.SDK.Attributes;

[assembly: WebResource("SourceCodeANZ.Forms.Controls.Resources.Calendar.js", "text/javascript", PerformSubstitution = true)]
[assembly: WebResource("SourceCodeANZ.Forms.Controls.Resources.moment.min.js", "text/javascript", PerformSubstitution = true)]
[assembly: WebResource("SourceCodeANZ.Forms.Controls.Resources.fullcalendar.min.js", "text/javascript", PerformSubstitution = true)]
[assembly: WebResource("SourceCodeANZ.Forms.Controls.Resources.locale-all.js", "text/javascript", PerformSubstitution = true)]
[assembly: WebResource("SourceCodeANZ.Forms.Controls.Resources.fullcalendar.min.css", "text/css", PerformSubstitution = true)]
[assembly: WebResource("SourceCodeANZ.Forms.Controls.style.css", "text/css", PerformSubstitution = true)]
[assembly: WebResource("SourceCodeANZ.Forms.Controls.fullcal16.png", "image/png")]
[assembly: WebResource("SourceCodeANZ.Forms.Controls.Resources.CalendarPropertyConfig.js", "text/javascript", PerformSubstitution = true)]
namespace SourceCodeANZ.Forms.Controls
{
    [ControlTypeDefinition("SourceCodeANZ.Forms.Controls.Resources.CalendarDefinition.xml")]
    [ClientScript("SourceCodeANZ.Forms.Controls.Resources.Calendar.js")]
    [ClientScript("SourceCodeANZ.Forms.Controls.Resources.moment.min.js")]
    [ClientScript("SourceCodeANZ.Forms.Controls.Resources.fullcalendar.min.js")]
    [ClientScript("SourceCodeANZ.Forms.Controls.Resources.locale-all.js")]
    [ClientCss("SourceCodeANZ.Forms.Controls.Resources.fullcalendar.min.css")]
    class Calendar : BaseControl
    {

        private string _dataSourceType;

      
        public Calendar()
           : base("div")
        {
            ((SourceCode.Forms.Controls.Web.Shared.IControl)this).DesignFormattingPaths.Add("stlyecss", "SourceCodeANZ.Forms.Controls.style.css");
        }

        public string Value
        {
            get { return this.Attributes["value"]; }
            set { this.Attributes["value"] = value; }
        }


        public string EventTitle
        {
            get { return this.Attributes["eventtitle"]; }
            set { this.Attributes["eventtitle"] = value; }
        }

        public string FilterSpec
        {
            get { return this.Attributes["filterspec"]; }
            set { this.Attributes["filterspec"] = value; }
        }

        public string MethodParameters
        {
            get { return this.Attributes["methodparameters"]; }
            set { this.Attributes["methodparameters"] = value; }
        }

        public string SOCreateMethod
        {
            get { return this.Attributes["socreatemethod"]; }
            set { this.Attributes["socreatemethod"] = value; }
        }

        public string SOSaveMethod
        {
            get { return this.Attributes["sosavemethod"]; }
            set { this.Attributes["sosavemethod"] = value; }
        }


        public string EventTitleField
        {
            get { return this.GetOption<string>("EventTitleField", ""); }
            set { this.SetOption<string>("EventTitleField", value, ""); }
        }

               
        public string EventStart
        {
            get { return this.Attributes["eventstart"]; }
            set { this.Attributes["eventstart"] = value; }
        }


        public string EventStartField
        {
            get { return this.GetOption<string>("EventStartField", ""); }
            set { this.SetOption<string>("EventStartField", value, ""); }
        }

       
        public string EventEnd
        {
            get { return this.Attributes["eventend"]; }
            set { this.Attributes["eventend"] = value; }
        }


        public string EventEndField
        {
            get { return this.GetOption<string>("EventEndField", ""); }
            set { this.SetOption<string>("EventEndField", value, ""); }
        }

        
        public bool EventAllDay
        {
            get { return Convert.ToBoolean(this.Attributes["eventallday"]); }
            set { this.Attributes["eventallday"] = value.ToString(); }
        }


        public string EventAllDayField
        {
            get { return this.GetOption<string>("EventAllDayField", ""); }
            set { this.SetOption<string>("EventAllDayField", value, ""); }
        }

        public bool EventEditable
        {
            get { return Convert.ToBoolean(this.Attributes["eventeditable"]); }
            set { this.Attributes["eventeditable"] = value.ToString(); }
        }

        public string EventEditableField
        {
            get { return this.GetOption<string>("EventEditableField", ""); }
            set { this.SetOption<string>("EventEditableField", value, ""); }
        }

        public bool EventSizeable
        {
            get { return Convert.ToBoolean(this.Attributes["eventsizeable"]); }
            set { this.Attributes["eventsizeable"] = value.ToString(); }
        }

        public string EventSizeableField
        {
            get { return this.GetOption<string>("EventSizeableField", ""); }
            set { this.SetOption<string>("EventSizeableField", value, ""); }
        }

        public string EventColor
        {
            get { return this.Attributes["eventcolor"]; }
            set { this.Attributes["eventcolor"] = value; }
        }

        public string EventType
        {
            get { return this.Attributes["eventtype"]; }
            set { this.Attributes["eventtype"] = value; }
        }


        public string EventTypeField
        {
            get { return this.GetOption<string>("EventTypeField", ""); }
            set { this.SetOption<string>("EventTypeField", value, ""); }
        }


        public string EventColorField
        {
            get { return this.GetOption<string>("EventColorField", ""); }
            set { this.SetOption<string>("EventColorField", value, ""); }
        }


        public string EventDataSourceField
        {
            get { return this.GetOption<string>("EventDataSourceField", ""); }
            set { this.SetOption<string>("EventDataSourceField", value, ""); }
        }


        public string EventDataSourceIDfield
        {
            get { return this.GetOption<string>("EventDataSourceIDfield", ""); }
            set { this.SetOption<string>("EventDataSourceIDfield", value, ""); }
        }

        public Unit Width { get; set; }

        public string MonthViewColFormat
        {
            get { return this.Attributes["monthviewcolformat"]; }
            set { this.Attributes["monthviewcolformat"] = value; }
        }

        public string WeekViewColFormat
        {
            get { return this.Attributes["weekviewcolformat"]; }
            set { this.Attributes["weekviewcolformat"] = value; }
        }

        public string DayViewColFormat
        {
            get { return this.Attributes["dayviewcolformat"]; }
            set { this.Attributes["dayviewcolformat"] = value; }
        }

        public string MonthViewTitleFormat
        {
            get { return this.Attributes["monthviewtitleformat"]; }
            set { this.Attributes["monthviewtitleformat"] = value; }
        }

        public string WeekViewTitleFormat
        {
            get { return this.Attributes["weekviewtitleformat"]; }
            set { this.Attributes["weekviewtitleformat"] = value; }
        }

        public string DayViewTitleFormat
        {
            get { return this.Attributes["dayviewtitleformat"]; }
            set { this.Attributes["dayviewtitleformat"] = value; }
        }

        //public string HeaderLeft
        //{
        //    get { return this.Attributes["headerleft"]; }
        //    set { this.Attributes["headerleft"] = value; }
        //}

        //public string HeaderCenter
        //{
        //    get { return this.Attributes["headercenter"]; }
        //    set { this.Attributes["headercenter"] = value; }
        //}

        //public string HeaderRight
        //{
        //    get { return this.Attributes["headerright"]; }
        //    set { this.Attributes["headerright"] = value; }
        //}

        public bool CustomNewEventUI
        {
            get { return Convert.ToBoolean(this.Attributes["customneweventui"]); }
            set { this.Attributes["customneweventui"] = value.ToString(); }
        }

        public bool LoadDataOnInit
        {
            get { return Convert.ToBoolean(string.IsNullOrEmpty(this.Attributes["loaddataoninit"]) ? "True" : this.Attributes["loaddataoninit"]); }
            set { this.Attributes["loaddataoninit"] = value.ToString(); }
        }

        //UserServerZone
        public bool UseServerZone
        {
            get { return this.GetOption<bool>("UseServerZone", false); }
            set { this.SetOption<bool>("UseServerZone", value, false); }
        }

        public bool IsVisible
        {
            get { return this.GetOption<bool>("isvisible", true); }
            set { this.SetOption<bool>("isvisible", value, true); }
        }

        public bool IsEnabled
        {
            get { return this.GetOption<bool>("isenabled", true); }
            set { this.SetOption<bool>("isenabled", value, true); }
        }

        public bool IsReadOnly
        {
            get { return this.GetOption<bool>("isreadonly", false); }
            set { this.SetOption<bool>("isreadonly", value, false); }
        }

        public string AssociationMethod
        {
            get { return this.GetOption<string>("SmartObjectMethod", ""); }
            set { this.SetOption<string>("SmartObjectMethod", value, ""); }
        }

        public string AssociationSO
        {
            get { return this.GetOption<string>("SmartObject", ""); }
            set { this.SetOption<string>("SmartObject", value, ""); }
        }


        public string ValueProperty
        {
            get { return this.GetOption<string>("SMOValueProperty", ""); }
            set { this.SetOption<string>("SMOValueProperty", value, ""); }
        }

        public string DisplayTemplate
        {
            get { return this.GetOption<string>("SMODisplayTemplate", ""); }
            set { this.SetOption<string>("SMODisplayTemplate", value, ""); }
        }

        public string Locale
        {
            get { return this.GetOption<string>("Locale", ""); }
            set { this.SetOption<string>("Locale", value, ""); }
        }


        public string DataSourceType
        {
            get { return this._dataSourceType; }
            set { this._dataSourceType = value; }
        }

        public bool MonthView { get { return this.GetOption<bool>("MonthView", true); } set { this.SetOption<bool>("MonthView", value, true); } }
        public bool WeekView { get { return this.GetOption<bool>("WeekView", true); } set { this.SetOption<bool>("WeekView", value, true); } }
        public bool DayView { get { return this.GetOption<bool>("DayView", true); } set { this.SetOption<bool>("DayView", value, true); } }
        public bool BasicWeekView { get { return this.GetOption<bool>("BasicWeekView", false); } set { this.SetOption<bool>("BasicWeekView", value, false); } }
        public bool BasicDayView { get { return this.GetOption<bool>("BasicDayView", false); } set { this.SetOption<bool>("BasicDayView", value, false); } }
        public bool ListYearView { get { return this.GetOption<bool>("ListYearView", false); } set { this.SetOption<bool>("ListYearView", value, false); } }
        public bool ListMonthView { get { return this.GetOption<bool>("ListMonthView", false); } set { this.SetOption<bool>("ListMonthView", value, false); } }
        public bool ListWeekView { get { return this.GetOption<bool>("ListWeekView", true); } set { this.SetOption<bool>("ListWeekView", value, true); } }
        public bool ListDayView { get { return this.GetOption<bool>("ListDayView", false); } set { this.SetOption<bool>("ListDayView", value, false); } }



        protected override void CreateChildControls()
        {
            Attributes.CssStyle.Add("width", (!Width.IsEmpty) ? Width.ToString() : "100%");
            if (State == SourceCode.Forms.Controls.Web.Shared.ControlState.Designtime)
            {
                Panel pnlDevSurface = new Panel();
                pnlDevSurface.BorderStyle = BorderStyle.Solid;
                pnlDevSurface.BorderColor = System.Drawing.Color.RoyalBlue;
                pnlDevSurface.Height = Unit.Pixel(500);
                pnlDevSurface.Controls.Add(new LiteralControl("<p><strong>Desiger View:</strong><br/>The Actual Calendar will be rendered at runtime.</p>"));
                Controls.Add(pnlDevSurface);
            }
            Attributes.Add("value", (!string.IsNullOrEmpty(Value)) ? Value : string.Empty);
            Attributes.Add("eventtitle", (!string.IsNullOrEmpty(EventTitle)) ? EventTitle : string.Empty);
            Attributes.Add("filterspec", (!string.IsNullOrEmpty(FilterSpec)) ? FilterSpec : string.Empty);
            Attributes.Add("methodparameters", (!string.IsNullOrEmpty(MethodParameters)) ? MethodParameters : string.Empty);
            Attributes.Add("socreatemethod", (!string.IsNullOrEmpty(SOCreateMethod)) ? SOCreateMethod : "Create");
            Attributes.Add("sosavemethod", (!string.IsNullOrEmpty(SOSaveMethod)) ? SOSaveMethod : "Save");
            Attributes.Add("eventstart", (!string.IsNullOrEmpty(EventStart)) ? EventStart : string.Empty);
            Attributes.Add("eventend", (!string.IsNullOrEmpty(EventEnd)) ? EventEnd : string.Empty);
            Attributes.Add("eventallday", EventAllDay.ToString());
            Attributes.Add("eventeditable", EventEditable.ToString());
            Attributes.Add("eventsizeable", EventSizeable.ToString());
            Attributes.Add("loaddataoninit", LoadDataOnInit.ToString());
            Attributes.Add("eventcolor", (!string.IsNullOrEmpty(EventColor)) ? EventColor : string.Empty);
            Attributes.Add("eventtype", (!string.IsNullOrEmpty(EventType)) ? EventType : string.Empty);
            Attributes.Add("customneweventui", CustomNewEventUI.ToString());
            Attributes.Add("isreadonly", IsReadOnly.ToString().ToLower());

            Attributes.Add("monthviewcolformat", (!string.IsNullOrEmpty(MonthViewColFormat)) ? MonthViewColFormat : "ddd");
            Attributes.Add("weekviewcolformat", (!string.IsNullOrEmpty(WeekViewColFormat)) ? WeekViewColFormat : "ddd M/d");
            Attributes.Add("dayviewcolformat", (!string.IsNullOrEmpty(DayViewColFormat)) ? DayViewColFormat : "dddd M/d");

            Attributes.Add("monthviewtitleformat", (!string.IsNullOrEmpty(MonthViewTitleFormat)) ? MonthViewTitleFormat : "MMMM YYYY");
            Attributes.Add("weekviewtitleformat", (!string.IsNullOrEmpty(WeekViewTitleFormat)) ? WeekViewTitleFormat : "MMM D YYYY");
            Attributes.Add("dayviewtitleformat", (!string.IsNullOrEmpty(DayViewTitleFormat)) ? DayViewTitleFormat : "MMMM D YYYY");

            Attributes.CssStyle.Add("box-sizing", "border-box");
            Attributes.CssStyle.Add(HtmlTextWriterStyle.Display, (IsVisible||this.State == SourceCode.Forms.Controls.Web.Shared.ControlState.Designtime) ? "inline-block" : "none");
            
            if (DataSourceType == "Static")
            {
                Literal lit = new Literal();
                lit.Text = "Static Data as a Source is not Supported at this stage, Sorry!!";
                Controls.Add(lit);
            }

            if (!Options.ContainsKey("MonthView")) Options.Add("MonthView", true);
            if (!Options.ContainsKey("WeekView")) Options.Add("WeekView", true);
            if (!Options.ContainsKey("DayView")) Options.Add("DayView", true);
            if (!Options.ContainsKey("BasicWeekView")) Options.Add("BasicWeekView", false);
            if (!Options.ContainsKey("BasicDayView")) Options.Add("BasicDayView", false);
            if (!Options.ContainsKey("ListYearView")) Options.Add("ListYearView", false);
            if (!Options.ContainsKey("ListMonthView")) Options.Add("ListMonthView", false);
            if (!Options.ContainsKey("ListWeekView")) Options.Add("ListWeekView", true);
            if (!Options.ContainsKey("ListDayView")) Options.Add("ListDayView", false);
            if (!Options.ContainsKey("Locale")) Options.Add("Locale", "en");
            if (!Options.ContainsKey("UseServerZone")) Options.Add("UseServerZone", false);


            base.CreateChildControls();
            
         
        }

       
        

    }

    

}
