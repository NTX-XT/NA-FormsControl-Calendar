using System;
using System.Collections.Generic;
using System.Xml;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using SourceCode.Forms.Controls.Web.SDK;
using SourceCode.Forms.Controls.Web.SDK.Attributes;

namespace SourceCodeANZ.Forms.Controls.PropertyConfiguration
{
    class CalendarConfig : SourceCode.Forms.Controls.Web.Shared.PropertyConfigurationBase
    {
        public CalendarConfig()
        {
            base.CodePaths.Add("CalenderPropertyConfigJS", "SourceCodeANZ.Forms.Controls.Resources.CalendarPropertyConfig.js");
            base.Name = "CalendarPropertyConfig";
        }

        public override void RenderControl(HtmlTextWriter writer)
        {
            SourceCode.Forms.Controls.Web.PanelInternal pnlSelectSmartObjectTreeWrapper = new SourceCode.Forms.Controls.Web.PanelInternal
            {
                ControlID = "CalendarPropertyConfig_SOTreePage",
                CssClass = "wrapper"
            };

            SourceCode.Forms.Web.Controls.Panel pnlSelectSmartObjectTreeWrapperChild = new SourceCode.Forms.Web.Controls.Panel
            {
                Behavior = SourceCode.Forms.Web.Controls.Panel.Behaviors.FullSize
            };
            pnlSelectSmartObjectTreeWrapper.Controls.Add(pnlSelectSmartObjectTreeWrapperChild);

            SourceCode.Forms.Controls.Web.PanelInternal pnlSelectSmartObjectTreeContent = new SourceCode.Forms.Controls.Web.PanelInternal
            {
                ControlID = "CalendarPropertyConfig_TreeCont"
            };
            SourceCode.Forms.Web.Controls.GenericTemplateImplementation SelectSmartObjectTreeContentImplementation = new SourceCode.Forms.Web.Controls.GenericTemplateImplementation
            {
                InstantiateControls = { pnlSelectSmartObjectTreeContent }
            };
            pnlSelectSmartObjectTreeWrapperChild.Content = SelectSmartObjectTreeContentImplementation;
            pnlSelectSmartObjectTreeWrapper.RenderControl(writer);


            SourceCode.Forms.Controls.Web.PanelInternal pnlConfigSmartObject = new SourceCode.Forms.Controls.Web.PanelInternal
            {
                ControlID = "CalendarPropertyConfig_DataSrcPageInternal",
                CssClass = "wrapper"
            };

            SourceCode.Forms.Controls.Web.PanelInternal pnlDisplayTemplateInternal = new SourceCode.Forms.Controls.Web.PanelInternal
            {
                ControlID = "CalendarPropertyConfig_DisplayTemplatePanel"
            };
            pnlDisplayTemplateInternal.Attributes.Add("locDisplayTemplateHeader", "Configure the Display Template");
            pnlDisplayTemplateInternal.RenderControl(writer);

            SourceCode.Forms.Controls.Web.PanelInternal pnlDataSourcePropertiesInternal = new SourceCode.Forms.Controls.Web.PanelInternal
            {
                ControlID = "CalendarPropertyConfig_DataSrcPage",
                CssClass = "wrapper"
            };
            SourceCode.Forms.Controls.Web.PanelInternal pnlDataSourceProperties = new SourceCode.Forms.Controls.Web.PanelInternal
            {
                ControlID = "CalendarPropertyConfig_DataSrcPageInternal",
                CssClass = "wrapper"
            };
            SourceCode.Forms.Web.Controls.Panel pnlDataSourcePropertiesImp = new SourceCode.Forms.Web.Controls.Panel
            {
                Behavior = SourceCode.Forms.Web.Controls.Panel.Behaviors.FullSize
            };
            pnlDataSourcePropertiesInternal.Controls.Add(pnlDataSourcePropertiesImp);
            SourceCode.Forms.Web.Controls.GenericTemplateImplementation pnlDataSourcePropertiesImplementation = new SourceCode.Forms.Web.Controls.GenericTemplateImplementation
            {
                InstantiateControls = { pnlDataSourceProperties }
            };
            pnlDataSourcePropertiesImp.Content = pnlDataSourcePropertiesImplementation;

            //Calendar SmartObject Specification
            SourceCode.Forms.Web.Controls.FormField smoNameField = new SourceCode.Forms.Web.Controls.FormField
            {
                ID = "CalendarPropertyConfig_ffSmartObject",
                Text = "SmartObject* :"
            };
            SourceCode.Forms.Web.Controls.LookupBox smoSelectionbox = new SourceCode.Forms.Web.Controls.LookupBox
            {
                ID = "CalendarPropertyConfig_SOTextBox"
            };
            smoSelectionbox.Attributes.Add("readonly", "readonly");
            smoSelectionbox.ButtonID = "CalendarPropertyConfig_SOButton";
            smoSelectionbox.Icon = "none";
            smoNameField.Controls.Add(smoSelectionbox);
            pnlDataSourceProperties.Controls.Add(smoNameField);

            //Calendar List Method Specification
            SourceCode.Forms.Web.Controls.FormField listMethodField = new SourceCode.Forms.Web.Controls.FormField
            {
                ID = "CalendarPropertyConfig_ffAssociationMethod",
                Text = "List Method* :"
            };
            SourceCode.Forms.Controls.Web.DropDownListInternal listMethodDropDown = new SourceCode.Forms.Controls.Web.DropDownListInternal
            {
                ControlID = "CalendarPropertyConfig_ddListAssociationMethod",
                CssClass = "icon-control"
            };
            listMethodField.Controls.Add(listMethodDropDown);
            pnlDataSourceProperties.Controls.Add(listMethodField);

            //Event Value Property Specification
            SourceCode.Forms.Web.Controls.FormField valuePropertyField = new SourceCode.Forms.Web.Controls.FormField
            {
                ID = "CalendarPropertyConfig_ffValueProperty",
                Text = "Value* :"
            };
            SourceCode.Forms.Controls.Web.DropDownListInternal valuePropertyDropDown = new SourceCode.Forms.Controls.Web.DropDownListInternal
            {
                ControlID = "CalendarPropertyConfig_ddListValueProperty",
                CssClass = "icon-control"
            };
            valuePropertyField.Controls.Add(valuePropertyDropDown);
            pnlDataSourceProperties.Controls.Add(valuePropertyField);

            //Event Display Template Specification
            SourceCode.Forms.Web.Controls.FormField displayPropertyField = new SourceCode.Forms.Web.Controls.FormField
            {
                ID = "CalendarPropertyConfig_ffDisplayValue",
                Text = "Display Template* :"
            };
            SourceCode.Forms.Web.Controls.LookupBox boxDisplayValue = new SourceCode.Forms.Web.Controls.LookupBox
            {
                ID = "CalendarPropertyConfig_lookupBoxDisplayValue",
                ButtonID = "CalendarPropertyConfig_lookupBoxDisplayValueButton",
                Display = true
            };
            displayPropertyField.Controls.Add(boxDisplayValue);
            pnlDataSourceProperties.Controls.Add(displayPropertyField);


            //Event Title Property Specification
            SourceCode.Forms.Web.Controls.FormField titlePropertyField = new SourceCode.Forms.Web.Controls.FormField
            {
                ID = "CalendarPropertyConfig_ffTitleProperty",
                Text = "Event Title* :"
            };
            SourceCode.Forms.Controls.Web.DropDownListInternal titlePropertyDropDown = new SourceCode.Forms.Controls.Web.DropDownListInternal
            {
                ControlID = "CalendarPropertyConfig_ddListTitlePropertyName",
                CssClass = "icon-control"
            };
            titlePropertyField.Controls.Add(titlePropertyDropDown);
            pnlDataSourceProperties.Controls.Add(titlePropertyField);

            //Event Start Date Property Specification
            SourceCode.Forms.Web.Controls.FormField sDatePropertyField = new SourceCode.Forms.Web.Controls.FormField
            {
                ID = "CalendarPropertyConfig_ffsDateProperty",
                Text = "Start Date* :"
            };
            SourceCode.Forms.Controls.Web.DropDownListInternal sDatePropertyDropDown = new SourceCode.Forms.Controls.Web.DropDownListInternal
            {
                ControlID = "CalendarPropertyConfig_ddListsDatePropertyName",
                CssClass = "icon-control"
            };
            sDatePropertyField.Controls.Add(sDatePropertyDropDown);
            pnlDataSourceProperties.Controls.Add(sDatePropertyField);

            //Event End Date Property Specification
            SourceCode.Forms.Web.Controls.FormField eDatePropertyField = new SourceCode.Forms.Web.Controls.FormField
            {
                ID = "CalendarPropertyConfig_ffeDateProperty",
                Text = "End Date* :"
            };
            SourceCode.Forms.Controls.Web.DropDownListInternal eDatePropertyDropDown = new SourceCode.Forms.Controls.Web.DropDownListInternal
            {
                ControlID = "CalendarPropertyConfig_ddListeDatePropertyName",
                CssClass = "icon-control"
            };
            eDatePropertyField.Controls.Add(eDatePropertyDropDown);
            pnlDataSourceProperties.Controls.Add(eDatePropertyField);

            //Event All-Day Property Specification
            SourceCode.Forms.Web.Controls.FormField AllDayPropertyField = new SourceCode.Forms.Web.Controls.FormField
            {
                ID = "CalendarPropertyConfig_ffAllDayProperty",
                Text = "All-Day Event:"
            };
            SourceCode.Forms.Controls.Web.DropDownListInternal AllDayPropertyDropDown = new SourceCode.Forms.Controls.Web.DropDownListInternal
            {
                ControlID = "CalendarPropertyConfig_ddListAllDayPropertyName",
                CssClass = "icon-control"
            };
            AllDayPropertyField.Controls.Add(AllDayPropertyDropDown);
            pnlDataSourceProperties.Controls.Add(AllDayPropertyField);


            //Event EditableField Property Specification
            SourceCode.Forms.Web.Controls.FormField EditableFieldPropertyField = new SourceCode.Forms.Web.Controls.FormField
            {
                ID = "CalendarPropertyConfig_ffEditableFieldProperty",
                Text = "Is Event Editable:"
            };
            SourceCode.Forms.Controls.Web.DropDownListInternal EditableFieldPropertyDropDown = new SourceCode.Forms.Controls.Web.DropDownListInternal
            {
                ControlID = "CalendarPropertyConfig_ddListEditableFieldPropertyName",
                CssClass = "icon-control"
            };
            EditableFieldPropertyField.Controls.Add(EditableFieldPropertyDropDown);
            pnlDataSourceProperties.Controls.Add(EditableFieldPropertyField);

            //Event SizeableField Property Specification
            SourceCode.Forms.Web.Controls.FormField SizeableFieldPropertyField = new SourceCode.Forms.Web.Controls.FormField
            {
                ID = "CalendarPropertyConfig_ffSizeableFieldProperty",
                Text = "Is Event Sizeable:"
            };
            SourceCode.Forms.Controls.Web.DropDownListInternal SizeableFieldPropertyDropDown = new SourceCode.Forms.Controls.Web.DropDownListInternal
            {
                ControlID = "CalendarPropertyConfig_ddListSizeableFieldPropertyName",
                CssClass = "icon-control"
            };
            SizeableFieldPropertyField.Controls.Add(SizeableFieldPropertyDropDown);
            pnlDataSourceProperties.Controls.Add(SizeableFieldPropertyField);

            //Event ColorField Property Specification
            SourceCode.Forms.Web.Controls.FormField ColorFieldPropertyField = new SourceCode.Forms.Web.Controls.FormField
            {
                ID = "CalendarPropertyConfig_ffColorFieldProperty",
                Text = "Event Color:"
            };
            SourceCode.Forms.Controls.Web.DropDownListInternal ColorFieldPropertyDropDown = new SourceCode.Forms.Controls.Web.DropDownListInternal
            {
                ControlID = "CalendarPropertyConfig_ddListColorFieldPropertyName",
                CssClass = "icon-control"
            };
            ColorFieldPropertyField.Controls.Add(ColorFieldPropertyDropDown);
            pnlDataSourceProperties.Controls.Add(ColorFieldPropertyField);


            //Event EvTypeField Property Specification
            SourceCode.Forms.Web.Controls.FormField EvTypeFieldPropertyField = new SourceCode.Forms.Web.Controls.FormField
            {
                ID = "CalendarPropertyConfig_ffEvTypeFieldProperty",
                Text = "Event Type:"
            };
            SourceCode.Forms.Controls.Web.DropDownListInternal EvTypeFieldPropertyDropDown = new SourceCode.Forms.Controls.Web.DropDownListInternal
            {
                ControlID = "CalendarPropertyConfig_ddListEvTypeFieldPropertyName",
                CssClass = "icon-control"
            };
            EvTypeFieldPropertyField.Controls.Add(EvTypeFieldPropertyDropDown);
            pnlDataSourceProperties.Controls.Add(EvTypeFieldPropertyField);


            //Event EvDataSourceField Property Specification
            SourceCode.Forms.Web.Controls.FormField EvDataSourceFieldPropertyField = new SourceCode.Forms.Web.Controls.FormField
            {
                ID = "CalendarPropertyConfig_ffEvDataSourceFieldProperty",
                Text = "Event Source:"
            };
            SourceCode.Forms.Controls.Web.DropDownListInternal EvDataSourceFieldPropertyDropDown = new SourceCode.Forms.Controls.Web.DropDownListInternal
            {
                ControlID = "CalendarPropertyConfig_ddListEvDataSourceFieldPropertyName",
                CssClass = "icon-control"
            };
            EvDataSourceFieldPropertyField.Controls.Add(EvDataSourceFieldPropertyDropDown);
            pnlDataSourceProperties.Controls.Add(EvDataSourceFieldPropertyField);

            //Event EvDataSourceIDField Property Specification
            SourceCode.Forms.Web.Controls.FormField EvDataSourceIDFieldPropertyField = new SourceCode.Forms.Web.Controls.FormField
            {
                ID = "CalendarPropertyConfig_ffEvDataSourceIDFieldProperty",
                Text = "Source Property ID:"
            };
            SourceCode.Forms.Controls.Web.DropDownListInternal EvDataSourceIDFieldPropertyDropDown = new SourceCode.Forms.Controls.Web.DropDownListInternal
            {
                ControlID = "CalendarPropertyConfig_ddListEvDataSourceIDFieldPropertyName",
                CssClass = "icon-control"
            };
            EvDataSourceIDFieldPropertyField.Controls.Add(EvDataSourceIDFieldPropertyDropDown);
            pnlDataSourceProperties.Controls.Add(EvDataSourceIDFieldPropertyField);

            Label lblHelpText = new Label();
            lblHelpText.Text = "&nbsp;&nbsp;&nbsp;* = Required";
            pnlDataSourceProperties.Controls.Add(lblHelpText);

            pnlDataSourcePropertiesInternal.RenderControl(writer);
            
            SourceCode.Forms.Controls.Web.TextBoxInternal calPropertiesHidden = new SourceCode.Forms.Controls.Web.TextBoxInternal
            {
                ControlID = "propertyConfig_propertiesXml"
            };
            calPropertiesHidden.Style.Add("display", "none");
            calPropertiesHidden.RenderControl(writer);
        }
    }
}
