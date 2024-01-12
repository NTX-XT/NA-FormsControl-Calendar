# Smartforms Full Calendar Control

## New in v2.02
- Fixed the ‘long event bug’ where events that start in the current month but end in the next month were not rendered on the calendar for the current month.
- Re-compiled to X64 architecture as required by SourceCode.HostClientAPI (Does not accept ANY [MSIL]).
- Re-compiled to .NET 4.8 as required by referenced assemblies.

## New in v2.01
- Removed the Month and Year properties since they are irrelevant.
- The Calendar will load with today as the default date.
- Use the Go to Date method on the control to load the calendar with a date other than today.

## New in v2.0
- New List Views.
- Local Time Zone Support. By default, it will now show the entries in the client browser’s time zone. Previously entries were shown in the Server’s time zone.
- Localization Support.
- V3.4.0 of Full Calendar.js Lib.
- Formatting strings changed to conform to moment.js formats: [https://momentjs.com/docs/#/displaying/](https://momentjs.com/docs/#/displaying/).
- New Views:
  - basicDay
  - basicWeek
  - listYear
  - listMonth
  - listWeek
  - listDay
- Removed complicated Header Left, Center, and Right formatting properties.
- Ability to indicate available Views with Check Boxes under properties.
- Touch Support.

## New in v1.8
- Ability to use a SmartObject, which requires Input parameters, e.g., a Stored Procedure-based SmartObject.
  - Use the pipe ‘|’ character for multiple parameters.
  - Use [CalendarStart] and [CalendarEnd] to pass in the current start and end date being viewed by the user.
  - If you need to pass in dynamic runtime values, do not load on init and use the Execute Control method ‘Refresh’ in a Rule and set the ‘Method Parameters’ property.
  - Examples:
    - LeaveType='Annual'|z_eDate=' [CalendarEnd] '|z_sDate=' [CalendarStart] '
    - LeaveType='Annual'|userLogin='denallix\holly'
  - You can use filters together with Input parameters to narrow down results even further. Also, note that the control will automatically add the current viewed calendar start and end dates to the filter. If your Stored Procedure does not necessarily need to get the start and end dates you don’t have to create them as Input parameters, just be mindful of the amount of data that will be returned by the stored procedure since k2 does post-processing as well to apply the filter.
- Ability to specify what is displayed in the header on the left, center, and right.
  - Separate multiple values with a comma or space.
  - Examples:
    - Header Left: prevYear, prev, next today, nextYear
    - Center: title
    - Right: month, agendaWeek, agendaDay
  - Possible values:
    - title - text containing the current month/week/day
    - prev - button for moving the calendar back one month/week/day
    - next - button for moving the calendar forward one month/week/day
    - prevYear - button for moving the calendar back one year
    - nextYear - button for moving the calendar forward one year
    - today - button for moving the calendar to the current month/week/day
    - a view name - button that will switch the calendar to any of the Available Views:
      - month
      - basicWeek
      - basicDay
      - agendaWeek
      - agendaDay
- New Control Method: GoToDate which can be used in an ‘Execute Control Method’ rule Action.
- Ability to Specify Month, Week, and Day View Title Format.
  - Example:
    - Month: MMM yyyy September 2015
    - Week: MMM d[ yyyy]{ '-'[ MMM] d yyyy} Sep 7 - 13 2015
    - Day: dddd, MMM d, yyyy Tuesday, Sep 8, 2015

## New in v1.7
- Bug when Browser Locale is not en-US fixed.

## New in v1.6
- Filter now allows SQL type WHERE Clause. E.g., field1 = ‘abc’ AND Id = 10) OR field2 Like ‘%xyz%’ Note: The Old Style Filter Spec is still supported for backward compatibility.

## New in v1.5
- A change in SharePoint SmartObject behavior in 4.6.7 RTM introduced a bug when using SharePoint 2013-based List as a Data Source; this has been fixed.
- Changed the “Load On Init” property to True by default.
- NOTE: If using a SharePoint List, change the Create Method property to CreateListItem and the Save Method to UpdateListItem.

## New in v1.4c
- ‘Event All Day’ Field Property is not mandatory anymore. Behavior is as follows:
  - If ‘Event All Day’ Field is blank and you have 2 separate fields for Event Start and End Date, ‘Event All Day’ will default to false;
  - If ‘Event All Day’ Field is blank and you have 1 field for both Event Start and End Date, ‘Event All Day’ will default to true;

## New in v1.4b
- Added property ‘Load in Init’. This prevents the calendar from loading data when the view is initialized. The loading of data can now be deferred until a user specifies specific values that can be used to filter events.
- Added a property on the Data Source ‘Is Event Sizeable’. Typically, this is used if the calendar shows full-day events and you don’t want the user to change the event duration by dragging the border handle of the event.
- Added a ‘Filter’ property. Data can now be filtered based on a simple filter, which can AND together multiple fields.
- Added ‘SOCreateMethod’ and ‘SOSaveMethod’ properties which can be used to specify the Create and Save (Update) Methods if the linked SmartObject Methods are not the Default ‘Create’ and ‘Save’
- Bug fix when DataSource is a SharePoint 2013 Calendar used with K2 for SharePoint (4.6.7 and later)
  - Note: With K2 blackpearl 4.6.7 RC, the ‘All Day Event’ field was created as a Text Field. You will need to Edit the SmartObject and change the field to Yes/No field because the ‘All Day’ field is a Boolean-required field on the Calendar Control.
