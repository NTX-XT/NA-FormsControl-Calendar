//NOTE: alert() statements are available for debugging purposes. You can uncomment the statements to show dialogs when each method is hit.

(function ($) {
    if (typeof SourceCodeANZ === "undefined" || SourceCodeANZ == null) SourceCodeANZ = {};
    if (typeof SourceCodeANZ.Forms === "undefined" || SourceCodeANZ.Forms == null) SourceCodeANZ.Forms = {};
    if (typeof SourceCodeANZ.Forms.Controls === "undefined" || SourceCodeANZ.Forms.Controls == null) SourceCodeANZ.Forms.Controls = {};
    
    SourceCodeANZ.Forms.Controls.Calendar = {

        //internal method used to get a handle on the control instance
        _getInstance: function (id) {
            var control = jQuery('#' + id);
            if (control.length == 0) {
                throw 'SourceCodeANZ.Forms.Controls.Calendar \'' + id + '\' not found';
            } else {
                return control[0];
            }
        },

        execute: function (objInfo) {
            var method = objInfo.methodName;
            if (method) {
                var _calendar = $("#" + objInfo.CurrentControlID);
                switch (method) {
                    case "Refresh":
                        _calendar[0].attributes['loaddataoninit'].value = "True";
                        _calendar.fullCalendar('refetchEvents');
                        break;
                    case "GoToDate":
                        var parameters = objInfo.methodParameters;
                        var targetdate = new Date(parameters["date"]);
                        _calendar.fullCalendar('gotoDate', targetdate);
                        break;
                }
            }
        },


        
        getProperty: function (objInfo) {
            var instance = SourceCodeANZ.Forms.Controls.Calendar._getInstance(objInfo.CurrentControlId);
            return instance.attributes[objInfo.property].value;
        },

        setProperty: function (objInfo) {
            //debugger;
            switch (objInfo.property.toLowerCase()) {
                case "isvisible":
                    SourceCodeANZ.Forms.Controls.Calendar.setIsVisible(objInfo);
                    break;
                case "isenabled":
                    SourceCodeANZ.Forms.Controls.Calendar.setIsEnabled(objInfo);
                    break;
                case "isreadonly":
                    SourceCodeANZ.Forms.Controls.Calendar.SetControlIsReadOnly(objInfo);
                    break;
                case "locale":
                    $('#' + objInfo.CurrentControlId).fullCalendar('option', 'locale', objInfo.Value);
                    break;
                default:
                    //$('#' + objInfo.CurrentControlId).data(objInfo.property).value = objInfo.Value;
                    var instance = SourceCodeANZ.Forms.Controls.Calendar._getInstance(objInfo.CurrentControlId);
                    instance.attributes[objInfo.property].value = objInfo.Value;
            }
        },


        //helper method to set visibility
        setIsVisible: function (objInfo) {
            value = (objInfo.Value === true || objInfo.Value == 'true');
            this._isVisible = value;
            var displayValue = (value === false) ? "none" : "block";
            var instance = SourceCodeANZ.Forms.Controls.Calendar._getInstance(objInfo.CurrentControlId);
            instance.style.display = displayValue;
        },

       
        SetControlIsReadOnly: function (objInfo) {
            //debugger;
            value = (objInfo.Value === true || objInfo.Value == 'true');
            var instance = SourceCodeANZ.Forms.Controls.Calendar._getInstance(objInfo.CurrentControlId);
            instance.attributes["isreadonly"].value = value;
        },


        //helper method to set control "enabled" state
        setIsEnabled: function (objInfo) {
            value = (objInfo.Value === true || objInfo.Value == 'true');
            this._isEnabled = value;
            var instance = SourceCodeANZ.Forms.Controls.Calendar._getInstance(objInfo.CurrentControlId);
            instance.readOnly = !value;
        }
    };


    $.widget('sfc.calendar1',
{
    _calendar: null,

    _create: function () {
        var date = new Date();
        var d = date.getDate();
        var m = date.getMonth();
        var y = date.getFullYear();
        _calendar = jQuery("#" + this.element.attr('id'));
        var customneweventui = _calendar.attr('customneweventui');
        var self = this;
        var selfControl = self.element[0];
        _calendar.fullCalendar({
            locale: this.options.Locale,
            header: {
                left: 'prevYear prev,today,next nextYear',
                center: 'title',
                right: selfControl.attributes["header_right"].value
            },
            defaultView: selfControl.attributes["header_right"].value.split(",")[0],
            views: {
                month: {
                    titleFormat: selfControl.attributes["monthviewtitleformat"].value,
                    columnFormat: selfControl.attributes["monthviewcolformat"].value
                },
                week: {
                    titleFormat: selfControl.attributes["weekviewtitleformat"].value,
                    columnFormat: selfControl.attributes["weekviewcolformat"].value
                },
                day: {
                    titleFormat: selfControl.attributes["dayviewtitleformat"].value,
                    columnFormat: selfControl.attributes["dayviewcolformat"].value
                },
                basicDay: {
                    titleFormat: selfControl.attributes["dayviewtitleformat"].value
                },
                basicWeek: {
                    titleFormat: selfControl.attributes["weekviewtitleformat"].value
                }
            },
            theme: false,
            selectable: true,
            selectHelper: true,
            lazyFetching: false,
            select: function (start, end) {
                if (!end.hasTime())
                    end.subtract(1, 'days');
                if (customneweventui == "False" && !(selfControl.attributes["isreadonly"].value == "true")) {
                    var title = prompt('Event Title:');
                    if (title) {
                        $.ajax({
                            url: 'CalendarAjaxHandler.handler',
                            cache: false,
                            type: 'POST',
                            dataType: "json",
                            data: {
                                command: "Create",
                                utcoffset: moment().utcOffset() / 60,
                                idfieldname: self.options["SMOValueProperty"],
                                data_source: self.options["SmartObject"],
                                title: title,
                                startAsDate: start.format("YYYY-MM-DD HH:mm"),
                                endAsDate: end.format("YYYY-MM-DD HH:mm"),
                                allDayAsBool: (!(start.hasTime() || end.hasTime())).toString(),
                                color: "#d9e57f",
                                SmartObjectName: self.options["SmartObject"],
                                SmartObjectMethod: self.options["SmartObjectMethod"],
                                SmartObjectValueProp: self.options["SMOValueProperty"],
                                SmartObjectDisplayTemplate: self.options["SMODisplayTemplate"],
                                EventTitleField: self.options["EventTitleField"],
                                EventStartField: self.options["EventStartField"],
                                EventEndField: self.options["EventEndField"],
                                EventAllDayField: self.options["EventAllDayField"],
                                EventEditableField: self.options["EventEditableField"],
                                EventSizeableField: self.options["EventSizeableField"],
                                EventColorField: self.options["EventColorField"],
                                SOCreateMethod: selfControl.attributes["socreatemethod"].value,
                                SOSaveMethod: selfControl.attributes["sosavemethod"].value
                            },
                            success: function (text) {
                                _calendar.fullCalendar('renderEvent',
                               {
                                   id: text[0].id,
                                   title: title,
                                   start: start,
                                   end: end,
                                   allDay: (!(start.hasTime() || end.hasTime())).toString(),
                                   eventdatasource: self.options["SmartObject"],
                                   eventdatasourceid: self.options["SMOValueProperty"]
                               },
                               false
                                );
                                selfControl.attributes["value"].value = text[0].id;
                                selfControl.attributes["eventtitle"].value = title;
                                selfControl.attributes["eventstart"].value = start.format("YYYY-MM-DD HH:mm");
                                selfControl.attributes["eventend"].value = end.format("YYYY-MM-DD HH:mm");
                                selfControl.attributes["eventallday"].value = !(start.hasTime() || end.hasTime());
                                raiseEvent(selfControl.id, 'Control', 'OnChange');
                            },
                            error: function (text) {
                                alert('there was an error while trying to execute event create');
                            }
                        });
                    }
                    _calendar.fullCalendar('unselect');
                } else {
                    selfControl.attributes["value"].value = "0";
                    selfControl.attributes["eventtitle"].value = "";
                    selfControl.attributes["eventcolor"].value = "";
                    selfControl.attributes["eventstart"].value = start.format("YYYY-MM-DD HH:mm");
                    selfControl.attributes["eventend"].value = end.format("YYYY-MM-DD HH:mm");
                    selfControl.attributes["eventallday"].value = (!(start.hasTime() || end.hasTime())).toString();
                    raiseEvent(selfControl.id, 'Control', 'OnClick');
                }
            },
            editable: true,
            eventClick: function(calEvent, jsEvent, view) {
                selfControl.attributes["value"].value = calEvent.id;
                selfControl.attributes["eventtitle"].value = calEvent.title;
                selfControl.attributes["eventstart"].value = calEvent.start.format("YYYY-MM-DD HH:mm");
                if (calEvent.end)
                    selfControl.attributes["eventend"].value = calEvent.end.format("YYYY-MM-DD HH:mm");
                else
                    selfControl.attributes["eventend"].value = calEvent.start.format("YYYY-MM-DD HH:mm");
                selfControl.attributes["eventallday"].value = calEvent.allDay;
                selfControl.attributes["eventeditable"].value = calEvent.editable;
                selfControl.attributes["eventsizeable"].value = calEvent.durationEditable;
                selfControl.attributes["eventcolor"].value = calEvent.color;
                selfControl.attributes["eventtype"].value = calEvent.eventtype;
                raiseEvent(selfControl.id, 'Control', 'OnClick');
            },
            eventAfterAllRender: function (view) {
                //This will force SmartForms Modal Pop-ups to correctly disable everything behind the pop-up:
                $(".fc-button").css("z-index", "0");
                $(".fc-content").css("z-index", "0");
            },
            
            events: function (start, end, timezone , callback) {
                   $.ajax({
                       url: 'CalendarAjaxHandler.handler',
                       cache: false,
                       dataType: "json",
                       data: {
                           start: start.format("YYYY-MM-DD HH:mm"),
                           end: end.format("YYYY-MM-DD HH:mm"),
                           command: "GetList",
                           utcoffset: moment().utcOffset() / 60,
                           useserverzone: self.options["UseServerZone"],
                           ControlIsReadOnly: false,
                           SmartObjectName: self.options["SmartObject"],
                           SmartObjectMethod: self.options["SmartObjectMethod"],
                           SmartObjectValueProp: self.options["SMOValueProperty"],
                           SmartObjectDisplayTemplate: self.options["SMODisplayTemplate"],
                           EventTitleField: self.options["EventTitleField"],
                           EventStartField: self.options["EventStartField"],
                           EventEndField: self.options["EventEndField"],
                           EventAllDayField: self.options["EventAllDayField"],
                           EventEditableField: self.options["EventEditableField"],
                           EventSizeableField: self.options["EventSizeableField"],
                           EventColorField: self.options["EventColorField"],
                           EventTypeField: self.options["EventTypeField"],
                           EventDataSourceField: self.options["EventDataSourceField"],
                           EventDataSourceIDfield: self.options["EventDataSourceIDfield"],
                           FilterSpec: selfControl.attributes["filterspec"].value,
                           MethodParameters: selfControl.attributes["methodparameters"].value,
                           LoadDataOnInt: selfControl.attributes["loaddataoninit"].value
                       },
                       success: function (data, text, xhr) {
                           //console.log("...SourceCodeANZ.Forms.Controls.Calendar...Data Loaded");
                           callback(data);
                       },
                       error: function (xhr, status, error) {
                           alert('There was an error while fetching events!');
                       }
                   });
               }
            ,
            eventResize: function (event, dayDelta, revertFunc) {
                if (!(selfControl.attributes["isreadonly"].value == "true")) {
                    var newEnd = moment(event.end);
                    if (!newEnd.hasTime())
                        newEnd.subtract(1, 'days');
                    $.ajax({
                        url: 'CalendarAjaxHandler.handler',
                        cache: false,
                        type: 'POST',
                        dataType: "json",
                        data: {
                            command: "Update",
                            utcoffset: moment().utcOffset() / 60,
                            id: event.id,
                            title: event.title,
                            color: event.color,
                            idfieldname: event.eventdatasourceid,
                            data_source: event.eventdatasource,
                            startAsDate: event.start.format("YYYY-MM-DD HH:mm"),
                            endAsDate: newEnd.format("YYYY-MM-DD HH:mm"),
                            allDayAsBool: event.allDay.toString(),
                            SmartObjectName: self.options["SmartObject"],
                            SmartObjectMethod: self.options["SmartObjectMethod"],
                            SmartObjectValueProp: self.options["SMOValueProperty"],
                            SmartObjectDisplayTemplate: self.options["SMODisplayTemplate"],
                            EventTitleField: self.options["EventTitleField"],
                            EventStartField: self.options["EventStartField"],
                            EventEndField: self.options["EventEndField"],
                            EventAllDayField: self.options["EventAllDayField"],
                            EventEditableField: self.options["EventEditableField"],
                            EventSizeableField: self.options["EventSizeableField"],
                            EventDataSourceField: self.options["EventDataSourceField"],
                            EventDataSourceIDfield: self.options["EventDataSourceIDfield"],
                            SOCreateMethod: selfControl.attributes["socreatemethod"].value,
                            SOSaveMethod: selfControl.attributes["sosavemethod"].value
                        },
                        success: function (data, text, xhr) {
                            selfControl.attributes["value"].value = data[0].id;
                            selfControl.attributes["eventtitle"].value = data[0].title;
                            selfControl.attributes["eventstart"].value = data[0].start;
                            selfControl.attributes["eventend"].value = data[0].end;
                            selfControl.attributes["eventallday"].value = data[0].allDay;
                            raiseEvent(selfControl.id, 'Control', 'OnChange');
                        },
                        error: function (text) {
                            alert('there was an error while trying to execute event resize');
                            revertFunc();
                        }
                    });

                }
                else revertFunc();
            },
            eventDrop: function (event, dayDelta, revertFunc) {
                if (!(selfControl.attributes["isreadonly"].value == "true")) {
                    var newEnd = moment(event.end);
                    if (!newEnd.hasTime())
                        newEnd.subtract(1, 'days');
                    var frmStart = event.start.format("YYYY-MM-DD HH:mm");
                    var frmEnd;
                    if (event.end)
                        frmEnd = newEnd.format("YYYY-MM-DD HH:mm");
                    else
                        frmEnd = frmStart;
                    $.ajax({
                        url: 'CalendarAjaxHandler.handler',
                        cache: false,
                        type: 'POST',
                        dataType: "json",
                        data: {
                            command: "Update",
                            utcoffset: moment().utcOffset() / 60,
                            id: event.id,
                            title: event.title,
                            color: event.color,
                            idfieldname: event.eventdatasourceid,
                            data_source: event.eventdatasource,
                            startAsDate: frmStart,
                            endAsDate: frmEnd,
                            SmartObjectName: self.options["SmartObject"],
                            SmartObjectMethod: self.options["SmartObjectMethod"],
                            SmartObjectValueProp: self.options["SMOValueProperty"],
                            SmartObjectDisplayTemplate: self.options["SMODisplayTemplate"],
                            EventTitleField: self.options["EventTitleField"],
                            EventStartField: self.options["EventStartField"],
                            EventEndField: self.options["EventEndField"],
                            EventAllDayField: self.options["EventAllDayField"],
                            EventEditableField: self.options["EventEditableField"],
                            EventSizeableField: self.options["EventSizeableField"],
                            EventDataSourceField: self.options["EventDataSourceField"],
                            EventDataSourceIDfield: self.options["EventDataSourceIDfield"],
                            SOCreateMethod: selfControl.attributes["socreatemethod"].value,
                            SOSaveMethod: selfControl.attributes["sosavemethod"].value
                        },
                        success: function (data, text, xhr) {
                            selfControl.attributes["value"].value = data[0].id;
                            selfControl.attributes["eventtitle"].value = data[0].title;
                            selfControl.attributes["eventstart"].value = data[0].start;
                            selfControl.attributes["eventend"].value = data[0].end;
                            selfControl.attributes["eventallday"].value = data[0].allDay;
                            raiseEvent(selfControl.id, 'Control', 'OnChange');
                        },
                        error: function (text) {
                            alert('there was an error while trying to execute event drop');
                            revertFunc();
                        }
                    });

                }
                else
                    revertFunc();
            }
        });
    },

    _init: function () {
        
    },


    _setOption: function (option, value) {

        switch (option.toUpperCase()) {
            case "ISVISIBLE":
                this.isvisible(value);
                break;
            case "PROPERTY":
                this.property(value);
                break;
        }

        $.Widget.prototype._setOption.apply(this, arguments);
    },

    destroy: function () {
        $(this.element).unbind('.calendar1');

        $.Widget.prototype.destroy.call(this);
    },
    isvisible: function (value) {
        if (checkExists(value)) {
            if (value == false || value == 'false')
                this._calendar.css('display', 'none');
            else
                this._calendar.css('display', 'inline');
        }
        else {
            return !(this._calendar.css('display') == 'none');
        }

    },
    property: function (value) {
        if (checkExists(value)) {

        }
    },

    setStyles: function (styles) {
    }
});

})(jQuery);


$(document).ready(function () {
    //console.log("...SourceCodeANZ.Forms.Controls.Calendar...Loaded");
    jQuery('.SFC.SourceCodeANZ-Forms-Controls-Calendar').each(function (i, element) {

        var optionsValue = $(element).attr('data-options');
        var options = $.parseJSON(optionsValue);
        var viewsToShow = options.MonthView?"month,":"";
        viewsToShow += options.WeekView ? "agendaWeek," : "";
        viewsToShow += options.DayView ? "agendaDay," : "";
        viewsToShow += options.BasicWeekView ? "basicWeek," : "";
        viewsToShow += options.BasicDayView ? "basicDay," : "";
        viewsToShow += options.ListYearView ? "listYear," : "";
        viewsToShow += options.ListMonthView ? "listMonth," : "";
        viewsToShow += options.ListWeekView ? "listWeek," : "";
        viewsToShow += options.ListDayView ? "listDay," : "";
        if (viewsToShow.length == 0)
            viewsToShow = "month";
        $(element).attr('header_right', viewsToShow);
        var obj = $(element).calendar1(options);
    });

});