var CLS_EACHFIELD = "st-eachfield";
var CLS_ROW = "st-row";
var CLS_EACHFIELD_ROW = CLS_EACHFIELD + ' ' + CLS_ROW;
var CLS_LABEL_AREA = "st-label-area";
var CLS_INPUT_AREA = "st-input-area";
var CLS_ERROR_MSG = "st-error-msg";
var CLS_LABEL = "st-label-txt";
var CLS_INPUT = "form-control";
var CLS_FIELDSET= "st-fs01";
var CLS_ARRAY_WIDGET = "st-array-widget";
var CLS_ARRAY_BTN = "st-array-btn";

UiForm.prototype.rawObj = {};
UiForm.prototype.objOriginal = {};
UiForm.prototype.obj2Edit = {};
UiForm.prototype.parentOid = undefined;
UiForm.prototype.locationId = '';
UiForm.prototype.forPrint = false;
UiForm.prototype.myName = '';
UiForm.prototype.baseUrl = '';
UiForm.prototype.beOperation = 'save';
UiForm.prototype.title= '';
UiForm.prototype.sourceToBeRemove = [];

var sliderAnimationMode = 'fade';
var sliderMasterName = "masterDiv";
if (typeof UiUtil === 'undefined' || UiUtil === null) {
	UiUtil = {}; // to avoid nb warning
}
function UiForm() {
};
UiForm.prototype.scrollAndFocus = function() {
	var masterDiv = document.getElementById(this.locationId);
	var focusable = masterDiv.querySelectorAll('input, select, textarea');
	var firstFocusable = focusable[0];
	$(firstFocusable).focus();
};
UiForm.prototype.assignValue = function(aIndex, aWidget, aFqn) { 
	if (UiUtil.NotUndefineNotNull(this.rawObj)) {
		if (UiUtil.NotUndefineNotNull(this.rawObj.dataset)) {
			if (UiUtil.NotUndefineNotNull(this.rawObj.dataset[aIndex])) {
				var editObj  = this.rawObj.dataset[aIndex];
				UiUtil.JsonAssignment(editObj, aFqn, aWidget.value); 
			}
		}
	}
};
UiForm.prototype.getValue = function(aIndex, aFqn) { 
	var editObj  = this.rawObj.dataset[aIndex];
	var varObj = UiUtil.GetVarByJsonPath(editObj, aFqn);
	return(varObj.data);
};
UiForm.prototype.beAction= function(aMsg, aIndex, aActionKeyword, aUrl, aBeSucc) { 
	var editObj  = this.rawObj.dataset[aIndex];
	UiUtil.BeActionWithMsg(aMsg, editObj, aActionKeyword, aUrl, aBeSucc);
};
UiForm.GetHtmlEditorValue = function(aHtmlEditor) {
	aHtmlEditor.nicInstances[0].saveContent();
	var jsVar = aHtmlEditor.nicInstances[0].content;
	return(jsVar);
};
// new version is above this line