- Turned internal control caching OFF due to unpredictable results in Internet Explorer (p.s. Chrome did not exhibit this behavior)

## Installation
1. Download the zip file from Nintex Gallery or Github.
2. Extract the downloaded file.
3. Copy and Extract on your Nintex Automation (K2) server.
4. Open a Command Prompt as Administrator and run install.bat

## Description
The Smartforms Full Calendar Control provides a full-size, drag-and-drop calendar that can use any SmartObject with a start and end date as a data source. It features 3 views: a Month, a Week, and a day. It also supports multiple data sources for displaying events from different sources.
Once installed, the Control will appear under Custom Controls as ‘K2ANZ FullCalendar’

## Data Source Configuration
- SmartObject
- List Method
- Value
- Display Template
- Event Title Field
- Start Date Field
- End Date Field
- All-Day Event Field
- Is Event Editable Field (Optional)
- Is Event Sizeable (Optional)
- Event Color Field (Optional)
- Event Type Field (Optional)
- Event Source Field (Only needed if you plan to allow editing multiple data sources)
- Event Source ID Property Field (Only needed if you plan to allow editing multiple data sources)
- Filter. Example: field1==value1&&field2==value2
  - Only an ‘AND’ type filter is currently implemented. You can use SmartObject Fields of any data type in the Filter. For text and memo fields the ‘==’ translates into a ‘Contains’ operator, while for Number, Boolean, Date etc., it translates into ‘Equals’

## Methods Provided
- Refresh

## Events Supported
- Changed
- Clicked

## Properties
- Visible (true/false)
- Read-Only (true/false)
- Load on Init (true/false)
- Filter.
- Month (number)
- Year (number)
- Month View Column Format (default: ddd)
- Week View Column Format (default: ddd d/M)
- Day View Column Format (default: dddd d/M)
- Custom Add UI (true/false)
- Value (Read-Only, populated when day is clicked)
- Event Title (Read-Only, populated when day is clicked)
- Event Start (Read-Only, populated when day is clicked)
- Event End (Read-Only, populated when day is clicked)
- Event Color (Read-Only, populated when day is clicked)
- Event Type (Read-Only, populated when day is clicked)
- Event All-Day (Read-Only, populated when day is clicked)
- Event Editable (Read-Only, populated when day is clicked)

## Adding Events

If Custom Add UI is false, a simple prompt will be displayed asking to enter an event title; otherwise, the View defined in the On-Click event will be shown.

New Events can be added by:
1. Clicking on a Day in the Month View (Will add an All-Day Event)
2. Clicking and dragging over multiple Days in the Month View (Will add All-Day Events)
3. Clicking on a Day and Hour in the Week View (Will add an Event with Start and End Times)
4. Clicking and dragging over multiple Days/Hours in the Week View (Will add an Event with Start and End Times)
5. Clicking on an Hour in the Day View (Will add an Event with Start and End Times)
6. Clicking and dragging over multiple Hours in the Day View (Will add an Event with Start and End Times)

## Editing Events

Events can be edited in several ways:
1. Click on an Event and drag-and-drop it to a different Day/Hour.
2. Click on the Event-End handle (right border) and drag.
3. Open a Custom View to edit the clicked event using the Calendar-Clicked Event.

## Rules Needed for Custom Add UI

The original text does not provide detailed rules and guidelines for implementing the Custom Add UI feature. Typically, this section would include instructions or specific rules for configuring the Custom Add UI in the smartforms Full Calendar Control.

## Configuring Multiple Sources

One approach to configuring multiple sources involves creating an SQL View that combines multiple sources using a UNION select. This is important for correctly updating the appropriate SmartObject when an event is edited, as the calendar control allows event editing through dragging and dropping.

### Sample View SQL Select Script

To configure multiple data sources in the smartforms Full Calendar Control, you can create a SQL View with a UNION select across different sources. This approach ensures the control can correctly identify and update the respective SmartObject when an event is edited. Below is a sample SQL script for creating such a view:

```sql
SELECT EventID, EventTitle, StartDate, EndDate, AllDayEvent, '#F9D656' as EventColor, 'Sample001' as EventType, '63de31c3-eab3-45cf-8b8a-85d4da20f9a2' as EventDataSource, 'EventID' as EventDataSourceIDField
FROM K2.dbo.EventSource001
UNION
SELECT EventID, EventTitle, StartDate, EndDate, AllDayEvent,'#4DC5E0' as EventColor, 'Sample003' as EventType, '6b9ad274-550a-49d2-a9a5-4edff2203545' as EventDataSource, 'EventID' as EventDataSourceIDField
FROM K2.dbo.EventSource002
UNION
SELECT EventID, EventTitle, StartDate, EndDate, AllDayEvent,'#A8D08D' as EventColor, 'Sample003' as EventType, '65f18a18-33df-4091-9739-25501125a602' as EventDataSource, 'EventID' as EventDataSourceIDField
FROM K2.dbo.EventSource003
```
Note that you must create the View in your custom Database and NOT in the K2 Database.

Once you have created the SQL View, you can create a SmartObject from the View and configure that as the Calendar's data source.

### Data Source Properties

When using the SmartObject based on the above SQL View, consider the following properties:

**Important**: If using multiple data sources, you MUST use a Custom Add UI.
