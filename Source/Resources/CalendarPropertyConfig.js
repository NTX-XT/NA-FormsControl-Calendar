if (typeof SourceCodeANZ === "undefined" || SourceCodeANZ == null) SourceCodeANZ = {};
if (typeof SourceCodeANZ.Forms === "undefined" || SourceCodeANZ.Forms == null) SourceCodeANZ.Forms = {};
if (typeof SourceCodeANZ.Forms.Controls === "undefined" || SourceCodeANZ.Forms.Controls == null) SourceCodeANZ.Forms.Controls = {};

function initializeCalendarPropertyConfig(propertyXml, fullXml, controlDefinitionXml, controlType, callback) {
    new CalendarPropertyConfig(propertyXml, fullXml, controlDefinitionXml, callback);
}

function CalendarPropertyConfig(propertyXml, fullXml, controlDefinitionXml, callback) {
    this.dropDownSoCatTreePopup = null;
    this.fullXml = parseXML(fullXml);
    this.callback = callback;
    this.initialize(propertyXml);
    this.soContextXml = "";
    this.ControlDefinitionXml = controlDefinitionXml;
    this.loading = false;
}

CalendarPropertyConfig.prototype = {

    _smartObjMethodNode: "",
    _smartObjKeyPropertyNode: "",
    _smartObjFilePropertyNode: "",

    initialize: function (propertyXml) {
        loading = true;

        $("#CalendarPropertyConfig_DataSrcPageInternal").bind("keydown keypress", this.preventBack);
        $('#propertyConfig_propertiesXml').val(propertyXml || (propertyXml = '<Controls><Control/></Controls>'));
        var $content = jQuery('#CalendarPropertyConfig_DataSrcPageInternal');
        var $inputControls = $content.find('.input-control');
        $inputControls.filter('.lookup-box').lookupbox();
        $inputControls.filter('.text-input').textbox();
        $content.find('select').dropdown();

        $('#CalendarPropertyConfig_lookupBoxDisplayValueButton').bind('click', this, this.showCalendarDisplayTemplatePopup);
        $('#CalendarPropertyConfig_SOButton').bind('click', this, this.changeCalendarSmartObject);

        $("#CalendarPropertyConfig_SOTextBox").attr("readonly", "readonly");

        var _controlsXml = parseXML(propertyXml);
        var _controlsNode = _controlsXml.documentElement;
        var _smartObjPropertyNode = _controlsNode.selectSingleNode('Control/Properties/Property[Name="AssociationSO"]');
        var _smartObjMethodNode = _controlsNode.selectSingleNode('Control/Properties/Property[Name="AssociationtMethod"]');
        var _smartObjValuePropertyNode = _controlsNode.selectSingleNode('Control/Properties/Property[Name="ValueProperty"]');

        var _smartObjEventTitlePropertyNode = _controlsNode.selectSingleNode('Control/Properties/Property[Name="EventTitleField"]');
        var _smartObjEventStartPropertyNode = _controlsNode.selectSingleNode('Control/Properties/Property[Name="EventStartField"]');
        var _smartObjEventEndPropertyNode = _controlsNode.selectSingleNode('Control/Properties/Property[Name="EventEndField"]');
        var _smartObjEventAllDayPropertyNode = _controlsNode.selectSingleNode('Control/Properties/Property[Name="EventAllDayField"]');
        var _smartObjEventEditablePropertyNode = _controlsNode.selectSingleNode('Control/Properties/Property[Name="EventEditableField"]');
        var _smartObjEventSizeablePropertyNode = _controlsNode.selectSingleNode('Control/Properties/Property[Name="EventSizebleField"]');
        var _smartObjEventColorPropertyNode = _controlsNode.selectSingleNode('Control/Properties/Property[Name="EventColorField"]');
        var _smartObjEventTypePropertyNode = _controlsNode.selectSingleNode('Control/Properties/Property[Name="EventTypeField"]');
        var _smartObjEventDataSourcePropertyNode = _controlsNode.selectSingleNode('Control/Properties/Property[Name="EventDataSourceField"]');
        var _smartObjEventDataSourceIDfieldPropertyNode = _controlsNode.selectSingleNode('Control/Properties/Property[Name="EventDataSourceIDfield"]');

        
        var _smartObjId = "";

        if (!!_smartObjPropertyNode) {
            _smartObjId = _smartObjPropertyNode.selectSingleNode('Value').firstChild.text;
        }

        if (!!_smartObjMethodNode) {
            _smartObjMethodNode = _smartObjMethodNode.selectSingleNode('Value').firstChild.text;
        }

        if (!!_smartObjValuePropertyNode) {
            _smartObjValuePropertyNode = _smartObjValuePropertyNode.selectSingleNode('Value').firstChild.text;
        }

        if (!!_smartObjEventTitlePropertyNode) {
            _smartObjEventTitlePropertyNode = _smartObjEventTitlePropertyNode.selectSingleNode('Value').firstChild.text;
        }

        var cattreeoptions = { objecttypes: 'smartobject' };

        if (!!_smartObjId) {
            cattreeoptions.selected = { objecttype: 'smartobject', objectid: _smartObjId };
        }

        var cthtml = '<ul class="tree"><li class="root children open"><a href="javascript:;">Loading...</a></li></ul>';
        $('#CalendarPropertyConfig_TreeCont').empty();
        this.dropDownSoCatTreePopup = $(cthtml).appendTo('#CalendarPropertyConfig_TreeCont').categorytree(cattreeoptions);

        popupManager.showPopup(
		{
		    id: 'CalendarPropertyConfig_DataSrcPageOutside',
		    buttons: [
                {
		        text: 'OK',
		        click: jQuery.proxy(this.CalendarConfigOkClick, this)
		    }, {
		        id: 'CalendarPopertyConfig_Cancel',
		        text: 'Cancel',
		        click: jQuery.proxy(this.CalendarConfigCancelClick, this)
		    }],
		    closeWith: 'PropertyConfig_Cancel',
		    headerText: "Calendar Data Source Configuration",
		    draggable: true,
		    content: jQuery('#CalendarPropertyConfig_DataSrcPage'),
		    width: 500,
		    height: 410,
		    onClose: jQuery.proxy(function () { this.CalendarConfigClose(this.callback); }, this)
		});

        if (_smartObjId) {
            popupManager.getLastModal().showBusy();
            CalendarPropertyConfig.prototype.getCalendarSmartObjectData.call(this, _smartObjId, false, true);
            popupManager.getLastModal().hideBusy();
        }
        this.loading = false;
    },

    changeCalendarSmartObject: function (e) {
        var _propertyConfig = e.data;

        popupManager.showPopup({
            id: 'CalendarPropertyConfig_SOTreePageOutside',
            buttons: [
            {
                text: 'OK',
                click: function () {
                    _propertyConfig.tempDisplayTemplateObjects = [];
                    CalendarPropertyConfig.prototype.CalendarConfigTreeOkClick.call(_propertyConfig);
                }
            }, {
                id: 'propertyConfig_SOTreePageCancelBtn',
                text: 'Cancel'
            }],
            headerText: "SmartObject Selection",
            draggable: true,
            maximizable: true,
            content: jQuery('#CalendarPropertyConfig_SOTreePage'),
            width: 360,
            height: 350,
            closeWith: 'propertyConfig_SOTreePageCancelBtn'
        });

        _propertyConfig.dropDownSoCatTreePopup.tree('expand', _propertyConfig.dropDownSoCatTreePopup.children('li:eq(0)'));
    },

    CalendarConfigTreeOkClick: function () {

        var _selectedNode = this.dropDownSoCatTreePopup.tree('find', 'selected');
        var _nodeType;

        if (_selectedNode.length === 0 || _selectedNode.metadata()["type"] !== "smartobject") {
            popupManager.showWarning("Please Select a SmartObject...");
            return;
        }

        popupManager.getLastModal().showBusy();

        var _nodeId = _selectedNode.metadata().guid;
        if (_nodeId) {
            var result = this.validateAssociationMethod(_nodeId);
            if (result === false) {
                popupManager.getLastModal().hideBusy();
                popupManager.showWarning("The Selected SmartObject does not have a List Method.");
            }
            else {
                CalendarPropertyConfig.prototype.getCalendarSmartObjectData.call(this, _nodeId, false, false);
                popupManager.getLastModal().hideBusy();
                popupManager.closeLast();
            }
        }
    },


    validateAssociationMethod: function (id) {
        var _propertyConfig = this;

        var result = jQuery.ajax({
            url: 'Utilities/AJAXCall.ashx',
            data: {
                method: 'getItems',
                resultTypes: 'ObjectProperties|ObjectMethods',
                targetType: 'Object',
                targetId: id
            },
            dataType: 'text',
            global: false,
            async: false,

            error: this.error
        }).responseText;

        if (result != null) {
            var _itemNode = parseXML(result).documentElement.selectSingleNode('Item');
            var _itemsNode = _itemNode.selectSingleNode('Items');

            //Methods
            var methodValid = false;

            var _methodItemNodes = _itemsNode.selectNodes('Item[@ItemType="Method"]');

            for (var i = 0, methodItemNodesCount = _methodItemNodes.length; i < methodItemNodesCount; i++) {
                var _methodItemNode = _methodItemNodes[i];

                //if (_methodItemNode.getAttribute('SubType') === 'create') {
                if (_methodItemNode.getAttribute('SubType') === 'list') {
                    methodValid = true;
                    break;
                }
            }
            return methodValid;
        }
        return true;
    },

    getCalendarSmartObjectData: function (id, isDisplayGetSmartObjectData, loadExisting) {
        var _propertyConfig = this;

        jQuery.ajax({
            url: 'Utilities/AJAXCall.ashx',
            data: {
                method: 'getItems',
                resultTypes: 'ObjectProperties|ObjectMethods',
                targetType: 'Object',
                targetId: id
            },
            dataType: 'text',
            global: false,
            success: function () {
                Array.prototype.unshift.call(arguments, isDisplayGetSmartObjectData, loadExisting);

                CalendarPropertyConfig.prototype.getItemsSuccessCalendarDropdown.apply(_propertyConfig, arguments);
            },
            error: this.error
        });
    },

    getCalendarSmartObjectDataDefault: function (id, isDisplayGetSmartObjectData, loadExisting) {
        var _propertyConfig = this;

        jQuery.ajax({
            url: 'Utilities/AJAXCall.ashx',
            data: {
                method: 'getItems',
                resultTypes: 'ObjectProperties|ObjectMethods',
                targetType: 'Object',
                targetId: id
            },
            dataType: 'text',
            global: false,
            success: function () {
                Array.prototype.unshift.call(arguments, isDisplayGetSmartObjectData, loadExisting);

                CalendarPropertyConfig.prototype.getItemsSuccessCalendarDropdown.apply(_propertyConfig, arguments);
            },
            error: this.error
        });
    },

    saveXmlValues: function (name, xmlDoc) {
        var el = xmlDoc.selectSingleNode('/Controls/Control/Properties/Property[Name = "' + name + '"]');
        var propertiesEl = xmlDoc.selectSingleNode('/Controls/Control/Properties');

        if (!propertiesEl) {
            propertiesEl = xmlDoc.createElement('Properties');

            xmlDoc.selectSingleNode('/Controls/Control').appendChild(propertiesEl);
        }

        if (el)
            for (var g = el.childNodes.length - 1; g >= 0; g--)
                if (el.childNodes[g].nodeName != 'Name')
                    el.removeChild(el.childNodes[g]);

        if (!el) {
            el = xmlDoc.createElement('Property');

            var nameEl = xmlDoc.createElement('Name');

            nameEl.appendChild(xmlDoc.createCDATASection(name));
            el.appendChild(nameEl);
            propertiesEl.appendChild(el);
        }

        var displayText = null;
        var valueText = null;

        if (name == 'AssociationSO') {
            displayText = jQuery('#CalendarPropertyConfig_TreeCont').attr('selectedSODisp');
            valueText = jQuery('#CalendarPropertyConfig_TreeCont').attr('selectedSO');
        }
        else if (name == 'DataSourceType') {
            displayText = valueText = jQuery('#CalendarPropertyConfig_TreeCont').attr('selectedSODisp');

        }
        else if (name == 'DisplayTemplate') {
            displayText = jQuery('#CalendarPropertyConfig_lookupBoxDisplayValue').val();

            var valueXml = parseXML('<Template/>');

            for (var d = 0; d < this.displayTemplateObjects.length; ++d) {
                var itemXml = valueXml.createElement('Item');
                var templateItem = this.displayTemplateObjects[d];

                if (templateItem.type == 'value') {
                    if (templateItem.text != '') {
                        itemXml.setAttribute('SourceType', 'Value');
                        itemXml.appendChild(valueXml.createElement('SourceValue')).appendChild(valueXml.createTextNode(templateItem.data));
                    }
                }
                else {
                    itemXml.setAttribute('SourceType', templateItem.data.SourceType);
                    itemXml.setAttribute('SourceID', templateItem.data.SourceID);
                    itemXml.setAttribute('DataType', templateItem.data.DataType);
                }

                valueXml.documentElement.appendChild(itemXml);
            }

            valueText = valueXml.xml;
        }
        else if (name == 'AssociationMethod') {
            var _target = document.getElementById('CalendarPropertyConfig_ddListAssociationMethod');

            if (_target.selectedIndex !== -1) {
                displayText = _target.options[_target.selectedIndex].innerHTML;
                valueText = _target.options[_target.selectedIndex].value;
            }
        }
        else if (name == 'ValueProperty') {
            var _target = document.getElementById('CalendarPropertyConfig_ddListValueProperty');

            if (_target.selectedIndex !== -1) {
                displayText = _target.options[_target.selectedIndex].innerHTML;
                valueText = _target.options[_target.selectedIndex].value;
            }
        }
        else if (name == 'EventTitleField') {
            var _target = document.getElementById('CalendarPropertyConfig_ddListTitlePropertyName');

            if (_target.selectedIndex !== -1) {
                displayText = _target.options[_target.selectedIndex].innerHTML;
                valueText = _target.options[_target.selectedIndex].value;
            }
        }
        else if (name == 'EventStartField') { 
            var _target = document.getElementById('CalendarPropertyConfig_ddListsDatePropertyName');

            if (_target.selectedIndex !== -1) {
                displayText = _target.options[_target.selectedIndex].innerHTML;
                valueText = _target.options[_target.selectedIndex].value;
            }
        }
        else if (name == 'EventEndField') {
            var _target = document.getElementById('CalendarPropertyConfig_ddListeDatePropertyName');

            if (_target.selectedIndex !== -1) {
                displayText = _target.options[_target.selectedIndex].innerHTML;
                valueText = _target.options[_target.selectedIndex].value;
            }
        }
        else if (name == 'EventAllDayField') {
            var _target = document.getElementById('CalendarPropertyConfig_ddListAllDayPropertyName');

            if (_target.selectedIndex !== -1) {
                displayText = _target.options[_target.selectedIndex].innerHTML;
                valueText = _target.options[_target.selectedIndex].value;
            }
        }
        else if (name == 'EventEditableField') {
            var _target = document.getElementById('CalendarPropertyConfig_ddListEditableFieldPropertyName');

            if (_target.selectedIndex !== -1) {
                displayText = _target.options[_target.selectedIndex].innerHTML;
                valueText = _target.options[_target.selectedIndex].value;
            }
        }
        else if (name == 'EventSizeableField') {
            var _target = document.getElementById('CalendarPropertyConfig_ddListSizeableFieldPropertyName');

            if (_target.selectedIndex !== -1) {
                displayText = _target.options[_target.selectedIndex].innerHTML;
                valueText = _target.options[_target.selectedIndex].value;
            }
        }
        else if (name == 'EventColorField') {
            var _target = document.getElementById('CalendarPropertyConfig_ddListColorFieldPropertyName');

            if (_target.selectedIndex !== -1) {
                displayText = _target.options[_target.selectedIndex].innerHTML;
                valueText = _target.options[_target.selectedIndex].value;
            }
        }
        else if (name == 'EventTypeField') {
            var _target = document.getElementById('CalendarPropertyConfig_ddListEvTypeFieldPropertyName');

            if (_target.selectedIndex !== -1) {
                displayText = _target.options[_target.selectedIndex].innerHTML;
                valueText = _target.options[_target.selectedIndex].value;
            }
        }
        else if (name == 'EventDataSourceField') {
            var _target = document.getElementById('CalendarPropertyConfig_ddListEvDataSourceFieldPropertyName');

            if (_target.selectedIndex !== -1) {
                displayText = _target.options[_target.selectedIndex].innerHTML;
                valueText = _target.options[_target.selectedIndex].value;
            }
        }
        else if (name == 'EventDataSourceIDfield') {
            var _target = document.getElementById('CalendarPropertyConfig_ddListEvDataSourceIDFieldPropertyName');

            if (_target.selectedIndex !== -1) {
                displayText = _target.options[_target.selectedIndex].innerHTML;
                valueText = _target.options[_target.selectedIndex].value;
            }
        }

        if (valueText) {
            var display = xmlDoc.createElement('DisplayValue');

            display.appendChild(xmlDoc.createCDATASection(displayText));
            el.appendChild(display);

            var value = xmlDoc.createElement('Value');

            value.appendChild(xmlDoc.createCDATASection(valueText));
            el.appendChild(value);
        }
        else
            xmlDoc.selectSingleNode('/Controls/Control/Properties').removeChild(el); //if the value is null remove it from saved xml
    },

    getItemsSuccessCalendarDropdown: function (isDisplayGetSmartObjectData, loadExisting, data, textStatus, xmlHttpRequest) {
        if (SourceCode.Forms.ExceptionHandler.handleException(data))
            return;

        var _itemNode = parseXML(data).documentElement.selectSingleNode('Item');
        var _itemsNode = _itemNode.selectSingleNode('Items');

        //Methods
        var methodAdded = false;
        var $listMethodSelect = jQuery('#CalendarPropertyConfig_ddListAssociationMethod').empty();

        var _methodItemNodes = _itemsNode.selectNodes('Item[@ItemType="Method"]');

        for (var i = 0, methodItemNodesCount = _methodItemNodes.length; i < methodItemNodesCount; i++) {
            var _methodItemNode = _methodItemNodes[i];

            if (_methodItemNode.getAttribute('SubType') === 'list') {
                var _optionEl = document.createElement('option');

                _optionEl.className = "list-method";
                _optionEl.value = _methodItemNode.selectSingleNode('Name').text;
                _optionEl.innerHTML = _methodItemNode.selectSingleNode('DisplayName').text;


                $listMethodSelect.append(_optionEl);
                methodAdded = true;
            }
        }

        if (!methodAdded) {
            popupManager.showWarning("The Selected SmartObject must have a List Method.");
        }
        else {
            $listMethodSelect.dropdown('refresh');


            jQuery('#CalendarPropertyConfig_ffFilterPropertyTextBox').val('(none)').closest(".lookup-box").removeClass("none").addClass("smartobject");
            var _displayNameText = _itemNode.selectSingleNode('DisplayName').text;
            var _propertyItemNodes = _itemsNode.selectNodes('Item[@ItemType="ObjectProperty"]');

            var _propertiesNode = this.fullXml.documentElement;
            var _propertyPropNodes = _propertiesNode.selectNodes('Prop[@serverControlType="property"]');

            var _contextXml = parseXML('<nodes/>');
            var _rootNode = _contextXml.documentElement.appendChild(_contextXml.createElement('node'));

            _rootNode.setAttribute('text', _displayNameText);
            _rootNode.setAttribute('icon', 'smartobject');
            _rootNode.setAttribute('open', 'true');

            var _firstNameText, _firstDisplayNameText;

            if (!isDisplayGetSmartObjectData) {
                var $valuePropertySelect = jQuery('#CalendarPropertyConfig_ddListValueProperty').empty();
                var $EventTitlePropertySelect = jQuery('#CalendarPropertyConfig_ddListTitlePropertyName').empty();

                var $EventStartPropertySelect = jQuery('#CalendarPropertyConfig_ddListsDatePropertyName').empty();
                var $EventEndPropertySelect = jQuery('#CalendarPropertyConfig_ddListeDatePropertyName').empty();
                var $EventAllDayPropertySelect = jQuery('#CalendarPropertyConfig_ddListAllDayPropertyName').empty();
                var $EventEditablePropertySelect = jQuery('#CalendarPropertyConfig_ddListEditableFieldPropertyName').empty();
                var $EventSizeablePropertySelect = jQuery('#CalendarPropertyConfig_ddListSizeableFieldPropertyName').empty();
                var $EventColorPropertySelect = jQuery('#CalendarPropertyConfig_ddListColorFieldPropertyName').empty();
                var $EventTypePropertySelect = jQuery('#CalendarPropertyConfig_ddListEvTypeFieldPropertyName').empty();
                var $EventDataSourcePropertySelect = jQuery('#CalendarPropertyConfig_ddListEvDataSourceFieldPropertyName').empty();
                var $EventDataSourceIDPropertySelect = jQuery('#CalendarPropertyConfig_ddListEvDataSourceIDFieldPropertyName').empty();

                var _optionEl_blank1 = document.createElement('option');
                _optionEl_blank1.className = '';
                _optionEl_blank1.value = '';
                _optionEl_blank1.innerHTML = '';
                $EventAllDayPropertySelect.append(_optionEl_blank1);

                var _optionEl_blank2 = document.createElement('option');
                _optionEl_blank2.className = '';
                _optionEl_blank2.value = '';
                _optionEl_blank2.innerHTML = '';
                $EventEditablePropertySelect.append(_optionEl_blank2);

                var _optionEl_blank3 = document.createElement('option');
                _optionEl_blank3.className = '';
                _optionEl_blank3.value = '';
                _optionEl_blank3.innerHTML = '';
                $EventColorPropertySelect.append(_optionEl_blank3);

                var _optionEl_blank4 = document.createElement('option');
                _optionEl_blank4.className = '';
                _optionEl_blank4.value = '';
                _optionEl_blank4.innerHTML = '';
                $EventTypePropertySelect.append(_optionEl_blank4);

                var _optionEl_blank5 = document.createElement('option');
                _optionEl_blank5.className = '';
                _optionEl_blank5.value = '';
                _optionEl_blank5.innerHTML = '';
                $EventDataSourcePropertySelect.append(_optionEl_blank5);

                var _optionEl_blank6 = document.createElement('option');
                _optionEl_blank6.className = '';
                _optionEl_blank6.value = '';
                _optionEl_blank6.innerHTML = '';
                $EventDataSourceIDPropertySelect.append(_optionEl_blank6);

                var _optionEl_blank7 = document.createElement('option');
                _optionEl_blank7.className = '';
                _optionEl_blank7.value = '';
                _optionEl_blank7.innerHTML = '';
                $EventSizeablePropertySelect.append(_optionEl_blank7);
            }

            for (var i = 0, propertyItemNodesCount = _propertyItemNodes.length; i < propertyItemNodesCount; i++) {
                var _propertyItemNode = _propertyItemNodes[i];
                var _itemNameText = _propertyItemNode.selectSingleNode('Name').text;
                var _itemDisplayNameText = _propertyItemNode.selectSingleNode('DisplayName').text;
                var _itemSubType = _propertyItemNode.getAttribute("SubType");
                var _subNode = _rootNode.appendChild(_contextXml.createElement('node'));

                _subNode.setAttribute('id', _itemNameText);
                _subNode.setAttribute('text', _itemDisplayNameText);
                _subNode.setAttribute('icon', _itemSubType.toLowerCase());
                _subNode.setAttribute('SourceID', _itemNameText);
                _subNode.setAttribute('SourceType', 'ObjectProperty');
                _subNode.setAttribute('DataType', _itemSubType);


                if (!_firstNameText && _propertyItemNode.getAttribute('SubType').toLowerCase() === 'text') {
                    _firstNameText = _itemNameText;
                    _firstDisplayNameText = _itemDisplayNameText;
                }

                var disallowedTypes = ['File', 'Image', 'DateTime', 'HyperLink', 'MultiValue', 'YesNo'];

                if (!disallowedTypes.contains(_propertyItemNode.getAttribute('SubType'))) {
                    var _optionEl = document.createElement('option');
                    _optionEl.className = _itemSubType.toLowerCase();
                    _optionEl.value = _itemNameText;
                    _optionEl.innerHTML = _itemDisplayNameText;
                    $valuePropertySelect.append(_optionEl);
                }

                if (_propertyItemNode.getAttribute('SubType').toLowerCase() === 'text' || _propertyItemNode.getAttribute('SubType').toLowerCase() === 'memo') {
                    var _optionElTitle = document.createElement('option');
                    _optionElTitle.className = _itemSubType.toLowerCase();
                    _optionElTitle.value = _itemNameText;
                    _optionElTitle.innerHTML = _itemDisplayNameText;
                    $EventTitlePropertySelect.append(_optionElTitle);
                }

                if (_propertyItemNode.getAttribute('SubType').toLowerCase() === 'datetime') {
                    var _optionElStartDate = document.createElement('option');
                    _optionElStartDate.className = _itemSubType.toLowerCase();
                    _optionElStartDate.value = _itemNameText;
                    _optionElStartDate.innerHTML = _itemDisplayNameText;
                    $EventStartPropertySelect.append(_optionElStartDate);
                }

                if (_propertyItemNode.getAttribute('SubType').toLowerCase() === 'datetime') {
                    var _optionElEndDate = document.createElement('option');
                    _optionElEndDate.className = _itemSubType.toLowerCase();
                    _optionElEndDate.value = _itemNameText;
                    _optionElEndDate.innerHTML = _itemDisplayNameText;
                    $EventEndPropertySelect.append(_optionElEndDate);
                }

                if (_propertyItemNode.getAttribute('SubType').toLowerCase() === 'yesno') {
                    var _optionElAllDay = document.createElement('option');
                    _optionElAllDay.className = _itemSubType.toLowerCase();
                    _optionElAllDay.value = _itemNameText;
                    _optionElAllDay.innerHTML = _itemDisplayNameText;
                    $EventAllDayPropertySelect.append(_optionElAllDay);
                }

                if (_propertyItemNode.getAttribute('SubType').toLowerCase() === 'yesno') {
                    var _optionElEditable = document.createElement('option');
                    _optionElEditable.className = _itemSubType.toLowerCase();
                    _optionElEditable.value = _itemNameText;
                    _optionElEditable.innerHTML = _itemDisplayNameText;
                    $EventEditablePropertySelect.append(_optionElEditable);
                }


                if (_propertyItemNode.getAttribute('SubType').toLowerCase() === 'yesno') {
                    var _optionElSizeable = document.createElement('option');
                    _optionElSizeable.className = _itemSubType.toLowerCase();
                    _optionElSizeable.value = _itemNameText;
                    _optionElSizeable.innerHTML = _itemDisplayNameText;
                    $EventSizeablePropertySelect.append(_optionElSizeable);
                }

                if (_propertyItemNode.getAttribute('SubType').toLowerCase() === 'text') {
                    var _optionElColor = document.createElement('option');
                    _optionElColor.className = _itemSubType.toLowerCase();
                    _optionElColor.value = _itemNameText;
                    _optionElColor.innerHTML = _itemDisplayNameText;
                    $EventColorPropertySelect.append(_optionElColor);
                }

                if (_propertyItemNode.getAttribute('SubType').toLowerCase() === 'text') {
                    var _optionElType = document.createElement('option');
                    _optionElType.className = _itemSubType.toLowerCase();
                    _optionElType.value = _itemNameText;
                    _optionElType.innerHTML = _itemDisplayNameText;
                    $EventTypePropertySelect.append(_optionElType);
                }

                if (_propertyItemNode.getAttribute('SubType').toLowerCase() === 'text') {
                    var _optionElDataSrc = document.createElement('option');
                    _optionElDataSrc.className = _itemSubType.toLowerCase();
                    _optionElDataSrc.value = _itemNameText;
                    _optionElDataSrc.innerHTML = _itemDisplayNameText;
                    $EventDataSourcePropertySelect.append(_optionElDataSrc);
                }

                if (_propertyItemNode.getAttribute('SubType').toLowerCase() === 'text') {
                    var _optionElDataSrcID = document.createElement('option');
                    _optionElDataSrcID.className = _itemSubType.toLowerCase();
                    _optionElDataSrcID.value = _itemNameText;
                    _optionElDataSrcID.innerHTML = _itemDisplayNameText;
                    $EventDataSourceIDPropertySelect.append(_optionElDataSrcID);
                }
            }

            if (!isDisplayGetSmartObjectData) {
                $valuePropertySelect.dropdown('refresh');
                $EventTitlePropertySelect.dropdown('refresh');
                $EventStartPropertySelect.dropdown('refresh');
                $EventEndPropertySelect.dropdown('refresh');
                $EventAllDayPropertySelect.dropdown('refresh');
                $EventEditablePropertySelect.dropdown('refresh');
                $EventSizeablePropertySelect.dropdown('refresh');
                $EventColorPropertySelect.dropdown('refresh');
                $EventTypePropertySelect.dropdown('refresh');
                $EventDataSourcePropertySelect.dropdown('refresh');
                $EventDataSourceIDPropertySelect.dropdown('refresh');
            }

            if (!_firstNameText) {
                _firstNameText = _propertyItemNodes[0].selectSingleNode('Name').text;
                _firstDisplayNameText = _propertyItemNodes[0].selectSingleNode('DisplayName').text;
            }

            var _guidAttr = _itemNode.getAttribute('Guid');

            $('#CalendarPropertyConfig_SOTextBox').val(_displayNameText).closest(".lookup-box").removeClass("none").addClass("smartobject");

            $('#CalendarPropertyConfig_TreeCont').attr({ selectedSO: _guidAttr, selectedSODisp: _displayNameText });

            this.soContextXml = _contextXml.xml;


            if (loadExisting) {
                var parsedxml = parseXML($('#propertyConfig_propertiesXml').val());
                var _controlPropertiesNode = parsedxml.documentElement.selectSingleNode('Control/Properties');
                var _propertyOrSmartObjectPropNodes = _propertiesNode.selectNodes('Prop[@serverControlType="property" or @serverControlType="smartobject"]');

                for (var i = 0, propertyOrSmartObjectPropNodesCount = _propertyOrSmartObjectPropNodes.length; i < propertyOrSmartObjectPropNodesCount; i++) {
                    var _idAttr = _propertyOrSmartObjectPropNodes[i].getAttribute('ID');
                    var _propertyNode = _controlPropertiesNode.selectSingleNode('Property[Name="'.concat(_idAttr, '"]'));

                    if (!!_propertyNode) {
                        switch (_idAttr) {
                            case 'ValueProperty':
                                var identifierSelected = parsedxml.selectSingleNode("//Controls/Control/Properties/Property[Name='ValueProperty']/Value").text
                                $valuePropertySelect.val(identifierSelected).dropdown('refresh');
                                break;
                            case 'DisplayTemplate':
                                var _value = _propertyNode.selectSingleNode('Value').text;
                                var _displayTemplateXml;
                                try { _displayTemplateXml = parseXML(_value); } catch (e) { };
                                if (!!_displayTemplateXml && !!_displayTemplateXml.documentElement && !_displayTemplateXml.getElementsByTagName('parsererror').length)
                                    this.setDisplayTemplateValues(this.transformXmlToTokenboxArray(_displayTemplateXml));
                                break;
                            case 'EventTitleField':
                                var eventTitleFieldSelected = parsedxml.selectSingleNode("//Controls/Control/Properties/Property[Name='EventTitleField']/Value").text
                                $EventTitlePropertySelect.val(eventTitleFieldSelected).dropdown('refresh');
                                break;

                            case 'EventStartField':
                                var eventStartFieldSelected = parsedxml.selectSingleNode("//Controls/Control/Properties/Property[Name='EventStartField']/Value").text
                                $EventStartPropertySelect.val(eventStartFieldSelected).dropdown('refresh');
                                break;
                            case 'EventEndField':
                                var eventEndFieldSelected = parsedxml.selectSingleNode("//Controls/Control/Properties/Property[Name='EventEndField']/Value").text
                                $EventEndPropertySelect.val(eventEndFieldSelected).dropdown('refresh');
                                break;
                            case 'EventAllDayField':
                                var eventAllDayFieldSelected = parsedxml.selectSingleNode("//Controls/Control/Properties/Property[Name='EventAllDayField']/Value").text
                                $EventAllDayPropertySelect.val(eventAllDayFieldSelected).dropdown('refresh');
                                break;
                            case 'EventEditableField':
                                var eventEditableFieldSelected = parsedxml.selectSingleNode("//Controls/Control/Properties/Property[Name='EventEditableField']/Value").text
                                $EventEditablePropertySelect.val(eventEditableFieldSelected).dropdown('refresh');
                                break;
                            case 'EventSizeableField':
                                var eventSizeableFieldSelected = parsedxml.selectSingleNode("//Controls/Control/Properties/Property[Name='EventSizeableField']/Value").text
                                $EventSizeablePropertySelect.val(eventSizeableFieldSelected).dropdown('refresh');
                                break;
                            case 'EventColorField':
                                var eventColorFieldSelected = parsedxml.selectSingleNode("//Controls/Control/Properties/Property[Name='EventColorField']/Value").text
                                $EventColorPropertySelect.val(eventColorFieldSelected).dropdown('refresh');
                                break;
                            case 'EventTypeField':
                                var eventTypeFieldSelected = parsedxml.selectSingleNode("//Controls/Control/Properties/Property[Name='EventTypeField']/Value").text
                                $EventTypePropertySelect.val(eventTypeFieldSelected).dropdown('refresh');
                                break;
                            case 'EventDataSourceField':
                                var eventDataSourceFieldSelected = parsedxml.selectSingleNode("//Controls/Control/Properties/Property[Name='EventDataSourceField']/Value").text
                                $EventDataSourcePropertySelect.val(eventDataSourceFieldSelected).dropdown('refresh');
                                break;
                            case 'EventDataSourceIDfield':
                                var eventDataSourceIDfieldSelected = parsedxml.selectSingleNode("//Controls/Control/Properties/Property[Name='EventDataSourceIDfield']/Value").text
                                $EventDataSourceIDPropertySelect.val(eventDataSourceIDfieldSelected).dropdown('refresh');
                                break;
                        }
                    }
                }

                var methodSelected = checkExists(parsedxml.selectSingleNode("//Controls/Control/Properties/Property[Name='AssociationMethod']/Value")) ? parsedxml.selectSingleNode("//Controls/Control/Properties/Property[Name='AssociationMethod']/Value").text : null;

                if (methodSelected != null) {
                    $listMethodSelect.val(methodSelected).dropdown('refresh');
                }
            }

            var displayTemplateObjects = this.tempDisplayTemplateObjects;
            this.initDefaultDisplayTemplate(displayTemplateObjects, _firstNameText, _firstDisplayNameText);
            var target = jQuery('#CalendarPropertyConfig_lookupBoxDisplayValue');
            target.val(this.transformDisplayTemplateObjectsToString(this.displayTemplateObjects));

            if (this.changeUseDisplaySO) {
                this.changeUseDisplaySO({ data: this });
            }

            popupManager.getLastModal().hideBusy();

            this.getItemsSuccessDropdownDone = true;
        }
    },

    CalendarConfigCancelClick: function () {
        popupManager.closeLast();
    },

    //initDefaultDisplayTemplate
    initDefaultDisplayTemplate: function (displayTemplateObjects, firstTextProp, firstTextDisplay) {
        if ((!displayTemplateObjects || displayTemplateObjects.length === 0) && !!firstTextProp && !!firstTextDisplay) {
            var soName = jQuery("#CalendarPropertyConfig_SOTextBox").val();
            displayTemplateObjects = [{ type: 'context', data: { SourceType: 'ObjectProperty', SourceID: firstTextProp, DataType: 'Text', icon: 'text' }, text: firstTextDisplay, tooltip: soName + " - " + firstTextDisplay }];
            this.setDisplayTemplateValues(displayTemplateObjects);

            var target = jQuery('#CalendarPropertyConfig_lookupBoxDisplayValue');
            jQuery('#CalendarPropertyConfig_lookupBoxDisplayValue').val('');
            target.val(this.transformDisplayTemplateObjectsToString(displayTemplateObjects));
            target.attr({ firstTextProp: firstTextProp, firstTextDisplay: firstTextDisplay });
        }
    },

    setDisplayTemplateValues: function (displayTemplateObjects) {
        if (!displayTemplateObjects)
            displayTemplateObjects = [];
        this.displayTemplateObjects = displayTemplateObjects;

        jQuery('#CalendarPropertyConfig_lookupBoxDisplayValue').val(this.transformDisplayTemplateObjectsToString(displayTemplateObjects));
        this.tempDisplayTemplateObjects = displayTemplateObjects;
    },

    transformDisplayTemplateObjectsToString: function (displayTemplateObjects) {
        var ret = '';
        if (displayTemplateObjects) {
            for (var i = 0; i < displayTemplateObjects.length; ++i) {
                var item = displayTemplateObjects[i];
                if (!item || (i === 0 && item.type == 'value' && (item.text == '&nbsp;' || item.text == ' ')))
                    continue;
                ret = ret.concat((item.type == 'value') ? ((item.text == '&nbsp;') ? ' ' : item.text) : ('[' + item.text + ']'));
            }
        }
        return ret;
    },

    transformXmlToTokenboxArray: function (xml) {
        var ret = [];

        var itemNodes = xml.documentElement.selectNodes('Item');

        for (var i = 0; i < itemNodes.length; ++i) {
            var itemNode = itemNodes[i];

            if (itemNode.getAttribute('SourceType') == 'Value') {
                var data = itemNode.selectSingleNode('SourceValue').text;
                if (data == '&nbsp;')
                    data = ' ';
                ret.push({ type: 'value', data: data, text: data });
            }
            else {
                var sourceType = itemNode.getAttribute('SourceType');
                var sourceID = itemNode.getAttribute('SourceID');
                var dataType = itemNode.getAttribute('DataType')
                var tokenData =
				{
				    SourceType: sourceType,
				    SourceID: sourceID,
				    DataType: dataType,
				    icon: dataType.toLowerCase()
				};
                var soName = jQuery("#pickerPropertyConfig_SOTextBox").val();
                var tokenObject =
				{
				    type: 'context',
				    data: tokenData,
				    text: sourceID,
				    tooltip: soName + " - " + sourceID
				};
                ret.push(tokenObject);
            }
        }

        return ret;
    },

    displayTemplatePopupOkClick: function (displayTemplateObjects) {
        if (!displayTemplateObjects || displayTemplateObjects.length === 0 || (displayTemplateObjects.length === 1 && (!displayTemplateObjects[0] || (displayTemplateObjects[0].type == 'value' && displayTemplateObjects[0].text.replace(/^\s+|\s+$/, '') == '')))) {
            popupManager.showWarning(Resources.CommonPhrases.DisplayTemplateEmptyValidateText);
        }
        else {
            this.setDisplayTemplateValues(displayTemplateObjects);
            popupManager.closeLast();
        }
    },

    showCalendarDisplayTemplatePopup: function (e) {
        var _propertyConfig = e.data;
        var _contextXml;

        var $propertyConfig_TreeCont = jQuery('#CalendarPropertyConfig_TreeCont');

        if (!$propertyConfig_TreeCont.attr('selectedSO')) {
            popupManager.showWarning($propertyConfig_TreeCont.attr('locSelectSOError'));
            return;
        }

        _contextXml = _propertyConfig.soContextXml;

        if (!!_propertyConfig.GM)
            _propertyConfig.GM.remove();

        var $propertyConfig_SOTreePage = jQuery('#CalendarPropertyConfig_SOTreePage');

        _propertyConfig.GM = new SourceCode.Forms.Widget.GenericMappings({
            container: 'CalendarPropertyConfig_DisplayTemplatePanel',
            hasExpressions: false,
            isTreeRightAligned: true,
            contentTitle: $propertyConfig_SOTreePage.attr('locDisplayItems'),
            contentId: 'propertyConfig_DisplayTemplatePanel_Container',
            contextXml: _contextXml
        });

        var newParent = jQuery('<table width="100%" height="100%"><tr><td style="vertical-align: top; padding: 0px; width: 1px;" /><td /></tr></table>');
        var newParentParent = jQuery('#propertyConfig_DisplayTemplatePanel_Container').parent().parent();
        newParentParent.append(newParent);
        newParent.find('td:eq(0)').append('<div class="form-field required" style="width: 1px;"><label class="form-field-label" style="width: 1px; padding: 1px;">&nbsp;</label></div>');
        newParent.find('td:eq(1)').append(jQuery('#propertyConfig_DisplayTemplatePanel_Container').parent());

        var _droppableContainerEl = jQuery('<div />');
        jQuery('#propertyConfig_DisplayTemplatePanel_Container').append(_droppableContainerEl);

				var inputHtml = "<input class=\"input-control token-input\"/>";
				var input = jQuery(inputHtml);
        //var input = jQuery('<input class="input-control token-input { watermark: \'' + Resources.Designers.ItemsRequired + '\' }\"/>');
        jQuery(_droppableContainerEl).append(input);

        input.tokenbox({
            accept: '.ui-draggable', wysiwyg: { enabled: false }, multiline: false, watermark: Resources.Designers.ItemsRequired,
            drop: function (ev, ui) {
                var node = ui.draggable; 
                var tooltip = "";
                while (node.length === 1) {
                    var text = node.text();
                    if (text != "" && node.is(":visible"))
                        tooltip = text + (tooltip == "" ? "" : (" - " + tooltip));
                    node = node.closest("ul").parent().closest("li").find("a:first");
                }
                jQuery(ev.originalEvent.target).children("span:last").find("span").attr("title", tooltip);
            },
            watermark: Resources.Designers.ItemsRequired.htmlEncode()
        });

        //_propertyConfig.GM.dropItem.addDroppables([_droppableContainerEl[0]]);
        popupManager.showPopup({
            id: 'CalendarPropertyConfig_DisplayTemplatePanelOutside',
            buttons:
			[
				{
				    text: Resources.WizardButtons.OKButtonText,
				    click: function () {
				        var displayTemplateObjects = input.tokenbox('value');
				        for (var i = 0; i < displayTemplateObjects.length; ++i) {
				            var token = displayTemplateObjects[i];
										if (token.text === "") {
				            //if (token.text == "") {
				                displayTemplateObjects.splice(i, 1);
				                --i;
				                continue;
				            }
				        }
				        CalendarPropertyConfig.prototype.displayTemplatePopupOkClick.call(_propertyConfig, displayTemplateObjects);
						//		this.displayTemplatePopupOkClick(displayTemplateObjects);
				    } 
				},
				{
				    id: 'CalendarPropertyConfig_DisplayTemplatePanelCancelBtn',
				    text: Resources.WizardButtons.CancelButtonText,
				    click: function () { }
				}
			],
            headerText: jQuery('#CalendarPropertyConfig_DisplayTemplatePanel').attr('locDisplayTemplateHeader'),
            draggable: true,
            content: jQuery('#CalendarPropertyConfig_DisplayTemplatePanel'),
            width: 700,
            height: 287,
            closeWith: 'CalendarPropertyConfig_DisplayTemplatePanelCancelBtn'
        });

        _propertyConfig.displayTemplateObjects = _propertyConfig.tempDisplayTemplateObjects

        if (!!_propertyConfig.displayTemplateObjects && !!_propertyConfig.displayTemplateObjects.length) {
            for (var i in _propertyConfig.displayTemplateObjects) {
                var o = _propertyConfig.displayTemplateObjects[i];
                if (o.type == 'context') {
                    var soName = jQuery("#CalendarPropertyConfig_SOTextBox").val();
                    o.tooltip = soName + " - " + o.text;
                }
            }
            input.tokenbox('value', _propertyConfig.displayTemplateObjects);
        }
    },

    CalendarConfigClose: function (callback) {
        callback();
        $('#CalendarPropertyConfig_SOTreePage, #CalendarPropertyConfig_DataSrcPage, #CalendarPropertyConfig_DisplayTemplatePanel').remove();
    },

    CalendarConfigOkClick: function () {

        var _warning;
        if (!$('#CalendarPropertyConfig_SOTextBox').val()) {
            popupManager.showWarning("A SmartObject must be specified.");
        }
        else if (!$('#CalendarPropertyConfig_ddListValueProperty').val()) {
            popupManager.showWarning("The Value Property must be specified.");
        }
        else if (!$('#CalendarPropertyConfig_ddListTitlePropertyName').val()) {
            popupManager.showWarning("The Event Title Property must be specified.");
        }
        else if (!$('#CalendarPropertyConfig_ddListsDatePropertyName').val()) {
            popupManager.showWarning("The Event Start Date Property must be specified.");
        }
        else if (!$('#CalendarPropertyConfig_ddListeDatePropertyName').val()) {
            popupManager.showWarning("The Event End Date Property must be specified.");
        }
        else {
            var xmlDoc = parseXML(document.getElementById('propertyConfig_propertiesXml').value);
            var listOfPropsAndMethods = this.fullXml.selectNodes('/Properties/Prop[@serverControlType="property" or @serverControlType="listmethod" or @serverControlType="smartobject"]');

            for (var k = 0; k < listOfPropsAndMethods.length; k++) {
                var name = listOfPropsAndMethods[k].getAttribute('ID');
                var category = listOfPropsAndMethods[k].getAttribute('category');

                if (this.saveXmlValues(name, xmlDoc) === false)
                    return;
            }

            popupManager.closeLast({
                cancelOnClose: true
            });

            $('#CalendarPropertyConfig_SOTreePage').remove();
            $('#CalendarPropertyConfig_DataSrcPage').remove();

            this.callback(1, xmlDoc.xml);
        }
    },

    dialogOkClick: function () {
        $(document.getElementById('imagePropertyConfig_dialogPanel')).add('.complex-property-config-wrapper').remove();
    },

    FormOrViewName: function () {
        return $(SourceCode.Forms.Designers.Common.getDefinitionNode()).find('Name')[0].text;
    },

    _setControlProperty: function (context) {
        var designerName = ControlHelper.getDesignerName(context.designerDefinition);
        ControlHelper.setControlProperty(context.designerDefinition, context.controlId, "AssociationSO", "PDF File");
        ControlHelper.setControlProperty(context.designerDefinition, context.controlId, "FileName", designerName);

        if (context.designerType == "view") {
            setTimeout(function () {
                context.designer.PropertyGrid.refresh();
            }, 500);
        }
    },

    preventBack: function (e) {
        if (e.keyCode == 8) {
            e.preventDefault();
            e.stopPropagation();
        }
    }
};