function UiForm(aVarName) { 
	this.myName = aVarName; // use in html pages to call function for this object
};
UiForm.prototype.ClearAndDisplayObject = function(aObj2Edit) {
	var locationElement = document.getElementById(this.locationId);
	UiUtil.RemoveNode(locationElement);
	this.displayObject(this.locationId, aObj2Edit, this.title, this.baseUrl);
};
UiForm.prototype.displayObject = function(aLocationId, aObj2Edit, aTitle, aBaseUrl) {
	var tmpAry = {};
	tmpAry.meta = aObj2Edit.meta;
	if (tmpAry.meta === undefined) tmpAry.meta = {};
	if (tmpAry.meta.desc === undefined) {
		tmpAry.meta.desc = 'undefined';
		if (aTitle !== undefined) {
			tmpAry.meta.childName = aTitle;
			this.title = aTitle;
		}
	}
	tmpAry.dataset = [];
	tmpAry.dataset.push(aObj2Edit);
	this.displayUiForm(aLocationId, tmpAry, 0, aBaseUrl);
};
UiForm.prototype.displayUiForm = function(aLocationId, aObj2Edit, aIdx, aBaseUrl) {
	if (aLocationId === undefined || aLocationId === null) {
		alert("The UiForm constructor takes two arguments:\n- name (string)\n- json object\n\nGot instead " + (typeof aLocationId) + " and " + (typeof aObj2Edit) + ".");
		return;
	}
	if (aObj2Edit === undefined || aObj2Edit === null) {
		alert("The UiForm constructor takes two arguments:\n- name (string)\n- json object\n\nGot instead " + (typeof aLocationId) + " and " + (typeof aObj2Edit) + ".");
		return;
	}
	if (aObj2Edit.dataset === undefined || aObj2Edit.dataset === null) {
		alert("The UiForm constructor takes a JSON object that must contain dataset field");
		return;
	}
	this.baseUrl = aBaseUrl;
	this.locationId = aLocationId;
	this.rawObj = aObj2Edit;
	this.obj2Edit = aObj2Edit.dataset[aIdx];
	this.objOriginal = jQuery.extend(true, {}, this.obj2Edit);
	this.title = aObj2Edit.meta.childName;
	if (this.title === undefined) {
		this.title = 'Undefined';
	}

	var masterDiv = document.createElement('div');
	$(masterDiv).css('margin-left', '5px');
	$(masterDiv).css('margin-right', '5px');

	var btnSetTop = document.createElement("fieldset");
	$(btnSetTop).css('cssText', 'padding-bottom: 0px; border: none; float: right; text-align: right; width: 100%');
	var btnSaveTop = this.createButton('Save', 'btnSaveTop');
	var btnCancelTop = this.createButton('Cancel', 'btnCancelTop');
	btnCancelTop.style.marginRight = '2px';
	//btnCancelTop.style.display = 'inline-block';
	btnSaveTop.setAttribute('onclick', this.myName + '.saveObject()');
	btnCancelTop.setAttribute('onclick', this.myName + '.cancelEdit()');
	btnCancelTop.setAttribute('disabled', true);
	btnSetTop.appendChild(btnCancelTop);
	btnSetTop.appendChild(btnSaveTop);
	masterDiv.appendChild(btnSetTop);

	var setSeqNum = {value: '', prefix: '', startNum: 0, cls: CLS_FIELDSET}; // for numbering fieldset, uses object to for pass by ref
	var childSet = this.createChildSet(masterDiv, this.title, false, UiForm.plusOne(setSeqNum));
	var avoidRecursive = [];
	avoidRecursive.push({clasz: this.obj2Edit.clasz, Oid: this.obj2Edit.objectId});
	this.editAreaRecursion(this.obj2Edit, masterDiv, childSet, "", "", 0, true, avoidRecursive, setSeqNum, false);

	var btnSetBottom = document.createElement("fieldset");
	$(btnSetBottom).css('cssText', 'padding-bottom: 0px; border: none; float: right; text-align: right; width: 100%; margin-top: 10px; margin-bottom: 10px');
	var btnSaveBottom = this.createButton('Save', 'btnSaveBottom');
	var btnCancelBottom = this.createButton('Cancel', 'btnCancelBottom');
	btnCancelBottom.style.marginRight = '2px';
	//btnCancelBottom.style.display = 'inline-block';
	btnSaveBottom.setAttribute('onclick', this.myName + '.saveObject()');
	btnCancelBottom.setAttribute('onclick', this.myName + '.cancelEdit()');
	btnCancelBottom.setAttribute('disabled', true);
	btnSetBottom.appendChild(btnCancelBottom);
	btnSetBottom.appendChild(btnSaveBottom);
	masterDiv.appendChild(btnSetBottom);

	var masterDivPage = UiUtil.GetActiveSlideElement(this.locationId);
	$(masterDivPage).empty();
	masterDivPage.appendChild(masterDiv);

	this.setOk(masterDivPage);
	return(masterDivPage);
};
UiForm.prototype.editAreaRecursion = function(aObj2Display, aMasterSet, aChildSet, aParentFqnName, aObjName, aObjIdx, aUnestedFeel, aAvoidRecursive, aSetNum, aNoChildSet) {
	if(aNoChildSet === undefined) aNoChildSet = false;
	var cntrField = 0;
	aParentFqnName = UiUtil.GetJsonPath(aParentFqnName, aObjName);
	var rootSet = null;
	for (var cntr in aAvoidRecursive) {
		if (aAvoidRecursive[cntr].Oid === String(aObj2Display.objectId) && aAvoidRecursive[cntr].clasz === aObj2Display.clasz) {
			return;
		}
	}

	for(var key in aObj2Display.data) {
		if (aObj2Display.data[key].dontDisplay !== undefined) continue;
		var fieldName = key;
		var fieldValue  = aObj2Display.data[fieldName];
		var titleStr = $(aChildSet.getElementsByTagName('legend')).text();
		if (this.isSystemField(fieldName) === false) {
			if (UiUtil.IsCustomWidget(fieldValue)) {
				this.createCustomWidget(fieldName, fieldValue, aChildSet, aParentFqnName);
				cntrField++;
			} else if ((fieldValue.data !== undefined && typeof(fieldValue.data) !== 'object') || fieldValue.lookup === true) { // atomic fields
				var fieldType = fieldValue.type;
				var fieldMask = fieldValue.mask;
				var labelName = fieldName;
				var inputField = this.createWidget(labelName, fieldValue, aParentFqnName, fieldType, fieldMask);
				if (inputField !== null) {
					if (aChildSet === null && rootSet === null && aNoChildSet === false) { // create new rootSet when order sequence grouping changes i.e. displayPosition 
						if (aUnestedFeel === true)	
							rootSet = this.createChildSet(aMasterSet, fieldName, true, UiForm.plusOne(aSetNum));
						else
							rootSet = this.createChildSet(aChildSet, fieldName, true, UiForm.plusOne(aSetNum));
						titleStr = $(rootSet.getElementsByTagName('legend')).text();
					} else {
						rootSet = aChildSet;
					}
					rootSet.appendChild(inputField);
					cntrField++;
				}
			} else { // handle object fields i.e. fieldobject and fieldobjectbox
				if ((fieldValue.dataset !== undefined || typeof(fieldValue.data) === 'object') && (fieldValue.lookup === undefined || fieldValue.lookup === false)) {
					rootSet = null; // displayPosition change, so new grouping for coming atomic fields, if any
					var newSet = aChildSet;
					titleStr = $(newSet.getElementsByTagName('legend')).text();

					var nextUnestedFeel = false;
					if ($.isArray(fieldValue.dataset)) { // its fieldobjectbox
						var nextNum = jQuery.extend({}, aSetNum);
						if (aNoChildSet === false) {
							if (aUnestedFeel === true) {
								nextNum = UiForm.plusOne(aSetNum);
							} else {
								nextNum = UiForm.nextLevelNumbering(aSetNum);
								nextUnestedFeel = true;
								aUnestedFeel = true;
							}
							newSet = this.createChildSet(aMasterSet, fieldName, true, nextNum);
							titleStr = $(newSet.getElementsByTagName('legend')).text();
						}
						var slideId = this.createIdStr(titleStr, '_slide');
						var slideNxt = this.createIdStr(titleStr, '_nxt');

						var nxtbtn = $(newSet).find("[id^=nextbtn]"); 
						var newbtn = $(newSet).find("[id^=newbtn]"); //.find('#newbtn')[0];
						var deletebtn = $(newSet).find("[id^=deletebtn]"); //.find('#deletebtn')[0];

						var divForSlideMaster = document.createElement('div');
						divForSlideMaster.setAttribute('id', slideId);
						newSet.appendChild(divForSlideMaster);
						var strClsz = fieldValue.clasz;
						var cntrObj;
						var cntrSlide = 0;
						for (cntrObj = 0; cntrObj < fieldValue.dataset.length; cntrObj++) {
							var aryIdx = "[" + cntrObj + "]";
							if (this.isUiMaster(fieldValue.dataset[cntrObj])) {
								aAvoidRecursive.push({clasz: fieldValue.dataset[cntrObj].clasz, Oid: fieldValue.dataset[cntrObj].objectId});
								this.editAreaRecursion(fieldValue.dataset[cntrObj], aMasterSet, newSet, aParentFqnName, fieldName + aryIdx, cntrObj, nextUnestedFeel, aAvoidRecursive, nextNum, false);
								aAvoidRecursive.pop();
							} else if (UiUtil.IsCustomWidget(fieldValue)) {
								this.createCustomWidget(fieldName, fieldValue.dataset[cntrObj], divForSlideMaster, aParentFqnName);
							} else {
								var divForSlideChild = document.createElement('div');
								divForSlideMaster.appendChild(divForSlideChild);
								aAvoidRecursive.push({clasz: fieldValue.dataset[cntrObj].clasz, Oid: fieldValue.dataset[cntrObj].objectId});
								fieldValue.dataset[cntrObj].slideNo = cntrSlide++;
								this.editAreaRecursion(fieldValue.dataset[cntrObj], aMasterSet, divForSlideChild, aParentFqnName, fieldName + aryIdx, cntrObj, nextUnestedFeel, aAvoidRecursive, nextNum, false);
								aAvoidRecursive.pop();
							}
						}

						this.setupAryCtrl(cntrObj, newbtn, deletebtn, nxtbtn, strClsz, titleStr, slideId, slideNxt, newSet, aParentFqnName, fieldName); // can refactor this at ediatAreaRecursion later
					} else { // its fieldobject
						var nextNum = jQuery.extend({}, aSetNum);
						if (this.isUiMaster(fieldValue) && aNoChildSet === false) {
							if (aUnestedFeel === true) {
								nextNum = UiForm.plusOne(aSetNum);
							} else {
								nextNum = UiForm.nextLevelNumbering(aSetNum);
								nextUnestedFeel = true;
								aUnestedFeel = true;
							}
							newSet = this.createChildSet(aMasterSet, fieldName, true, nextNum);
							titleStr = $(newSet.getElementsByTagName('legend')).text();
						}
	
						if (UiUtil.IsCustomWidget(fieldValue)) {
							this.createCustomWidget(fieldName, fieldValue, newSet, aParentFqnName);
						} else {
							aAvoidRecursive.push({clasz: fieldValue.data.clasz, Oid: fieldValue.data.objectId});
							this.editAreaRecursion(fieldValue, aChildSet, newSet, aParentFqnName, fieldName, 0, nextUnestedFeel, aAvoidRecursive, nextNum, false);
							aAvoidRecursive.pop();
						}

						if (this.isUiMaster(fieldValue)) {
							if ($(newSet).find('.' + CLS_EACHFIELD).length !== 0) {
								var newbtn = $(newSet).find("[id^=newbtn]"); //.find('#newbtn')[0];
								var elem = $(this.doHref('', fieldValue.clasz, titleStr, aParentFqnName, fieldName))[0];
								newbtn[0].appendChild(elem);

								var delbtn = $(newSet).find("[id^=deletebtn]")[0]; // .find('#deletebtn')[0];
								elem = $(this.doHref('[Delete]', fieldValue.clasz, titleStr, aParentFqnName, fieldName))[0];
								delbtn.appendChild(elem);
							} else {
								var newbtn = $(newSet).find("[id^=newbtn]"); //.find('#newbtn')[0];
								var elem = $(this.doHref('[New]', fieldValue.clasz, titleStr, aParentFqnName, fieldName))[0];
								newbtn[0].appendChild(elem);

								var delbtn = $(newSet).find("[id^=deletebtn]")[0]; //.find('#deletebtn')[0];
								elem = $(this.doHref('', fieldValue.clasz, titleStr, aParentFqnName, fieldName))[0];
								delbtn.appendChild(elem);
							}
						}
					}
				}
			}
		}
	}
};
UiForm.prototype.createCustomWidget = function(aName, aValue, aSet, aBasePath) {
	var result = true;
	var widgetGrp;
	if (this.forPrint === false) {
		var fieldFqn = UiUtil.GetJsonPath(aBasePath, aName);
		if (aValue.type === "mobilephone" ) {
			var mbl = UiUtil.CreateMobilePhone(aName, aValue, fieldFqn);
			if (mbl !== undefined) {
				aSet.appendChild(mbl);
			}
		} else if (aValue.type === "date" ) {
			widgetGrp = UiUtil.CreateDatePicker(aName, aValue, true, false, fieldFqn);
			aSet.appendChild(widgetGrp);
		} else if (aValue.type === "datetime" ) {
			widgetGrp = UiUtil.CreateDatePicker(aName, aValue, true, true, fieldFqn);
			aSet.appendChild(widgetGrp);
		} else if (aValue.type === "html" ) {
			widgetGrp = UiUtil.CreateHtmlField(aName, aValue, fieldFqn);
			aSet.appendChild(widgetGrp);
		} else if (aValue.type === 'telephone' ) {
			var tel = UiUtil.CreateTelephone(aName, aValue, fieldFqn);
			if (tel !== undefined) {
				aSet.appendChild(tel);
			}
		} else if (aValue.type === 'money' ) {
			var mny = UiUtil.CreateMoney(aName, aValue, fieldFqn);
			if (mny !== undefined) {
				aSet.appendChild(mny);
			}
		} else if (aValue.type === 'boolean' ) {
			var chkbxArea = UiUtil.CreateCheckBox(aName, aValue, fieldFqn);
			var chkbx = chkbxArea.getElementsByTagName("input")[0];
			aSet.appendChild(chkbxArea);
		} else if (aValue.type === 'country' ) {
			var inputArea = UiUtil.CreateComboBox(aName, fieldFqn);
			var cmb = inputArea.getElementsByTagName("select")[0];
			cmb.toBeEmpty = [];
			var childFqn = fieldFqn.replace('Country', 'State'); // change fieldFqn last field to state
			UiUtil.PopulateComboBoxWithName(cmb, aValue.option, aValue.data);
			UiUtil.SetupMasterChildComboBox(cmb, this.myName, fieldFqn, childFqn);
			aSet.appendChild(inputArea);
		} else if (aValue.type === 'state' ) {
			var inputArea = UiUtil.CreateComboBox(aName, fieldFqn);
			var cmb = inputArea.getElementsByTagName("select")[0];
			cmb.toBeEmpty = [];
			var childFqn = fieldFqn.replace('State', 'City');
			UiUtil.SetupMasterChildComboBox(cmb, this.myName, fieldFqn, childFqn);
			aSet.appendChild(inputArea);
			UiUtil.PopulateMasterChildCmbx(cmb, fieldFqn, aValue, this.obj2Edit);
		} else if (aValue.type === 'city' ) {
			var inputArea = UiUtil.CreateComboBox(aName, fieldFqn);
			var cmb = inputArea.getElementsByTagName("select")[0];
			aSet.appendChild(inputArea);
			UiUtil.PopulateMasterChildCmbx(cmb, fieldFqn, aValue, this.obj2Edit);

			var cmbState = $(cmb).parents('.' + CLS_EACHFIELD).prev().find('select');
			if (cmbState.length !== 0) {
				var cmbCountry = cmbState.parents('.' + CLS_EACHFIELD).prev().find('select');
				if (cmbCountry.length !== 0) {
					cmbCountry[0].toBeEmpty.push(cmb);
				}
			}
		} else {
			result = false;
		}
	} else {
		if (aValue.type === undefined) {
			result = false;
		} else {
			var printTxt = document.createElement("span");
			printTxt.setAttribute("class", "print-field");
			printTxt.innerHTML = aValue.data;
			var printField = UiUtil.CreateTextFieldWithLabel(aName, printTxt);
			aSet.appendChild(printField);
		}
	}
	return(result);
};
UiForm.prototype.createWidget = function(fieldName, fieldValue, aBasePath, fieldType, fieldMask) {
	var widgetGrp = null;
	if (this.forPrint === false) {
		var fieldFqn = UiUtil.GetJsonPath(aBasePath, fieldName);
		if (fieldValue.lookup === true) {
			widgetGrp = UiUtil.CreateComboBox(fieldName, fieldFqn);
			var cmb = widgetGrp.getElementsByTagName("select")[0];
			cmb.UiForm = this;
			if (UiUtil.NotUndefineNotNullNotBlank(fieldValue.editable)) {
				if (fieldValue.editable === true) {
					var inputElem = document.createElement("input");
					$(inputElem).attr("type", "text");
					inputElem.onkeypress = function(evt) { UiUtil.OnKeyPrintable(evt, function() {
						$(cmb).val(''); // if enter textfield, remove combobox value
					}); };
					cmb.parentNode.append(inputElem);
					$(cmb).attr("onchange", "$(this).parent().find('input').val('')"); // if enter combobox, remove textfield value
				}
			}
			//UiForm.populateComboBoxWithName(cmb, fieldValue.option, fieldValue.data);
			UiUtil.PopulateComboBoxWithName(cmb, fieldValue.option, fieldValue.data);
		} else {
			widgetGrp = UiUtil.CreateTextField(fieldName, fieldValue.data, fieldValue.size, undefined, fieldType, fieldMask, fieldFqn);
			var txtField = widgetGrp.getElementsByTagName("input")[0];
			txtField.UiForm = this;
		}

		if (this.obj2Edit.objectId !== -1) {
			this.setUpdateableOnWidget(fieldValue, widgetGrp);
		}

		this.setChangeableOnWidget(fieldValue, widgetGrp);
	} else {
		var printTxt = document.createElement("span");
		printTxt.setAttribute("class", "print-field");
		printTxt.innerHTML = fieldValue.data;
		widgetGrp = UiUtil.CreateTextFieldWithLabel(fieldName, printTxt);
	}
	
	return(widgetGrp);
};
UiForm.prototype.createChildSet = function(masterSet, setName, isArray, seqNum) {
	if (typeof seqNum !== 'undefined' && seqNum !== null) setName = seqNum.value + '. ' + setName; 
	var childSet = this.createFieldset(setName);
	if (typeof seqNum !== 'undefined' && seqNum !== null) $(childSet).addClass(seqNum.cls);
	if (isArray) {
		var aryCtrl = document.createElement('div');
		aryCtrl.setAttribute('id', 'st-aryctrl');
		aryCtrl.setAttribute('class', CLS_ARRAY_WIDGET);

		var spNext= document.createElement('span');
		spNext.setAttribute('class', CLS_ARRAY_BTN);
		spNext.setAttribute('id', 'nextbtn_' + UiUtil.GetRandom5());
		spNext.innerHTML = '';

		var spDelete = document.createElement('span');
		spDelete.setAttribute('class', CLS_ARRAY_BTN);
		spDelete.setAttribute('id', 'deletebtn_' + UiUtil.GetRandom5());
		spDelete.innerHTML = '';

		var spNew = document.createElement('span');
		spNew.setAttribute('class', CLS_ARRAY_BTN);
		spNew.setAttribute('id', 'newbtn_' + UiUtil.GetRandom5());
		spNew.innerHTML = '';

		aryCtrl.appendChild(spNext);
		aryCtrl.appendChild(spDelete);
		aryCtrl.appendChild(spNew);

		childSet.appendChild(aryCtrl);
	}
	var appdObj = masterSet.appendChild(childSet);
	var prevObj = $(appdObj).prev()[0]; // place a div for spacing top margin purpose
	if (prevObj !== undefined) {
		if (prevObj.tagName.toLowerCase() === 'div') {
			var divMrg = document.createElement('div');
			divMrg.style.marginTop = "20px";
			$(prevObj).after(divMrg);
		}
	}
	return(childSet);
};
UiForm.prototype.setupAryCtrlButton = function(aTargetField, aFieldsetTitle, aSlideId, aSlideNxt, aBasePath, aTargetName) {
	var setMaster = UiUtil.GetActiveSlideElement(this.locationId);
	var setChild = $(setMaster).find('legend').filter(':contains("' + aFieldsetTitle + '")');
	setChild = $(setChild).parent()[0];
	var btn1 = $(setChild).children('#st-aryctrl').children('[id^=newbtn]');
	var btn2 = $(setChild).children('#st-aryctrl').children('[id^=deletebtn]');
	var btn3 = $(setChild).children('#st-aryctrl').children('[id^=nextbtn]');
	var totalMember = 0;
	for (var cntr = 0; cntr < aTargetField.dataset.length; cntr++) {
		if (aTargetField.dataset[cntr].delete === undefined) {
			totalMember++;
		}
	}
	this.setupAryCtrl(totalMember, btn1, btn2, btn3, aTargetField.clasz, aFieldsetTitle, aSlideId, aSlideNxt, setChild, aBasePath, aTargetName); // can refactor this at ediatAreaRecursion later
};
UiForm.prototype.setupAryCtrl = function(cntrObj, newbtn, deletebtn, nxtbtn, strClsz, fieldsetName, slideId, slideNxt, slideSet, basePath, targetName) {
	var strNext = 'Next>>';
	if (cntrObj === 0) {
		strNext = '';
		newbtn[0].innerHTML = this.doHref('[New]', strClsz, fieldsetName, basePath, targetName);
		if (deletebtn !== undefined) {
			deletebtn[0].innerHTML = this.doHref('', strClsz, fieldsetName, basePath, targetName);
		}
	} else if (cntrObj === 1) {
		strNext = '';
		newbtn[0].innerHTML = this.doHref('[New]', strClsz, fieldsetName, basePath, targetName);
		if (deletebtn !== undefined) {
			deletebtn[0].innerHTML = this.doHref('[Delete]', strClsz, fieldsetName, basePath, targetName);
		}
	} else if (cntrObj > 1) {
		newbtn[0].innerHTML = this.doHref('[New]', strClsz, fieldsetName, basePath, targetName);
		if (deletebtn !== undefined) {
			deletebtn[0].innerHTML = this.doHref('[Delete]', strClsz, fieldsetName, basePath, targetName);
		}
		if (typeof nxtbtn[0] !== 'undefined') {
			nxtbtn[0].setAttribute('id', slideNxt);
			nxtbtn[0].innerHTML = strNext;
		}
	} else {
	}

	var nxtspan = document.getElementById(slideNxt);
	if (UiUtil.NotUndefineNotNull(nxtspan)) {
		nxtspan.innerHTML = strNext;
	}

	var scriptElem = document.getElementById(slideId + "_script");
	if (UiUtil.IsUndefineOrNull(scriptElem)) {
		var slideScript = document.createElement('script');
		slideScript.id = slideId + "_script";
		slideScript.setAttribute('type', 'text/javascript');
		
		slideScript.innerHTML = "\n" + "//<![CDATA[ " + "\n"
		+ "	$(document).ready(function(){ " 
		+ "var masterSlider = document.getElementById('" + slideId + "');"
		+ "var nextBtn = document.getElementById('" + slideNxt + "');"
		+ "UiUtil.CreateUpdateVerticalSlider(masterSlider, nextBtn);"
		+ "});"
		+ "\n" + "//]]>" + "\n";
		slideSet.appendChild(slideScript);
	} else {
		var masterSlider = document.getElementById(slideId);
		var nextBtn = document.getElementById(slideNxt);
		UiUtil.CreateUpdateVerticalSlider(masterSlider, nextBtn);
		this.enableSlide(slideId);
	} 
};
UiForm.prototype.doHref = function(innerLabel, strClsz, titleStr, basePath, fieldName) {
	var clickAction;
	var result = '';
	if (innerLabel.indexOf('New') >= 0) {
		clickAction =	this.myName + "." + "newFieldObject('" + strClsz + "', '" + titleStr + "', '" + basePath + "', '" + fieldName + "');";
		result = '<a href="javascript:void(0)" onclick="' + clickAction + 'return false;">' + innerLabel + '</a>';
	} else if (innerLabel.indexOf('Delete') >= 0) {
		clickAction =	this.myName + "." + "deleteFieldObject('" + titleStr + "', '" + basePath + "', '" + fieldName + "');";
		result = '<a href="javascript:void(0)" onclick="' + clickAction + 'return false;">' + innerLabel + '</a>';
	} else {
		result = '<a href="javascript:void(0)">' + innerLabel + '</a>';
	}
	return(result);
};
UiForm.prototype.isSystemField = function(aName) {	
	var result = false;
	if (aName === "uimaster") {
		result = true;
	} else if (aName === "objectId") {
		result = true;
	} else if (aName === "clasz") {
		result = true;
	}
	return(result);
};
UiForm.prototype.createIdStr = function(fieldName, postfix) {
	var strId = fieldName.replace(/\s+/g, '_') + postfix;
	strId = strId.split('.').join('');
	return(strId);
};
UiForm.prototype.isUiMaster = function(each) {	
	var result = false;
	if (each.uimaster === true) {
		result = true;
	}
	return(result);
};
UiForm.prototype.createFieldset = function(displayLabel) {
	var fset = document.createElement("fieldset");
	var lgnd = document.createElement("legend");
	lgnd.innerHTML = displayLabel;
	fset.appendChild(lgnd);

	return(fset);
};
UiForm.prototype.createButton = function(btnLabel, btnId) {
	var newBtn = document.createElement('button');
	newBtn.innerHTML = btnLabel;
	newBtn.style.cursor = 'pointer';
	newBtn.style.width = '80px';
	newBtn.setAttribute('id', btnId);
	return(newBtn);
};
/*
UiForm.populateComboBoxWithName = function(cmb, jsonObj, chosen) {
	var opt = document.createElement("option"); 
	opt.value = ""; 
	opt.innerHTML = ""; 
	cmb.appendChild(opt); 

	if (jsonObj !== undefined) {
		$.each(jsonObj, function(name, value)  { 
			var opt = document.createElement("option"); 
			opt.value = name; 
			opt.innerHTML = name; 
			if (name === chosen) {
				opt.setAttribute("selected", '');
			}
			cmb.appendChild(opt); 
		});
	}
};
*/
UiForm.changeValueBoolean = function(aFqn, aWidget) { 
	if (UiUtil.NotUndefineNotNull(aWidget.UiForm) === false) {
		return;
	}
	var value = "false";
	if ($(aWidget).prop("checked") === true) {
		value = "true";
	}
	UiUtil.JsonAssignment(aWidget.UiForm.obj2Edit, aFqn, value); 
};
UiForm.changeValue = function(aFqn, aWidget) { 
	if (UiUtil.NotUndefineNotNull(aWidget.UiForm) === false) {
		return;
	}
	UiUtil.JsonAssignment(aWidget.UiForm.obj2Edit, aFqn, aWidget.value); 
};
UiForm.changeHtmlField = function(aFqn, aWidget) { 
	if (UiUtil.NotUndefineNotNull(aWidget.UiForm) === false) {
		return;
	}
	// ignore this damn <br> html element place in by HtmlEditor widget
	if (aWidget.value !== "<br>") {
		UiForm.changeValue(aFqn, aWidget);
	}
};
UiForm.prototype.addStyle = function(cssStr) {
	if (this.styleExist(cssStr) === false) {
		var head = document.getElementsByTagName('head')[0];
		var style = document.createElement('style');
		style.type = 'text/css';
		if (style.styleSheet){
			style.styleSheet.cssText = cssStr;
		} else {
			style.appendChild(document.createTextNode(cssStr));
		}
		head.appendChild(style);
	}
};
UiForm.prototype.styleExist = function(strStyle) {
	var ssList = document.styleSheets; 
	if (!ssList) return false;
	for (var i = 0; i < ssList.length; i++) {
		var ss = ssList[i]; 
		if (!ss) continue;
		if (this.xTraverseStyleSheet(ss, strStyle)) return true;
	}
	return false;
};
UiForm.prototype.xTraverseStyleSheet = function(ss, strStyle) {
	if (!ss) return false;
	var rls = this.xGetCSSRules(ss) ; if (!rls) return false;
	var str2 = this.stdCssStr(strStyle);
	for (var j = 0; j < rls.length; j++) {
		var cr = rls[j];
		if (cr.selectorText) {
			var str1 = this.stdCssStr(cr.cssText);
			if (str1 === str2) {
				return true; 
			} else {
				if (cr.cssText === str2) {
					return true;
				}
			}
		}
		if (cr.type && cr.type === 3 && cr.styleSheet) xTraverseStyleSheet(cr.styleSheet, strStyle);
	}
	if (ss.imports) {
		for (var j = 0 ; j < ss.imports.length; j++) {
			if (xTraverseStyleSheet(ss.imports[j], strStyle)) return true;
		}
	}
	return false;
};
UiForm.prototype.stdCssStr = function(strCss) {
	var body = strCss.match(/[^{}]+(?=\})/g); // standardise body section string
	var tmp = document.createElement("div");
	tmp.style.cssText = body[0];

	var tgtCss = strCss.substr(0, strCss.indexOf(body) -1); // get the targeted css name
	var result = tgtCss + '{ ' + tmp.style.cssText + ' }';
	
	return(result);
};
UiForm.prototype.xGetCSSRules = function(ss) { 
	return ss.rules ? ss.rules : ss.cssRules; 
};
UiForm.prototype.hrefCssAdd = function(cssPath) {
	if (hrefCssExist(cssPath) === false) {
		var lnk = document.createElement("link");
		lnk.setAttribute("href", cssPath);
		lnk.setAttribute("rel", "stylesheet");
		lnk.setAttribute("type", "text/css");
		document.head.appendChild(lnk);
	}
};
UiForm.prototype.hrefCssExist = function(cssPath) {
	var ss = document.styleSheets;
	for (var cntr = 0, max = ss.length; cntr < max; cntr++) {
		var fullUrl = getFullUrl(cssPath);
		if (ss[cntr].href === fullUrl) return(true);
	}	
	return(false);
};
UiForm.prototype.setUpdateableOnWidget = function(fieldValue, widgetSet) {
	if (fieldValue.updateable !== undefined) {
		if (fieldValue.data !== undefined) {
			var nodesChild = widgetSet.getElementsByTagName('*');
			for(var cntr = 0; cntr < nodesChild.length; cntr++){
				nodesChild[cntr].setAttribute('updateable', '');
			}
		}
	}
};
UiForm.prototype.setChangeableOnWidget = function(fieldValue, widgetSet) {
	if (fieldValue.changeable !== undefined) {
		if (fieldValue.data !== undefined) {
			var nodesChild = widgetSet.getElementsByTagName('*');
			for(var cntr = 0; cntr < nodesChild.length; cntr++){
				nodesChild[cntr].setAttribute('changeable', '');
			}
		}
	}
};
UiForm.prototype.setOk = function(errormsg) {
	var ok = document.createComment("000");
	errormsg.appendChild(ok);
};
UiForm.prototype.setupCtrl = function(cntrObj, strClsz, titleStr, basePath, fieldName) {
	var setMaster = document.getElementById(this.locationId);
	var setChild = $(setMaster).find('legend').filter(':contains("' + titleStr + '")');
	setChild = $(setChild).parent()[0];
	var nwbtn = $(setChild).find('[id^=newbtn]')[0];
	var dlbtn = $(setChild).find('[id^=deletebtn]')[0];
	if (cntrObj === 0) {
		if (nwbtn !== undefined) {
			nwbtn.innerHTML = this.doHref('[New]', strClsz, titleStr, basePath, fieldName);
		}
		if (dlbtn !== undefined){
			dlbtn.innerHTML = this.doHref('', strClsz, titleStr, basePath, fieldName);
		} 
	} else {
		if (nwbtn !== undefined) {
			nwbtn.innerHTML = this.doHref('', strClsz, titleStr, basePath, fieldName);
		} 
		if (dlbtn !== undefined) {
			dlbtn.innerHTML = this.doHref('[Delete]', strClsz, titleStr, basePath, fieldName);
		}
	}
};
UiForm.prototype.insertObjectIntoFrame = function(jsonObject, fieldsetTitle, basePath, targetName) {
	var tempScrollTop = $(window).scrollTop();
	var fieldFqnName = UiUtil.GetJsonPath(basePath, targetName);

	var setMaster = document.getElementById(this.locationId);
	var setChild = $(setMaster).find('legend').filter(':contains("' + fieldsetTitle + '")');
	var titleStr = $(setChild).text();
	var afterNumIdx = titleStr.indexOf(' ');
	var prefixStr = titleStr.substr(0, afterNumIdx - 1); // don't want the dot

	setChild = $(setChild).parent()[0];
	var targetField = UiUtil.GetVarByJsonPath(this.obj2Edit, fieldFqnName);
	delete targetField.delete; // remove delete marker for new field
	var subSeqNum = {value: '', prefix: prefixStr, startNum: 0, cls: 'fs02'}; // for numbering fieldset, uses object to for pass by ref
	if (targetField.dataset !== undefined) {
		var slideId = this.createIdStr(fieldsetTitle, '_slide');
		var slideNxt = this.createIdStr(fieldsetTitle, '_nxt');
		targetField.dataset.push(jsonObject.dataset[0]);

		// create the div for the new child field and append to allSlider
		var cntr = targetField.dataset.length - 1;
		var divForSlideChild = document.createElement('div');
		var masterSlider = document.getElementById(slideId);
		masterSlider.appendChild(divForSlideChild);
		var avoidRecursive = new Array();
		avoidRecursive.push({clasz: this.rawObj.meta.ParentClass, Oid: this.rawObj.meta.ParentOid});

		this.editAreaRecursion(targetField.dataset[cntr], setChild, divForSlideChild, basePath, targetName + '[' + cntr + ']', cntr, true, avoidRecursive, subSeqNum, false);
		this.setupAryCtrlButton(targetField, fieldsetTitle, slideId, slideNxt, basePath, targetName);
		//this.enableSlide(slideId);
		this.enableDisableCancelButton();
	} else {
		jQuery.extend(true, targetField, jsonObject.dataset[0]);
		var avoidRecursive = new Array();
		avoidRecursive.push({clasz: this.rawObj.meta.ParentClass, Oid: this.rawObj.meta.ParentOid});
		this.editAreaRecursion(targetField, setChild, setChild, basePath, targetName, 0, true, avoidRecursive, subSeqNum, false);
		this.setupCtrl(1, targetField.clasz, fieldsetTitle, basePath, targetName);
	}
	$(window).scrollTop(tempScrollTop);
};
UiForm.prototype.newFieldObject = function(aFieldClasz, fieldsetTitle, basePath, targetName) {
	UiUtil.DialogWaitStart();
	var fieldFqnName = UiUtil.GetJsonPath(basePath, targetName);
	var thisUiForm = this; // once gointo ajax call, this is no this prototype anymore
	var requestParam = {targetClasz: JSON.stringify(aFieldClasz), fieldFqn: fieldFqnName};
	UiUtil.BeActionWithMsg("Creating new " + targetName + "...", requestParam, 'newField', this.baseUrl, function(jsonObject) {
		if (jsonObject !== null) {
			thisUiForm.insertObjectIntoFrame(jsonObject, fieldsetTitle, basePath, targetName);
		} else {
			displayMsg('error', 'Fail to create field: ' + fieldsetTitle);
		}
	}
	, undefined
	);
};
UiForm.prototype.deleteFieldObject = function(fieldsetTitle, basePath, fieldName) {
	var fieldFqnName = UiUtil.GetJsonPath(basePath, fieldName);
	var targetField = UiUtil.GetVarByJsonPath(this.obj2Edit, fieldFqnName);
	var fieldBrief = '';
	if (targetField.dataset !== undefined) {
		var slideId = this.createIdStr(fieldsetTitle, '_slide');
		var idxSlide = UiUtil.GetSlidePosition(slideId);
		fieldBrief = this.getFieldBrief(targetField.dataset[idxSlide]); // get a string to briefly describe to the user about the record about to delete
	} else {
		fieldBrief = this.getFieldBrief(targetField);
	}

	var sendDelRq = this.sendDeleteFieldObject(this, fieldsetTitle, basePath, fieldName);
	UiUtil.DialogOkCancel('Confirm to Delete', 'Confirm to delete ' + fieldBrief + '?', "question", sendDelRq);
};
UiForm.prototype.getFieldBrief = function(aDisplayField) {
	var result = '';
	var cntr = 0;
	var targetField = aDisplayField.data;
	for (var key in targetField) { 
		if (key !== 'cbjectId' && key !== 'clasz') {
			if (result !== "") result += ', ';
			result += '"' + key + '"' + ': ' + this.getObjStrPart(targetField[key].data); // arbitrary traverse the object and get any string to it
			cntr++;
		}
		if (cntr > 1) break; // only describe 2 field, 0 and 1
	}
	return(result);
};
UiForm.prototype.getObjStrPart = function(aObject) {
	var result = '';
	if (typeof aObject !== 'object') result = aObject;
	for (var key in aObject) { 
		if (key !== 'cbjectId' && key !== 'clasz') {
			if (aObject[key].data !== undefined) {
				result = this.getObjStrPart(aObject[key].data);
				break;
			} else {
				if (aObject[key].dataset !== undefined) {
					result = this.getObjStrPart(aObject[key].dataset[0]);
					break;
				}
			}
		}
	}
	return(result);
};
UiForm.prototype.getObjClasz = function(aObj) {
	if (aObj.dataset !== undefined) {

	} else {

	}
};
UiForm.prototype.sendDeleteFieldObject = function(aThis, fieldsetTitle, basePath, targetName) {
	return function() {
		var thisUiForm = aThis; // once gointo a call dialog box, this is window this, not UiForm this
		var fieldFqnName = UiUtil.GetJsonPath(basePath, targetName);
		var targetField = UiUtil.GetVarByJsonPath(aThis.obj2Edit, fieldFqnName);
		var setMaster = document.getElementById(thisUiForm.locationId);

		if (targetField.dataset !== undefined) {
			var slideNxt = thisUiForm.createIdStr(fieldsetTitle, '_nxt');
			var slideId = thisUiForm.createIdStr(fieldsetTitle, '_slide');
			var idxSlide = UiUtil.GetSlidePosition(slideId);

			if (targetField.dataset[idxSlide].objectId === -1) {
				targetField.dataset.splice(idxSlide, 1);
			} else {
				targetField.dataset[idxSlide].delete = true;
			}

			// remove the div slide to deleted
			var fullHeightDiv = document.getElementById(slideId + "_fhd");
			for(var cntrSlider = 0; cntrSlider < $(fullHeightDiv).children().length; cntrSlider++) {
				if (cntrSlider === idxSlide) {
					var elementToDelete = $(fullHeightDiv).children()[cntrSlider];
					fullHeightDiv.removeChild(elementToDelete);
				}
			}

			// refresh the vertical slider
			thisUiForm.setupAryCtrlButton(targetField, fieldsetTitle, slideId, slideNxt, basePath, targetName);
		} else {
			var divParent = $(setMaster).find('legend').filter(':contains("' + fieldsetTitle +'")').parent()[0];
			var divChild = $(setMaster).find('legend').filter(':contains("' + fieldsetTitle +'")').parent().children();
			for(var cntr = 0; cntr < divChild.length; cntr++) { 
				if (divChild[cntr].tagName !== 'LEGEND' && divChild[cntr].id !== 'st-aryctrl') { 
					divParent.removeChild(divChild[cntr]);
				}
			}
			thisUiForm.setupCtrl(0, targetField.clasz, fieldsetTitle, basePath, targetName);
			targetField.delete = true;
		}
	};
};
UiForm.prototype.disableArea = function() {
	var nodesDisable = document.getElementById(this.locationId).getElementsByTagName('*');
	this.changeEditableArea(true, nodesDisable, false);
	this.preventOnclickA(this.locationId); // disable the New, Delete, Next link in object fields
};
UiForm.prototype.enableArea = function(ignoreUpdateable) {
	document.getElementById(this.locationId).disabled = false;
	var nodesDisable = document.getElementById(this.locationId).getElementsByTagName('*');
	if (ignoreUpdateable === undefined) ignoreUpdateable = false;
	this.changeEditableArea(false, nodesDisable, ignoreUpdateable);
	this.focusFirstWidget(); 
};
UiForm.prototype.enableSlide= function(theFrameId) {
	document.getElementById(theFrameId).disabled = false;
	var nodesDisable = document.getElementById(theFrameId).getElementsByTagName('*');
	this.changeEditableArea(false, nodesDisable, true);
	var slideDiv = UiUtil.GetSlideElement(theFrameId);
	this.focusFirstElement(slideDiv); 
};
UiForm.prototype.boldFsBtn = function(btn, fw) {
	for(var cntr = 0; cntr < $(btn).length; cntr++) {
		var btnFs = $($(btn)[cntr]).parents('fieldset')[0]; // only bold on immediate children of fsHover
		if (this.getLgndStr(btnFs) === this.getLgndStr(fsHover)) {
			$($($(btn)[cntr]).parents('div')[0]).css('font-weight', fw);
			$($(btn)[cntr]).css('font-weight', fw);
			if (fw === 'bold') {
				$(btnFs).children('legend').css('color', 'blue');
			} else {
				$(btnFs).children('legend').css('color', 'black');
			}
		}
	}
};
UiForm.prototype.getLgndStr = function(fs) {
	var result = $(fs).children('legend').text();
	if (result === undefined || result === null) {
		result = '';
	}
	return(result);
};
UiForm.prototype.mouseAtFs = function(fs) {
	var result;
	if (fs !== undefined && fs !== null) {
		if ($(fs).is('fieldset')) {
			result = fs;
		} else {
			result = $($(fs).parents('fieldset')[0]);
		}
	}
	return(result);
};
UiForm.prototype.boldFsHover = function() {
	var thisUiForm = this;
	$('fieldset .' + CLS_FIELDSET).bind('mousemove', function(evt) {
		var newMouseAt = thisUiForm.mouseAtFs(evt.target);
		if (thisUiForm.getLgndStr(newMouseAt) !== thisUiForm.getLgndStr(fsHover)) {
			if (fsHover !== undefined && fsHover !== null) {
				var btn = $(fsHover).find('.array_btn');
				if (btn !== undefined && btn !== null) {
					thisUiForm.boldFsBtn(btn, 'normal');
				}
			}
	
			fsHover = thisUiForm.mouseAtFs(evt.target);
			if (fsHover !== undefined && fsHover !== null) {
				var btn = $(fsHover).find('.array_btn');
				if (btn !== undefined && btn !== null) {
					thisUiForm.boldFsBtn(btn, 'bold');
				}
			}
		}
	});
};
var fsHover;
UiForm.prototype.boldFsOut = function() {
	if (fsHover !== undefined && fsHover !== null) {
		var btn = $(fsHover).find('.array_btn');
		if (btn !== undefined && btn !== null) {
			this.boldFsBtn(btn, 'normal');
		}
	}
};
UiForm.prototype.preventOnclickA = function(aArea) {
	$('#' + aArea + ' a[onclick]').each(function() {
		var originalClick = this.onclick;
		$(this).data('onclick', this.onclick);
		this.onclick = function(event) {
			if ($(this).attr('disabled')) {
				return false;
			};
			$(this).data('onclick', originalClick);
			$(this).data('onclick').call(this, event || window.event);
		};
	});
};
UiForm.prototype.changeColor = function(nodes, disable) {
	var bkcl;
	var fgcl;
	var lbcl;
	var hfcl;
	if (disable === true) {
		bkcl = 'rgb(235, 235, 228)';
		fgcl = 'rgb(136, 136, 136)';
		lbcl = 'grey';
		hfcl = 'grey';
		this.boldFsOut(); 
	} else {
		bkcl = 'rgb(255, 255, 255)';
		fgcl = 'black';
		lbcl = 'black';
		hfcl = '';
		this.boldFsHover(); // will bold the array buttons when mouse move on the seledted fieldset
	}

	var tgNm = nodes.tagName;
	if (tgNm === 'INPUT' || tgNm === 'SELECT') {
		nodes.style.backgroundColor = bkcl;
		nodes.style.color = fgcl;
	} else if (tgNm === 'LABEL' || tgNm === 'FIELDSET') {
		nodes.style.color = lbcl;
	} else if (tgNm === 'TABLE') {
		if (disable) {
			$(nodes).find("tr").attr("ondblclick", "null");
		} else {
			$(nodes).find("tr").attr("ondblclick", "rowClick(this)");
		}
	} else if (tgNm === 'A') {
		if (nodes.innerHTML.indexOf('Next') !== -1) {
			if (navigator.userAgent.toUpperCase().indexOf('MSIE') >= 0) {
				nodes.style.color = hfcl;
			} else {
				nodes.style.color = '';
			}
		} else {
			nodes.style.color = hfcl;
		}
	} else if (tgNm === 'DIV') {
		if ($(nodes).attr('class') !== undefined) {
			if ($(nodes).attr('class').trim() === 'nicEdit-main') {
				$(nodes).attr('contenteditable', !disable);
				$(nodes).css('background-color', bkcl);
				$(nodes).css('color', fgcl);
			}
		}
	}
};
UiForm.prototype.changeEditableArea = function(disable, nodes, ignoreUpdateable) {
	for(var cntr = 0; cntr < nodes.length; cntr++) {
		if (nodes[cntr].id === "btnCancelTop" || nodes[cntr].id === "btnCancelBottom" || nodes[cntr].tagName === "FIELDSET") {
			continue;
		}

		if (nodes[cntr].hasAttribute("updateable") && !ignoreUpdateable) { // if is key, make it not updateable, should rename updateable to iskey
			if (this.obj2Edit.cbjectId !== -1 || disable === true || nodes[cntr].hasAttribute("changeable")) {
				nodes[cntr].disabled = true;
			} else {
				nodes[cntr].disabled = false;
			}
			this.changeColor(nodes[cntr], nodes[cntr].disabled);
			var nodesDisable = nodes[cntr].getElementsByTagName('*');
			if (nodesDisable !== undefined) {
				this.changeEditableArea(nodes[cntr].disabled, nodesDisable, ignoreUpdateable); // this is not effective, child is flatten and not hierarchical
			}
		} else {
			if (nodes[cntr].hasAttribute("changeable")) {
				nodes[cntr].disabled = true; 
			} else {
				nodes[cntr].disabled = disable; // this will add the disabled attribute to the element
			}
			var dbtn = $($(nodes[cntr]).find('[id^=deletebtn]')[0]).find('a');
			var nbtn = $($(nodes[cntr]).find('[id^=newbtn]')[0]).find('a');
			if (disable || nodes[cntr].disabled) {
				if (dbtn !== undefined && dbtn.length > 0) {
					dbtn.css('cursor', 'default');
					dbtn.attr('disabled', 'disabled');
				}
				if (nbtn !== undefined && nbtn.length > 0) {
					nbtn.css('cursor', 'default');
					nbtn.attr('disabled', 'disabled');
				}
			} else {
				if (dbtn !== undefined && dbtn.length > 0) {
					dbtn.css('cursor', 'pointer');
					dbtn.removeAttr('disabled');
				}
				if (nbtn !== undefined && nbtn.length > 0) {
					nbtn.css('cursor', 'pointer');
					nbtn.removeAttr('disabled');
				}
			}
			this.changeColor(nodes[cntr], disable || nodes[cntr].disabled);
		}
	}
};
UiForm.prototype.storeSaveObject = function() {
};
UiForm.prototype.validatedBeforeSave = function() {
	return(true);
};
UiForm.prototype.saveObjectSuccess = function() {
};
UiForm.prototype.saveObjectFail = function() {
};
UiForm.prototype.warnBeforeSave = function() {
	return(false);
};
UiForm.prototype.afterSaveCancelButton = function() {
};
UiForm.prototype.onAfterSave = function() {
};
UiForm.prototype.onFinally = function() {
};
UiForm.prototype.callSave2Backend = function() {
	var editArea = this;
	return(function() {
		editArea.saveObject2Backend();
	});
};
UiForm.prototype.warnOnSave = function(aWarnMsg, aWarnIgnore) {
	UiUtil.DialogYesNo('Confirm to Save', aWarnMsg, this.callSave2Backend(), aWarnIgnore);
};
UiForm.prototype.saveObject2Backend = function(aSavingMsg) {
	var editArea = this;
	var requestParam = {parentOid: this.parentOid, object2Save: JSON.stringify(this.obj2Edit)};
	UiUtil.BeActionMsg(aSavingMsg, requestParam, this.beOperation, this.baseUrl, function(jsonObject) {
			window.onbeforeunload = null;
			editArea.obj2Edit = UiUtil.GetAryByJsonPath(jsonObject, "")[0];
			editArea.storeSaveObject();
			editArea.saveObjectSuccess();
			UiUtil.DisplayInfo("Successfully saved...");
			editArea.objOriginal = jQuery.extend(true, {}, editArea.obj2Edit);
			editArea.afterSaveCancelButton();
			editArea.onAfterSave();
		}
		, function() {
			editArea.saveObjectFail();
		}
		, function() {
			editArea.onFinally();
		}
	);
};
UiForm.prototype.saveObject = function(aSavingMsg) {
	UiUtil.PopulateJson(this.obj2Edit);
	if (this.validatedBeforeSave() === true) { 
		if (this.warnBeforeSave()) {
			// do nothing
		} else {
			this.saveObject2Backend(aSavingMsg);
		}
	}
};
UiForm.prototype.onAfterCancel = function() {
};
UiForm.prototype.cancelEdit = function() {
	UiUtil.PopulateJson(this.obj2Edit);
	if (UiUtil.DifferentJson(this.objOriginal, this.obj2Edit)) {
		var thisForm = this;
		UiUtil.DialogOkCancel('Confirm to Cancel', "If there are changes, you will lose it, please confirm?", "question", function() {
			var obj2EditOrignal = jQuery.extend(true, {}, thisForm.objOriginal);
			thisForm.ClearAndDisplayObject(obj2EditOrignal);
			thisForm.enableArea(false);
			var funcSlow = function() {
				thisForm.onAfterCancel();
			};
			setTimeout(funcSlow, 500); // need use timeout else slider will not be drawn
		}, function() {
		});
	} else {
		this.onAfterCancel();
	}
};
UiForm.prototype.focusFirstWidget = function(theParentId) {
	var editDiv = this.locationId;
	if (UiUtil.NotUndefineNotNull(theParentId)) {
		editDiv = theParentId;
	}

	if (UiUtil.NotUndefineNotNullNotBlank(editDiv)) {
		var theParentElement = document.getElementById(editDiv);
		this.focusFirstElement(theParentElement);
	}
};
UiForm.prototype.focusFirstElement = function(theParentElement) {
	var allInput = $(theParentElement).find('input, select', 'textarea');
	for (var cntr = 0; cntr < allInput.length; cntr++) {
		if (allInput[cntr].disabled === false) {
			allInput[cntr].focus();
			var funcSlow = function() { 
				if (allInput[cntr].tagName !== "SELECT") {
					allInput[cntr].select();
				}
			};
			setTimeout(funcSlow, 500);
			break;
		}
	}
};
UiForm.prototype.setupCancel2Quit = function(aOnAfterCancel) {
	$("#btnCancelTop").attr("disabled", false);
	$("#btnCancelBottom").attr("disabled", false);
	var afterCancel = function() {
		$("#btnCancelTop").attr("disabled", false);
		$("#btnCancelBottom").attr("disabled", false);
		aOnAfterCancel();
	};
	if (UiUtil.NotUndefineNotNull(aOnAfterCancel)) {
		this.onAfterCancel = afterCancel;
	}
};
UiForm.prototype.setupCancel2Revert = function() {
	this.onAfterCancel = function() {
		$("#btnCancelTop").attr("disabled", true);
		$("#btnCancelBottom").attr("disabled", true);
	};

	this.afterSaveCancelButton = function() {
		$("#btnCancelTop").attr("disabled", true);
		$("#btnCancelBottom").attr("disabled", true);
	};

	var thisForm = this;
	$("body").on('click keypress', "#" + this.locationId, function(event) {
		thisForm.enableDisableCancelButton();
	});
};
UiForm.prototype.enableDisableCancelButton = function() {
	if ($("#btnCancelTop").attr("disabled") === "disabled") {
		// if there're changes, enable the cancel button
		UiUtil.PopulateJson(this.obj2Edit);
		if (UiUtil.DifferentJson(this.objOriginal, this.obj2Edit)
		|| event.originalEvent instanceof KeyboardEvent ) {
			$("#btnCancelTop").attr("disabled", false);
			$("#btnCancelBottom").attr("disabled", false);
		}
	} 

	// do the same for the bottom button
	var editableStatus = $("#btnCancelTop").attr("disabled");
	$("#btnCancelBottom").css("disabled", editableStatus);
};
UiForm.prototype.showBackButton = function() {
	$("#" + this.locationId).find("#btnCancelTop").css("display", "inline-block");
	$("#" + this.locationId).find("#btnCancelTop").html("Back");
	$("#" + this.locationId).find("#btnCancelTop").prop("disabled", false);

	$("#" + this.locationId).find("#btnCancelBottom").css("display", "none");
	$("#" + this.locationId).find("#btnSaveTop").css("display", "inline-block");
	$("#" + this.locationId).find("#btnSaveBottom").css("display", "none");
};
UiForm.prototype.hideCancelSaveBtn = function() {
	$("#" + this.locationId).find("#btnCancelTop").css("display", "none");
	$("#" + this.locationId).find("#btnCancelBottom").css("display", "none");
	$("#" + this.locationId).find("#btnSaveTop").css("display", "none");
	$("#" + this.locationId).find("#btnSaveBottom").css("display", "none");
	$("#" + this.locationId).find("#btnCancelTop").parent().css("border", "none"); // not working ?
	$("#" + this.locationId).find("#btnCancelBottom").parent().css("border", "none"); // not working ?
};
UiForm.prototype.noBorderForFirstFieldSet = function() {
	var firstFieldset = $("#" + this.locationId).find("fieldset")[1]; // 0 is the btn fieldset, 1 is the first fieldset
	$(firstFieldset).css("border", "none");
	$($(firstFieldset).find("legend")[0]).css("display", "none");
};
UiForm.prototype.isEdited = function() {
	UiUtil.PopulateJson(this.obj2Edit);
	if (UiUtil.DifferentJson(this.objOriginal, this.obj2Edit)) {
		return true;
	}
	return false;
};
UiForm.GetDataRemoveGrid = function(aDataFromBE, aGridName) {
	delete aDataFromBE.dataset[0].data[aGridName];
	return(aDataFromBE);
};
// deprecated, use UiUtil.DifferentJson instead
UiForm.DifferentJson = function(aOriginal, aEdited) {
	var result = false;
	var jsonOriginal = JSON.stringify(aOriginal);
	var jsonEdited = JSON.stringify(aEdited);
	var varOriginal = jsonOriginal.match(/["]?data["]?\s?:\s?[^{](.+?)(?=[,}])/gm);
	var varEdited = jsonEdited.match(/["]?data["]?\s?:\s?[^{](.+?)(?=[,}])/gm);
	var strOriginal = "";
	var strEdited = "";
	if (UiUtil.NotUndefineNotNull(varOriginal)) strOriginal = varOriginal.toString();
	if (UiUtil.NotUndefineNotNull(varEdited)) strEdited = varEdited.toString();
	if (strOriginal !== strEdited) {
		result = true;
	} else {
		var varOriginalSet = jsonOriginal.match(/["]?dataset["]?\s?:\s?[^{](.+?)(?=[,}])/gm);
		var varEditedSet = jsonEdited.match(/["]?dataset["]?\s?:\s?[^{](.+?)(?=[,}])/gm);
		var strOriginalSet = "";
		var strEditedSet = "";
		if (UiUtil.NotUndefineNotNull(varOriginalSet)) strOriginalSet = varOriginalSet.toString();
		if (UiUtil.NotUndefineNotNull(varEditedSet)) strEditedSet = varEditedSet.toString();
		if (strOriginalSet !== strEditedSet) {
			result = true;
		}
	}
	return(result);
};
UiForm.plusOne = function(seqNum) {
	if (typeof seqNum !== 'undefined' && seqNum !== null) {
		seqNum.startNum++;
		seqNum.value = seqNum.prefix + seqNum.startNum;
	} 
	return(seqNum);
};
UiForm.nextLevelNumbering = function(seqNum) {
	if (typeof seqNum !== 'undefined' && seqNum !== null) {
		seqNum.prefix += seqNum.value + '.';
		seqNum.startNum = 1;
		seqNum.value = seqNum.prefix + seqNum.startNum;
	} 
	return(seqNum);
};
UiForm.IsFunction = function(functionToCheck) {
 var getType = {};
 return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
};

UiForm.CheckJsonBlank = function(aJson, aName, aErrorMsg) {
	var result = false;
	var strVal = UiUtil.GetValueByJsonPath(aJson, aName);	
	if (UiForm.IsBlank(strVal)) {
		result = true;
		UiUtil.DialogError("Error", aErrorMsg, UiUtil.DoNothing); // no support for focus unless generated input-area got predictable id
	}
	return(result);
};
UiForm.CheckBlank = function(aElement, aErrorMsg) {
	var result = false;
	if (UiForm.IsBlank(aElement.val())) {
		result = true;
		UiUtil.DialogError("Error", aErrorMsg, function(){ aElement.focus();});
	}
	return(result);
};
UiForm.IsJsonBlank = function(aJson, aName) {
	var result = false;
	var strVal = UiUtil.GetValueByJsonPath(aJson, aName);	
	if (UiForm.IsBlank(strVal)) {
		result = true;
	}
	return(result);
};
UiForm.IsBlank = function(aValue) {
	if (typeof aValue === 'undefined') {
		return(true);
	} else if (aValue === null) {
		return(true);
	} else if (aValue.trim() === "") {
		return(true);
	} else {
		return(false);
	}
};