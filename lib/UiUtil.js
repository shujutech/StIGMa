var CLS_EACHFIELD = "st-eachfield";
var CLS_ROW = "st-row";
var CLS_EACHFIELD_ROW = CLS_EACHFIELD + ' ' + CLS_ROW;
var CLS_LABEL_AREA = "st-label-area";
var CLS_INPUT_AREA = "st-input-area";
var CLS_INPUT = "form-control";
var CLS_ERROR_IMG = "st-error-img";
var CLS_ERROR_MSG = "st-error-msg";
var CLS_LABEL = "st-label-txt";
var CLS_CHECKBOX = "st-checkbox";
var CLS_DATE_PICKER = "st-date-picker" + " " + CLS_INPUT;
var CLS_COMBO_BOX = "custom-select";
var CLS_NO_SUCH_WIDGET = "no-such-widget";

if ($.jMaskGlobals) $.jMaskGlobals.watchDataMask = true;

$(document).ready(function(){
	UiUtil.MAX_UPLOAD_SIZE = 2097152;
	UiUtil.CONTENT_TYPE_WWW = 'application/x-www-form-urlencoded; charset=UTF-8';
	UiUtil.CONTENT_TYPE_JSON = 'application/json'; // for unknown reason cannot have UTF-8

	UiUtil.DisplayMsgHide();
	$(document).ready($('button#ttxcvtyl').click(function(){
		var newimg=$('span',this).css('background-image');
		var fileonly = UiUtil.GetFileNameFromPath(newimg);
		var cmpimg='arr_white.gif';
		if (fileonly === cmpimg)
			newimg='url(img/arrv_white.gif)';
		else 
			newimg='url(img/arr_white.gif)';
		$('span',this).css('background-image',newimg);
	}));
}); 
function displayMsg(type, mesg) {
	var msgPlace = document.getElementById('msgArea');
	if (msgPlace !== undefined && msgPlace !== null) {
		if (mesg !== undefined) {
			msgPlace.innerHTML = mesg;
		} else {
			msgPlace.innerHTML = 'Error message is not correctly set, undefine value';
		}

		var msgIcon = document.getElementById('msgImage');
		msgIcon.setAttribute('src', 'img/imgInfo.gif');
		if (type.toLowerCase() === 'error') {
			msgIcon.setAttribute('src', 'img/exclamation-grey.gif');
		}
	}
}
function blinkError(errorStatus, errorMsg, errorField) {
	if (errorMsg === undefined) {
		displayMsg('error', "Server responded with undefine error message, please report to <a href='mailto:stems.my@shujutech.biz'>stems.my@shujutech.biz</a>");
		return;
	}

	displayMsg(errorStatus, "System error, " + errorMsg + ", please report to &nbsp; <a href='mailto:stems.my@shujutech.biz'>stems.my@shujutech.biz</a>");
	if (UiUtil.NotUndefineNotNull(errorField)) {
		var allLabel = document.getElementsByTagName('LABEL');
		for(var cntr = 0; cntr < allLabel.length; cntr++){
			for(var cntrError = 0; cntrError < errorField.length; cntrError++){
				if (allLabel[cntr].innerHTML.indexOf(errorField[cntrError]) !== -1) {
					var parentDiv = allLabel[cntr].parentNode;
					for(var count = 0; count < parentDiv.childNodes.length; count++) {
						if (parentDiv.childNodes[count].tagName === 'IMG') {
							//var img = parentDiv.childNodes[count];
							//img.setAttribute('src', 'img/imgErrorBlink.gif');
							//$(img).css("display", "");
						}
					}
				}
			}
		}
	}
}
function setErrStr(xhr, err) {
	//var errMsg = "readyState: " + xhr.readyState+ "\nstatus: " + xhr.status + "\nresponseText: " + xhr.responseText;
	var errMsg = "readyState: " + xhr.readyState + ", \nstatus: " + xhr.status + ", \nerror: " + err;
	return errMsg;
}
function getVarByJsonPath(fromObject, fieldFullName) {
	var pthAry = fieldFullName.split('.');
	var result = fromObject;
	for (var cntr = 0; cntr < pthAry.length; cntr++) {
		var key = pthAry[cntr];
		if (key.indexOf("[") === -1) {
			result = result.data[key];
		} else {
			var idxPt = key.match(/\[(.*?)\]/g);
			var nmePt = key.substr(0, key.indexOf(idxPt));
			var idxPt = idxPt[0].split('[')[1].split(']')[0];
			result = result.data[nmePt].dataset[idxPt];
			if (result === undefined) break;
		}
	}
	return result;
}
$(document).ready(function(){
	$('.lityjtno').click(function () {
		$('.lityjtno').css('background', 'url(img/loading.gif) no-repeat center center');
	});
}); 
function getNotCloneElement(aElementId) {
	var normJqVar = aElementId.replace('[', '\\[').replace(']', '\\]').replace('.', '\\.');
	var escJqVar = "[id='" + normJqVar + "']";
	var dupSlider = $(escJqVar);
	for(var cntr = 0; cntr < dupSlider.length; cntr++) {
		if (dupSlider[cntr].areaEdit !== undefined) {
			return dupSlider[cntr];
		}
	}
};
function removeTime(aDateTime) {
	var aryDateTime = aDateTime.split(' ');
	var dateOnly = aryDateTime[0];
	return dateOnly;
};
function removeTimeFromDataset(aDataset, aTargetField) {
	for(var idx in aDataset) {
		var startDateTime = getVarByJsonPath(aDataset[idx], aTargetField);
		if (startDateTime !== undefined) {
			var startDateOnly = removeTime(startDateTime.data);
			startDateTime.data = startDateOnly;
		}
	}
};
function MakeObjData(aValue) {
	var result = {};
	result.data = aValue;
	return result;	
}
function DecimalPlace(aNum) {
	var strNum = aNum.toString();
	var pureNum = strNum.replace(/,/g , "");
	var result = parseFloat(Math.round(pureNum * 100) / 100).toFixed(2);
	return result;
};
function Str2Num(aStr) {
	var result = Number(aStr.replace(/[^0-9\.]+/g,""));
	return result;
};
function NumberWithComma(aNum) { // deprecated
	return UiUtil.NumberWithComma(aNum);
};


// https://stackoverflow.com/questions/2655925/how-to-apply-important-using-css
(function($) {    
	if ($.fn.style) {
	return;
	}

	// Escape regex chars with \
	var escape = function(text) {
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
	};

	// For those who need them (< IE 9), add support for CSS functions
	var isStyleFuncSupported = !!CSSStyleDeclaration.prototype.getPropertyValue;
	if (!isStyleFuncSupported) {
	CSSStyleDeclaration.prototype.getPropertyValue = function(a) {
		return this.getAttribute(a);
	};
	CSSStyleDeclaration.prototype.setProperty = function(styleName, value, priority) {
		this.setAttribute(styleName, value);
		var priority = typeof priority != 'undefined' ? priority : '';
		if (priority != '') {
		// Add priority manually
		var rule = new RegExp(escape(styleName) + '\\s*:\\s*' + escape(value) +
			'(\\s*;)?', 'gmi');
		this.cssText =
			this.cssText.replace(rule, styleName + ': ' + value + ' !' + priority + ';');
		}
	};
	CSSStyleDeclaration.prototype.removeProperty = function(a) {
		return this.removeAttribute(a);
	};
	CSSStyleDeclaration.prototype.getPropertyPriority = function(styleName) {
		var rule = new RegExp(escape(styleName) + '\\s*:\\s*[^\\s]*\\s*!important(\\s*;)?',
			'gmi');
		return rule.test(this.cssText) ? 'important' : '';
	}
	}

	// The style function
	$.fn.style = function(styleName, value, priority) {
	// DOM node
	var node = this.get(0);
	// Ensure we have a DOM node
	if (typeof node == 'undefined') {
		return this;
	}
	// CSSStyleDeclaration
	var style = this.get(0).style;
	// Getter/Setter
	if (typeof styleName != 'undefined') {
		if (typeof value != 'undefined') {
		// Set style property
		priority = typeof priority != 'undefined' ? priority : '';
		style.setProperty(styleName, value, priority);
		return this;
		} else {
		// Get style property
		return style.getPropertyValue(styleName);
		}
	} else {
		// Get CSSStyleDeclaration
		return style;
	}
	};
})(jQuery);



/*
 * 
 * 
 * Start of using UiUtil as the namespace instead of just 
 * global function above. We migrate it over to use the UiUtil
 * namespace gradually.
 * 
 * 
*/

var UiUtil = {};
UiUtil.DEBUG = false;
//UiUtil.DEBUG = true;
UiUtil.ImgErrorBlink = "img/imgErrorBlink.gif";
UiUtil.Months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
UiUtil.DoNothing = function() {}; 

UiUtil.GetFileNameFromPath = function(aPath) {
	var result;
	if (UiUtil.NotUndefineNotNullNotBlank(aPath)) {
		result = aPath.replace(/^.*[\\\/]/, '')
	} else {
		result = aPath;
	}
	return result;
}; 
UiUtil.NumberWithCommaCents = function(aNum) {
	var result = "";
	if (UiUtil.NotUndefineNotNullNotBlank(aNum)) {
		var val = aNum + "";
		var parts = val.toString().split(".");
		var dollar = UiUtil.NumberWithComma(parts[0]);
		var cents = parts[1];
		if (UiUtil.IsUndefineOrNullOrBlank(cents)) {
			cents = "00";
		} else if (cents.length === 1) {
			cents = cents + "0";
		} else if (cents.length > 2) {
			cents = cents.substr(0, 2);
		} 
		result = dollar + "." + cents;
	}
	return result;
};
UiUtil.NumberWithComma = function(aNum) {
	if (UiUtil.IsUndefineOrNullOrBlank(aNum)) return "";
	return aNum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
UiUtil.HandleMoney = function(aStrToHandle) { // possible deprecated, use FormatMoney instead
	var result = "";
	if (UiUtil.NotUndefineNotNullNotBlank(aStrToHandle)) {
		var strToHandle = ('' + aStrToHandle).replace(/[^0-9.]/g, "");
		if (UiUtil.NotUndefineNotNullNotBlank(strToHandle)) {
			var partDollar = "0";
			var partCent = "00";
			var gotDot = strToHandle.indexOf('.');
			if (gotDot >= 0) {
				partDollar = strToHandle.substr(0, strToHandle.indexOf('.'));
				partDollar = partDollar.replace(/\D/g, ''); // no more other dot
				partCent = strToHandle.substr(strToHandle.indexOf('.') + 1);
				partCent = partCent.replace(/\D/g, '');
				if (partCent.length > 2) {
					partCent = partCent.substr(0, 2);
				}
				partDollar = UiUtil.NumberWithComma(partDollar);
				result = partDollar + "." + partCent;
			} else {
				result = UiUtil.NumberWithComma(strToHandle);
			}
		}
	}
	return result;
};
UiUtil.NumToMoney = function(aCurrency, aNumMoney) {
	var theMoney = aCurrency + " " + aNumMoney;
	theMoney = UiUtil.FormatMoney(theMoney);
	return theMoney;
};
UiUtil.FormatMoney = function(aStrMoney) {
	if (aStrMoney === undefined) return "";
	var currency;
	var amount;
	var arySplit = aStrMoney.split(/[ ]+/);
	if (arySplit.length !== 0) {
		currency = arySplit[0];
		amount = arySplit[1];
	} else {
		currency = aStrMoney.substring(0, 3);
		amount = aStrMoney.substring(3);
	}

	if (UiUtil.NotUndefineNotNull(amount)) {
		var amountDecimal = DecimalPlace(amount);
		var result = currency + " " + UiUtil.NumberWithComma(amountDecimal);
		return result;
	} else {
		return "<Error>";
	}
};
UiUtil.SpecialCharReplace = function(aFunctionName) {
	var result = aFunctionName.replace(/ /g, "_");
	result = result.replace(/\[/g, "bracketo");
	result = result.replace(/\]/g, "bracketc");
	result = result.replace(/\./g, "dot");
	return result;
};
UiUtil.SpecialCharUnplace = function(aFunctionName) {
	var result = aFunctionName.replace(/bracketo/g, "[");
	result = result.replace(/bracketc/g, "]");
	result = result.replace(/dot/g, ".");
	return result;
};
UiUtil.ScriptAddWithRemove = function(strScript, idName) {
	var tmp = UiUtil.ScriptAdd(strScript);
	tmp.setAttribute("id", idName);
	//this.sourceToBeRemove.push(idName);
};
UiUtil.ScriptAdd = function(strScript) {
	var head = document.getElementsByTagName('head')[0];
	var scpt = document.createElement('script');
	scpt.type = 'text/javascript';
	scpt.appendChild(document.createTextNode(strScript));
	head.appendChild(scpt);
	return scpt;
};
UiUtil.GetJsonPath = function(aBasePath, fieldName) {
	if (aBasePath !== "" && fieldName !== "") {
		aBasePath += ".";
	}
	aBasePath += fieldName;
	return aBasePath;
};
UiUtil.DialogMaxLen = function(aMsg) {
	if (/<\/?[a-z][\s\S]*>/i.test(aMsg)) {
		var msgHtml = aMsg;
		var firstTagPos = msgHtml.indexOf('<');
		if (firstTagPos > 0) {
			var splitableStr = msgHtml.substring(0, firstTagPos);
			var remainderStr = msgHtml.substring(firstTagPos);
			var splittedStr = UiUtil.DialogMaxLen(splitableStr);
			aMsg = splittedStr + remainderStr;
		}
		return aMsg;
	}
	
	var result = "";
	var strAry = aMsg.replace(/.{70}\S*\s+/g, "$&@").split(/\s+@/);
	for(var cntr = 0; cntr < strAry.length; cntr++) {
		var eachStr = strAry[cntr];
		if (result !== "") {
			result += "<br>" + eachStr;
		} else {
			result += eachStr;
		}
	}

	return result;
};
UiUtil.DialogStr2Html = function(msgHtml) {
	if (typeof msgHtml === "string") {
		var properLenStr = UiUtil.DialogMaxLen(msgHtml);
		msgHtml = "<div style='display:block;text-align:left'>" + properLenStr + "</div>";
	} 

	return msgHtml;
};
UiUtil.DialogWaitStart = function(aWaitMsg) {
	var waitMsg = "<div style='margin-top: 15px; min-width: 500px'></div>" 
	+ "<div style='margin: auto; margin-bottom: 8px' class='loadersmall'></div>" 
	+ "<div style='width: 100%; text-align: center; font-size: 20px; padding-top: 0px'>Please wait...</div>";
	if (UiUtil.NotUndefineNotNullNotBlank(aWaitMsg)) {
		waitMsg += "<div id='st-dlg-wait-id' style='width: 100%; text-align: center; font-size: 13px; padding-top: 7px; padding-bottom: 20px; font-weight: 300; margin-bottom: 20px'>" + aWaitMsg + "<div>";
	}
	swal({
		title: waitMsg
		, html: "<div id='st-swal-dialog-wait' style='display: none'></div>"
		, allowOutsideClick: false
		//, timer: 600000
		, showCancelButton: false
		, showConfirmButton: false 
	});
};
UiUtil.DialogWaitStop = function() {
	if ($("#st-swal-dialog-wait").length !== 0) {
		swal.close();
	}
};
UiUtil.DialogYesNo = function(titleHtml, msgHtml, jsYes, jsNo) {
	var strType = undefined;
	if (typeof msgHtml === "string") {
		msgHtml = UiUtil.DialogStr2Html(msgHtml);
		strType = 'question';
	}
	swal({
		title: titleHtml
		, html: msgHtml
		, type: strType
		, showConfirmButton: true
		, showCancelButton: true
		, confirmButtonText: 'Yes'
		, cancelButtonText: 'No'
		, focusConfirm: false
		, allowOutsideClick: false
	})
	.then((value) => {
		if (UiUtil.DialogAnswerOk(value)) {
			if (UiUtil.NotUndefineNotNullNotBlank(jsYes)) {
				jsYes();
			}
		} else {
			if (UiUtil.NotUndefineNotNullNotBlank(jsNo)) {
				jsNo();
			}
		}
	});
};
UiUtil.DialogAnswerOk = function(value) {
	var result = false;
	if (UiUtil.NotUndefineNotNullNotBlank(value.value)) {
		if (value.value === true) {
			result = true;
		}
	}

	return result;	
};
UiUtil.DialogSaveCancel = function(titleHtml, msgHtml, aIcon, jsOk, jsCancel, onOpenFunc, aValidationOption) {
	if (UiUtil.NotUndefineNotNullNotBlank(aValidationOption)) {
		// Validation mode: requires jsonObject, divBodyName, createBody, and onValidate
		var aOnValidate = aValidationOption.onValidate;
		var aBodyName = aValidationOption.divBodyName;
		var aJsonObject = aValidationOption.jsonObject;
		var aCreateBody = aValidationOption.createBody;
		var aOnFailValidation = aValidationOption.onFailValidation;

		if (!aValidationOption.cloneObject) { // will not clone for recursive calls
			aValidationOption.cloneObject = JSON.parse(JSON.stringify(aJsonObject));
		}

		var divBody = document.createElement('div');
		divBody.setAttribute('id', aBodyName);
		divBody.setAttribute('style', 'text-align:left;margin-top:15px');
		var bodyContent = divBody;

		var jsFunc = function() {
			if (UiUtil.NotUndefineNotNullNotBlank(onOpenFunc)) {
				onOpenFunc();
			}
			if (UiUtil.NotUndefineNotNullNotBlank(aCreateBody)) {
				aCreateBody(aValidationOption.cloneObject);
			}
		};

		UiUtil.DialogTwoButton(titleHtml, bodyContent, aIcon, function() {
			UiUtil.PopulateJsonFromDialog(aBodyName, aValidationOption.cloneObject, function() {
				if (UiUtil.NotUndefineNotNullNotBlank(aOnValidate)) {
					aOnValidate(aValidationOption.cloneObject, function(aFailMsg) {
						if (UiUtil.NotUndefineNotNullNotBlank(aFailMsg)) {
							if (UiUtil.NotUndefineNotNullNotBlank(aOnFailValidation)) {
								aOnFailValidation();
							}
							UiUtil.DialogError("Error", aFailMsg, function() {
								UiUtil.DialogSaveCancel(titleHtml, msgHtml, aIcon, jsOk, jsCancel, onOpenFunc, aValidationOption);
							});
						} else {
							if (UiUtil.NotUndefineNotNullNotBlank(jsOk)) {
								jsOk(aValidationOption.cloneObject);
							}
						}
					});
				} else {
					if (UiUtil.NotUndefineNotNullNotBlank(jsOk)) {
						jsOk(aValidationOption.cloneObject);
					}
				}
			});
		}, jsCancel, jsFunc, "Save", "Cancel");
	} else {
		// Original behavior: no validation, simple pass-through
		UiUtil.DialogTwoButton(titleHtml, msgHtml, aIcon, jsOk, jsCancel, onOpenFunc, "Save", "Cancel");
	}
};
UiUtil.DialogOkCancel = function(titleHtml, msgHtml, aIcon, jsOk, jsCancel, onOpenFunc) {
	UiUtil.DialogTwoButton(titleHtml, msgHtml, aIcon, jsOk, jsCancel, onOpenFunc, "Ok", "Cancel");
	$(".swal2-container h2").css("margin-bottom", "0px");
};
UiUtil.DialogTwoButton = function(titleHtml, msgHtml, aIcon, jsOk, jsCancel, onOpenFunc, aOkText, aCancelText) {
	var strType = aIcon;
	if (typeof msgHtml === "string") {
		msgHtml = UiUtil.DialogStr2Html(msgHtml);
	}
	var displayConfirmButton = true;
	if (UiUtil.IsUndefineOrNullOrBlank(aOkText)) {
		displayConfirmButton = false;
	}

	swal({
		title: titleHtml
		, html: msgHtml
		, type: strType
		, showConfirmButton: displayConfirmButton
		, showCancelButton: true
		, confirmButtonText: aOkText
		, cancelButtonText: aCancelText
		, focusConfirm: false 
		, allowOutsideClick: false
		, onOpen: function() {
			if (UiUtil.NotUndefineNotNullNotBlank(onOpenFunc)) {
				onOpenFunc();
			}
			var titleLine = '<hr style="display:block;height:1px;border:0;border-top:1px solid #ccc;margin:1em 0;padding:0;width:70%;margin-top:0px;margin-bottom:0px;">';
			if ($("#swal2-title").next()[0].outerHTML !== titleLine) {
				$("#swal2-title").after(titleLine);
			}
		}
	}).then((value) => {
		if (UiUtil.DialogAnswerOk(value)) {
			if (UiUtil.NotUndefineNotNullNotBlank(jsOk)) {
				jsOk();
			}
		} else {
			if (UiUtil.NotUndefineNotNullNotBlank(jsCancel)) {
				jsCancel();
			}
		}
	});
};
UiUtil.DialogNoIcon = function(titleHtml, msgHtml, jsAction) {
	UiUtil.DialogOk("", titleHtml, msgHtml, jsAction);
};
UiUtil.DialogInfo = function(titleHtml, msgHtml, jsAction) {
	UiUtil.DialogOk("info", titleHtml, msgHtml, jsAction);
};
UiUtil.DialogError = function(titleHtml, msgHtml, jsAction) {
	UiUtil.DialogOk("error", titleHtml, msgHtml, jsAction);
};
UiUtil.DialogQuestion = function(titleHtml, msgHtml, jsAction) {
	UiUtil.DialogOk("question", titleHtml, msgHtml, jsAction);
};
UiUtil.DialogOk = function(strIcon, titleHtml, msgHtml, jsAction) {
	if (UiUtil.IsUndefineOrNullOrBlank(titleHtml)) {
		titleHtml = "Error";
	}
	if (UiUtil.IsUndefineOrNullOrBlank(msgHtml)) {
		//msgHtml = "Let us know what filter is needed at: <a href='mailto:stems.my@shujutech.biz?Subject='Dialog%20Error,%20No%20Title%20And%20Msg'>stems.my@shujutech.biz</a>";
		msgHtml = "Contact us for support at: <a href='mailto:stems.my@shujutech.biz?Subject='Dialog%20Error,%20No%20Title%20And%20Msg'>stems.my@shujutech.biz</a>";
	}

	msgHtml = UiUtil.DialogStr2Html(msgHtml);
	swal({
		title: titleHtml
		, html: msgHtml
		, type: strIcon
		, showConfirmButton: true
		, showCancelButton: false 
		, focusConfirm: true
		, allowOutsideClick: false
	})
	.then((value) => {
		if (UiUtil.NotUndefineNotNullNotBlank(jsAction)) {
			jsAction();
		}
	});
};
UiUtil.IsNum = function(aDgtMth) {
	var strDgtMth = aDgtMth;
	if (typeof aDgtMth !== "string") {
		strDgtMth = "" + aDgtMth; // convert to string
	}
	var isNum = /^\d+$/.test(strDgtMth);
	return isNum;
};
UiUtil.GetMthAbbrv = function(aStrDate) {
	var objDate = new Date(aStrDate); // date standard format e.g: 02-Feb-2024 00:00:00 +0800
	var numMonth = objDate.getMonth();
	var result = UiUtil.MthAbbrv(numMonth);
	return result;
};
UiUtil.MthAbbrv = function(aDgtMth) {
	var isNum = UiUtil.IsNum(aDgtMth); 
	if (isNum) {
		var intDgtMth = parseInt(aDgtMth);
		if (intDgtMth >= 0 &&intDgtMth <= 11) {
			return UiUtil.Months[intDgtMth].substr(0,3);
		} else {
			return "";
		}
	} else {
		return "";
	}
};
UiUtil.MthAbbrvYearAbbrv = function(aStrDate) {
	var aryDate = aStrDate.split("-");
	var mth = aryDate[1];
	var yer = aryDate[2];
	return mth + '-' + yer;
};
UiUtil.MthInFull = function(aStrDate) {
	var aryDate = aStrDate.split("-");
	var day = aryDate[0];
	var mth = aryDate[1];
	var yer = aryDate[2];
	var mthNum = UiUtil.MthNumStartWithZero(mth);
	var strMth = UiUtil.Months[mthNum];
	return strMth;
};
UiUtil.YearInFull = function(aStrDate) {
	var aryDate = aStrDate.split("-");
	var yer = aryDate[2];
	return yer;
};
UiUtil.MthAbbrvStartFromOne = function(aDgtMth) {
	var isNum = UiUtil.IsNum(aDgtMth); 
	if (isNum) {
		var intDgtMth = parseInt(aDgtMth) - 1;
		if (intDgtMth >= 0 &&intDgtMth <= 11) {
			return UiUtil.Months[intDgtMth].substr(0,3);
		} else {
			return "";
		}
	} else {
		return "";
	}
};
UiUtil.MthNum = function(aStrMth) {
	for(var cntr = 0; cntr < UiUtil.Months.length; cntr++) {
		var strMth = UiUtil.Months[cntr];
		var abbrvMth = strMth.substr(0, 3);
		if (abbrvMth === aStrMth) {
			return cntr + 1;
		}
	}
};
UiUtil.MthNumStartWithZero = function(aStrMth) {
	for(var cntr = 0; cntr < UiUtil.Months.length; cntr++) {
		var strMth = UiUtil.Months[cntr];
		var abbrvMth = strMth.substr(0, 3);
		if (abbrvMth === aStrMth) {
			return cntr;
		}
	}
};
UiUtil.PadZero = function(num, size) {
	var s = num+"";
	while (s.length < size) s = "0" + s;
	return s;
};
UiUtil.DisplayDateToDate = function(aStrDate) {
	var result = new Date();
	if (UiUtil.NotUndefineNotNullNotBlank(aStrDate)) {
		var aryDate = aStrDate.split("-");
		var day = aryDate[0];
		var mth = aryDate[1];
		var yer = aryDate[2];
		if (yer.length > 4) yer = yer.substring(0, 4);
		var numMth = UiUtil.MthNum(mth);
		var dateISO = yer + "-" + UiUtil.PadZero(numMth, 2) + "-" + day;
		result = new Date(dateISO);
	}

	return result;
};
UiUtil.DisplayDateToStrTime = function(aStrDate) {
	var result;
	if (UiUtil.NotUndefineNotNullNotBlank(aStrDate)) {
		var aryDate = aStrDate.split(' ');
		result = aryDate[1];
	}
	return result;
};
UiUtil.DateMonthStart = function(aDate) {
	var result = new Date(aDate.getFullYear(), aDate.getMonth(), 1);
	return result;
};
UiUtil.DateMonthEnd = function(aDate) {
	var result = new Date(aDate.getFullYear(), aDate.getMonth() + 1, 0);
	return result;
};
UiUtil.DateMinusDay = function(aDate, aInt) {
	var result = new Date(aDate);
	result.setDate(result.getDate() - aInt);
	return result;
};
UiUtil.DatePlusDay = function(aDate, aInt) {
	var result = new Date(aDate);
	result.setDate(result.getDate() + aInt);
	return result;
};
UiUtil.DateDiffInDays = function(aStart, aEnd) {
	var diff = aEnd - aStart;
	if (diff < 0) diff = aStart - aEnd;
	return Math.round((diff)/(1000*60*60*24));
};
UiUtil.DateForDisplay = function(aDate) {
	var date = aDate;
	if (aDate === undefined || aDate === null) {
		date = new Date();
	} 
	var numDay = date.getDate();
	var numMth = date.getMonth(); // starts from 0
	var numYear = date.getFullYear();
	var result = UiUtil.PadZero(numDay, 2) + "-" + UiUtil.MthAbbrv(numMth) + "-" + numYear;
	return result;
};
UiUtil.DateMinus = function(aDateEnd, aDateStart) {
	var Difference_In_Time = aDateEnd.getTime() - aDateStart.getTime(); // To calculate the time difference of two dates 
	var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24); // To calculate the no. of days between two dates 
	return Difference_In_Days;
};
UiUtil.DateInRange = function(aRangeStart, aRangeEnd, aStartDate, aEndDate) {
	var rangeStart = new Date(aRangeStart.toDateString()); // toDateString() is to remove the time part of the date
	var rangeEnd = new Date(aRangeEnd.toDateString());
	var startDate = new Date(aStartDate.toDateString());
	var endDate = new Date(aEndDate.toDateString());
	return (startDate.getTime() >= rangeStart.getTime() && startDate.getTime() <= rangeEnd.getTime()) || (rangeStart.getTime() >= startDate.getTime() && rangeStart.getTime() <= endDate.getTime());

};
UiUtil.DateAddDays = function(date, days) {
	const copy = new Date(Number(date));
	copy.setDate(date.getDate() + days);
	return copy;
};
UiUtil.TimeForDisplay = function(aDate) {
	var date = aDate;
	if (aDate === undefined || aDate === null) {
		date = new Date();
	} 
	var numHour = date.getHours();
	var numMin = date.getMinutes();
	var numSec = date.getSeconds();
	var result = UiUtil.PadZero(numHour, 2) + ":" + UiUtil.PadZero(numMin, 2) + ":" + UiUtil.PadZero(numSec, 2);
	return result;
};
UiUtil.DateTimeForDisplay = function(aDate) {
	var result = UiUtil.DateForDisplay(aDate) + " " + UiUtil.TimeForDisplay();
	return result;
};
UiUtil.IsCheckbox = function(element) {
	return element.type === "checkbox";
};
UiUtil.FindInput = function(aDivName) {
	var result;
	var element = document.getElementById(aDivName);
	if (element) {
		var inputs = element.querySelectorAll("input");
		result = inputs[0];
	} else {
		var inputs = []; // Empty array if element not found
	}
	return result;
};
UiUtil.InputFieldForBE = function(aDivName) {
	var input = UiUtil.FindInput(aDivName);
	if (UiUtil.IsCheckbox(input)) {
		return input.checked;
	} else {
		return input.value;
	}
};
UiUtil.FindInputFromElement = function(aElement) {
	if (typeof aElement === 'string') {
		aElement = document.getElementById(aElement);
	}
	if (aElement && aElement instanceof HTMLElement) {
		const inputArea = aElement.querySelector('.st-input-area');
		if (inputArea) {
			return inputArea.querySelector('input');
		}
		return aElement.querySelector('input');
	}
	return null;
}
UiUtil.ComboBoxForBE = function(aDivName) {
	//var input = $($('#' + aDivName).find('select')[0]);
	var input = $($('#' + aDivName + " select"));
	return input.val();
};
UiUtil.GetStrDateFrom = function() {
	var inputParentStart = document.getElementById('st-dp-dateFrom');
	return UiUtil.DatePickerToStrDate(inputParentStart);;
};
UiUtil.GetStrDateEnd = function() {
	var inputParentEnd = document.getElementById('st-dp-dateEnd');
	return UiUtil.DatePickerToStrDate(inputParentEnd);;
};
UiUtil.DatePickerToStrDate = function(aInputParentElement) {
	var aryInput = aInputParentElement.querySelectorAll('input'); // uses pure javascript
	var day = aryInput[0].value;
	var mth = aryInput[1].value; // starts from 1
	var yer = aryInput[2].value;
	var result = day + "-" + UiUtil.MthAbbrv(parseInt(mth) - 1) + "-" + yer;
	return result;
};
UiUtil.SetDatePickerFromStrDate = function(aStrDate, txtDay, txtMth, txtYear, txtHour, txtMin, txtSec) {
	if (UiUtil.NotUndefineNotNullNotBlank(aStrDate)) {
		var day = aStrDate.substr(0, 2);
		var str3CharMth = aStrDate.substr(3, 3);
		var yer = aStrDate.substr(7, 4);
		var intMth = "";
		if (str3CharMth !== undefined && str3CharMth !== "") {
			intMth = new Date(Date.parse('01-' + str3CharMth + '-' + yer)).getMonth() + 1;
			//intMth = new Date(Date.parse(str3CharMth + yer)).getMonth() + 1; // apple don't support this
		}
	
		txtDay.setAttribute("value", day);
		txtMth.setAttribute("value", intMth);
		txtYear.setAttribute("value", yer);

		var hour = aStrDate.substr(12, 2);
		var min = aStrDate.substr(15, 2);
		var sec = aStrDate.substr(18, 2);
		txtHour.setAttribute("value", hour);
		txtMin.setAttribute("value", min);
		txtSec.setAttribute("value", sec);
	}
};
UiUtil.SetDatePickerValue = function(aInputParentElement, aDateValue) {
	var aryInput = aInputParentElement.querySelectorAll('input'); // uses pure javascript
	aryInput[0].value = UiUtil.PadZero(aDateValue.getDate(), 2);
	aryInput[1].value = UiUtil.PadZero(aDateValue.getMonth() + 1, 2);
	aryInput[2].value = aDateValue.getFullYear();
};
UiUtil.GetDatePickerValue = function(aInputParentElement) {
	var aryInput = aInputParentElement.querySelectorAll('input'); // uses pure javascript
	var day = aryInput[0].value;
	var mth = aryInput[1].value; // starts from 1
	var yer = aryInput[2].value;
	var result = new Date(yer, parseInt(mth) - 1, day);
	return result;
};
/*
 * Deprecated, use the refactored PopupCalendarPeriod and CreatePeriodRangeElement instead 
 */
UiUtil.ShowCalendarPeriod = function(aTitle, aMsg, currentDateFrom, currentDateEnd, aDateSelected, aOnCancel) {
	UiUtil.DialogPeriodRange(aTitle, aMsg, currentDateFrom, currentDateEnd, function() {
		var newDateFrom = UiUtil.DisplayDateToDate(UiUtil.GetStrDateFrom());
		var newDateEnd = UiUtil.DisplayDateToDate(UiUtil.GetStrDateEnd());
		if (newDateFrom > newDateEnd) {
			UiUtil.DialogError("Error", "'To' date must be later then 'From' date!", function() {
				UiUtil.ShowCalendarPeriod(aTitle, aMsg, newDateFrom, newDateEnd);
			});
		} else {
			if (UiUtil.NotUndefineNotNullNotBlank(aDateSelected))
				aDateSelected(newDateFrom, newDateEnd);
		}
	}, function() {
		if (UiUtil.NotUndefineNotNullNotBlank(aOnCancel))
			aOnCancel();
	});
};
UiUtil.GetRandom5 = function() {
	return Math.floor(Math.random()*90000) + 10000;
};
UiUtil.GenElementId = function(aOneElementId, aFieldFqn, aPrefix, aFormId) {
	// generate element id according to slideIndex and field Fqn
	var genId;
	if (UiUtil.NotUndefineNotNullNotBlank(aOneElementId)) {
		genId = aOneElementId;
	} else if (UiUtil.NotUndefineNotNullNotBlank(aFieldFqn)) {
		var fqnName = UiUtil.SpecialCharReplace(aFieldFqn);
		if (UiUtil.IsUndefineOrNullOrBlank(aFormId)) {
			if (UiUtil.NotUndefineNotNullNotBlank(aPrefix)) {
				genId = aPrefix + fqnName;
			} else {
				genId = "wt_" + fqnName;
			}
		} else {
			var formName = UiUtil.SpecialCharReplace(aFormId);
			if (UiUtil.NotUndefineNotNullNotBlank(aPrefix)) {
				genId = aPrefix + formName + '_' + fqnName;
			} else {
				genId = "wt_" + formName + '_' + fqnName;
			}
		}
	} else {
		genId = "wt_rd" + UiUtil.GetRandom5();
	}
	
	return genId;
};
UiUtil.GetFieldId = function(aElementId) {
	var result = UiUtil.SpecialCharUnplace(aElementId);
	return (aElementId.substr(3));
};
UiUtil.MaskNumberWithWidth = function(aSize) {
	var theMask = "###,###,###,###,###,###,##0";
	if (UiUtil.NotUndefineNotNullNotBlank(aSize)) {
		theMask = "0";
		for(var cntr = 1; cntr < parseInt(aSize); cntr++) {
			if (theMask.length % 3 === 0) {
				theMask = "," + theMask;
			}
			theMask = "#" + theMask;
		}
	}
	return theMask;
};
UiUtil.CreateTextField = function(displayLabel, aValue, aSize, aId, aFieldType, aFieldMask, aFieldFqn, aFormId) {
	var inputTxt = UiUtil.CreateTextFieldNoLabel(aId, aValue);

	var elementId = UiUtil.GenElementId(aId, aFieldFqn, undefined, aFormId);
	inputTxt.setAttribute("id", elementId);

	if (aSize !== undefined) {
		inputTxt.setAttribute("size", aSize);
	}

	// mask according to given mask or data type
	if (UiUtil.NotUndefineNotNull(aFieldMask)) {
		inputTxt.setAttribute("data-mask", aFieldMask);
		inputTxt.setAttribute("maxlength", aFieldMask.length);
		var maskPlaceholder = aFieldMask.replace(/0/g , " ");
		maskPlaceholder = maskPlaceholder.replace(/#/g , " ");
		inputTxt.setAttribute("placeholder", maskPlaceholder);
	} else {
		if (UiUtil.NotUndefineNotNull(aFieldType)) {
			if (aFieldType === "integer") {
				var theMask = UiUtil.MaskNumberWithWidth(aSize);
				inputTxt.setAttribute("data-mask", theMask);
				inputTxt.setAttribute("maxlength", theMask.length);
			} else if (aFieldType === "encrypt") {
				inputTxt.setAttribute("type", "password");
				inputTxt.setAttribute("autocomplete", "new-password");
				inputTxt.setAttribute("size", 32);
			}
		}
	}

	var widgetGrp = UiUtil.CreateTextFieldWithLabel(displayLabel, inputTxt);
	return widgetGrp;
};
UiUtil.CheckJsonBlank = function(aJson, aName, aErrorMsg) {
	var result = false;
	var strVal = UiUtil.GetValueByJsonPath(aJson, aName);	
	if (UiUtil.IsBlank(strVal)) {
		result = true;
		UiUtil.DialogInfo('Invalid input', aErrorMsg, function(){}); // no support for focus unless generated input-area got predictable id
	}
	return result;
};
UiUtil.CheckBlank = function(aElement, aErrorMsg) {
	var result = false;
	if (UiUtil.IsBlank(aElement.val())) {
		result = true;
		UiUtil.DialogError('Invalid input', aErrorMsg, function(){ UiUtil.SetFocus("#" + aElement[0].id);});
	}
	return result;
};
UiUtil.IsJsonBlank = function(aJson, aName) {
	var result = false;
	var strVal = UiUtil.GetValueByJsonPath(aJson, aName);	
	if (UiUtil.IsBlank(strVal)) {
		result = true;
	}
	return result;
};
UiUtil.IsBlank = function(aValue) {
	if (typeof aValue === 'undefined') {
		return true;
	} else if (aValue === null) {
		return true;
	} else if (aValue.trim() === "") {
		return true;
	} else {
		return false;
	}
};
UiUtil.IsFunction = function(functionToCheck) {
	if (UiUtil.NotUndefineNotNull(functionToCheck)) {
		var getType = {};
		return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
	}
	return false;
};
UiUtil.IsUndefineOrNull = function(aVar) {
	return !UiUtil.NotUndefineNotNull(aVar);
};
UiUtil.IsUndefineOrNullOrBlank = function(aVar) {
	return !UiUtil.NotUndefineNotNullNotBlank(aVar);
};
UiUtil.NotUndefineNotNull = function(aVar) {
	if ((typeof aVar !== 'undefined') && (aVar !== null) && aVar !== "undefined") {
		return true;
	}
	return false;
};
UiUtil.NotUndefineNotNullNotBlank = function(aVar) {
	if (UiUtil.NotUndefineNotNull(aVar)) {
		if (typeof aVar === "string") {
			if (aVar.trim().length !== 0) {
				return true;
			} else {
				return false;
			}
		} else {
			return true;
		}
	}
	return false;
};
UiUtil.IsEmptyObject = function(aVar) {
	return Object.entries(aVar).length === 0;
};
UiUtil.DisplayMsgHide = function() {
	if (UiUtil.NotUndefineNotNull($("#msgImage"))) {
		$("#msgImage").css("visibility", "hidden");
	}
	if (UiUtil.NotUndefineNotNull($("#msgArea"))) {
		$("#msgArea").css("visibility", "hidden");
	}
};
UiUtil.DisplayMsgUnHide = function() {
	if (UiUtil.NotUndefineNotNull($("#msgArea"))) {
		if (UiUtil.NotUndefineNotNullNotBlank($("#msgArea").html())) {
			$("#msgImage").css("visibility", "visible");
			$("#msgArea").css("visibility", "visible");
		}
	}
};
UiUtil.DisplayError = function(aMsg) {
	UiUtil.DisplayMsg("error", aMsg);
};
UiUtil.DisplayInfo = function(aMsg) {
	UiUtil.DisplayMsg("info", aMsg);
};
UiUtil.DisplayMsg = function(type, mesg) {
	if (UiUtil.NotUndefineNotNull(mesg) === false) return;
	var msgPlace = document.getElementById('msgArea');
	if (UiUtil.NotUndefineNotNull(msgPlace)) {
		if (mesg !== undefined) {
			msgPlace.innerHTML = mesg;
		} else {
			msgPlace.innerHTML = 'Error message is not correctly set, undefine value';
		}

		var msgIcon = document.getElementById('msgImage');
		msgIcon.setAttribute('src', 'img/imgInfo.gif');
		if (type.toLowerCase() === 'error') {
			msgIcon.setAttribute('src', 'img/exclamation-grey.gif');
		}
	}
	UiUtil.DisplayMsgUnHide();
};
UiUtil.DialogReport2Us = function(aMsg, aAfterAck) {
	UiUtil.DialogBlink(aMsg + ", for support contact &nbsp;<a href='mailto:stems.my@shujutech.biz'>stems.my@shujutech.biz</a>", aAfterAck);
};
UiUtil.DialogBlink = function(aMsg, aAfterAck) {
	var respond = {};
	respond.status = 'error';
	respond.msg = aMsg;
	UiUtil.BlinkError(respond, aAfterAck);
};
UiUtil.ConvertHtmlToPlainText = function(htmlString) {
	const parser = new DOMParser();
	const parsedHtml = parser.parseFromString(htmlString, 'text/html');
	const plainText = parsedHtml.body.textContent;
	return plainText;
};
UiUtil.BlinkError = function(respond, aAfterAck) {
	var strErrorMsg = "";
	var errorStatus = respond.status;
	var errorMsg = UiUtil.ConvertHtmlToPlainText(respond.msg);
	var errorField = respond.errorField;
	if (!UiUtil.NotUndefineNotNullNotBlank(errorMsg)) {
		strErrorMsg = "System error, please report to &nbsp; <a href='mailto:stems.my@shujutech.biz'>stems.my@shujutech.biz</a>";
	} else {
		if (errorMsg.length > 253) {
			strErrorMsg = errorMsg.substring(0, 253).trim() + ".."; // kiv, maybe should only truncate msg part and retain the email part
		} else {
			strErrorMsg = errorMsg;
		}
	}

	UiUtil.DisplayMsg(errorStatus, strErrorMsg);
	UiUtil.DialogError("Error", strErrorMsg, aAfterAck);	
	if (UiUtil.NotUndefineNotNull(errorField)) { // place error marker at all error fields
		var allLabel = document.getElementsByTagName('LABEL');
		for(var cntr = 0; cntr < allLabel.length; cntr++){
			for(var cntrError = 0; cntrError < errorField.length; cntrError++){
				if (allLabel[cntr].innerHTML.indexOf(errorField[cntrError]) !== -1) {
					var parentDiv = allLabel[cntr].parentNode;
					for(var count = 0; count < parentDiv.childNodes.length; count++) {
						if (parentDiv.childNodes[count].tagName === 'IMG') {
							//var img = parentDiv.childNodes[count];
							//img.setAttribute('src', 'img/imgErrorBlink.gif');
							//$(img).css("display", "");
						}
					}
				}
			}
		}
	}
};
UiUtil.IsValidDate = function(dateString) {
	if (UiUtil.NotUndefineNotNullNotBlank(dateString)) {
		if (dateString instanceof Date) {
			return !isNaN(dateString.getTime());
		}
		const datePattern = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD format
		if (datePattern.test(dateString)) {
			const date = new Date(dateString);
			return !isNaN(date.getTime());
		}
	}
	return false;
};
UiUtil.IsValidJson = function(json) {
	try {
		JSON.parse(json);
		return true;
	} catch (ex) {
			return false;
	}
};
UiUtil.SetErrStr = function(xhr, err, errorThrown) {
	var errMsg = "";
	if (UiUtil.NotUndefineNotNullNotBlank(errorThrown)) {
		errMsg = errorThrown.split('\n')[0];
	} else {
		var theString = xhr.responseText;
		if (UiUtil.NotUndefineNotNullNotBlank(theString)) {
			errMsg = theString.split('\n')[0];
		} else {
			errMsg = "Unknow error, internet connection problem";
		}
	}
	return errMsg;
};
UiUtil.CallBackendJson = function (aUrl, aContentType, aMsg, aSuccFunc, aFailFunc, aFinalFunc) {
	if (UiUtil.NotUndefineNotNullNotBlank(aMsg) === false) {
		console.log("WARN, calling to UiUtil.CallBackend with empty JSON value in aMsg");
		return;
	}
	if (UiUtil.IsUndefineOrNullOrBlank(aContentType)) {
		aContentType = 'application/x-www-form-urlencoded; charset=UTF-8';
	}
	$.ajax({
		type: 'post',
		url: aUrl,
		dataType: 'json',
		contentType: aContentType, // this is needed when uploading excel file using content type json
		data: aMsg,
		success: function(respond, textStatus, jqXHR) {
			if (respond.status.toLowerCase() === 'ok') {
				aSuccFunc(respond, textStatus, jqXHR);
				if (UiUtil.NotUndefineNotNull(aFinalFunc)) {
					aFinalFunc(respond, textStatus, jqXHR);
				}
			} else {
				var afterAck = function(respond) {
					if (UiUtil.NotUndefineNotNull(aFailFunc)) {
						aFailFunc(respond, textStatus, jqXHR);
					}
					if (UiUtil.NotUndefineNotNull(aFinalFunc)) {
						aFinalFunc(respond, textStatus, jqXHR);
					}
				};
				UiUtil.BlinkError(respond, afterAck);
			}
			result = respond;
		},
		error: function(xhr, err, errorThrown) {
			if (UiUtil.HandleHtmlResponse(xhr, err) == false) {
				var respond = {};
				respond.msg = UiUtil.SetErrStr(xhr, err);
				respond.status = 'error';
				respond.errorField = 'null';
				var afterAck = function(respond) {
					if (UiUtil.NotUndefineNotNull(aFailFunc)) {
						aFailFunc(respond, errorThrown, xhr);
					}
					if (UiUtil.NotUndefineNotNull(aFinalFunc)) {
						aFinalFunc();
					}
					if (xhr.getResponseHeader('Transfer-Encoding') === "chunked") {
						if (UiUtil.NotUndefineNotNullNotBlank(aMsg)) {
							console.log("WARN, possible multiple concurrent backend call with invalid JSON value in aMsg, ignoring it, do nothing: " + aMsg);
						} else {
							console.log("WARN, possible multiple concurrent backend call with empty JSON value in aMsg, ignoring it, do nothing");
						}
					}
				};
				console.log("WARN, possible multiple concurrent backend call, ignoring it, do nothing");
				if (UiUtil.NotUndefineNotNullNotBlank(respond.msg)) {
					if (err === "parsererror" && respond.msg.startsWith("<")) respond.msg = null;
					UiUtil.BlinkError(respond, afterAck);
				}
			}
		}
	});
};
UiUtil.HandleHtmlResponse = function(xhr, err) {
	var result = false;
	if ((err === 'parsererror' || err.message.startsWith('Unexpected token')) && xhr.responseText && xhr.responseText.startsWith('<')) {
		const parser = new DOMParser();
		const parsedHTML = parser.parseFromString(xhr.responseText, 'text/html');
		if (parsedHTML.documentElement.nodeName === 'HTML') {
			window.top.location.reload();
			result = true;
		}
	}
	return result;
};
UiUtil.BeActionWithMsgNoFinalNoStop = function(aWaitMsg, aData, aActionKeyword, aUrl, aSuccFunc, aFailFunc, aMoreData) {  // deprecated
	UiUtil.BeActionJson("servlet", UiUtil.CONTENT_TYPE_WWW, aWaitMsg, aData, aActionKeyword, aUrl, aMoreData, false, aSuccFunc, aFailFunc, undefined);
};
UiUtil.BeActionWithMsgWithFinalNoStop = function(aWaitMsg, aData, aActionKeyword, aUrl, aSuccFunc, aFailFunc, aFinalFunc) {  // deprecated
	UiUtil.BeActionJson("servlet", UiUtil.CONTENT_TYPE_WWW, aWaitMsg, aData, aActionKeyword, aUrl, undefined, false, aSuccFunc, aFailFunc, aFinalFunc);
};
UiUtil.BeActionWithMsgWithFinal = function(aWaitMsg, aData, aActionKeyword, aUrl, aSuccFunc, aFailFunc, aFinalFunc) {  // deprecated
	UiUtil.BeActionJson("servlet", UiUtil.CONTENT_TYPE_WWW, aWaitMsg, aData, aActionKeyword, aUrl, undefined, true, aSuccFunc, aFailFunc, aFinalFunc);
};
UiUtil.BeActionWithMsg = function(aWaitMsg, aData, aActionKeyword, aUrl, aSuccFunc, aFailFunc, aMoreData) {  // deprecated
	UiUtil.BeActionJson("servlet", UiUtil.CONTENT_TYPE_WWW, aWaitMsg, aData, aActionKeyword, aUrl, aMoreData, true, aSuccFunc, aFailFunc, undefined);
};
UiUtil.BeActionWithMsgNoStop= function(aWaitMsg, aData, aActionKeyword, aUrl, aSuccFunc, aFailFunc, aMoreData) {  // deprecated
	UiUtil.BeActionJson("servlet", UiUtil.CONTENT_TYPE_WWW, aWaitMsg, aData, aActionKeyword, aUrl, aMoreData, false, aSuccFunc, aFailFunc, undefined);
};
UiUtil.BeAction = function(aData, aActionKeyword, aUrl, aSuccFunc, aFailFunc, aMoreData) {  // deprecated
	UiUtil.BeActionJson("servlet", UiUtil.CONTENT_TYPE_WWW, "", aData, aActionKeyword, aUrl, aMoreData, true, aSuccFunc, aFailFunc, undefined);
};
UiUtil.HttpPostJson = function(aWaitMsg, aData, aActionKeyword, aUrl, aSuccFunc, aFailFunc, aMoreData) {
	UiUtil.BeActionJson("rest", UiUtil.CONTENT_TYPE_JSON, aWaitMsg, aData, aActionKeyword, aUrl, aMoreData, true, aSuccFunc, aFailFunc, undefined);
};
UiUtil.BeActionJson = function(aRestOrServlet, aContentType, aWaitMsg, aData, aActionKeyword, aUrl, aMoreData, aStopDialog, aSuccFunc, aFailFunc, aFinalFunc) { 
	UiUtil.DialogWaitStart(aWaitMsg);
	var theUrl = aUrl + '?type=' + aActionKeyword;
	if (aRestOrServlet == "rest") { 
		theUrl = aUrl + '/' + aActionKeyword; 
	}
	var requestParam = {parentOid: this.parentOid, data: JSON.stringify(aData)};
	if (UiUtil.NotUndefineNotNull(aMoreData)) {
		Object.assign(requestParam, aMoreData);
	}
	
	UiUtil.CallBackendJson(theUrl, aContentType, requestParam, function(respond, textStatus, jqXHR) {
		if (UiUtil.NotUndefineNotNull(aSuccFunc)) {
			aSuccFunc(respond, textStatus, jqXHR); 
		}
	}
	, function(respond, textStatus, jqXHR) {
		if (UiUtil.NotUndefineNotNull(aFailFunc)) {
			aFailFunc(respond, textStatus, jqXHR); 
		}
	}
	, function() {
		if (UiUtil.NotUndefineNotNullNotBlank(aFinalFunc)) {
			aFinalFunc();
		}
		if (UiUtil.IsUndefineOrNullOrBlank(aStopDialog) || aStopDialog === true) {
			UiUtil.DialogWaitStop(); 
		}
	}
	);
};
UiUtil.BeActionHtml = function(aWaitMsg, aData, aActionKeyword, aUrl, aSuccFunc, aFailFunc, aMoreData) { 
	UiUtil.DialogWaitStart(aWaitMsg);
	var theUrl = aUrl + '?type=' + aActionKeyword;
	var requestParam = {parentOid: this.parentOid, data: JSON.stringify(aData)};
	if (UiUtil.NotUndefineNotNull(aMoreData)) {
		Object.assign(requestParam, aMoreData);
	}

	UiUtil.CallBackendHtml(theUrl, requestParam, function(respond, textStatus, jqXHR) {
		if (UiUtil.NotUndefineNotNull(aSuccFunc)) {
			aSuccFunc(respond, textStatus, jqXHR); 
		}
	}
	, function(respond, textStatus, jqXHR) {
		if (UiUtil.NotUndefineNotNull(aFailFunc)) {
			aFailFunc(respond, textStatus, jqXHR); 
		}
	}
	, function() { 
		UiUtil.DialogWaitStop(); 
	}
	, true 
	);
};
UiUtil.JsonAssignment = function(fromObject, fieldFullName, newValue) {
	var jsonVar = UiUtil.GetVarByJsonPath(fromObject, fieldFullName);
	jsonVar.data = newValue;
	return jsonVar;
};
UiUtil.UseEnterEsc = function(aFunc) {
	$(document).keypress(function(evt) {
		if(evt.which === 13) {
			$(':focus').blur();
			if ($('#modal-9').css('visibility') === 'visible') {
				stopInfoNifty();
			} else {
				aFunc();
			}
		} 
	});
	$(document).keyup(function(evn) {
		if (evn.keyCode === 27) { 
				if ($('#modal-9').css('visibility') === 'visible') {
					stopInfoNifty();
				}
		}
	});
};
UiUtil.GetPrevObj = function(aName) {
	var result;
	var strData = localStorage.getItem(aName);
	if (UiUtil.NotUndefineNotNullNotBlank(strData)) {
		result = JSON.parse(strData);
		/*
		if (typeof result === "string") {
			result = JSON.parse(result); // parse another time, not sure why after first parse is reomve backslash and is still stirng
		}
		*/
	}
	return result;
};
UiUtil.StoreObj = function(aName, newObj) {
	if (UiUtil.NotUndefineNotNull(newObj)) {
		localStorage.setItem(aName, JSON.stringify(newObj));
	} else {
		localStorage.setItem(aName, undefined);
	}
};
UiUtil.StorePrevObj = function(aName, aObj) {
	var newObj = jQuery.extend(true, {}, aObj);
	if (UiUtil.NotUndefineNotNull(newObj)) {
		localStorage.setItem(aName, JSON.stringify(newObj));
	}
};
UiUtil.BackNavi = function(aBeforeEdit, aAfterEdit) {
	var beforeEdit = JSON.stringify(aBeforeEdit);
	var afterEdit = JSON.stringify(aAfterEdit);
	if (beforeEdit !== afterEdit) {
		UiUtil.DialogWaitStop();
		//$("#wait-loading").css("display", "none"); // this for only one element
		$('[id="wait-loading"]').css("display", "none"); // for mutiple element with the same id
		return "All changes will be lost...";
	} else {
		return null;
	}
};
UiUtil.CallFunctionOrGoto = function(aOnCancelGoto) {
	if (UiUtil.NotUndefineNotNull(aOnCancelGoto)) {
		if (UiUtil.IsFunction(aOnCancelGoto)) {
			aOnCancelGoto();
		} else {
			UiUtil.LoadHRef(aOnCancelGoto);
		}
	} else {
		UiUtil.DialogWaitStart();
		window.history.go(-1);
	}
};
UiUtil.CancelEdit_Deprecated = function(aOnCancelGoto) {
	if (UiUtil.NotUndefineNotNull(window.onbeforeunload)) {
		var changeAlertMsg = window.onbeforeunload();
		if (changeAlertMsg !== null) {
			UiUtil.DialogOkCancel('Confirm to Cancel', 'You have made changes, confirm to cancel?', "question", function() {
				window.onbeforeunload = null;
				UiUtil.CallFunctionOrGoto(aOnCancelGoto);
			});
		} else {
			window.onbeforeunload = null;
			UiUtil.CallFunctionOrGoto(aOnCancelGoto);
		}
	}
};
UiUtil.GetAryByJsonPath = function(aJsnVar, aFqn) {
	var result = aJsnVar;
	if (UiUtil.NotUndefineNotNullNotBlank(aFqn)) {
		result = UiUtil.GetVarByJsonPath(aJsnVar, aFqn);
	}
	return result.dataset;
};
UiUtil.GetVarByJsonPath = function(aJsnVar, aFqn) {
	var pthAry = aFqn.split('.');
	var result = aJsnVar;
	for (var cntr = 0; cntr < pthAry.length; cntr++) {
		var key = pthAry[cntr];
		if (key.indexOf("[") === -1) {
			if (UiUtil.IsUndefineOrNullOrBlank(result) || (UiUtil.IsUndefineOrNullOrBlank(result.data) && UiUtil.IsUndefineOrNullOrBlank(result.dataset))) {
				console.log("Undefine variable of FQN: " + aFqn);
			}
			if (result.hasOwnProperty(key)) {
				result = result[key];
			} else if (UiUtil.NotUndefineNotNullNotBlank(result.data)) {
				if (result.data.hasOwnProperty(key))
					result = result.data[key];
				else {
					console.log("In FQN: " + aFqn + ", not found property name: " + key);
					result = undefined;
				}
			} else if (UiUtil.NotUndefineNotNullNotBlank(result.dataset)) {
				if (result.dataset.hasOwnProperty(key))
					result = result.dataset[key];
				else {
					console.log("In FQN: " + aFqn + ", not found property name: " + key);
					result = undefined;
				} 
			} 
		} else {
			var idxPt = key.match(/\[(.*?)\]/g);
			var nmePt = key.substr(0, key.indexOf(idxPt));
			var idxPt = idxPt[0].split('[')[1].split(']')[0];
			result = result.data[nmePt].dataset[idxPt];
			if (result === undefined) break;
		}
	}
	return result;
};
UiUtil.GetVarFromBeReply = function(aBeReply) { // use this if you're expecting single object reply
	return aBeReply.dataset[0];
};
UiUtil.GetStrFromBeReply = function(aBeReply) {
	return aBeReply.Field01;
};
UiUtil.GetValueFromBeReply = function(aBeReply, aFieldFqn) {
	var theValue = UiUtil.GetValueByJsonPath(UiUtil.GetVarFromBeReply(aBeReply), aFieldFqn);
	return theValue;
}; 
UiUtil.GetAryByFieldName = function(aFieldVar, aFieldFqn) {
	var result = UiUtil.GetAryByJsonPath(aFieldVar, aFieldFqn);
	return result;
};
UiUtil.GetVarByFieldName = function(aFieldVar, aFieldFqn) {
	var result = UiUtil.GetVarByJsonPath(aFieldVar, aFieldFqn);
	return result;
};
UiUtil.GetValueByFieldName = function(aFieldVar, aFieldFqn) {
	var result;
	if (UiUtil.IsUndefineOrNullOrBlank(aFieldFqn)) {
		if (UiUtil.NotUndefineNotNull(aFieldVar.data)) {
			return aFieldVar.data;
		} else {
			return aFieldVar;
		}
	}

	if (UiUtil.IsUndefineOrNullOrBlank(aFieldVar.data)) {
		var tmpVar = {};
		tmpVar.data = aFieldVar;
		if (UiUtil.GetVarByFieldName(tmpVar, aFieldFqn)) {
			result = UiUtil.GetValueByJsonPath(tmpVar, aFieldFqn);
		}
	} else {
		if (aFieldFqn === 'objectId' || aFieldFqn === 'clasz' || aFieldFqn === 'delete') {
			result = UiUtil.GetValueByJsonPath(aFieldVar, aFieldFqn);
		} else {
			if (UiUtil.GetVarByFieldName(aFieldVar, aFieldFqn)) {
				result = UiUtil.GetValueByJsonPath(aFieldVar, aFieldFqn);
			}
		}
	}
	return result;
};
UiUtil.SetValueByFieldName = function(aFieldVar, aFieldFqn, aFieldValue) {
	if (UiUtil.IsUndefineOrNullOrBlank(aFieldFqn)) {
		aFieldVar.data = aFieldValue;
		return;
	}

	var theVar = UiUtil.GetVarByFieldName(aFieldVar, aFieldFqn);
	theVar.data = aFieldValue;
};
UiUtil.RenameField= function(aMasterObj, aOldName, aNewName) {
	aMasterObj.data[aNewName] = UiUtil.GetVarByFieldName(aMasterObj, aOldName);
	delete aMasterObj.data[aOldName];
};
UiUtil.GetValueByJsonPath = function(aJsnVar, aFqn) {
	if (aFqn === 'objectId') {
		return aJsnVar.objectId;
	} else if (aFqn === 'clasz') {
		return aJsnVar.clasz;
	} else if (aFqn === 'delete') {
		return aJsnVar.delete;
	} else {
		var jsnVar = UiUtil.GetVarByJsonPath(aJsnVar, aFqn);
		if (typeof jsnVar === 'object') {
			if (jsnVar.hasOwnProperty("data"))
				return jsnVar.data;
			else if (jsnVar.hasOwnProperty("dataset"))
				return jsnVar.dataset;
			else {
				console.log("For FQN: " + aFqn + ", there is no such variable/property")
				return undefined;
			}
		} else {
			return jsnVar;
		}
	}
};
UiUtil.GetValueIsDeleted = function(aJsnVar) {
	var isDeleted = UiUtil.GetValueByJsonPath(aJsnVar, "delete");
	if (UiUtil.NotUndefineNotNullNotBlank(isDeleted)) {
		return isDeleted;
	} else {
		return false;
	}
};
UiUtil.GetNotCloneElement = function(aElementId) {
	var normJqVar = aElementId.replace('[', '\\[').replace(']', '\\]').replace('.', '\\.');
	var escJqVar = "[id='" + normJqVar + "']";
	var dupSlider = $(escJqVar);
	for(var cntr = 0; cntr < dupSlider.length; cntr++) {
		if (dupSlider[cntr].areaEdit !== undefined) {
			return dupSlider[cntr];
		}
	}
};
UiUtil.SetValByJsonPath = function(aJsnVar, aFqn, aValue) {
	var aryVar = UiUtil.GetVarByJsonPath(aJsnVar, aFqn);
	aryVar.data = aValue;
};
UiUtil.ValidateEmail = function(aEmailAddr) {
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(aEmailAddr);
};
UiUtil.GetSystemData = function(aFieldName) {
	return function(jsObj) { 
		return UiUtil.MakeObjData(UiUtil.GetVarByJsonPath(jsObj, aFieldName)); 
	};
};
UiUtil.MakeObjData = function(aValue) {
	var result = {};
	result.data = aValue;
	return result;	
};
UiUtil.RemoveArrayElement = function(array, element) {
	return array.filter(e => e !== element);
};
UiUtil.GetTimeZone = function(aDate) {
	var timeZone = "";
	if (aDate !== undefined) {
		var ary = aDate.split(" ");
		if (ary.length > 1) {
			timeZone = ary[ary.length - 1];
		}
	}
	return timeZone;
};
UiUtil.GetDisplayDate = function(nmDay, nmMth, nmYer, nmHour, nmMin, nmSec) { 
	var strDate = "";
	if (UiUtil.IsNum(nmDay)
	&& UiUtil.IsNum(nmMth)
	&& UiUtil.IsNum(nmYer)
	) {
		strDate = nmDay + "-" + UiUtil.MthAbbrv(parseInt(nmMth) - 1) + "-" + nmYer; 
		if (UiUtil.IsNum(nmHour)
		&& UiUtil.IsNum(nmMin)
		&& UiUtil.IsNum(nmSec)
		) {
			strDate += " "  + nmHour + ":" + nmMin + ":" + nmSec; 
		}
	}
	return strDate;
};
UiUtil.CreateTextFieldNoLabel = function(id, aValue) {
	var inputTxt = document.createElement("input");
	inputTxt.areaEdit = this;
	inputTxt.setAttribute("class", CLS_INPUT);
	inputTxt.setAttribute("type", "text");
	if (aValue !== undefined) {
		inputTxt.setAttribute("value", aValue);
		$(inputTxt).val(aValue);
	}
	if (id !== undefined && id !== "") {
		inputTxt.setAttribute("id", id);
	}
	return inputTxt;
};
UiUtil.OnDatePickerChangeValue = function(aParam, aElem) {
	var newDate;
	var theId;
	if (UiUtil.NotUndefineNotNullNotBlank(aParam)) {
		newDate = aParam.date;
		theId = aParam.id;
	} else {
		newDate = UiUtil.GetDatePickerValue(aElem.parentElement.parentElement);
		theId = aElem.id;
	}
	var oldDate = undefined;
	if (UiUtil.NotUndefineNotNullNotBlank(aElem)) {
		oldDate = aElem.oldDate;
		aElem.oldDate = newDate;
	}
	UiUtil.OnDatePickerChangeDate(theId, oldDate, newDate);
};
UiUtil.OnDatePickerChangeDate = function(aId, aOldDate, aNewDate) {
};
UiUtil.CreateDatePicker = function(displayLabel, fieldVar, aUseSpanPicker, aShowTime, aFieldFqn, aFormId) {
	var spanDay = document.createElement("span");
	var dtElementId = UiUtil.GenElementId(undefined, aFieldFqn, undefined, aFormId);

	dtElementId = UiUtil.GenElementId(undefined, aFieldFqn, "dd_", aFormId); // prefix with date day
	var tfDay = UiUtil.CreateTextFieldNoLabel(dtElementId);
	tfDay.setAttribute("size", 2);
	tfDay.setAttribute("class", CLS_DATE_PICKER);
	tfDay.setAttribute("data-mask", "00");
	tfDay.style.minWidth = "40px";
	spanDay.appendChild(tfDay);

	var slashDay = document.createElement("span");
	slashDay.setAttribute("class", "symbol");
	slashDay.innerHTML = "/";

	dtElementId = UiUtil.GenElementId(undefined, aFieldFqn, "dm_", aFormId); // prefix with date month
	var spanMth = document.createElement("span");
	var tfMth = UiUtil.CreateTextFieldNoLabel(dtElementId);
	tfMth.setAttribute("size", 2);
	tfMth.setAttribute("class", CLS_DATE_PICKER);
	tfMth.setAttribute("data-mask", "00");
	tfMth.style.minWidth = "40px";
	spanMth.appendChild(tfMth);

	var slashMth = document.createElement("span");
	slashMth.setAttribute("class", "symbol");
	slashMth.innerHTML = "/";

	dtElementId = UiUtil.GenElementId(undefined, aFieldFqn, "dy_", aFormId); 
	var spanYear = document.createElement("span");
	var tfYear = UiUtil.CreateTextFieldNoLabel(dtElementId);
	tfYear.setAttribute("size", 4);
	tfYear.setAttribute("class", CLS_DATE_PICKER);
	tfYear.setAttribute("data-mask", "0000");
	tfYear.style.minWidth = "60px";
	spanYear.appendChild(tfYear);

	dtElementId = UiUtil.GenElementId(undefined, aFieldFqn, "dh_", aFormId); 
	var spanHour = document.createElement("span");
	var tfHour = UiUtil.CreateTextFieldNoLabel(dtElementId);
	tfHour.setAttribute("size", 2);
	tfHour.setAttribute("class", CLS_DATE_PICKER);
	tfHour.setAttribute("data-mask", "00");
	spanHour.appendChild(tfHour);

	var slashHour = document.createElement("span");
	slashHour.setAttribute("class", "symbol");
	slashHour.innerHTML = "/";

	dtElementId = UiUtil.GenElementId(undefined, aFieldFqn, "di_", aFormId); 
	var spanMin = document.createElement("span");
	var tfMin = UiUtil.CreateTextFieldNoLabel(dtElementId);
	tfMin.setAttribute("size", 2);
	tfMin.setAttribute("class", CLS_DATE_PICKER);
	tfMin.setAttribute("data-mask", "00");
	spanMin.appendChild(tfMin);

	var slashMin = document.createElement("span");
	slashMin.setAttribute("class", "symbol");
	slashMin.innerHTML = "/";

	dtElementId = UiUtil.GenElementId(undefined, aFieldFqn, "ds_", aFormId); 
	var spanSec = document.createElement("span");
	var tfSec = UiUtil.CreateTextFieldNoLabel(dtElementId);
	tfSec.setAttribute("size", 4);
	tfSec.setAttribute("class", CLS_DATE_PICKER);
	tfSec.setAttribute("data-mask", "00");
	spanSec.appendChild(tfSec);

	UiUtil.SetDatePickerFromStrDate(fieldVar.data, tfDay, tfMth, tfYear, tfHour, tfMin, tfSec);
	var strDateForCursor = tfYear.value + tfMth.value + tfDay.value;
	var timeZone = UiUtil.GetTimeZone(fieldVar.data); 

	dtElementId = UiUtil.GenElementId(undefined, aFieldFqn, undefined, aFormId); 
	var spanPicker= document.createElement("span");
	spanPicker.setAttribute("id", dtElementId);
	$(spanPicker).css("margin", "auto");

	var jsPicker = document.createElement("script");
	jsPicker.setAttribute("type", "text/javascript");

	var callbackAry = "'datereturned': [ UiUtil.OnDatePickerChangeValue ]";  

	var dpkId = "'id': '" + tfYear.id + "'";
	if (aUseSpanPicker === true) {
		jsPicker.innerHTML = "\n" + "//<![CDATA[  " + "\n"
		+ "	datePickerController.destroyDatePicker('"+ tfYear.id + "');"
		+ " var opts = {" + dpkId + ", formElements: {'" + tfYear.id + "':'%Y','" + tfMth.id + "':'%m','" + tfDay.id + "':'%d'}, showWeeks: false, positioned: '" + spanPicker.id + "', callbackFunctions: {" + callbackAry + "}" + "};"
		+ "	datePickerController.createDatePicker(opts);"
		+ "	datePickerController.setCursorDate('" + tfYear.id + "', '" + strDateForCursor + "');"
		+ "\n" + "//]]>" + "\n";
	} else {
		jsPicker.innerHTML = "\n" + "//<![CDATA[  " + "\n"
		+ "	datePickerController.destroyDatePicker("+ tfYear.id + ");"
		+ "	var opts = {" + dpkId + ", formElements: {'" + tfYear.id + "':'%Y','" + tfMth.id + "':'%m','" + tfDay.id + "':'%d'}, showWeeks: false" + ", callbackFunctions: {" + callbackAry + "}" + "};"
		+ "	datePickerController.createDatePicker(opts);"
		+ "	datePickerController.setCursorDate('" + tfYear.id + "', '" + strDateForCursor + "');"
		+ "\n" + "//]]>" + "\n";
	}

	var parent = document.createElement("parentwrapper");
	parent.appendChild(spanDay);
	parent.appendChild(slashDay);
	parent.appendChild(spanMth);
	parent.appendChild(slashMth);
	parent.appendChild(spanYear);
	parent.appendChild(jsPicker);
	parent.appendChild(spanPicker);


	var spanTime = document.createElement("span");
	if (aShowTime === true) {
		$(spanTime).css("display", "");
	} else {
		$(spanTime).css("display", "none");
	}
	parent.appendChild(spanTime);
	spanTime.appendChild(spanHour);
	spanTime.appendChild(slashHour);
	spanTime.appendChild(spanMin);
	spanTime.appendChild(slashMin);
	spanTime.appendChild(spanSec);
	var result = UiUtil.CreateTextFieldWithLabel(displayLabel, parent);

	var chgLabel = result.getElementsByTagName("label")[0];
	var dtFormat = document.createElement("span");
	dtFormat.style.fontWeight = "normal";
	dtFormat.innerHTML = " (DD/MM/YYYY";
	if (aShowTime === true) {
		dtFormat.innerHTML = dtFormat.innerHTML + " HOUR/MIN/SEC " + timeZone;
	}
	dtFormat.innerHTML = dtFormat.innerHTML + ")";
	chgLabel.appendChild(dtFormat);

	var dpcInput = tfYear.parentElement.parentElement;
	UiUtil.OnDatePickerInputChange(dpcInput, 'UiUtil.OnDatePickerChangeValue(undefined, this)');

	return result;
};
UiUtil.CreateCheckBox = function(displayLabel, aValue, fieldFqn, aFormId) {
	var	inputId = UiUtil.GenElementId(undefined, fieldFqn, undefined, aFormId);
	var inputTxt = document.createElement("input");
	inputTxt.setAttribute("id", inputId);
	inputTxt.setAttribute("class", CLS_CHECKBOX);
	inputTxt.setAttribute("type", "checkbox");
	inputTxt.style.minWidth = 0;
	if (aValue.data !== undefined) {
		if (aValue.data === 'true' || aValue.data === true) {
			$(inputTxt).prop("checked", true);
		} else {
			$(inputTxt).prop("checked", false);
		}
	} else {
		$(inputTxt).prop("checked", false);
	}

	var result = UiUtil.CreateTextFieldWithLabel(displayLabel, inputTxt);
	var labelArea = result.querySelector(".st-label-area");
	var inputArea = result.querySelector(".st-input-area");
	if (labelArea && inputArea) {
		inputArea.style.float = 'left';
		labelArea.style.float = 'left';
		labelArea.style.marginLeft = '10px';
		result.insertBefore(inputArea, labelArea);
	}
	result.classList.add("st-eachfield-checkbox");
	return result;
};
UiUtil.IsNumeric = function(num) {
	return !isNaN(num);
};
UiUtil.CallBackendHtml = function (aUrl, aMsg, aSuccFunc, aFailFunc, aFinalFunc, aNoOkMsg) {
	if (UiUtil.NotUndefineNotNullNotBlank(aMsg) === false) {
		console.log("WARN, calling to UiUtil.CallBackend with empty HTML value in aMsg");
		return;
	}

	var result = {status:'error', msg:'Fail to make ajax call'};
	$.ajax({
		type:'post',
		url:aUrl,
		dataType: 'html',
		data:aMsg,
		success:function(respond, textStatus, jqXHR) {
			if (UiUtil.GetLastLine(respond).startsWith("Error")) {
				var errorobj = {};
				errorobj.status = 'error';
				errorobj.msg = respond.split('\n')[0];

				var afterAck = function(respond) {
					if (UiUtil.NotUndefineNotNull(aFailFunc)) {
						aFailFunc(respond);
					}
					if (UiUtil.NotUndefineNotNull(aFinalFunc)) {
						aFinalFunc();
					}
				};
				UiUtil.BlinkError(errorobj, afterAck);
			} else {
				if (UiUtil.NotUndefineNotNull(aSuccFunc)) {
					aSuccFunc(respond, textStatus, jqXHR);
				}
				if (UiUtil.NotUndefineNotNull(aFinalFunc)) {
					aFinalFunc();
				}
			}

			if (UiUtil.NotUndefineNotNull(aFinalFunc)) {
				aFinalFunc(respond, textStatus, jqXHR);
			}
		}, error:function(xhr, err, errorThrown) {
			var respond = {};
			respond.msg = UiUtil.SetErrStr(xhr, err);
			respond.status = 'error';
			respond.errorField = 'null';
			var afterAck = function(respond) {
				if (UiUtil.NotUndefineNotNull(aFailFunc)) {
					aFailFunc(respond, errorThrown, xhr);
				}
				if (UiUtil.NotUndefineNotNull(aFinalFunc)) {
					aFinalFunc();
				}
				if (xhr.getResponseHeader('Transfer-Encoding') === "chunked") {
					if (UiUtil.NotUndefineNotNullNotBlank(aMsg)) {
						console.log("WARN, possible multiple concurrent backend call with invalid HTML value in aMsg, ignoring it, do nothing: " + aMsg);
					} else {
						console.log("WARN, possible multiple concurrent backend call with empty HTML value in aMsg, ignoring it, do nothing");
					}
				}
			};
			console.log("WARN, possible multiple concurrent backend call, ignoring it, do nothing");
			if (UiUtil.NotUndefineNotNullNotBlank(respond.msg)) {
				UiUtil.BlinkError(respond, afterAck);
			}
		}
	});
	return result;
};
UiUtil.FormatDate = function(aDateTime) {
	var dateTime = aDateTime.split(" ");
	return dateTime[0];
};
UiUtil.NavigateMonth = function(aDirection, aDateStart, aIdMth) {
	var jsDateInput = aDateStart;
	var numMth = jsDateInput.getMonth(); 
	if (aDirection === 'add') {
		numMth++;
	} else if (aDirection === 'minus') {
		numMth--;
	} else if (aDirection === 'static') {
	} else {
		UiUtil.DialogError("Error", "Internal application/javascript error!");
		return;	
	}
	//var jsDateOutput = new Date(jsDateInput.getFullYear(), numMth, jsDateInput.getDate()); // bug, if new Date(2020, 3, 31) will give us 1st of May 2020
	var jsDateOutput = new Date(jsDateInput.getFullYear(), numMth, 1);

	var strMth = UiUtil.MthAbbrv(jsDateOutput.getMonth());
	$('#' + aIdMth).html(strMth);

	var jsDateStart = UiUtil.DateMonthStart(jsDateOutput);
	var inputParentStart = document.getElementById('st-dp-dateFrom');
	UiUtil.SetDatePickerValue(inputParentStart, jsDateStart);

	var jsDateEnd = UiUtil.DateMonthEnd(jsDateOutput);
	var inputParentEnd = document.getElementById('st-dp-dateEnd');
	UiUtil.SetDatePickerValue(inputParentEnd, jsDateEnd);
};
UiUtil.ExtractScript = function(scriptList) {
	var fullScript = "";
	for(var cntr = 0; cntr < scriptList.length; cntr++) { 
		var eachScript = scriptList[cntr]; 
		var scriptText = $(eachScript).html().replace("<![CDATA[", "").replace("]]>", "").replace(/\//g, '').trim(); 
		//var scriptText = $(eachScript).html().replace("<!--[CDATA[", "").replace("]]-->", "").replace(/\//g, '').trim(); 
		fullScript += scriptText;
	}
	if (UiUtil.NotUndefineNotNullNotBlank(fullScript)) fullScript += ";";
	return fullScript;
};
/*
 * Deprecated, use the refactored PopupCalendarPeriod and CreatePeriodRangeElement instead 
 */
UiUtil.DialogPeriodRange = function(aTitleHeader, aTitleBody, aDateStart, aDateEnd, onOk, onCancel) {
	UiUtil.DialogWaitStart();
	var dateStart = {};  
	if (aDateStart === undefined) 
		dateStart.data = UiUtil.DateForDisplay(UiUtil.DateMonthStart(new Date()));
	else
		dateStart.data = UiUtil.DateForDisplay(UiUtil.DateMonthStart(aDateStart));
	var divDateStart = UiUtil.CreateDatePicker('From', dateStart, true , false, undefined, undefined); // was a bug here but was working coz we're using UiUtil.PopulateWidget to populate this?

	var dateEnd = {};
	if (aDateEnd === undefined) 
		dateEnd.data = UiUtil.DateForDisplay(UiUtil.DateMonthEnd(new Date()));
	else 
		dateEnd.data = UiUtil.DateForDisplay(UiUtil.DateMonthEnd(aDateEnd));
	var divDateEnd = UiUtil.CreateDatePicker('To', dateEnd, true , false, undefined, undefined);

	$(divDateStart).attr('id', 'st-dp-dateFrom');
	$(divDateStart).css('cssText', 'float: left: width: 40%; display: inline-block !important; text-align: left; margin-right: 20px');
	$(divDateStart).find('label').css('font-weight', 'normal');

	$(divDateEnd).attr('id', 'st-dp-dateEnd');
	$(divDateEnd).css('cssText', 'float: left: width: 40%; display: inline-block !important; text-align: left; margin-right: 20px');
	$(divDateEnd).find('label').css('font-weight', 'normal');
	
	if (UiUtil.NotUndefineNotNullNotBlank(aTitleBody)) {
		var divTitle = document.createElement('div');
		if (aTitleBody instanceof HTMLElement) {
			divTitle.appendChild(aTitleBody)
		} else {
			divTitle.innerHTML = aTitleBody;
			$(divTitle).css('width', '100%');
			$(divTitle).css('font-size', 'larger');
			$(divTitle).css('font-style', 'italic');
			$(divTitle).css('margin-bottom', '37px');
			$(divTitle).css('margin-top', '0');
		}
	}

	var iMonthLeft = document.createElement('i');
	$(iMonthLeft).attr('id', 'st-dp-iMonthLeft');
	iMonthLeft.setAttribute("class", "fa fa-chevron-circle-left");
	$(iMonthLeft).css('cssText', 'margin: 0px !important; font-size: larger; cursor: pointer');
	$(document).ready(function() {
		var inputParentStart = document.getElementById('st-dp-dateFrom');
		$("#st-dp-iMonthLeft").click(function() { UiUtil.NavigateMonth('minus', UiUtil.GetDatePickerValue(inputParentStart), 'monthAbbrv'); });
	});
	var iMonthRight = document.createElement('i');
	$(iMonthRight).attr('id', 'st-dp-iMonthRight');
	iMonthRight.setAttribute("class", "fa fa-chevron-circle-right");
	$(iMonthRight).css('cssText', 'margin: 0px !important; font-size: larger; cursor: pointer');
	$(document).ready(function() {
		var inputParentEnd = document.getElementById('st-dp-dateEnd');
		$("#st-dp-iMonthRight").click(function() { UiUtil.NavigateMonth('add', UiUtil.GetDatePickerValue(inputParentEnd), 'monthAbbrv'); });
	});
	var spanMonthAbbrv = document.createElement('span');
	spanMonthAbbrv.setAttribute("class", "unselectable");
	$(spanMonthAbbrv).css('padding-left', '6px');
	$(spanMonthAbbrv).css('padding-right', '6px');
	$(spanMonthAbbrv).css('font-family', 'monospace');
	$(spanMonthAbbrv).attr('id', 'monthAbbrv');
	spanMonthAbbrv.innerHTML = "JAN";

	var divControl = document.createElement('div');
	divControl.appendChild(iMonthLeft);
	divControl.appendChild(spanMonthAbbrv);
	divControl.appendChild(iMonthRight);
	var divMonthNavg = UiUtil.CreateTextFieldWithLabel("", divControl);
	$(divMonthNavg).css('float', 'left');
	$(divMonthNavg).css('width', '20%');
	$(divMonthNavg).css('margin-top', '29px');
	$(divMonthNavg).css('margin-right', '1em');

	var divCol = document.createElement('div');
	$(divCol).css('float', 'left');
	$(divCol).css('display', 'flex');
	$(divCol).css('align-items', 'center');
	$(divCol).css('width', '100%');
	divCol.appendChild(divDateStart);
	divCol.appendChild(divDateEnd);
	divCol.appendChild(divMonthNavg);
	
	var divPeriod = document.createElement('div');
	if (UiUtil.NotUndefineNotNullNotBlank(aTitleBody)) {
		divPeriod.appendChild(divTitle);
	}
	$(divPeriod).css('float', 'left');
	$(divPeriod).css('margin-top', '0');
	divPeriod.appendChild(divCol);

	//var jsFunc = new Function();
	var jsFunc = function() {
		$(".swal2-container h2").css("margin", "0");
		$(".swal2-popup").css("padding", "2.5em");
	};
	
	UiUtil.DialogOkCancel(aTitleHeader, divPeriod, undefined, onOk, onCancel, jsFunc);
	UiUtil.NavigateMonth('static', UiUtil.DisplayDateToDate(dateStart.data), 'monthAbbrv');
	UiUtil.DialogWaitStop();

	const elDateFromPicker = document.querySelector('#st-dp-dateFrom .date-picker-control');
	const elDateEndPicker = document.querySelector('#st-dp-dateEnd .date-picker-control');
	elDateFromPicker.click();
	elDateFromPicker.click();
	elDateEndPicker.click();
	elDateEndPicker.click();
};
UiUtil.GetDatePickerData = function(aFormId, aFieldFqn, aForm) { 
	var strDate;
	if ((UiUtil.NotUndefineNotNullNotBlank(UiUtil.GetElementById(undefined, UiUtil.GenElementId(undefined, aFieldFqn, "dd_", aFormId)))
	&& UiUtil.NotUndefineNotNullNotBlank(UiUtil.GetElementById(undefined, UiUtil.GenElementId(undefined, aFieldFqn, "dm_", aFormId)))
	&& UiUtil.NotUndefineNotNullNotBlank(UiUtil.GetElementById(undefined, UiUtil.GenElementId(undefined, aFieldFqn, "dy_", aFormId)))
	&& UiUtil.NotUndefineNotNullNotBlank(UiUtil.GetElementById(undefined, UiUtil.GenElementId(undefined, aFieldFqn, "dh_", aFormId)))
	&& UiUtil.NotUndefineNotNullNotBlank(UiUtil.GetElementById(undefined, UiUtil.GenElementId(undefined, aFieldFqn, "di_", aFormId)))
	&& UiUtil.NotUndefineNotNullNotBlank(UiUtil.GetElementById(undefined, UiUtil.GenElementId(undefined, aFieldFqn, "ds_", aFormId)))
	)
	) {
		var nmDay = $("#" + UiUtil.GenElementId(undefined, aFieldFqn, "dd_", aFormId)).val();
		var nmMth = $("#" + UiUtil.GenElementId(undefined, aFieldFqn, "dm_", aFormId)).val();
		var nmYer = $("#" + UiUtil.GenElementId(undefined, aFieldFqn, "dy_", aFormId)).val();
		var nmHour = $("#" + UiUtil.GenElementId(undefined, aFieldFqn, "dh_", aFormId)).val();
		var nmMin = $("#" + UiUtil.GenElementId(undefined, aFieldFqn, "di_", aFormId)).val();
		var nmSec = $("#" + UiUtil.GenElementId(undefined, aFieldFqn, "ds_", aFormId)).val();
		strDate = UiUtil.GetDisplayDate(nmDay, nmMth, nmYer, nmHour, nmMin, nmSec);

		var nmDayElem = $("#" + UiUtil.GenElementId(undefined, aFieldFqn, "dd_", aFormId))[0];
		var strTzLabel = $(nmDayElem).parent().parent().parent().parent().find(".st-label-area").find("label").text();
		if (UiUtil.NotUndefineNotNullNotBlank(strTzLabel)) {
			var theTz = strTzLabel.match(/[+-][0-9]{2}[0-9]{2}/);
			if (UiUtil.NotUndefineNotNullNotBlank(theTz)) {
				strDate += " " + theTz[0];
			}
		}
	} else {
		strDate = UiUtil.GetWidgetData(undefined, aFieldFqn, "Missing datepicker widget [dd_, dm_, dy_, dh_, di_, ds_]: ", undefined, undefined, aForm);
	}

	return strDate;
};
UiUtil.NumberWithComma = function(aNum) {
	return aNum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
UiUtil.AddStyle = function(cssStr) {
	if (UiUtil.StyleExist(cssStr) === false) {
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
UiUtil.StyleExist = function(strStyle) {
	var ssList = document.styleSheets; 
	if (!ssList) return false;
	for (var i = 0; i < ssList.length; i++) {
		var ss = ssList[i]; 
		if (!ss) continue;
		if (UiUtil.XTraverseStyleSheet(ss, strStyle)) return true;
	}
	return false;
};
UiUtil.XTraverseStyleSheet = function(ss, strStyle) {
	if (!ss) return false;
	var rls = UiUtil.XGetCSSRules(ss) ; if (!rls) return false;
	var str2 = UiUtil.StdCssStr(strStyle);
	for (var j = 0; j < rls.length; j++) {
		var cr = rls[j];
		if (cr.selectorText) {
			var str1 = UiUtil.StdCssStr(cr.cssText);
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
UiUtil.StdCssStr = function(strCss) {
	var body = strCss.match(/[^{}]+(?=\})/g); // standardise body section string
	var tmp = document.createElement("div");
	tmp.style.cssText = body[0];

	var tgtCss = strCss.substr(0, strCss.indexOf(body) -1); // get the targeted css name
	var result = tgtCss + '{ ' + tmp.style.cssText + ' }';
	
	return result;
};
UiUtil.XGetCSSRules = function(ss) { 
	return ss.rules ? ss.rules : ss.cssRules; 
};
UiUtil.HrefCssAdd = function(cssPath) {
	if (UiUtil.HrefCssExist(cssPath) === false) {
		var lnk = document.createElement("link");
		lnk.setAttribute("href", cssPath);
		lnk.setAttribute("rel", "stylesheet");
		lnk.setAttribute("type", "text/css");
		document.head.appendChild(lnk);
	}
};
UiUtil.HrefCssExist = function(cssPath) {
	var ss = document.styleSheets;
	for (var cntr = 0, max = ss.length; cntr < max; cntr++) {
		var fullUrl = getFullUrl(cssPath);
		if (ss[cntr].href === fullUrl) return true;
	}	
	return false;
};
UiUtil.CreateComboBox = function(displayLabel, aFieldFqn, aEditable, aFormId) {
	var input;
	if (UiUtil.IsUndefineOrNullOrBlank(aEditable)) {
		input = document.createElement("select");
	} else {
		//input = document.createElement("datalist"); // datalist have more problem
		input = document.createElement("select");
	}
	var genId = UiUtil.GenElementId(undefined, aFieldFqn, undefined, aFormId);
	if (UiUtil.NotUndefineNotNullNotBlank(genId)) {
		input.setAttribute("id", genId);
	}
	input.setAttribute("class", CLS_COMBO_BOX);
	input.displayLabel = displayLabel;
	var result = input;
	if (displayLabel !== undefined) {
		result = UiUtil.CreateTextFieldWithLabel(displayLabel, input);
		$(result).find(".st-input-area").addClass("st-select-editable");
	}
	return result;
};
UiUtil.CreateComboBoxForGrid = function(aLookup, aFuncValidate, aDefaultValue, aDisabled) {
	if (typeof aFuncValidate === 'function') console.log('Call to UiUtil.CreateComboBoxForGrid 2nd parameter is name of function and not the function object!');
	var parentDiv = document.createElement("div");
	$(parentDiv).css("cssText", "position: relative");

	var cmb = UiUtil.CreateComboBox(undefined, undefined);
	UiUtil.PopulateComboBoxWithName(cmb, aLookup.option, aLookup.data.Descr.data);
	$(cmb).css("cssText", "width: 100% !important; border: none");
	var validateFuncStr = "if (this.value === 'blank') this.nextElementSibling.value = null; else this.nextElementSibling.value = this.value; this.value = '';";
	if (UiUtil.NotUndefineNotNullNotBlank(aFuncValidate)) validateFuncStr += " " + aFuncValidate + '(this, this.value, this.nextElementSibling.value)'; // combo object, input value, select value
					
	$(cmb).attr("onchange", validateFuncStr);

	var inputTxt = UiUtil.CreateTextFieldNoLabel(undefined);
	$(inputTxt).css("cssText", "width: 90% !important; border: none; top: 0; left: 0; position: absolute");
	$(inputTxt).attr("autocomplete", "off");
	//if (UiUtil.NotUndefineNotNullNotBlank(aFuncValidate)) $(inputTxt).attr("onblur", aFuncValidate + "(this, this.value, this.nextElementSibling.value)"); // this is for editable combobox, how to avoid 2x call by cmb.onchange
	if (UiUtil.NotUndefineNotNullNotBlank(aFuncValidate)) $(inputTxt).attr("onblur", aFuncValidate + "(this)"); // this is for editable combobox, how to avoid 2x call by cmb.onchange
	$(inputTxt).attr("value", aDefaultValue);

	if (UiUtil.NotUndefineNotNullNotBlank(aDisabled) && aDisabled === true) {
		$(inputTxt).attr('disabled', '');
	}

	parentDiv.appendChild(cmb);
	parentDiv.appendChild(inputTxt);
	return parentDiv;
};
UiUtil.PopulateComboBoxWithName = function(cmb, jsonObj, chosen) {
	var gotValue = false;
	var opt = document.createElement("option"); 
	opt.value = "blank"; 
	opt.innerHTML = ""; 
	cmb.appendChild(opt); 

	var strChosen;
	if (UiUtil.NotUndefineNotNull(chosen) && typeof chosen === 'object') {
		/*
		for (var key in chosen) {
			if (chosen[key].hasOwnProperty('isLookupDescr')) {
				strChosen = chosen[key].data;
			}
		}
		*/
		if ('Descr' in chosen) {
			strChosen = chosen['Descr'].data;
		} else {
			console.log('Error! Lookup object have no lookup Descr field');
		}
	} else {
		strChosen = chosen;
	}

	if (jsonObj !== undefined) {
		$.each(jsonObj, function(name, value)  { 
			var opt = document.createElement("option"); 
			opt.value = name; 
			opt.innerHTML = name; 
			if (name === strChosen) {
				opt.setAttribute("selected", '');
				gotValue = true;
			}
			cmb.appendChild(opt); 
		});

		if (gotValue === false) { // got no value, maybe is editable combobox with input
			var editableInput = $(cmb).parent().find("input")[0];
			if (UiUtil.NotUndefineNotNullNotBlank(editableInput)) {
				$(editableInput).val(strChosen);
			}
		}
	}
};
UiUtil.PopulateComboBoxWithValueAndDefault = function(cmb, choices, chosen) {
	var opt = document.createElement("option"); 
	opt.value = ""; 
	opt.innerHTML = ""; 
	cmb.appendChild(opt); 

	if (choices !== undefined) {
		var autoDefaultOnOneOption = false;
		if (Object.keys(choices).length === 1) {
			autoDefaultOnOneOption = true;
		}

		$.each(choices, function(name, value)  { 
			var opt = document.createElement("option"); 
			opt.value = value; 
			opt.innerHTML = value; 
			if (value === chosen || autoDefaultOnOneOption) {
				opt.setAttribute("selected", '');
				autoDefaultOnOneOption = false;
			}
			cmb.appendChild(opt); 
		});
	}
};
UiUtil.DecodeUnescape = function(input) {
	if (/&amp;|&quot;|&#39;|'&lt;|&gt;/.test(input)) {
		var doc = new DOMParser().parseFromString(input, "text/html");
		return doc.documentElement.textContent;
	}
	return input;
};
UiUtil.CamelCaseToTitleCase = function(camelCase){
	if (camelCase == null || camelCase == "") {
		return camelCase;
	}
	
	camelCase = camelCase.trim();
	var newText = "";
	for (var i = 0; i < camelCase.length; i++) {
		if (/[A-Z]/.test(camelCase[i])
			&& i != 0
			&& /[a-z]/.test(camelCase[i-1])) {
		newText += " ";
		}
		if (i == 0 && /[a-z]/.test(camelCase[i]))
		{
		newText += camelCase[i].toUpperCase();
		} else {
		newText += camelCase[i];
		}
	}
	
	return newText;
};
UiUtil.TitleCaseToCamelCase = function(titleCase){
	var noSpace = titleCase.replace(/ /g,"");
	return noSpace.charAt(0).toLowerCase() + noSpace.slice(1);
};
UiUtil.CreateTextFieldWithLabel = function(displayLabel, inputField) {
	var parent = document.createElement("div");
	parent.setAttribute("class", CLS_EACHFIELD_ROW);

	var labelArea = document.createElement("div");
	labelArea.setAttribute("class", CLS_LABEL_AREA);
	var label = document.createElement("label");
	label.innerHTML = displayLabel;
	label.style.float = 'left';
	label.setAttribute('class', CLS_LABEL);
	var err = document.createElement("img");
	err.setAttribute("src", UiUtil.ImgErrorBlink);
	err.style.display = 'none';
	err.style.marginTop = '4px';
	err.style.marginLeft = '10px';
	err.style.float = 'left';
	err.setAttribute("class", CLS_ERROR_IMG);
	var msg = document.createElement("span");
	msg.setAttribute("class", CLS_ERROR_MSG);
	msg.style.display = "none";
	labelArea.appendChild(label);
	labelArea.appendChild(err);
	labelArea.appendChild(msg);

	var inputArea = document.createElement("div");
	inputArea.setAttribute("class", CLS_INPUT_AREA);

	if (inputField.tagName === "parentwrapper") {
		for(var cntr = 0; cntr < inputField.childNodes.length; cntr++) { 
			inputArea.appendChild(inputField.childNodes[cntr]);
		}
	} else {
		inputArea.appendChild(inputField);
	}
	parent.appendChild(labelArea);
	parent.appendChild(inputArea);
	
	return parent;
};
UiUtil.Json2Money = function(result, strValue) {
	var arr = strValue.split(' ');
	if (typeof arr[0] !== 'undefined') {
		result.currency = arr[0];
		if (typeof arr[1] !== 'undefined') {
			var dolcent = arr[1].split('.');
			if (typeof dolcent[0] !== 'undefined') {
				result.dollar = dolcent[0];
				if (typeof dolcent[1] !== 'undefined') {
					result.cent = dolcent[1];
				}
			}
		}
	}
};
UiUtil.HandleDollar = function(el, ev, centid) {
	var code = ev.keyCode;
	if (code === 190) {
		$("#" + centid).focus();
	}
};
UiUtil.HandleBlankMoney = function(dollarId, centId) {
	var dollarValue = $("#" + dollarId).val();
	var centValue = $("#" + centId).val();
	if (!UiUtil.NotUndefineNotNullNotBlank(dollarValue)) { // dollar is blank
		if (UiUtil.NotUndefineNotNullNotBlank(centValue)) { // cent is not blank
			if (parseInt(centValue) === 0) {
				$("#" + centId).val("");
			} else {
				$("#" + dollarId).val("0");
			}
		}
	}

	if (!UiUtil.NotUndefineNotNullNotBlank(centValue)) { // cent is blank
		if (UiUtil.NotUndefineNotNullNotBlank(dollarValue)) { // dollar is not blank
			if (parseInt(dollarValue) === 0) {
				//$("#" + dollarId).val("");
			} else {
				$("#" + centId).val("00");
			}
		} 
	}
	
	if (UiUtil.NotUndefineNotNullNotBlank(dollarValue)) { // dollar is not blank
		if (parseInt(dollarValue) === 0) {
			if (!UiUtil.NotUndefineNotNullNotBlank(centValue)) { // cent is blank
				$("#" + centId).val("00");
			}
		}
	}
	
	if (centValue.length === 1) {
		$("#" + centId).val(centValue + "0");
	}
};
UiUtil.HandleCent = function(el, ev, centid) {
	// do nothing
};
UiUtil.CreateMoney = function(displayLabel, jsonMoney, aFieldFqn, aFormId) {
	var mnyValue = {};
	mnyValue.currency = '';
	mnyValue.dollar = '';
	mnyValue.cent = '';

	UiUtil.Json2Money(mnyValue, jsonMoney.data);

	var crcy = UiUtil.CreateComboBox(undefined);
	UiUtil.PopulateComboBoxWithValueAndDefault(crcy, jsonMoney.currencies, mnyValue.currency);
	var	mnyCurrency = UiUtil.GenElementId(undefined, aFieldFqn, "mr_", aFormId);
	crcy.setAttribute("id", mnyCurrency);
	crcy.setAttribute("style", "min-width:70px");

	var spCrcy = document.createElement("span");
	spCrcy.setAttribute("class", "symbol");
	spCrcy.appendChild(crcy);

	var theMask = UiUtil.MaskNumberWithWidth();
	var spDlr = document.createElement("span");
	var	mnyDollar = UiUtil.GenElementId(undefined, aFieldFqn, "md_", aFormId);
	var tfDlr = UiUtil.CreateTextFieldNoLabel(mnyDollar, mnyValue.dollar);
	tfDlr.setAttribute("style", "text-align:right");
	tfDlr.setAttribute("data-mask", theMask);
	tfDlr.setAttribute("data-mask-reverse", "true");
	spDlr.appendChild(tfDlr);

	var decPoint = document.createElement("span");
	decPoint.setAttribute("class", "symbol");
	decPoint.innerHTML = ".";

	var spCnt = document.createElement("span");
	var	mnyCent = UiUtil.GenElementId(undefined, aFieldFqn, "mc_", aFormId);
	var tfCnt = UiUtil.CreateTextFieldNoLabel(mnyCent, mnyValue.cent);
	tfCnt.setAttribute("style", "text-align:right");
	tfCnt.setAttribute("style", "min-width:35px");
	tfCnt.setAttribute("data-mask", "00");
	tfCnt.setAttribute("size", 2);
	spCnt.appendChild(tfCnt);

	var blankMoneyParam = "'" + tfDlr.id + "', '" + tfCnt.id + "'";
	tfDlr.setAttribute("onkeyup", "UiUtil.HandleDollar(this, event, \"" + tfCnt.id + "\");");
	tfDlr.setAttribute("onblur", "UiUtil.HandleBlankMoney(" + blankMoneyParam + ");");
	tfCnt.setAttribute("onblur", "UiUtil.HandleBlankMoney(" + blankMoneyParam + ");");

	tfDlr.setAttribute("onfocus", "this.select();");
	tfCnt.setAttribute("onfocus", "this.select();");

	var parent = document.createElement("parentwrapper");
	parent.appendChild(spCrcy);
	parent.appendChild(spDlr);
	parent.appendChild(decPoint);
	parent.appendChild(spCnt);
	var result = UiUtil.CreateTextFieldWithLabel(displayLabel, parent);
	var	mnyId = UiUtil.GenElementId(undefined, aFieldFqn, undefined, aFormId);
	result.setAttribute("id", mnyId);

	return result;
};
UiUtil.SetOneElementValue = function(aFormId, aFieldFqn, aFieldValue) {
	var elementId = UiUtil.GenElementId(undefined, aFieldFqn, undefined, aFormId);
	if (UiUtil.NotUndefineNotNullNotBlank(elementId)) {
		var theElement = $(UiUtil.GetElementById(undefined, elementId));
		UiUtil.SetElementValue(theElement, aFieldValue);
	} else {
		if (UiUtil.DEBUG) {
			console.log("Missing widget id: " + elementId + ", for FQN: " + aFieldFqn);
		}
	}
};
UiUtil.SetWidgetDate = function(aOneElementId, aFormId, aFieldFqn, aFlattenOneValue, aForm) {
	var idDay = UiUtil.GenElementId(undefined, aFieldFqn, "dd_", aFormId);
	var idMth = UiUtil.GenElementId(undefined, aFieldFqn, "dm_", aFormId); 
	var idYear = UiUtil.GenElementId(undefined, aFieldFqn, "dy_", aFormId); 
	var idHour = UiUtil.GenElementId(undefined, aFieldFqn, "dh_", aFormId); 
	var idMin = UiUtil.GenElementId(undefined, aFieldFqn, "di_", aFormId); 
	var idSec = UiUtil.GenElementId(undefined, aFieldFqn, "ds_", aFormId); 

	var elemDay = $("#" + idDay);
	var elemMth = $("#" + idMth);
	var elemYear = $("#" + idYear);
	var elemHour = $("#" + idHour);
	var elemMin = $("#" + idMin);
	var elemSec = $("#" + idSec);

	if (UiUtil.IsUndefineOrNullOrBlank(aOneElementId)) {
		if (UiUtil.NotUndefineNotNullNotBlank(elemDay[0])
		&& UiUtil.NotUndefineNotNullNotBlank(elemMth[0])
		&& UiUtil.NotUndefineNotNullNotBlank(elemYear[0])
		&& UiUtil.NotUndefineNotNullNotBlank(elemHour[0])
		&& UiUtil.NotUndefineNotNullNotBlank(elemMin[0])
		&& UiUtil.NotUndefineNotNullNotBlank(elemSec[0])
		) {
			UiUtil.SetDatePickerFromStrDate(aFlattenOneValue, elemDay, elemMth, elemYear, elemHour, elemMin, elemSec);
		} else {
			var elementId = UiUtil.GenElementId(undefined, aFieldFqn, undefined, aFormId);
			var theElement = $(UiUtil.GetElementById(undefined, elementId, aForm)); // jquery $ will make theElement array
			if (UiUtil.NotUndefineNotNull(theElement)) {
				UiUtil.SetElementValue(theElement, aFlattenOneValue);
			} else {
				console.log("Missing datepicker widget: " + UiUtil.GenElementId(undefined, aFieldFqn, undefined, aFormId));
			}
		}
	} else {
		UiUtil.SetOneElementValue(aOneElementId, aFieldFqn, aFlattenOneValue);
	}
};
UiUtil.SetWidgetPhone = function(aOneElementId, aFormId, aFieldFqn, aFlattenOneValue) {
	var idCtry = UiUtil.GenElementId(undefined, aFieldFqn, "pc_", aFormId); // prefix with telephone country code
	var idNdc = UiUtil.GenElementId(undefined, aFieldFqn, "pa_", aFormId);
	var idNo = UiUtil.GenElementId(undefined, aFieldFqn, "pn_", aFormId); 
	
	var elemCtry = $("#" + idCtry);
	var elemNdc = $("#" + idNdc);
	var elemNo = $("#" + idNo);
	
	if (UiUtil.IsUndefineOrNullOrBlank(aOneElementId)) {
		if (UiUtil.NotUndefineNotNullNotBlank(elemCtry[0])
		&& UiUtil.NotUndefineNotNullNotBlank(elemNdc[0])
		&& UiUtil.NotUndefineNotNullNotBlank(elemNo[0])
		) {
			var strArray = aFlattenOneValue.data.split("-");
			var valCtry = strArray[0];
			var valNdc = strArray[1];
			var valNo = strArray[2];

			elemCtry.val(valCtry);
			elemNdc.val(valNdc);
			elemNo.val(valNo);
		} else {
			console.log("Missing phone widget: " + UiUtil.GenElementId(undefined, aFieldFqn, undefined, aFormId));
		}
	} else {
		UiUtil.SetOneElementValue(aOneElementId, aFieldFqn, aFlattenOneValue);
	}
};
UiUtil.SetWidgetMoney = function(aOneElementId, aFormId, aFieldFqn, aFlattenOneValue) {
	var	mnyCurrency = UiUtil.GenElementId(undefined, aFieldFqn, "mr_", aFormId);
	var	mnyDollar = UiUtil.GenElementId(undefined, aFieldFqn, "md_", aFormId);
	var	mnyCent = UiUtil.GenElementId(undefined, aFieldFqn, "mc_", aFormId);

	var mnyValue = {};
	mnyValue.currency = '';
	mnyValue.dollar = '';
	mnyValue.cent = '';
	UiUtil.Json2Money(mnyValue, aFlattenOneValue);

	var vCurrency = $("#" + mnyCurrency);
	var vDollar = $("#" + mnyDollar);
	var vCent = $("#" + mnyCent);

	if (UiUtil.IsUndefineOrNullOrBlank(aOneElementId)) {
		if (UiUtil.NotUndefineNotNullNotBlank(vCurrency[0])
		&& UiUtil.NotUndefineNotNullNotBlank(vDollar[0])
		&& UiUtil.NotUndefineNotNullNotBlank(vCent[0])
		) {
			vCurrency.val(mnyValue.currency);
			vDollar.val(mnyValue.dollar);
			vCent.val(mnyValue.cent);
		} else {
			console.log("Missing money widget: " + UiUtil.GenElementId(undefined, aFieldFqn, undefined, aFormId));
		}
	} else {
		UiUtil.SetOneElementValue(aOneElementId, aFieldFqn, aFlattenOneValue);
	}
};
UiUtil.SetValueNoBr = function(aElementId, aWidget) { 
	if (aWidget.value !== "<br>") { // ignore this damn <br> html element place in by HtmlEditor widget
		$("#" + aElementId).val(aWidget.value);
	}
};
UiUtil.SetValue = function(aObj2Edit, aFqn, aWidget) { 
	UiUtil.JsonAssignment(aObj2Edit, aFqn, aWidget.value);
};
UiUtil.HtmlDecode = function(input){
	var tmpTextArea = document.createElement('textarea');
	tmpTextArea.innerHTML = input;
	return tmpTextArea.childNodes.length === 0 ? "" : tmpTextArea.childNodes[0].nodeValue; // handle case of empty input
};
UiUtil.CreateHtmlField = function(displayLabel, aValue, aFieldFqn, aFormId) {
	var nicTextArea = document.createElement("textarea");
	var divOrTextArea = nicTextArea;
	var textAreaId = UiUtil.GenElementId(undefined, aFieldFqn, undefined, aFormId);
	var nicElementId = textAreaId;
	nicTextArea.setAttribute("class", 'nic-text-area');
	nicTextArea.setAttribute("id", textAreaId);
	nicTextArea.innerText = aValue.data;
	nicTextArea.style.width = "950px";
	nicTextArea.style.height = "145px";
	nicTextArea.style.background = "white";
	nicTextArea.style.overflowY = "scroll";

	if (aValue.changeable && (aValue.changeable === "false" || aValue.changeable === false)) {
		nicTextArea.style.visibility = "hidden";
		var readOnlyDiv = document.createElement("div");
		var divAreaId = UiUtil.GenElementId(undefined, aFieldFqn, undefined, aFormId);
		nicElementId = textAreaId;
		readOnlyDiv.setAttribute("id", divAreaId);
		readOnlyDiv.style.overflow = 'scroll';
		readOnlyDiv.style.border = '1px solid rgb(204, 204, 204)';
		readOnlyDiv.style.color = 'black';
		readOnlyDiv.style.background = '#e9ecef';
		readOnlyDiv.style.padding = '7px';
		readOnlyDiv.innerHTML = UiUtil.HtmlDecode(aValue.data);
		readOnlyDiv.style.width = "950px";
		readOnlyDiv.style.height = "145px";
		readOnlyDiv.style.overflowY = "scroll";
		divOrTextArea = readOnlyDiv;
	}

	var divArea = UiUtil.CreateTextFieldWithLabel(displayLabel, divOrTextArea);
	var result = document.createElement("div");
	result.style.float = 'left';
	result.style.width = '100%'; 
	result.appendChild(divArea);

	var jsNicE = document.createElement("script");
	jsNicE.setAttribute("type", "text/javascript");
	jsNicE.innerHTML = "\n" + "//<![CDATA[  "
	+ "\n" + "var htmlEditor = new nicEditor({fullPanel : true}).panelInstance('" + nicTextArea.id + "');";
	if (aValue.changeable && (aValue.changeable === "false" || aValue.changeable === false)) {
		jsNicE.innerHTML += "\n" + "UiUtil.DisableNicEdit('" + nicTextArea.id + "');";
	}
	
	if (UiUtil.IsUndefineOrNullOrBlank(aValue.changeable) || aValue.changeable === "true" || aValue.changeable === true) { // do length check only for editable nicedit
		jsNicE.innerHTML += "\n" + "var nicInstance = nicEditors.findEditor('" + nicTextArea.id + "');"
		+ "\n" + "if (nicInstance) {"
		+ "\n" + " 	const editorEl = nicInstance.elm;"
		+ "\n" + " 	if (editorEl) {"
		+ "\n" + " 	  editorEl.style.overflowY = 'scroll';"
		+ "\n" + " 	  editorEl.style.height = '145px';"
		+ "\n" + " 	}"
		+ "\n" + " 	nicInstance.elm.onkeyup = function() {"
		+ "\n" + "    UiUtil.WarnOverflowText(nicInstance, " + "'" + nicTextArea.id + "'" + ", " + aValue.size + ");"
		+ "\n" + " 	}"
		+ "\n" + "  var editorElm = document.getElementById(" + "'" + nicElementId + "'" + ");"
		+ "\n" + "  if (!editorElm.hasAttribute('disabled')) {"
		+ "\n" + "    UiUtil.WarnOverflowText(nicInstance, " + "'" + nicTextArea.id + "'" + ", " + aValue.size + ");"
		+ "\n" + "  }"
		+ "\n" + "}"
	}
	jsNicE.innerHTML += "\n" + "//]]>" + "\n";
	var jsexe = document.createElement("jsnice"); // cannot append directly on the body, the script will not execute, why?
	jsexe.appendChild(jsNicE);
	divArea.appendChild(jsexe);

	return result;
};
UiUtil.WarnOverflowText = function(nicInstance, nicTextArea_id, aValue_size) {
	const content = nicInstance.getContent();
	const divError = document.getElementById(nicTextArea_id);
	const maxLen = aValue_size;
	if (content.length >= maxLen) {
		UiUtil.ShowFieldError(divError, 'The content size is too large, remove formatting and use only plain text to reduce size!');
	} else {
		UiUtil.SetValueNoBr(nicTextArea_id, {value: content});
		UiUtil.HideFieldError(divError);
		UiUtil.BlankNicIfEmpty(nicTextArea_id);
	} 
};
UiUtil.PopulateComboBoxWithValue = function(cmb, choices, chosen) {
	var opt = document.createElement("option"); 
	opt.value = ""; 
	opt.innerHTML = ""; 
	cmb.appendChild(opt); 

	if (choices !== undefined) {
		$.each(choices, function(name, value)  { 
			var opt = document.createElement("option"); 
			opt.value = value; 
			opt.innerHTML = value; 
			if (value === chosen) {
				opt.setAttribute("selected", '');
			}
			cmb.appendChild(opt); 
		});
	}
};
UiUtil.GetElementById = function(aParentIdOrElement, aElementId, aForm) {
	var result;
	if (UiUtil.NotUndefineNotNullNotBlank(aParentIdOrElement)) {
		if (typeof aParentIdOrElement === "string") {
			result = $("#" + aParentIdOrElement).find("#" + aElementId)[0];
		} else {
			result = aParentIdOrElement.querySelector("#" + aElementId);
		}
	} else {
		result = document.getElementById(aElementId);
	}

	if (UiUtil.IsUndefineOrNullOrBlank(result)) {
		if (UiUtil.NotUndefineNotNullNotBlank(aForm)) {
			result = aForm.querySelector("#" + aElementId);
		} else {
			console.log("Cannot find element: " + aElementId);
		}
	}

	return result;
};
UiUtil.GetPhoneData = function(aFormId, aFieldFqn, aForm) {
	var phoneData;
	if ((UiUtil.NotUndefineNotNullNotBlank(UiUtil.GetElementById(undefined, UiUtil.GenElementId(undefined, aFieldFqn, "pc_", aFormId)))
	&& UiUtil.NotUndefineNotNullNotBlank(UiUtil.GetElementById(undefined, UiUtil.GenElementId(undefined, aFieldFqn, "pa_", aFormId)))
	&& UiUtil.NotUndefineNotNullNotBlank(UiUtil.GetElementById(undefined, UiUtil.GenElementId(undefined, aFieldFqn, "pn_", aFormId)))
	)
	) {
		var idCountry = UiUtil.GenElementId(undefined, aFieldFqn, "pc_", aFormId); // prefix with telephone country code
		var idNdc = UiUtil.GenElementId(undefined, aFieldFqn, "pa_", aFormId);
		var idNo = UiUtil.GenElementId(undefined, aFieldFqn, "pn_", aFormId); // prefix with telephone number

		var elCountry = document.getElementById(idCountry);
		var elNdc = document.getElementById(idNdc);
		var elNo = document.getElementById(idNo);

		phoneData = elCountry.value + "-" + elNdc.value + "-" + elNo.value; 
	} else {
		phoneData = UiUtil.GetWidgetData(undefined, aFieldFqn, "Missing phone widget [pc_, pa_, pn_]: ", undefined, undefined, aForm);
	}

	return phoneData;
};
UiUtil.CreateTelephone = function(displayLabel, jsonTelephone, aFieldFqn, aFormId) {
	var listAreaCode = UiUtil.CreateComboBox(undefined);
	var tpBase = UiUtil.GenElementId(undefined, aFieldFqn, "pa_", aFormId); // prefix with phone area code
	listAreaCode.setAttribute("id", tpBase);
	listAreaCode.setAttribute("style", "min-width:70px;");
	var result = UiUtil.CreatePhone(displayLabel, jsonTelephone, listAreaCode, aFieldFqn, aFormId);
	return result;
};
UiUtil.CreateMobilePhone = function(displayLabel, jsonMobile, aFieldFqn, aFormId) {
	var listNdc = UiUtil.CreateComboBox(undefined);
	var mpBase = UiUtil.GenElementId(undefined, aFieldFqn, "pa_", aFormId);
	listNdc.setAttribute("id", mpBase);
	var result = UiUtil.CreatePhone(displayLabel, jsonMobile, listNdc, aFieldFqn, aFormId);
	return result;
};
UiUtil.CreatePhone = function(displayLabel, jsonMobile, listNdc, aFieldFqn, aFormId) {
	var strArray = jsonMobile.data.split("-");
	var codeCtry = strArray[0];
	var codeNdc = strArray[1];
	var codeSubNo = strArray[2];

	var listCountry = UiUtil.CreateComboBox(undefined);
	var ctryId = UiUtil.GenElementId(undefined, aFieldFqn, "pc_", aFormId); // prefix with telephone country code
	listCountry.setAttribute("id", ctryId);
	UiUtil.PopulateComboBoxWithName(listCountry, jsonMobile.countrycode, codeCtry);

	var spCountry = document.createElement("span");
	spCountry.setAttribute("class", "st-symbol");
	spCountry.appendChild(listCountry);

	var spNdc = document.createElement("span");
	spNdc.setAttribute("class", "st-symbol");
	spNdc.appendChild(listNdc);

	var spNo = document.createElement("span");
	var tfNoId = UiUtil.GenElementId(undefined, aFieldFqn, "pn_", aFormId); // prefix with telephone number
	var tfNo = UiUtil.CreateTextFieldNoLabel(tfNoId);
	if (codeSubNo !== undefined) {
		tfNo.setAttribute("value", codeSubNo);
	}
	spNo.appendChild(tfNo);

	var funcName = UiUtil.GenElementId(undefined, aFieldFqn, "pf_", aFormId);
	var scrptDyn = UiUtil.CreateDynamicList(funcName, listNdc.id, jsonMobile.countrycode);
	UiUtil.ScriptAddWithRemove(scrptDyn, funcName);
	var chgFunc = funcName + "(this.value)";
	listCountry.setAttribute("onchange", chgFunc);

	UiUtil.PopulateComboBoxWithValue(listNdc, jsonMobile.countrycode[codeCtry], codeNdc); // to populate the selected NDC

	var phoneId = UiUtil.GenElementId(undefined, aFieldFqn, undefined, aFormId); // prefix with telephone country code
	var parent = document.createElement("parentwrapper");
	parent.appendChild(spCountry);
	parent.appendChild(spNdc);
	parent.appendChild(spNo);
	var result = UiUtil.CreateTextFieldWithLabel(displayLabel, parent);
	result.setAttribute("id", phoneId);

	return result;
};
UiUtil.PopulateMasterChildCmbx = function(childCmb, childFqn, aValue, aObj2Edit) {
	var parentCmb = $(childCmb).parents('.' + CLS_EACHFIELD).prev().find('select');
	if (parentCmb.length !== 0) {
		var targetObj = UiUtil.GetVarByJsonPath(aObj2Edit, childFqn);
		$(childCmb).empty();
		var parentCurrentValue = $(parentCmb).find('option:selected').text();
		$.each(targetObj.option, function(master, child) {
			if (master === parentCurrentValue) {
				UiUtil.PopulateComboBoxWithValue(childCmb, child, aValue.data.Descr.data);
				return false;
			}
		});
	}
};
UiUtil.CreateDynamicList = function(masterId, childId, jsonMaster) {
	var StrSwitchStart = "var arr; var option; function " + masterId + "(val)"
	+ " {"
	+ " var slc_all = $('select[id=" + childId + "]'" + ");"
	+ " for(var cntr=0; cntr < slc_all.length; cntr++) {"
	+ " 	var slc_target = slc_all[cntr];"
	+ " 	slc_target.options.length = 0;"
	+ " 	switch (val) {";
	var StrCase = "case 'REPLACE_SELECTED_COUNTRY':"
	+ " 	arr = new Array(REPLACE_NDC_LIST_BY_COUNTRY);"
	+ " 	slc_target.disabled = false;"
	+ " 	for (var i=0;i<arr.length;i++) {"
	+ " 	option = new Option(arr[i],arr[i]);"
	+ " 	slc_target.options[i] = option;"
	+ " 	}"
	+ " 	break;";
	var StrSwitchEnd = "default:"
	+ " 	slc_target.disabled = false;"
	+ " 	slc_target.options.length = 0;"
	+ " 	break;"
	+ " 	}"
	+ " }"
	+ " }";

	var strCase = "";
	$.each(jsonMaster, function(name, value) {
		strCase += StrCase.replace("REPLACE_SELECTED_COUNTRY", name);
		var strAry = "";
		for(var cntr = 0; cntr < value.length; cntr++) {
			if (strAry !== "") {
				strAry += ", ";
			}
			strAry += "'" + value[cntr] + "'";
		}
		strCase = strCase.replace("REPLACE_NDC_LIST_BY_COUNTRY", strAry) + " ";
	});

	var result = StrSwitchStart + strCase + StrSwitchEnd;
	return result;
};
UiUtil.SetComboBoxWithValue = function(cmb, choices, chosen) {
	var opt = document.createElement("option"); 
	opt.value = ""; 
	opt.innerHTML = ""; 
	cmb.appendChild(opt); 

	if (choices !== undefined) {
		$.each(choices, function(name, value)  { 
			var opt = document.createElement("option"); 
			opt.value = value; 
			opt.innerHTML = value; 
			if (value === chosen) {
				opt.setAttribute("selected", '');
			}
			cmb.appendChild(opt); 
		});
	}
};
UiUtil.FilterChildComboBox = function(aObj2Edit, parentCmbx, strChildFqn) {
	var childCmbx = $(parentCmbx).parents('.' + CLS_EACHFIELD).next().find('select');
	if (childCmbx.length === 0) return;
	var targetObj = UiUtil.GetVarByJsonPath(aObj2Edit, strChildFqn);
	childCmbx.empty();
	$.each(targetObj.option, function(master, child) {
		if (master === parentCmbx.value) {
			UiUtil.SetComboBoxWithValue(childCmbx[0], child, '');
			return false;
		}
	});
};
UiUtil.EmptyChildComboBox = function(aWidget) {
	if (aWidget.toBeEmpty !== undefined) {
		for (var cntr = 0; cntr < aWidget.toBeEmpty.length; cntr++) {
			$(aWidget.toBeEmpty[cntr]).empty();
		}
	}
};
UiUtil.SetupMasterChildComboBox = function(cmb, theUiForm, fieldFqn, childFqn) {
	cmb.setAttribute("onchange", "UiUtil.SetValue(" + theUiForm + ".obj2Edit, '" + fieldFqn + "', this)" 
	+ "; " + "UiUtil.FilterChildComboBox(" + theUiForm + ".obj2Edit" + ", this, '" + childFqn + "')" 
	+ "; UiUtil.EmptyChildComboBox(this)");
	cmb.setAttribute("onblur", "UiUtil.SetValue(" + theUiForm + ".obj2Edit, '" +  fieldFqn + "', this)");
};
UiUtil.SlideLargestHeight = function(aSliderList) {
	for(var cntr = 0; cntr < aSliderList.length; cntr++) {
		var eachSlider = aSliderList[cntr];
		$(eachSlider).css("height", ""); // need to remove the css so DOM will recalculate the height
	}

	var largestHeight = 0;
	for(var cntr = 0; cntr < aSliderList.length; cntr++) {
		var eachSlider = aSliderList[cntr];
		if ($(eachSlider).outerHeight() > largestHeight) {
			largestHeight = $(eachSlider).outerHeight() + 3;
		}
	}
	return largestHeight;
};
UiUtil.SetEverySliderTopOffset = function(largestHeight, aSliderList, sliderTopOffset) {
	var totalSliderHeight = 0;
	for(var cntr = 0; cntr < aSliderList.length; cntr++) {
		var eachSlider = aSliderList[cntr];
		$(eachSlider).outerHeight(largestHeight + "px");
		$(eachSlider).width("100%");
		eachSlider.sliderIndex = cntr;
		sliderTopOffset[cntr] = totalSliderHeight;
		totalSliderHeight += $(eachSlider).outerHeight();
	};
	return totalSliderHeight;
};
UiUtil.ResizeVerticalSlider = function(aMasterDiv, sliderTopOffset) {
	// get the previous fullHeightDiv
	var fhdDivId = aMasterDiv.id + "_fhd";
	var fullHeightDiv = aMasterDiv.querySelector("[id='" + fhdDivId + "']");
	if (UiUtil.IsUndefineOrNull(fullHeightDiv)) {
		fullHeightDiv = document.createElement("div");
		fullHeightDiv.id = aMasterDiv.id + "_fhd";
		fullHeightDiv.style.float = "left";
	} 

	if (UiUtil.IsUndefineOrNull(sliderTopOffset)) {
		sliderTopOffset = new Array();
	}

	// append new added list if any i.e. using the fullHeightDiv siblings
	var newSliderList = $(fullHeightDiv).siblings();
	if (UiUtil.NotUndefineNotNull(newSliderList) && newSliderList.length > 0) {
		$(fullHeightDiv).append(newSliderList);
	}

	var sliderList = $(fullHeightDiv).children();
	var largestHeight = UiUtil.SlideLargestHeight(sliderList);
	var totalSliderHeight = UiUtil.SetEverySliderTopOffset(largestHeight, sliderList, sliderTopOffset);
	
	$(fullHeightDiv).outerHeight(totalSliderHeight);
	$(aMasterDiv).outerHeight(largestHeight + "px");
	$(aMasterDiv).css("overflow", "hidden");
	aMasterDiv.setAttribute("class", "st-slider-master");
};
UiUtil.VerticalSliderClick = function(aMasterDiv, aEvent) {
	// get the previous fullHeightDiv
	var fhdDivId = aMasterDiv.id + "_fhd";
	var fullHeightDiv = aMasterDiv.querySelector("[id='" + fhdDivId + "']");
	if (UiUtil.IsUndefineOrNull(fullHeightDiv)) {
		fullHeightDiv = document.createElement("div");
		fullHeightDiv.id = aMasterDiv.id + "_fhd";
		fullHeightDiv.style.float = "left";
		$(aMasterDiv).append(fullHeightDiv);
	} 

	// append new added list if any i.e. using the fullHeightDiv siblings
	var newSliderList = $(fullHeightDiv).siblings();
	if (UiUtil.NotUndefineNotNull(newSliderList) && newSliderList.length > 0) {
		$(fullHeightDiv).append(newSliderList);
	}

	var sliderTopOffset = fullHeightDiv.sliderTopOffset;
	if (UiUtil.IsUndefineOrNull(fullHeightDiv.sliderTopOffset)) {
		sliderTopOffset = new Array();
	}

	var sliderList = $(fullHeightDiv).children();
	var largestHeight = UiUtil.SlideLargestHeight(sliderList);
	var totalSliderHeight = UiUtil.SetEverySliderTopOffset(largestHeight, sliderList, sliderTopOffset);

	$(fullHeightDiv).outerHeight(totalSliderHeight);
	$(aMasterDiv).outerHeight(largestHeight + "px");
	$(aMasterDiv).css("overflow", "hidden");
	aMasterDiv.setAttribute("class", "st-slider-master");

	var current = undefined;
	for(var cntrSlider = 0; cntrSlider < sliderList.length; cntrSlider++) {
		var eachSlider = sliderList[cntrSlider];
		if ($(eachSlider).hasClass("selected")) {
			current = eachSlider.sliderIndex;
			break;
		}
	}
	
	if (current === undefined) {
		current = -1;
		$(sliderList[0]).addClass('selected');
	} else if (current === 0) {
		$(sliderList[0]).removeClass('selected');
		$(sliderList[1]).addClass('selected');
	} else if (current + 1 === sliderList.length) {
		$(sliderList[0]).addClass('selected');
		$(sliderList[sliderList.length - 1]).removeClass('selected');
		current = -1;
	} else {
		$(sliderList[current]).removeClass('selected');
		$(sliderList[current + 1]).addClass('selected');
	}

	$(fullHeightDiv).stop().animate({
		marginTop: '-' + sliderTopOffset[current + 1] + 'px'
	}, 500, function() {
		current++;
		if (UiUtil.NotUndefineNotNull(aEvent)) {
			//$($(fullHeightDiv).children()[current]).find(':input:enabled').focus(); 
			$($(fullHeightDiv).children()[current]).find(":input:enabled:visible:first").focus(); 
		}
	});
	if (UiUtil.NotUndefineNotNull(aEvent)) {
		aEvent.preventDefault();
	}
	
	fullHeightDiv.lastSlider = sliderList[sliderList.length - 1];
	return fullHeightDiv;
};
UiUtil.CreateUpdateVerticalSlider = function(aMasterDiv, aNextButton) {
	if (UiUtil.IsUndefineOrNullOrBlank(aMasterDiv)) return;
	var fullHeightDiv = UiUtil.VerticalSliderClick(aMasterDiv, undefined);
	var sliderList = $(fullHeightDiv).children();
	var sliderTopOffset = fullHeightDiv.sliderTopOffset;
	var lastSlider = fullHeightDiv.lastSlider;

	var clickBound = false;
	if (UiUtil.NotUndefineNotNull(aNextButton)) {
		var allEvent = $._data(aNextButton, 'events');
		clickBound = UiUtil.NotUndefineNotNull(allEvent) && UiUtil.NotUndefineNotNull(allEvent.click);
	}
	if (UiUtil.NotUndefineNotNull(aNextButton) && clickBound === false) {
		$(aNextButton).bind('click', function(aEvent) {
			UiUtil.VerticalSliderClick(aMasterDiv, aEvent);
		});

		// when window resize, our slider section in it's parent div need to be recalculated
		$(window).on('resize', function() {
			UiUtil.ResizeVerticalSlider(aMasterDiv, sliderTopOffset);
		});

		// clicking on the tab (on the last input of each fieldset), makes the form slide to the next step
		$(sliderList).each(function() {
			var eachSlider = this;
			$(this).find(":input:last, [contenteditable]:last").bind('keydown', function(evt) {
				if (evt.keyCode === 9){
					if (eachSlider === lastSlider) {
						// do nothing, tab to the next element
					} else {
						$(aNextButton).click();
						evt.preventDefault();
					}
				}
			});
		});
	}
};
UiUtil.GetSlidePosition = function(aMasterDivId) {
	var current = 0;
	var fullHeightDiv = document.getElementById(aMasterDivId + "_fhd");
	for(var cntrSlider = 0; cntrSlider < $(fullHeightDiv).children().length; cntrSlider++) {
		var eachSlider = $(fullHeightDiv).children()[cntrSlider];
		if ($(eachSlider).hasClass("selected")) {
			current = eachSlider.sliderIndex;
			break;
		}
	}
	return current;
};
UiUtil.GetSlideElement = function(aMasterDivId) {
	var index = UiUtil.GetSlidePosition(aMasterDivId);
	var fullHeightDiv = document.getElementById(aMasterDivId + "_fhd");
	var activeSlide = $(fullHeightDiv).children()[index];
	return activeSlide;
};
UiUtil.RemoveNode = function(parentNode) {
	while (parentNode.firstChild) {
		parentNode.removeChild(parentNode.firstChild);
	}
};
UiUtil.RemoveAllChildSlide = function(aMasterDivId) {
	var fullHeightDiv = document.getElementById(aMasterDivId + "_fhd");
	UiUtil.RemoveNode(fullHeightDiv);

};
UiUtil.ApplyMask = function(mask, value) {
	if (!window.jQuery || !jQuery.fn.mask || !jQuery.fn.masked) {
		return value;
	}
	if (!mask || UiUtil.IsUndefineOrNullOrBlank(mask)) {
		return value;
	}
	var $input = jQuery('<input type="text">');
	var options = {};
	var isCurrencyMask = /\.0+$/.test(mask);
	if (isCurrencyMask && options.reverse === undefined) {
		options.reverse = true;
		if (typeof value === "number" || /^\d+(\.\d+)?$/.test(value)) {
			if (value == 0) {
				const decimalPlaces = mask.split('.')[1]?.length || 0;
				value = '0.' + '0'.repeat(decimalPlaces);
			} else {
				value = Math.round(parseFloat(value) * 100).toString();
			}
		}
	}
	$input.mask(mask, options);
	return $input.masked(value);
};
UiUtil.UnmaskValue = function(mask, value, preserveDecimals = false) {
	let result = '';
	let valueIndex = 0;
	let inDecimal = false;
	for (let i = 0; i < mask.length && valueIndex < value.length; i++) {
		const maskChar = mask[i];
		const valueChar = value[valueIndex];
		if (maskChar === '.') {
			inDecimal = true;
			if (preserveDecimals) {
				result += '.';
			}
			valueIndex++; // skip dot in value
			continue;
		}
		if (inDecimal && !preserveDecimals) {
			if (/\d/.test(valueChar)) {
				valueIndex++;
			}
			continue;
		}
		if (maskChar === '0' && /\d/.test(valueChar)) {
			result += valueChar;
			valueIndex++;
		}
		else if (maskChar === '#' && /\d/.test(valueChar)) {
			result += valueChar;
			valueIndex++;
		}
		else {
			if (valueChar === maskChar) {
				valueIndex++;
			}
		}
	}
	return result;
};
UiUtil.IsDateMask = function(maskString) {
	if (typeof maskString !== 'string' || !maskString) {
		return false;
	}
	const datePatterns = [
		/^0?9\/0?9\/9999$/,		   // MM/DD/YYYY, M/D/YYYY, etc.
		/^0?9-0?9-9999$/,			  // MM-DD-YYYY
		/^99\/99\/9999$/,			   // MM/DD/YYYY (strict)
		/^99-99-9999$/,				 // MM-DD-YYYY (strict)
		/^9999\/0?9\/0?9$/,			 // YYYY/MM/DD
		/^9999-0?9-0?9$/,			   // YYYY-MM-DD
		/^9999\/99\/99$/,				// YYYY/MM/DD (strict)
		/^9999-99-99$/,				  // YYYY-MM-DD (strict)
		/^0?9-aaa-9999$/,       // dd-mmm-yyyy
		/^00-AAA-0000$/,        // dd-MMM-yyyy (strict)
		/^aaa\s+0?9,\s+9999$/,		  // MMM D, YYYY
		/^aaaa\s+0?9,\s+9999$/,		  // MMMM D, YYYY
		/^0?9\s+aaa\s+9999$/,			// D MMM YYYY
		/^0?9\s+aaaa\s+9999$/,			// D MMMM YYYY
		/^0?9\/0?9\/99$/,				// MM/DD/YY
		/^0?9-0?9-99$/,				  // MM-DD-YY
		/^99\/99\/99$/,				   // MM/DD/YY (strict)
		/^99-99-99$/,					 // MM-DD-YY (strict)
		/^0?9\.0?9\.9999$/,			  // DD.MM.YYYY
		/^0?9\.0?9\.99$/,				 // DD.MM.YY
		/^99\.99\.9999$/,				 // DD.MM.YYYY (strict)
		/^99\.99\.99$/,					// DD.MM.YY (strict)
		/^0?9\/0?9\/9999\s+0?9:0?9\s*(?:aa)?$/,  // MM/DD/YYYY HH:MM AM/PM
		/^99\/99\/9999\s+99:99\s*(?:aa)?$/,	   // MM/DD/YYYY HH:MM (strict)
	];
	return datePatterns.some(pattern => pattern.test(maskString));
};
UiUtil.GetWidgetCleanValue = function(aInputElement) {
	if (UiUtil.IsUndefineOrNull($(aInputElement).data("mask"))) {
		if ($(aInputElement).is("td")) {
			return aInputElement.textContent;
		} else if (aInputElement.tagName === 'LABEL') {
			return aInputElement.innerText;
		} else {
			if (aInputElement.tagName === 'DIV') {
				return aInputElement.innerHTML;
			} else {
				if (aInputElement.tagName === 'TEXTAREA' && aInputElement.classList.contains('nic-text-area')) {
					const divNicContent = aInputElement.parentElement.querySelector('.nicEdit-main');
					if (divNicContent) {
						return divNicContent.innerHTML === '<br>' ? '' : divNicContent.innerHTML;
					} else {
						return '';
					}
				} else {
					return aInputElement.value;
				}
			}
		}
	} else {
		const theMask = aInputElement.getAttribute("data-mask");
		if (UiUtil.IsDateMask(theMask)) {
			return aInputElement.value;
		} else {
			return UiUtil.UnmaskValue(theMask, aInputElement.value);
		}
	}
};
UiUtil.GetWidgetData = function(aFormId, aFieldFqn, aMissingMsg, aDataType, aFuncGotAsyncData, aForm) {
	var result;
	var inputElement = UiUtil.GetElementById(undefined, UiUtil.GenElementId(undefined, aFieldFqn, undefined, aFormId), aForm); // uses one input field to represent the data
	if (UiUtil.NotUndefineNotNullNotBlank(inputElement)) {
		if (UiUtil.IsInputFileType($(inputElement)) && UiUtil.NotUndefineNotNullNotBlank(aFuncGotAsyncData)) { // input with type file, i.e. is a file selector to upload
			var attachmentInputId = UiUtil.GenElementId(undefined, aFieldFqn, undefined, aFormId);
			UiUtil.ToBase64(attachmentInputId, function(attachmentInBase64) {
				if (UiUtil.NotUndefineNotNullNotBlank(aFuncGotAsyncData)) {
					aFuncGotAsyncData(attachmentInBase64);
				}
			}, function() {
				UiUtil.DialogError('Error', "Fail to attach file: " + aFieldFqn, function() {});
			});
		} else {
			if (UiUtil.IsWidget($(inputElement))) {
				if (UiUtil.IsUndefineOrNullOrBlank(aDataType)) {
					aDataType = "";
				}
				if (UiUtil.IsUndefineOrNull($(inputElement).data("mask")) || aDataType === "string") {
					if (inputElement.tagName === "SELECT") {
						result = $(inputElement).find(":selected").text();
						if (UiUtil.NotUndefineNotNullNotBlank(result)) {
							// do nothing
						} else {
							var textfieldValue = $(inputElement).parent().find("input").val();
							if (UiUtil.NotUndefineNotNullNotBlank(textfieldValue)) {
								result = textfieldValue;
							}
						}
					} else {
						result = UiUtil.GetWidgetCleanValue(inputElement);
					}
				} else {
					result = UiUtil.GetWidgetCleanValue(inputElement);
				}
			} else {
				result = UiUtil.GetWidgetCleanValue(inputElement);
			}
		}
	} else {
		if (UiUtil.DEBUG) {
			console.log(aMissingMsg + UiUtil.GenElementId(undefined, aFieldFqn, undefined, aFormId));
		}
		result = CLS_NO_SUCH_WIDGET;
	}
	return result;
};
UiUtil.GetMoneyData = function(aFormId, aFieldFqn, aForm) { 
	var strAmt;
	if ((UiUtil.NotUndefineNotNullNotBlank(UiUtil.GetElementById(undefined, UiUtil.GenElementId(undefined, aFieldFqn, "mr_", aFormId)))
	&& UiUtil.NotUndefineNotNullNotBlank(UiUtil.GetElementById(undefined, UiUtil.GenElementId(undefined, aFieldFqn, "md_", aFormId)))
	&& UiUtil.NotUndefineNotNullNotBlank(UiUtil.GetElementById(undefined, UiUtil.GenElementId(undefined, aFieldFqn, "mc_", aFormId)))
	)
	) {
		var nmCy = $("#" + UiUtil.GenElementId(undefined, aFieldFqn, "mr_", aFormId)).find(":selected").text();
		var nmDl = $("#" + UiUtil.GenElementId(undefined, aFieldFqn, "md_", aFormId)).val();
		var nmCt = $("#" + UiUtil.GenElementId(undefined, aFieldFqn, "mc_", aFormId)).val();

		strAmt = "";
		if (!nmDl.trim() && !nmCt.trim()) {
			strAmt = ""; 
		} else {
			strAmt = nmCy + " " + nmDl + "." + nmCt; 
		}
	} else {
		strAmt = UiUtil.GetWidgetData(aFormId, aFieldFqn, "Missing money widget [mr_, md_, mc_]: ", undefined, undefined, aForm);
	}

	return strAmt;
};
UiUtil.GetCheckBoxData = function(aFormId, aFieldFqn, aObj2Edit, aForm) { 
	var value = "false";
	if ((UiUtil.NotUndefineNotNullNotBlank(UiUtil.GetElementById(undefined, UiUtil.GenElementId(undefined, aFieldFqn, undefined, aFormId))))
	) {
		var elementId = UiUtil.GenElementId(undefined, aFieldFqn, undefined, aFormId);
		if ($(UiUtil.GetElementById(undefined, elementId, undefined, aFormId)).prop("checked") === true) {
			value = "true";
		}

		// need the below if to avoid original null value being set to false when nothing actually change, impacted onbeforeunload
		var fieldName = aFieldFqn.substring(aFieldFqn.lastIndexOf(".") + 1);
		if ((UiUtil.NotUndefineNotNullNotBlank(UiUtil.GetValueByJsonPath(aObj2Edit, fieldName)) === false && value === "false")) { // don't do anything if obj2Edit value is null/blank and checkbox value is false
			value = undefined; // this shows, no data from db and checkbox is false, so let db data as undefine / no data
		}
	} else {
		value = UiUtil.GetWidgetData(aFormId, aFieldFqn, "Missing checkbox widget: ", undefined, undefined, aForm);
	}

	return value;
};
UiUtil.FlipIsDown = function(aElemId) {
	var result = true;
	if ($("#" + aElemId).css("display") === "none") {
		result = false;
	}

	return result;
};
UiUtil.FlipDown = function(aElemId) {
	var result = false;
	if ($("#" + aElemId).css("display") === "none") {
		$("#" + aElemId).slideDown("slow");
		result = true;
	}

	return result;
};
UiUtil.FlipUpDown = function(aElemId) {
	var result;
	if ($("#" + aElemId).css("display") !== "none") {
		$("#" + aElemId).slideUp("slow");
		result = "up";
	} else {
		$("#" + aElemId).slideDown("slow");
		result = "down";
	}

	return result;
};
UiUtil.IsSystemField = function(aName) {	
	var result = false;
	if (aName === "uifomaster") {
		result = true;
	} else if (aName === "objectId") {
		result = true;
	} else if (aName === "clasz") {
		result = true;
	}
	return result;
};
UiUtil.IsCustomPopulate = function(aValue) {
	var result = UiUtil.IsCustomWidget(aValue);
	if (UiUtil.NotUndefineNotNullNotBlank(aValue.clasz) && aValue.clasz.endsWith('Attachment')) {
		result = false;
	}
	return result;
};
UiUtil.IsCustomWidget = function(aValue) {
	var result = true;
	if (aValue.type === "mobilephone") {
	} else if (aValue.type === "datetime" || aValue.type === "date") {
	} else if (aValue.type === "html") {
	} else if (aValue.type === 'telephone') {
	} else if (aValue.type === 'money') {
	} else if (aValue.type === 'boolean') {
	} else if (aValue.type === 'country') {
	} else if (aValue.type === 'state') {
	} else if (aValue.type === 'city') {
	} else if (aValue.type === 'base64') {
	} else if (aValue.type === 'upload') {
	} else if (UiUtil.NotUndefineNotNullNotBlank(aValue.clasz) && aValue.clasz.endsWith('Attachment')) {
	} else {
		result = false;
	}

	return result;
};
UiUtil.ComposeFqn = function(aParent, aChild) {
	var result;
	if (UiUtil.NotUndefineNotNullNotBlank(aParent)) {
		if (UiUtil.NotUndefineNotNullNotBlank(aChild)) {
			result = aParent + "." + aChild;
		} else {
			result = aParent;
		}
	} else {
		result = aChild;
	}

	return result;
};
UiUtil.GetFieldNameFromFqn = function(aFqnName) {
	var result = aFqnName;
	if (UiUtil.NotUndefineNotNullNotBlank(aFqnName)) {
		var dotPosition = aFqnName.lastIndexOf(".");
		if (dotPosition >= 0) {
			result = aFqnName.substring(dotPosition + 1);
		}
	}
	return result;
};
UiUtil.CntrIsNotZero = function(cntrAsync, cntrMax) {
	if (cntrAsync.cntr === 0) {
		return false;
	} else {
		cntrMax.cntr++;
		if (cntrMax.cntr > 1000000) {
			return false;
		}
	}
	return true;
};
UiUtil.SetWidgetValue = function(aObj2Edit, aFormId, aFieldFqn, cntrAsync, aForm) {
	var populateDirection = "toWidget";
	UiUtil.SetWidgetOrJsonValue(aObj2Edit, aFormId, aFieldFqn, populateDirection, cntrAsync, aForm);
};
UiUtil.SetJsonValue = function(aObj2Edit, aFormId, aFieldFqn, cntrAsync, aForm) {
	var populateDirection = "toJsonObj";
	UiUtil.SetWidgetOrJsonValue(aObj2Edit, aFormId, aFieldFqn, populateDirection, cntrAsync, aForm);
};
UiUtil.GetWidgetOrJsonValue = function(aObj2Edit, aFieldFqn, aPopulateDirection, aFuncGetFromWidget, aFuncGotAsyncData) {
	var result;
	if (aPopulateDirection === "toWidget") {
		var fieldName = UiUtil.GetFieldNameFromFqn(aFieldFqn);
		result = UiUtil.GetValueByFieldName(aObj2Edit, fieldName);
	} else {
		result = aFuncGetFromWidget(aFuncGotAsyncData);
	}
	return result;
};
UiUtil.SetWidgetOrJsonValue = function(aObj2Edit, aFormId, aFieldFqn, aPopulateDirection, aCntrAsync, aForm) {
	aCntrAsync.cntr++;
	var missingWidgetMsg = "Missing widget, id: ";
	var fieldName = UiUtil.GetFieldNameFromFqn(aFieldFqn);
	var fieldData = UiUtil.GetVarByFieldName(aObj2Edit, fieldName);
	if (fieldData.type === "mobilephone" || fieldData.type === "telephone") {
		var phoneData = UiUtil.GetWidgetOrJsonValue(aObj2Edit, aFieldFqn, aPopulateDirection, function() { return UiUtil.GetPhoneData(aFormId, aFieldFqn, aForm); });
		UiUtil.AssignData(aPopulateDirection, aObj2Edit, aFormId, aFieldFqn, phoneData, aForm);
	} else if (fieldData.type === "datetime" || fieldData.type === "date" ) {
		var dateData = UiUtil.GetWidgetOrJsonValue(aObj2Edit, aFieldFqn, aPopulateDirection, function() { return UiUtil.GetDatePickerData(aFormId, aFieldFqn, aForm); });
		UiUtil.AssignData(aPopulateDirection, aObj2Edit, aFormId, aFieldFqn, dateData, aForm);
	} else if (fieldData.type === 'money') {
		var moneyData = UiUtil.GetWidgetOrJsonValue(aObj2Edit, aFieldFqn, aPopulateDirection, function() { return UiUtil.GetMoneyData(aFormId, aFieldFqn, aForm); });
		UiUtil.AssignData(aPopulateDirection, aObj2Edit, aFormId, aFieldFqn, moneyData, aForm);
	} else if (fieldData.type === 'boolean') {
		var booleanData = UiUtil.GetWidgetOrJsonValue(aObj2Edit, aFieldFqn, aPopulateDirection, function() { return UiUtil.GetCheckBoxData(aFormId, aFieldFqn, aObj2Edit, aForm); });
		UiUtil.AssignData(aPopulateDirection, aObj2Edit, aFormId, aFieldFqn, booleanData, aForm);
	} else if (fieldData.type === "html") {
		var elementData = UiUtil.GetWidgetOrJsonValue(aObj2Edit, aFieldFqn, aPopulateDirection, function() { return UiUtil.GetWidgetData(aFormId, aFieldFqn, missingWidgetMsg, undefined, undefined, aForm); });
		UiUtil.AssignData(aPopulateDirection, aObj2Edit, aFormId, aFieldFqn, elementData, aForm);
	} else if (fieldData.type === 'country') {
		var elementData = UiUtil.GetWidgetOrJsonValue(aObj2Edit, aFieldFqn, aPopulateDirection, function() { return UiUtil.GetWidgetData(aFormId, aFieldFqn, missingWidgetMsg, undefined, undefined, aForm); });
		UiUtil.AssignData(aPopulateDirection, aObj2Edit, aFormId, aFieldFqn, elementData, aForm);
	} else if (fieldData.type === 'state') {
		var elementData = UiUtil.GetWidgetOrJsonValue(aObj2Edit, aFieldFqn, aPopulateDirection, function() { return UiUtil.GetWidgetData(aFormId, aFieldFqn, missingWidgetMsg, undefined, undefined, aForm); });
		UiUtil.AssignData(aPopulateDirection, aObj2Edit, aFormId, aFieldFqn, elementData, aForm);
	} else if (fieldData.type === 'city') {
		var elementData = UiUtil.GetWidgetOrJsonValue(aObj2Edit, aFieldFqn, aPopulateDirection, function() { return UiUtil.GetWidgetData(aFormId, aFieldFqn, missingWidgetMsg, undefined, undefined, aForm); });
		UiUtil.AssignData(aPopulateDirection, aObj2Edit, aFormId, aFieldFqn, elementData, aForm);
	} else if (fieldData.type === 'upload' || fieldData.type === 'base64') { // handling upload of file using HTML built in input control
		aCntrAsync.cntr++;
		var inputElement = UiUtil.GetElementById(undefined, UiUtil.GenElementId(undefined, aFieldFqn, undefined, aFormId)); 
		if (UiUtil.NotUndefineNotNullNotBlank(inputElement)) {
			var isEditedAnd2Json = true;
			if (aPopulateDirection === 'toWidget') {
				inputElement.value = fieldData.filePathAndName;
			} else {
				fieldData.filePathAndName = inputElement.value;
				if (UiUtil.IsUndefineOrNullOrBlank(inputElement.edited)) {
					isEditedAnd2Json = false; // do not change the json value if upload input is not edited
				}
			}

			if (isEditedAnd2Json === true) {
				UiUtil.GetWidgetOrJsonValue(aObj2Edit, aFieldFqn, aPopulateDirection
					, function(aFuncGotAsyncData) { 
						return UiUtil.GetWidgetData(aFormId, aFieldFqn, missingWidgetMsg, undefined, aFuncGotAsyncData, aForm); 
					}
					, function(base64Data) { 
						UiUtil.AssignData(aPopulateDirection, aObj2Edit, aFormId, aFieldFqn, base64Data, aForm);
						aCntrAsync.cntr--; 
					}
				);
			} else {
				aCntrAsync.cntr--;
			}
		}
	} else if (fieldData.lookup === true) {
		var fieldFqn = aFieldFqn;
		var lookupData = fieldData.data;
		if (typeof lookupData === 'object') {
			fieldFqn = "Descr";
			aObj2Edit = fieldData;
		}
		var elementData = UiUtil.GetWidgetOrJsonValue(aObj2Edit, fieldFqn, aPopulateDirection, function() { return UiUtil.GetWidgetData(aFormId, aFieldFqn, missingWidgetMsg, "string", undefined, aForm); });
		UiUtil.AssignData(aPopulateDirection, aObj2Edit, aFormId, fieldFqn, elementData, aForm);
	} else {
		var elementData = UiUtil.GetWidgetOrJsonValue(aObj2Edit, aFieldFqn, aPopulateDirection, function() { return UiUtil.GetWidgetData(aFormId, aFieldFqn, missingWidgetMsg, "string", undefined, aForm); });
		UiUtil.AssignData(aPopulateDirection, aObj2Edit, aFormId, aFieldFqn, elementData, aForm);
	}
	aCntrAsync.cntr--;
};
UiUtil.IsInputFileType = function(aElement) {
	if (aElement.is("input")) {
		if (aElement.attr("type") === "file") {
			return true;
		}
	}
	return false;
};
UiUtil.IsWidget = function(aElement) {
	if (aElement.is("input") || aElement.is("select") || aElement.is("textarea") || aElement.is("[contenteditable]")) {
		return true;
	} else {
		return false;
	}
};
UiUtil.SetElementValue = function(aElement, aValue) {
	if (!UiUtil.NotUndefineNotNullNotBlank(aValue)) {
		aValue = "";
	}

	if (UiUtil.IsWidget(aElement)) {
		aElement.val(aValue);
	} else {
		aElement.text(aValue);
	}
};
UiUtil.GetElementValue = function(aElement) {
	var result;
	if (UiUtil.IsWidget(aElement)) {
		result = aElement.val();
	} else {
		result = aElement.text();
	}
	
	return result;
};
UiUtil.IsEqual = function(aLeft, aRight) {
	if (aLeft === aRight) {
		return true;
	} else if (!UiUtil.NotUndefineNotNullNotBlank(aLeft) && !UiUtil.NotUndefineNotNullNotBlank(aRight)) {
		return true;
	}
	return false;
};
UiUtil.AssignData = function(aPopulateDirection, aObj2Edit, aFormId, aFieldFqn, aFieldValue, aForm) {
	var fieldName = UiUtil.GetFieldNameFromFqn(aFieldFqn);
	var fieldObject = UiUtil.GetVarByFieldName(aObj2Edit, fieldName);

	if (aPopulateDirection === "toWidget") {
		var elementId = UiUtil.GenElementId(undefined, aFieldFqn, undefined, aFormId);
		var theElement = $(UiUtil.GetElementById(undefined, elementId, aForm)); // jquery $ will make theElement array
		if (UiUtil.IsUndefineOrNullOrBlank(theElement[0])) {
			console.log("Missing widget id: " + elementId + ", for FQN: " + aFieldFqn);
			return;
		}

		if (fieldObject.type === "mobilephone" || fieldObject.type === "telephone") {
			UiUtil.SetWidgetPhone(undefined, aFormId, aFieldFqn, aFieldValue); // not tested
		} else if (fieldObject.type === "datetime" || fieldObject.type === "date" ) {
			UiUtil.SetWidgetDate(undefined, aFormId, aFieldFqn, aFieldValue, aForm); // not tested
		} else if (fieldObject.type === "money") {
			UiUtil.SetWidgetMoney(undefined, aFormId, aFieldFqn, aFieldValue); // not tested
		/*
		} else if (fieldObject.type === "boolean") {
			// do it when needed
		} else if (fieldObject.type === "country") {
			// do it when needed
		} else if (fieldObject.type === "state") {
			// do it when needed
		} else if (fieldObject.type === "city") {
			// do it when needed
		*/
		} else {
			const theMask = theElement.attr("data-mask");
			const theFieldValue = UiUtil.ApplyMask(theMask, aFieldValue);
			UiUtil.SetElementValue(theElement, theFieldValue);
		}
		if (UiUtil.DEBUG) {
			console.log("Found field: " + aFieldFqn + ", element id: " + elementId + ", value: " + aFieldValue);
		}
	} else { // toJsonObj
		fieldObject = UiUtil.GetVarByFieldName(aObj2Edit, fieldName);
		if(UiUtil.IsEqual(fieldObject.data, aFieldValue) === false) {
			if (UiUtil.IsEqual(aFieldValue, CLS_NO_SUCH_WIDGET) === false) {
				if (fieldObject.hasOwnProperty("option")) {
					fieldObject.data.Descr.data = aFieldValue;
				} else {
					fieldObject.data = aFieldValue;
				}
			}
		}
	}
};
UiUtil.PopulateWidgetAtParent = function(aFormId, aJsonObj, aForm, aFuncOnPopulated) {
	var cntrAsync = {}; cntrAsync.cntr = 0;
	var avoidRecursive = [];
	avoidRecursive.push({clasz: aJsonObj.clasz, Oid: aJsonObj.objectId});
	UiUtil.PopulateDataRecursion(aJsonObj, "", "", avoidRecursive, function(aObj2Edit, aFieldFqn, aFieldValue) {
		UiUtil.SetWidgetValue(aObj2Edit, aFormId, aFieldFqn, cntrAsync, aForm);
	});

	if (UiUtil.NotUndefineNotNullNotBlank(aFuncOnPopulated)) {
		setTimeout(function() {
			var cntrMax = {}; cntrMax.cntr = 0;
			while(UiUtil.CntrIsNotZero(cntrAsync, cntrMax) === true) {};
			aFuncOnPopulated();
		}, 100);
	}
};
UiUtil.PopulateWidgetFromDialog = function(aDialogId, aJsonObj, aFuncOnPopulated) {
	UiUtil.PopulateWidgetAtParent(aDialogId, aJsonObj, undefined, aFuncOnPopulated);
};
UiUtil.PopulateJsonFromDialog = function(aDialogId, aJsonObj, aFuncOnPopulated) {
	UiUtil.PopulateJsonAtParent(aDialogId, aJsonObj, aFuncOnPopulated);
};
UiUtil.PopulateWidgetFromForm = function(aFormId, aJsonObj, aFuncOnPopulated) {
	UiUtil.PopulateWidgetAtParent(aFormId, aJsonObj, undefined, aFuncOnPopulated);
};
UiUtil.PopulateJsonFromForm = function(aFormId, aJsonObj, aFuncOnPopulated) {
	UiUtil.PopulateJsonAtParent(aFormId, aJsonObj, aFuncOnPopulated);
};
UiUtil.PopulateJson = function(aJsonObj, aFuncOnPopulated) {
	UiUtil.PopulateJsonAtParent(undefined, aJsonObj, aFuncOnPopulated);
};
UiUtil.PopulateJsonAtParent = function(aFormId, aJsonObj, aFuncOnPopulated, aForm) {
	var cntrAsync = {}; cntrAsync.cntr = 0;
	var avoidRecursive = [];
	avoidRecursive.push({clasz: aJsonObj.clasz, Oid: aJsonObj.objectId});
	UiUtil.PopulateDataRecursion(aJsonObj, "", "", avoidRecursive, function(aObj2Edit, aFieldFqn, aFieldValue) {
		UiUtil.SetJsonValue(aObj2Edit, aFormId, aFieldFqn, cntrAsync, aForm);
	});

	if (UiUtil.NotUndefineNotNullNotBlank(aFuncOnPopulated)) {
		setTimeout(function() {
			var cntrMax = {}; cntrMax.cntr = 0;
			while(UiUtil.CntrIsNotZero(cntrAsync, cntrMax) === true) {};
			aFuncOnPopulated();
		}, 100);
	}
};
// to use this method, both the form widgets and object2Edit must be in sync
// here, it traverse the object2Edit structure and for each field, it obtain it's widget value
UiUtil.PopulateDataRecursion = function(aObj2Edit, aParentFqnName, aObjName, aAvoidRecursive, aTraversedFunc) {
	aParentFqnName = UiUtil.GetJsonPath(aParentFqnName, aObjName); // looks like aObjName is not needed, completely remove it if all is ok later
	for (var cntr = 0; cntr < aAvoidRecursive.length - 1; cntr++) {
		if ((aAvoidRecursive[cntr].Oid === String(aObj2Edit.objectId) || aAvoidRecursive[cntr].Oid === aObj2Edit.objectId) 
		&& aAvoidRecursive[cntr].clasz === aObj2Edit.clasz
		&& aAvoidRecursive[cntr].fieldName === aObjName
		) {
			console.log("Found recursive structure, field: " + aObj2Edit.fieldName + ", obj: " + JSON.stringify(aObj2Edit));
			return;
		}
	}

	for(var key in aObj2Edit.data) {
		if (aObj2Edit.data[key].dontDisplay !== undefined) continue;
		var fieldName = key;
		var fieldValue  = aObj2Edit.data[fieldName];
		var fieldFqn = UiUtil.ComposeFqn(aParentFqnName, fieldName);
		if (UiUtil.IsSystemField(fieldName) === false) {
			if (UiUtil.IsCustomPopulate(fieldValue)) { // custom widget values probably cannot be assign directly
				aTraversedFunc(aObj2Edit, fieldFqn, fieldValue);
			} else if ((fieldValue.data !== undefined && typeof(fieldValue.data) !== 'object') || fieldValue.lookup === true) { // atomic fields
				aTraversedFunc(aObj2Edit, fieldFqn, fieldValue);
			} else { // handle object fields i.e. fieldobject and fieldobjectbox
				if ((fieldValue.dataset !== undefined || typeof(fieldValue.data) === 'object') && (fieldValue.lookup === undefined || fieldValue.lookup === false)) {
					// need to first clear the dataset and re-create its widget, call UiUtil.ClearAndPopulateSlideToDiv below? KIV
					if ($.isArray(fieldValue.dataset)) { // its fieldobjectbox
						for (var cntrObj = 0; cntrObj < fieldValue.dataset.length; cntrObj++) {
							var aryIdx = "[" + cntrObj + "]";
							var fieldObj = fieldValue.dataset[cntrObj].clasz;
							var fieldOid = fieldValue.dataset[cntrObj].objectId;
							if (UiUtil.NotUndefineNotNullNotBlank(fieldObj) && UiUtil.NotUndefineNotNullNotBlank(fieldOid)) {
								aAvoidRecursive.push({clasz: fieldObj, Oid: fieldOid, fieldName: fieldName});
								UiUtil.PopulateDataRecursion(fieldValue.dataset[cntrObj], aParentFqnName, fieldName + aryIdx, aAvoidRecursive, aTraversedFunc);
								aAvoidRecursive.pop();
							}
						}
					} else { // its fieldobject
						var fieldObj = fieldValue;
						var fieldOid = fieldValue.objectId;
						if (UiUtil.NotUndefineNotNullNotBlank(fieldObj) && UiUtil.NotUndefineNotNullNotBlank(fieldOid)) {
							aAvoidRecursive.push({clasz: fieldObj, Oid: fieldOid, fieldName: fieldName});
							UiUtil.PopulateDataRecursion(fieldValue, aParentFqnName, fieldName, aAvoidRecursive, aTraversedFunc);
							aAvoidRecursive.pop();
						}
					}
				}
			}
		} else {
			// do nothing to system field
		}
	}
};
UiUtil.ClearAndPopulateSlideToDiv = function(fieldsetId, targetField, thisUiForm, setMaster, basePath, targetName) {
	var slideNxt = thisUiForm.createIdStr(fieldsetId, '_nxt');
	var slideId = thisUiForm.createIdStr(fieldsetId, '_slide');

	UiUtil.RemoveAllChildSlide(slideId);
	var masterSlider = document.getElementById(slideId);
	var cntrSlide = 0;
	for (var cntr = 0; cntr < targetField.dataset.length; cntr++) {
		if (targetField.dataset[cntr].delete !== undefined) continue;
		var divForSlideChild = document.createElement('div');
		masterSlider.appendChild(divForSlideChild);
		var avoidRecursive = new Array();
		avoidRecursive.push({clasz: thisUiForm.obj2Edit.clasz, Oid: thisUiForm.obj2Edit.objectId});
//		targetField.dataset[cntr].slideNo = cntrSlide++;
		thisUiForm.editAreaRecursion(targetField.dataset[cntr], setMaster, divForSlideChild, basePath, targetName + '[' + cntr + ']', avoidRecursive, 0);
	}
	var funcSlow = function() { 
		thisUiForm.setupAryCtrlButton(targetField, fieldsetId, slideId, slideNxt, basePath, targetName);
	};
	setTimeout(funcSlow, 100);
};
UiUtil.SetAllComboDefaultValue = function() {
	var defaultValue = undefined;
	$("select").each(function() { 
		var thisSelect = this;
		var allOption = $(thisSelect).find("option");
		for(var cntr = 0; cntr < allOption.length; cntr++) {
			var thisOption = allOption[cntr];
			if (UiUtil.NotUndefineNotNullNotBlank($(thisOption).val())) {
				if (UiUtil.NotUndefineNotNullNotBlank(defaultValue)) {
					defaultValue = undefined;
					break;
				} else {
					defaultValue = $(thisOption).val();
				}
			}
		}

		if (UiUtil.NotUndefineNotNullNotBlank(defaultValue)) {
			$(thisSelect).val(defaultValue);
			defaultValue = undefined;
		}
	});
};
UiUtil.IsDisable = function(aParentId) {
	const parentDiv = document.getElementById(aParentId);
	if (!parentDiv) return false;
	const stInputArea = parentDiv.querySelector('.st-input-area');
	const spanWithInput = stInputArea.querySelector(`span:has(input)`);
	if (!spanWithInput) return false;
	const controls = spanWithInput.querySelectorAll('input');
	const result = Array.from(controls).every(el => 
		el.disabled === true
	);
	return result;
};
UiUtil.DisableIt = function(aParentDiv) {
	$('#' + aParentDiv).find('*').css('color', '#212529');
	$('#' + aParentDiv).find('*').attr('disabled', '');
};
UiUtil.EnableIt = function(aParentDiv) {
	$('#' + aParentDiv).find('*').css('color', '#212529');
	$('#' + aParentDiv).find('*').removeAttr('disabled');
};
UiUtil.LoadHRefNewTab = function(strHref) {
	var contextPath = window.location.pathname.substring(0, window.location.pathname.lastIndexOf("/"));
	var fullPath = window.location.origin + contextPath + "/" + strHref.replace(/^\/+/g, '');
	var wnd = window.open(fullPath, '_blank');
	return wnd;
};
UiUtil.LoadHRef = function(strHref) {
	var contextPath = window.location.pathname.substring(0, window.location.pathname.lastIndexOf("/"));
	var fullPath = window.location.origin + contextPath + "/" + strHref.replace(/^\/+/g, '');
	window.location = fullPath;
};
UiUtil.IsDefinedIFrame = function(aAllDefinedIFrame, aGotIFrameHref) {
	var arrayDefinedIFrame = Object.values(aAllDefinedIFrame);
	for(var cntr = 0; cntr < arrayDefinedIFrame.length; cntr++) {
		var eachIFrame = arrayDefinedIFrame[cntr];
		var gotoParam = (new URLSearchParams(new URL(aGotIFrameHref).search)).get("goto");
		if (UiUtil.NotUndefineNotNullNotBlank(gotoParam)) {
			if (eachIFrame.includes(gotoParam)) {
				return true;
			}
		}
	}
	return false;
};
UiUtil.ShowIFrame = function(aItemId, aDivParentId, aIFrameId, aIFrameArray) {
	var allIframe = document.getElementById(aDivParentId).getElementsByTagName('iframe');
	for(var cntr = 0; cntr < allIframe.length; cntr++) {
		var eachElement = allIframe[cntr];
		document.getElementById(eachElement.id).style.display = "none";
	}

	var itemElement = document.getElementById(aItemId);
	if (!UiUtil.NotUndefineNotNull(itemElement)) {
		UiUtil.DialogWaitStart('Creating new windowing..');
		itemElement = document.getElementById(aIFrameId).cloneNode(true);
		itemElement.id = aItemId;
		itemElement.src = aIFrameArray[aItemId];
		itemElement.onload = function(){
			UiUtil.DialogWaitStop();
			var gotIFrameHref = itemElement.contentDocument.location.href;
			if (UiUtil.IsDefinedIFrame(aIFrameArray, gotIFrameHref)) {
				itemElement.contentWindow.focus();
				if (UiUtil.NotUndefineNotNull(itemElement.contentWindow.focusFirstWidget)) {
				}
			} else {
				window.location = itemElement.src; // don't show it in iframe, thou full reload but let it so
			}
		};
		document.getElementById(aDivParentId).appendChild(itemElement);
		currentIFrame = itemElement;
	}
	itemElement.style.display = "block";

	if (UiUtil.NotUndefineNotNullNotBlank(itemElement.contentWindow.document.onVisible)) {
		itemElement.contentWindow.document.onVisible();
	}
	return itemElement;
};
UiUtil.GetCallerWindow = function() {
	var theCallerId = localStorage.getItem(window.frameElement.id + "_callerScreen");
	if (UiUtil.NotUndefineNotNullNotBlank(theCallerId)) { 
		var theCaller = top.document.getElementById(theCallerId);
		if (UiUtil.NotUndefineNotNullNotBlank(theCaller)) { 
			if (UiUtil.NotUndefineNotNullNotBlank(theCaller.contentWindow.document.displayCaller)) { 
				return theCaller.contentWindow;
			}
		}
	}
	return null;
};
UiUtil.setCallerDisplay = function(theCallerId, theCalleeId) {
	localStorage.setItem(theCalleeId + "_callerScreen", theCallerId);
};
UiUtil.callCallerDisplay = function() {
	var theCallerId = localStorage.getItem(window.frameElement.id + "_callerScreen");
	if (UiUtil.NotUndefineNotNullNotBlank(theCallerId)) { 
		var theCaller = top.document.getElementById(theCallerId);
		if (UiUtil.NotUndefineNotNullNotBlank(theCaller)) { 
			if (UiUtil.NotUndefineNotNullNotBlank(theCaller.contentWindow.document.displayCaller)) { 
				theCaller.contentWindow.document.displayCaller();
			}
		}
	}
};

UiUtil.BREADCRUMB_PREVIOUS_TITLE = "bcrumb_previous";
UiUtil.BreadcrumbSetPreviousTitle = function(aPreviousTitle) {
	localStorage.setItem(UiUtil.BREADCRUMB_PREVIOUS_TITLE, aPreviousTitle);
};
UiUtil.BreadcrumbGetTitle = function(aCurrentTitle) {
	var result = "";
	var thePreviousTitle = localStorage.getItem(UiUtil.BREADCRUMB_PREVIOUS_TITLE);
	if (UiUtil.NotUndefineNotNullNotBlank(thePreviousTitle)) {
		var turnToPreviousTitlePosition;
		var	turnToPreviousTitle;
		var indexLast = thePreviousTitle.lastIndexOf("</span>");
		if (indexLast < 0) {
			turnToPreviousTitle = thePreviousTitle;
			thePreviousTitle = "";
		} else {
			turnToPreviousTitlePosition = indexLast + "</span>".length;
			turnToPreviousTitle = thePreviousTitle.substring(turnToPreviousTitlePosition);
		}
		var turnToPreviousTitleHtml = "<span style='font-size: large; letter-spacing: 2'>" + turnToPreviousTitle + "</span>" 
		+ "<span style='font-size:large;letter-spacing:-4;padding-left:10px;padding-right:15px'> >> </span>";
		result = thePreviousTitle.substring(0, turnToPreviousTitlePosition) + " " + turnToPreviousTitleHtml;
	} else {
		result = "<span style='font-size: large; letter-spacing: 2'>" + aCurrentTitle + "</span>";
		result += "<span style='font-size:large;letter-spacing:-4;padding-left:10px;padding-right:15px'> >> </span>";
	}
	return result + aCurrentTitle;
}; 
UiUtil.SetFocus = function(aId) {
	setTimeout(function() {
		$(aId).focus();
		$(aId).select();
	}, 500);
};
UiUtil.GetParameterByName = function(name) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
	var normUrl = location.search.split("&nbsp").join("%20");
	var results = regex.exec(normUrl);
	return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
};
UiUtil.GetFileName = function(response, status, xhr) {
	var filename = "";
	var disposition = xhr.getResponseHeader('Content-Disposition');
	if (disposition && disposition.indexOf('attachment') !== -1) {
		var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
		var matches = filenameRegex.exec(disposition);
		if (matches !== null && matches[1]) { 
			filename = matches[1].replace(/['"]/g, '');
		}
	} return filename;
};
UiUtil.BeActionBlob = function(aDialogMsg, aData, aActionKeyword, aUrl, aSuccFunc, aFailFunc, aFinalFunc) {
	UiUtil.BeActionBlobRestOrServlet("servlet", "get", aDialogMsg, aData, aActionKeyword, aUrl, aSuccFunc, aFailFunc, aFinalFunc);
};
UiUtil.HttpGetBlob = function(aDialogMsg, aData, aActionKeyword, aUrl, aSuccFunc, aFailFunc, aFinalFunc) {
	UiUtil.BeActionBlobRestOrServlet("rest", "get", aDialogMsg, aData, aActionKeyword, aUrl, aSuccFunc, aFailFunc, aFinalFunc);
};
UiUtil.BeActionBlobRestOrServlet = function(aRestOrServlet, aHttpMethod, aDialogMsg, aData, aActionKeyword, aUrl, aSuccFunc, aFailFunc, aFinalFunc) {
	UiUtil.DialogWaitStart(aDialogMsg);
	var theUrl = aUrl + '?type=' + aActionKeyword;
	var httpMethod = "get";
	if (aRestOrServlet == "rest") { 
		theUrl = aUrl + '/' + aActionKeyword; 
		httpMethod = aHttpMethod;
	}
	var requestParam = {parentOid: this.parentOid, data: JSON.stringify(aData)};
	$.ajax({
		type: httpMethod,
		url: theUrl,
		dataType: "text",
		//contentType: "application/json",
		data: requestParam,
		success:function(respond, textStatus, jqXHR) {
			if (respond.startsWith("Error")) {
				var firstLine = respond.split('\n')[0];
				var respondStruct = {};
				respondStruct.status = "error";
				respondStruct.msg = firstLine;
				respondStruct.errorField = null;
				var afterAck = function(respondStruct) {
					if (UiUtil.NotUndefineNotNull(aFailFunc)) {
						aFailFunc(respondStruct, textStatus, jqXHR);
					}
					if (UiUtil.NotUndefineNotNull(aFinalFunc)) {
						aFinalFunc(respondStruct, textStatus, jqXHR);
					}
				};
				UiUtil.BlinkError(respondStruct, afterAck);
			} else if (respond.indexOf('ERROR') >= 0) {
				respond = JSON.parse(respond);
				var afterAck = function(respond) {
					if (UiUtil.NotUndefineNotNull(aFailFunc)) {
						aFailFunc(respond.msg, textStatus, jqXHR);
					}
					if (UiUtil.NotUndefineNotNull(aFinalFunc)) {
						aFinalFunc(respond.msg, textStatus, jqXHR);
					}
				};
				if (UiUtil.NotUndefineNotNullNotBlank(respond.msg)) {
					UiUtil.BlinkError(respond, afterAck);
				}
			} else {
				var fileName = UiUtil.GetFileName(respond, textStatus, jqXHR);
				var contentType = jqXHR.getResponseHeader("content-type");

				var link;
				if (contentType.indexOf("zip") !== -1) {
					link = "data:application/zip;base64," + respond;
				} else {
					link = "data:application/octet-stream;base64," + respond;
				}

				if (UiUtil.NotUndefineNotNullNotBlank(fileName)) {
					var aref = document.createElement("a");
					document.body.appendChild(aref);
					aref.style = "display: none";
					aref.href = link;
					aref.download = fileName;
					aref.click();
					window.URL.revokeObjectURL(link);
				} else {
					window.location = link;
				}

				aSuccFunc(respond);
			}
		},
		error:function(xhr, err, errorThrown) {
			console.log("ERROR: when calling to: " + aUrl);
			var respond = {};
			respond.msg = UiUtil.SetErrStr(xhr, err);
			respond.status = 'error';
			respond.errorField = 'null';
			var afterAck = function(respond) {
				if (UiUtil.NotUndefineNotNull(aFailFunc)) {
					aFailFunc(respond, errorThrown, xhr);
				}
			};
			if (UiUtil.NotUndefineNotNullNotBlank(respond.msg)) {
				UiUtil.BlinkError(respond, afterAck);
			}
		}
	});
};
UiUtil.GetLastLine = function(aStr) {
	if (UiUtil.NotUndefineNotNullNotBlank(aStr)) {
		var lines = aStr.match(/[^\r\n]+/g);
		if (UiUtil.NotUndefineNotNullNotBlank(lines)) {
			var lastLine = lines[lines.length - 1];
			return lastLine;
		} else {
			return aStr;
		}
	}
	return "";
}; 
UiUtil.ReplaceAll = function(target, search, replacement) {
	return target.replace(new RegExp(search, 'g'), replacement);
};
UiUtil.Null2Zero = function(aVar) {
	if (UiUtil.IsUndefineOrNullOrBlank(aVar)) {
		return 0;
	} else {
		return UiUtil.ReplaceAll(aVar, ",", "") * 1;
	}
};
UiUtil.DifferentJson = function(aOriginal, aEdited) {
	const result = UiUtil.CompareJSONStrings(aOriginal, aEdited);
	return !result;
	/*
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
	return result;
	*/
};
UiUtil.DifferentTableData = function(aOriginal, aEdited) {
	var result = false;
	var tblOriginal = JSON.stringify(aOriginal);
	var tblEdited = JSON.stringify(aEdited);
	if (tblOriginal !== tblEdited) {
		result = true;
	}
	return result;
};
UiUtil.FocusAtWidget = function(aWidgetId) {
	return function() {
		setTimeout(function() {
			var theWidget = document.getElementById(aWidgetId);
			if (UiUtil.NotUndefineNotNullNotBlank(theWidget)) {
				theWidget.focus();
			}
		}, 300);
	};
};
UiUtil.DisabledWidget = function(aFormId, aWidgetLabel, aDisable)  {
	$("#" + aFormId + " label:contains('" + aWidgetLabel + "')").parent().parent().find(":input").each(function() {
		$(this).prop("disabled", aDisable);
		if (this.tagName.toUpperCase() === "SELECT") {
			$(this).find("option").prop("disabled", aDisable);
		}
	});
};
UiUtil.IsCharacterKeyPress = function(evt) {
	if (typeof evt.which === "undefined") {
		return true; // This is IE, which only fires keypress events for printable keys
	} else if (typeof evt.which === "number" && evt.which > 0) {
		return !evt.ctrlKey && !evt.metaKey && !evt.altKey && evt.which !== 8; // In other browsers except old versions of WebKit, evt.which is only greater than zero if the keypress is a printable key. We need to filter out backspace and ctrl/alt/meta key combinations
	}
	return false;
};
UiUtil.OnKeyPrintable = function(aEvt, aCallback) { 
	aEvt = aEvt || window.event;
	if (UiUtil.IsCharacterKeyPress(aEvt)) {
		aCallback();
	}
};
UiUtil.GetElementByLabel = function(aFormId, aLabelText) {
	var form = document.getElementById(aFormId);
	var labels = form.getElementsByTagName('LABEL');
	for (var cntr = 0; cntr < labels.length; cntr++) {
		const labelText = UiUtil.GetLabelPureText(labels[cntr].innerText);
 		if (labelText === aLabelText) {
			return labels[cntr];
	}
	}
};
UiUtil.GetLabelPureText = function(el) {
	if (el && el.childNodes)
		return Array.from(el.childNodes).filter(node => node.nodeType === Node.TEXT_NODE).map(node => node.textContent.trim()).join(" ");
	else
		return el;
};
UiUtil.GetWidgetParentByLabel = function(aFormId, aWidgetLabel)  {
	var lbElement = UiUtil.GetElementByLabel(aFormId, aWidgetLabel);
	var result = lbElement.parentElement.parentElement;
	return result;
};
UiUtil.MakeEditableSelect = function(aFormId, aWidgetLabel)  {
	$("#" + aFormId + " label:contains('" + aWidgetLabel + "')").parent().parent().find(".st-input-area").addClass("st-select-editable");
	$("#" + aFormId + " label:contains('" + aWidgetLabel + "')").parent().parent().find("select").each(function() {
		var selectElem = this;
		var inputElem = document.createElement("input");
		$(inputElem).attr("type", "text");
		//$(inputElem).attr("onkeypress", "$(this).parent().find('select').val('')"); // if enter textfield, remove combobox value
		inputElem.onkeypress = function(evt) { UiUtil.OnKeyPrintable(evt, function() {
			$(selectElem).parent().find('select').val(''); // if enter textfield, remove combobox value
		}); };
		this.parentNode.append(inputElem);
		$(this).attr("onchange", "$(this).parent().find('input').val('')"); // if enter combobox, remove textfield value
	});
};
UiUtil.GetEditableSelectValue = function(aFormId, aWidgetLabel)  {
	var result = "";
	$("#" + aFormId + " label:contains('" + aWidgetLabel + "')").parent().parent().find("select").each(function() {
		if (UiUtil.NotUndefineNotNullNotBlank($(this).val())) {
			result = $(this).val();
			return;
		} else {
			var textfieldValue = $(this).parent().find("input").val();
			if (UiUtil.NotUndefineNotNullNotBlank(textfieldValue)) {
				result = textfieldValue;
				return;
			}
		}
	});
	return result;
};
UiUtil.CreateColorTag = function(aTagText, aTagColor, aIconType, aOnClickFunc)  {
	var tagDiv = document.createElement("div");
	$(tagDiv).addClass("st-tag-chip");
	$(tagDiv).style().background = aTagColor;
	$(tagDiv).style().color = "white";
	$(tagDiv).style().marginTop = "10px";
	$(tagDiv).text(aTagText);

	if (UiUtil.NotUndefineNotNullNotBlank(aIconType)) {
		if (aIconType === "icon-remove") {
			var tagIcon = document.createElement("i");
			$(tagIcon).addClass("icons icon-remove");
			$(tagIcon).style().marginLeft = "5px";
			$(tagDiv).append(tagIcon);
			$(tagDiv).find(".icon-remove").on("click", function() {
				if (UiUtil.NotUndefineNotNullNotBlank(aOnClickFunc)) {
					aOnClickFunc(tagDiv, "click-icon", "remove-tag");
				}
				$(tagDiv).remove();
			});
		} else if (aIconType === "icon-ok") {
			$(tagDiv).on("click", function() {
				var foundOk = $(tagDiv).find(".icon-ok")[0];
				if (UiUtil.NotUndefineNotNullNotBlank(foundOk)) {
					if (UiUtil.NotUndefineNotNullNotBlank(aOnClickFunc)) {
						aOnClickFunc(tagDiv, "click-tag", "remove-icon");
					}
					$(foundOk).remove();
				} else {
					var tagIcon = document.createElement("i");
					$(tagIcon).addClass("icons icon-ok");
					$(tagIcon).style().marginLeft = "5px";
					$(tagDiv).append(tagIcon);
					if (UiUtil.NotUndefineNotNullNotBlank(aOnClickFunc)) {
						aOnClickFunc(tagDiv, "click-tag", "add-icon");
					}
				}
			});
		} else {
			var tagIcon = document.createElement("i");
			$(tagIcon).addClass("icons " + aIconType);
			$(tagIcon).style().marginLeft = "5px";
			$(tagDiv).append(tagIcon);
		}
	}
	return tagDiv;
};
UiUtil.EncryptPassword = function(aCryptKey, aPlainPassword) {
	var encryptMachine = new JSEncrypt();
	encryptMachine.setPublicKey(aCryptKey);
	var result = encryptMachine.encrypt(aPlainPassword);
	return result;
};
UiUtil.GetCaller = function() {
	var urlString = document.location.href;
	var url = new URL(urlString);
	var strCaller = url.searchParams.get("caller");
	return strCaller;
};
UiUtil.DisableAll = function(parentElement) {
	var nodes = document.getElementById(parentElement).getElementsByTagName('*');	
	for(var cntr = 0; cntr < nodes.length; cntr++){
		nodes[cntr].disabled = true;
	}	
};
UiUtil.RemoveDialogNicEdit= function() {
	var totalNicEdit = document.getElementById('swal2-content').querySelectorAll('.nicEdit-main').length;
	for(var cntr = 0; cntr < totalNicEdit; cntr++) {
		if (UiUtil.NotUndefineNotNullNotBlank(nicEditors)) {
			if (nicEditors.editors.length > 0) {
				var nicLastIndex = nicEditors.editors.length - 1;
				if (UiUtil.NotUndefineNotNullNotBlank(nicEditors.editors[nicLastIndex].nicInstances[0])) {
					var nicId = nicEditors.editors[nicLastIndex].nicInstances[0].e.id;
					nicEditors.editors[nicLastIndex].removeInstance(nicId);
				}
			} else {
				console.log("When removing nic editors, no editors to remove");
			}
		} else {
			console.log("When removing nic editors, found .nicEdit-main but no global variable nicEditors!");
		}
	}
};
UiUtil.DialogWithDateRange = function(aOption) {
	var aTitle = aOption.title;
	var aOkButtonText = aOption.okButtonText;
	var aCancelButtonText = aOption.cancelButtonText;
	var aOnValidate = aOption.onValidate; // if you want validation, make sure you provide the callback in the validation function
	var aOnOk = aOption.onOk;
	var aOnCancel = aOption.onCancel; 
	var aGetStrDateFrom = aOption.getStrDateFrom;  // compulsory 
	var aGetStrDateEnd = aOption.getStrDateEnd; 
	var aOnFailValidation = aOption.onFailValidation;
	var aBodyName = aOption.divBodyName;
	var aCreateBody = aOption.createBody;
	var aJsonObject = aOption.jsonObject;
	var aCloneObject = aOption.cloneObject;

	if (!aCloneObject) { // will not clone for recursive calls
		aCloneObject = JSON.parse(JSON.stringify(aJsonObject));
		aOption.cloneObject = aCloneObject;
	}

	var divWithPeriod = document.createElement('div');
	divWithPeriod.setAttribute('id', aBodyName);
	divWithPeriod.setAttribute('style', 'text-align:left;margin-top:15px');
	var bodyContent = divWithPeriod;

	var jsFunc = function() {
		document.querySelector('.swal2-container h2').style.margin = '0'; 
		document.querySelector('.swal2-popup').style.padding = '2.5em';
		document.querySelector('.swal2-popup').style.paddingLeft = '1em';
		document.querySelector('.swal2-popup').style.paddingRight = '1em';
		if (UiUtil.NotUndefineNotNullNotBlank(aCreateBody)) {
			aCreateBody(aOption.cloneObject);
		}
	};

	UiUtil.DialogTwoButton(aTitle, bodyContent, undefined, function() 
		{
			UiUtil.PopulateJsonFromDialog(aBodyName, aOption.cloneObject, function() { // callback, populate without the attachment, if invalid, it'll retain user input data
				if (UiUtil.GotErrorFieldShown(aBodyName)) {
					const failMsg = "Cannot proceed until all field error is corrected!";
					UiUtil.DialogError("Error", failMsg, function() {
						UiUtil.DialogWithCustomBody(aOption);
					});
				} else {
					var newDateFrom = aGetStrDateFrom();
					var newDateEnd = aGetStrDateEnd();
					if (newDateFrom > newDateEnd) {
						if (UiUtil.NotUndefineNotNullNotBlank(aOnFailValidation)) {
							aOnFailValidation();
						}
						//UiUtil.PopulateJsonFromDialog(aBodyName, aJsonObject); // populate without the attachment for validation first, if invalid, it'll retain user input data
						UiUtil.RemoveDialogNicEdit(); // nic uses global variable, need to remove all nicedit for dialog box
						UiUtil.DialogError("Error", "'Start or To' date must be later then 'End or From' date!", function() {
							UiUtil.DialogWithDateRange(aOption);
						});
					} else {
						UiUtil.RemoveDialogNicEdit();
						if (UiUtil.NotUndefineNotNullNotBlank(aOnValidate)) {
							aOnValidate(aJsonObject, function(aFailMsg) {
								if (UiUtil.NotUndefineNotNullNotBlank(aFailMsg)) {
									if (UiUtil.NotUndefineNotNullNotBlank(aOnFailValidation)) {
										aOnFailValidation();
									}
									UiUtil.PopulateJsonFromDialog(aBodyName, aJsonObject); // no callback, populate without the attachment, if invalid, it'll retain user input data
									UiUtil.RemoveDialogNicEdit();
									UiUtil.DialogError("Error", aFailMsg, function() {
										UiUtil.DialogWithDateRange(aOption);
									});
								} else {
									UiUtil.RemoveDialogNicEdit();
									if (UiUtil.NotUndefineNotNullNotBlank(aOnOk)) {
										aOnOk(newDateFrom, newDateEnd);
									}
								}
							});
						} else {
							UiUtil.RemoveDialogNicEdit();
							if (UiUtil.NotUndefineNotNullNotBlank(aOnOk)) {
								aOnOk(newDateFrom, newDateEnd);
							}
						}
					}
				}
			}); 
		}
		, function() {
			UiUtil.RemoveDialogNicEdit();
			if (UiUtil.NotUndefineNotNullNotBlank(aOnCancel))
				aOnCancel();
		}
		, jsFunc
		, aOkButtonText
		, aCancelButtonText
	);
	$(".swal2-container h2").css("margin-bottom", "0px");
};
UiUtil.PopupCalendarPeriod = function(aOption) {
	var aTitle = aOption.title;
	var aContent = aOption.content;
	var aOnDateSelected = aOption.onDateSelected;
	var aOnCancel = aOption.onCancel; 
	var aOnLoaded = aOption.onLoaded; 

	var jsFunc = function() {
		document.querySelector('.swal2-container h2').style.margin = '0'; 
		document.querySelector('.swal2-popup').style.padding = '2.5em';
		if (aOnLoaded) aOnLoaded();
	};

	UiUtil.DialogOkCancel(aTitle, aContent, undefined, function() {
		var newDateFrom = UiUtil.DisplayDateToDate(UiUtil.GetStrDateFrom());
		var newDateEnd = UiUtil.DisplayDateToDate(UiUtil.GetStrDateEnd());
		if (newDateFrom > newDateEnd) {
			UiUtil.DialogError("Error", "'Start or To' date must be later then 'End or From' date!", function() {
				UiUtil.PopupCalendarPeriod(aOption);
			});
		} else {
			if (UiUtil.NotUndefineNotNullNotBlank(aOnDateSelected))
				aOnDateSelected(newDateFrom, newDateEnd);
		}
	}, function() {
		if (UiUtil.NotUndefineNotNullNotBlank(aOnCancel))
			aOnCancel();
	}, jsFunc);
};
UiUtil.CreatePeriodRangeElement = function(aOption) {
	var aDateStart = aOption.dateStart;
	var aDateEnd = aOption.dateEnd;
	var aNavMonth = aOption.navMonth;
	if (UiUtil.IsUndefineOrNullOrBlank(aNavMonth)) { 
		aNavMonth = false;
	}

	var dateStart = {};
	var dateEnd = {};

	if (UiUtil.IsUndefineOrNullOrBlank(aDateStart)) 
		dateStart.data = UiUtil.DateForDisplay(new Date());
	else
		dateStart.data = UiUtil.DateForDisplay(aDateStart);

	if (UiUtil.IsUndefineOrNullOrBlank(aDateEnd)) 
		dateEnd.data = UiUtil.DateForDisplay(new Date());
	else 
		dateEnd.data = UiUtil.DateForDisplay(aDateEnd);

	var divDateStart = UiUtil.CreateDatePicker('From', dateStart, true , false, undefined, undefined);
	var divDateEnd = UiUtil.CreateDatePicker('To', dateEnd, true , false, undefined, undefined);

	divDateStart.setAttribute('id', 'st-dp-dateFrom');
	divDateStart.setAttribute('style', 'float:left;width:40%;display:inline-block !important;text-align:left;margin-right:20px');
	divDateStart.querySelector('label').style.fontWeight = 'normal';

	divDateEnd.setAttribute('id', 'st-dp-dateEnd');
	divDateEnd.setAttribute('style', 'float:left;width:40%;display:inline-block !important;text-align:left;margin-right:20px');
	divDateEnd.querySelector('label').style.fontWeight = 'normal';
	
	var iMonthLeft = document.createElement('i');
	iMonthLeft.setAttribute('id', 'st-dp-iMonthLeft');
	iMonthLeft.setAttribute("class", "fa fa-chevron-circle-left");
	iMonthLeft.setAttribute('style', 'margin:0px !important;font-size:larger;cursor:pointer');
	$(document).ready(function() {
		var inputParentStart = document.getElementById('st-dp-dateFrom');
		$("#st-dp-iMonthLeft").click(function() { 
			if (UiUtil.IsDisable('st-dp-dateFrom') == false) {
				UiUtil.NavigateMonth('minus', UiUtil.GetDatePickerValue(inputParentStart), 'monthAbbrv'); 
			}
		});
	});
	var iMonthRight = document.createElement('i');
	iMonthRight.setAttribute('id', 'st-dp-iMonthRight');
	iMonthRight.setAttribute("class", "fa fa-chevron-circle-right");
	iMonthRight.setAttribute('style', 'margin: 0px !important; font-size: larger; cursor: pointer');
	$(document).ready(function() {
		var inputParentEnd = document.getElementById('st-dp-dateEnd');
		$("#st-dp-iMonthRight").click(function() { 
			if (UiUtil.IsDisable('st-dp-dateEnd') == false) {
				UiUtil.NavigateMonth('add', UiUtil.GetDatePickerValue(inputParentEnd), 'monthAbbrv'); 
			}
		});
	});
	var spanMonthAbbrv = document.createElement('span');
	spanMonthAbbrv.setAttribute("class", "unselectable");
	spanMonthAbbrv.style.paddingLeft = '6px';
	spanMonthAbbrv.style.paddingRight = '6px';
	spanMonthAbbrv.style.fontFamily = 'monospace';
	spanMonthAbbrv.setAttribute('id', 'monthAbbrv');
	spanMonthAbbrv.innerHTML = "Jan";

	var divControl = document.createElement('div');
	divControl.appendChild(iMonthLeft);
	divControl.appendChild(spanMonthAbbrv);
	divControl.appendChild(iMonthRight);
	var divMonthNavg = UiUtil.CreateTextFieldWithLabel("", divControl);
	divMonthNavg.style.float = 'left';
	divMonthNavg.style.width = '20%';
	divMonthNavg.style.marginTop = '29px';
	divMonthNavg.style.marginRight = '1em';

	var divCol = document.createElement('div');
	divCol.style.float = 'left';
	divCol.style.display = 'flex';
	divCol.style.alignItems = 'center';
	divCol.style.width = '100%';
	divCol.appendChild(divDateStart);
	divCol.appendChild(divDateEnd);
	if (aNavMonth) {
		divCol.appendChild(divMonthNavg);
		$(document).ready(function() {
			UiUtil.NavigateMonth('static', UiUtil.DisplayDateToDate(dateStart.data), 'monthAbbrv');
		});
	}
	
	var divPeriod = document.createElement('div');
	divPeriod.style.float = 'left';
	divPeriod.style.marginTop = '0';
	divPeriod.appendChild(divCol);

	return divPeriod;
};
UiUtil.OnDatePickerInputChange = function(aInputParent, aFuncName) {
	var aryInput = aInputParent.querySelectorAll('input'); // uses pure javascript
	aryInput[0].setAttribute('onblur', aFuncName);
	aryInput[1].setAttribute('onblur', aFuncName);
	aryInput[2].setAttribute('onblur', aFuncName);
};
// javascript got insertBefore but do not have insertAfter!
UiUtil.InsertAfter = function(newNode, referenceNode) {
	referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
};
UiUtil.Trim2Len = function(aStr2Trim, aMaxLen) {
	var result = aStr2Trim;
	if (UiUtil.NotUndefineNotNullNotBlank(aStr2Trim)) {
		if (aStr2Trim.length > aMaxLen) {
			result = aStr2Trim.substring(0, aMaxLen);
		}
	}
	return result;	
};
UiUtil.OnAttachmentChange = function(aElemInputUploadId, aElemFileName) {
	// do nothing
};
UiUtil.OnRemoveUpload = function(aInputUploadId, aFileNameId, aDoOnAttachmentChange) {
	var elemFileName = document.getElementById(aFileNameId);
	var elemInputUpload = document.getElementById(aInputUploadId);
	elemFileName.innerText = '';
	elemInputUpload.value = '';
	elemInputUpload.edited = true;

	var elemFileNameRemoveId = elemFileName.id + '_Remove';
	var elemFileNameRemove = document.getElementById(elemFileNameRemoveId);
	if (UiUtil.NotUndefineNotNullNotBlank(elemFileNameRemove)) {
		elemFileNameRemove.style.visibility = 'hidden';
		if (UiUtil.NotUndefineNotNullNotBlank(UiUtil.OnAttachmentChange) && UiUtil.IsUndefineOrNullOrBlank(aDoOnAttachmentChange)) {
			UiUtil.OnAttachmentChange(elemInputUpload, elemFileName);
		}
	}

	var elemFileNameViewId = elemFileName.id + '_View';
	var elemFileNameView = document.getElementById(elemFileNameViewId);
	if (UiUtil.NotUndefineNotNullNotBlank(elemFileNameView)) {
		elemFileNameView.style.visibility = 'hidden';
	}
};
UiUtil.AddIconTrashForUpload = function(aElemInputUpload, aElemFileName) {
	var aElemFileNameRemoveId = aElemFileName.id + '_Remove';
	var elementRemove = document.getElementById(aElemFileNameRemoveId);
	//if (UiUtil.IsUndefineOrNullOrBlank(aElemFileName.nextSibling) || aElemFileName.nextSibling.tagName !== 'I') {
	if (UiUtil.IsUndefineOrNullOrBlank(elementRemove)) {
		if (UiUtil.NotUndefineNotNullNotBlank(aElemFileName.innerText)) {
			var iTrashIcon = document.createElement('i');
			iTrashIcon.setAttribute('id', aElemFileNameRemoveId);
			iTrashIcon.setAttribute('class', 'icons icon-trash');
			iTrashIcon.setAttribute('onclick', 'UiUtil.OnRemoveUpload(' 
			+ '"' + aElemInputUpload.id + '"' 
			+ ', ' + '"' + aElemFileName.id + '"' 
			+ ')');
			iTrashIcon.style.marginLeft = '5px';
			UiUtil.InsertAfter(iTrashIcon, aElemFileName);
		}
	} else {
		var aElemFileNameRemove = document.getElementById(aElemFileNameRemoveId);
		if (UiUtil.NotUndefineNotNullNotBlank(aElemFileNameRemove)) {
			aElemFileNameRemove.style.visibility = 'visible';
			aElemFileNameRemove.style.height = 'auto';
		}
	}

	/*
	if (UiUtil.NotUndefineNotNullNotBlank(UiUtil.OnAttachmentChange) && UiUtil.IsUndefineOrNullOrBlank(aDoOnAttachmentChange)) {
		UiUtil.OnAttachmentChange(aElemInputUpload, aElemFileName);
	}
	*/
};
UiUtil.OnUploadChangeValue = function(aInputUploadId, aFileNameId) {
	var elemFileName = document.getElementById(aFileNameId);
	var elemInputUpload = document.getElementById(aInputUploadId);
	if (UiUtil.NotUndefineNotNullNotBlank(elemInputUpload.value)) {
		elemFileName.innerText = UiUtil.Trim2Len(UiUtil.GetFileNameFromPath(elemInputUpload.value), 32);
		elemInputUpload.edited = true;
		UiUtil.AddIconTrashForUpload(elemInputUpload, elemFileName);
		UiUtil.AddIconViewForUpload(elemInputUpload, elemFileName);
		if (UiUtil.NotUndefineNotNullNotBlank(UiUtil.OnAttachmentChange)) {
			UiUtil.OnAttachmentChange(elemInputUpload, elemFileName);
		}
	}
};
UiUtil.AttachmentFromJson = function() {
	// do nothing
};
UiUtil.MakeAttachmentViewOnly = function(aFieldFqn, aFormId) {
	var base64Fqn = UiUtil.GetJsonPath(aFieldFqn, 'Base64 Data');
	var base64Id = UiUtil.GenElementId(undefined, base64Fqn, undefined, aFormId);
	var base64Element = document.getElementById(base64Id);
	var base64LabelFor = base64Element.parentElement.nextSibling;
	base64Element.disabled = true;
	base64LabelFor.style.color = 'gray';

	var fileNameFqn = UiUtil.GetJsonPath(aFieldFqn, 'File Name');
	var fileNameId = UiUtil.GenElementId(undefined, fileNameFqn, undefined, aFormId);
	var fileNameRemoveId = fileNameId + '_Remove';
	var fileNameRemoveElement = document.getElementById(fileNameRemoveId);
	if (UiUtil.NotUndefineNotNullNotBlank(fileNameRemoveElement)) {
		fileNameRemoveElement.disabled = true; // don't work
		fileNameRemoveElement.onclick = function() {}; 
		fileNameRemoveElement.style.color = 'gray';
	}
};
UiUtil.CreateAttachmentWidget = function(aDisplayLabel, aJsonData, aFieldFqn, aFormId) {
	UiUtil.AttachmentFromJson = function() {
		var attachmentValue = UiUtil.GetValueByFieldName(aJsonData, 'Base64 Data');
		return attachmentValue;
	};

	var base64Fqn = UiUtil.GetJsonPath(aFieldFqn, 'Base64 Data');

	var fileNameFqn = UiUtil.GetJsonPath(aFieldFqn, 'File Name');
	var fileNameId = UiUtil.GenElementId(undefined, fileNameFqn, undefined, aFormId);

	var fileName = UiUtil.GetValueByFieldName(aJsonData, 'File Name');
	var result = UiUtil.CreateUploadWidget(aDisplayLabel, base64Fqn, fileNameId, fileName, aFormId);

	return result;
};
UiUtil.CreateUploadWidget = function(aDisplayLabel, aFieldFqn, aFileNameId, aFileName, aFormId) {
	var elementId = UiUtil.GenElementId(undefined, aFieldFqn, undefined, aFormId);
	var inputUpload = document.createElement('input');
	inputUpload.setAttribute("id", elementId);
	inputUpload.setAttribute('type', 'file');
	inputUpload.setAttribute('size', '30');
	inputUpload.style.display = 'block';
	inputUpload.style.visibility= 'hidden';
//inputUpload.style.height = '5px'; // for safari, but effect chrome
	var displayLabel = aDisplayLabel + "<span style='font-size: 11px; font-weight: 100; margin-left: 5px'>Max size 2MB</span>";
	var result = UiUtil.CreateTextFieldWithLabel(displayLabel, inputUpload);

	//inputUpload.filename = aFileName; // don't work, browser do not allow 
	var lbUpload = document.createElement('label');
	lbUpload.style.textDecoration = "none"; // we don't use browser type=file, too many security restrictions
	lbUpload.style.backgroundColor = "#EEEEEE";
	lbUpload.style.padding = "2px 6px 2px 6px";
	lbUpload.style.borderRadius = "2px";
	lbUpload.style.border = "1px solid black";
	lbUpload.setAttribute("for", elementId);
	lbUpload.innerText = "Choose File";
	result.appendChild(lbUpload);

	var lbFileName = document.createElement('label');
	if (UiUtil.NotUndefineNotNullNotBlank(aFileNameId)) {
		lbFileName.setAttribute("id", aFileNameId);
	} else {
		lbFileName.setAttribute("id", elementId + '_FileName');
	}
	lbFileName.style.marginLeft= "8px";
	result.appendChild(lbFileName);

	inputUpload.setAttribute('onchange', 'UiUtil.OnUploadChangeValue(' 
	+ '"' + inputUpload.id + '"' 
	+ ', ' + '"' + lbFileName.id + '"' 
	+ ')');

	if (UiUtil.NotUndefineNotNullNotBlank(aFileName)) {
		lbFileName.innerText = UiUtil.Trim2Len(aFileName, 32);
		UiUtil.AddIconTrashForUpload(inputUpload, lbFileName);
		UiUtil.AddIconViewForUpload(inputUpload, lbFileName);
	}

	return result;
};
UiUtil.GetRfc822Tz = function() {
	return new Date().toString().match(/[+-][0-9]{2}[0-9]{2}\b/).pop();
};
UiUtil.FilePathToUrl = function(path) {
	path = path.replaceAll('\\', '/');
	path = path.replaceAll(' ', '%20');
	var drive = /(.)\:\//;
	return path.replace(drive, 'file:///$1:/');
};
UiUtil.ToBase64 = function(aInputFileTypeId, aOnCompleteConvert, aOnError) {
	const reader = new FileReader();
	const file = document.querySelector('#' + aInputFileTypeId).files[0];
	if (UiUtil.NotUndefineNotNullNotBlank(file)) {
		reader.readAsDataURL(file);
		if (UiUtil.NotUndefineNotNullNotBlank(aOnCompleteConvert)) {
			reader.onload = () => aOnCompleteConvert(reader.result);
		}
		if (UiUtil.NotUndefineNotNullNotBlank(aOnError)) {
			reader.onerror = error => aOnError(error);
		}
	} else {
		if (UiUtil.NotUndefineNotNullNotBlank(aOnCompleteConvert)) {
			aOnCompleteConvert('');
		}
	}
};
UiUtil.HidePdfViewer = function(aMyselfId) {
	var pdfViewerElement = document.getElementById(aMyselfId);
	pdfViewerElement.style.display = 'none';
	var parent = UiUtil.FindNearestElementByClass(pdfViewerElement, 'swal2-popup');
	parent.style.display = 'flex';
};
UiUtil.OnViewUpload = function(aInputUploadId, aFileNameId) {
	var inputUploadElement = document.getElementById(aInputUploadId);
	var swalDialog = UiUtil.FindNearestElementByClass(inputUploadElement, 'swal2-popup');
	var canvasElement = UiUtil.FindNearestElementByTag(inputUploadElement, 'canvas');

	var fileName = '';
	var fileNameElem = document.getElementById(aFileNameId);
	if (UiUtil.NotUndefineNotNullNotBlank(aFileNameId)) {
		fileName = fileNameElem.innerText;
	}

	UiUtil.ToBase64(aInputUploadId, function(attachmentInBase64) {
		var base64Value;
		if (UiUtil.NotUndefineNotNullNotBlank(attachmentInBase64)) {
			base64Value = attachmentInBase64;
		} else {
			base64Value = UiUtil.AttachmentFromJson();
		}
		if (UiUtil.NotUndefineNotNullNotBlank(base64Value)) {
			var noHeaderPosition = 'data:application/pdf;base64,'.length;
			var base64NoHeader = base64Value.substr(noHeaderPosition);
			if (swalDialog === null && UiUtil.NotUndefineNotNullNotBlank(base64NoHeader)) {
				UiUtil.DisplayPdf(base64NoHeader, '<div style="font-size: small">' + fileName + '</div>');
			} else {
				if (canvasElement !== null) {
					swalDialog.parentElement.removeChild(canvasElement.parentElement);
				}
				var pdfRandom = UiUtil.GetRandom5();
				var pdfParentId = 'canvas-parent' + pdfRandom;
				var pdfChildId = 'canvas-child' + pdfRandom;
				var pdfParentElement = document.createElement("div");

				pdfParentElement.id = pdfParentId;
				pdfParentElement.onclick = function() { UiUtil.HidePdfViewer(pdfParentId) };
				pdfParentElement.style.position = 'absolute';
				pdfParentElement.style.top = '42%';
				pdfParentElement.style.left = '50%';
				pdfParentElement.style.transform = 'translate(-50%, -50%)';
				pdfParentElement.style.height = '99vh';
				pdfParentElement.style.display = 'flex';
				pdfParentElement.style.justifyContent = 'center';
				pdfParentElement.style.alignItems = 'center';

				pdfParentElement.innerHTML = "<canvas id='" + pdfChildId + "'></canvas>";
				swalDialog.parentElement.appendChild(pdfParentElement);
				UiUtil.CreatePdfElement(base64NoHeader, pdfChildId);
				swalDialog.style.display = 'none';
				pdfParentElement.style.display = 'block';
			}
		} else {
			UiUtil.DialogError('Error', 'Fail to get the the attachment value');
		}
	}, function() {
		UiUtil.DialogError('Error', 'Fail to determine the size of the attachment');
	});
};
UiUtil.AddIconViewForUpload = function(aElemInputUpload, aElemFileName) {
	var aElemFileNameViewId = aElemFileName.id + '_View';
	var elementView = document.getElementById(aElemFileNameViewId);
	if (UiUtil.IsUndefineOrNullOrBlank(elementView)) {
		if (UiUtil.NotUndefineNotNullNotBlank(aElemFileName.innerText)) {
			var iView= document.createElement('i');
			iView.setAttribute('id', aElemFileNameViewId);
			iView.setAttribute('class', 'icons icon-eye');
			iView.setAttribute('onclick', 'UiUtil.OnViewUpload(' 
			+ '"' + aElemInputUpload.id + '"' 
			+ ', ' + '"' + aElemFileName.id + '"' 
			+ ')');
			iView.style.marginLeft = '5px';
			UiUtil.InsertAfter(iView, aElemFileName);
		}
	} else {
		var aElemFileNameView = document.getElementById(aElemFileNameViewId);
		if (UiUtil.NotUndefineNotNullNotBlank(aElemFileNameView)) {
			aElemFileNameView.style.visibility = 'visible';
			aElemFileNameView.style.height = 'auto';
		}
	}
};
UiUtil.CreatePdfElement = function(aThePdf, aCanvasId) {
	var pdfData = atob(aThePdf);
	/*
	var pdfData = atob(
	'JVBERi0xLjcKCjEgMCBvYmogICUgZW50cnkgcG9pbnQKPDwKICAvVHlwZSAvQ2F0YWxvZwog' +
	'IC9QYWdlcyAyIDAgUgo+PgplbmRvYmoKCjIgMCBvYmoKPDwKICAvVHlwZSAvUGFnZXMKICAv' +
	'TWVkaWFCb3ggWyAwIDAgMjAwIDIwMCBdCiAgL0NvdW50IDEKICAvS2lkcyBbIDMgMCBSIF0K' +
	'Pj4KZW5kb2JqCgozIDAgb2JqCjw8CiAgL1R5cGUgL1BhZ2UKICAvUGFyZW50IDIgMCBSCiAg' +
	'L1Jlc291cmNlcyA8PAogICAgL0ZvbnQgPDwKICAgICAgL0YxIDQgMCBSIAogICAgPj4KICA+' +
	'PgogIC9Db250ZW50cyA1IDAgUgo+PgplbmRvYmoKCjQgMCBvYmoKPDwKICAvVHlwZSAvRm9u' +
	'dAogIC9TdWJ0eXBlIC9UeXBlMQogIC9CYXNlRm9udCAvVGltZXMtUm9tYW4KPj4KZW5kb2Jq' +
	'Cgo1IDAgb2JqICAlIHBhZ2UgY29udGVudAo8PAogIC9MZW5ndGggNDQKPj4Kc3RyZWFtCkJU' +
	'CjcwIDUwIFRECi9GMSAxMiBUZgooSGVsbG8sIHdvcmxkISkgVGoKRVQKZW5kc3RyZWFtCmVu' +
	'ZG9iagoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDEwIDAwMDAwIG4g' +
	'CjAwMDAwMDAwNzkgMDAwMDAgbiAKMDAwMDAwMDE3MyAwMDAwMCBuIAowMDAwMDAwMzAxIDAw' +
	'MDAwIG4gCjAwMDAwMDAzODAgMDAwMDAgbiAKdHJhaWxlcgo8PAogIC9TaXplIDYKICAvUm9v' +
	'dCAxIDAgUgo+PgpzdGFydHhyZWYKNDkyCiUlRU9G');
	*/

	// Loaded via <script> tag, create shortcut to access PDF.js exports.
	var pdfjsLib = window['pdfjs-dist/build/pdf'];

	// The workerSrc property shall be specified.
	pdfjsLib.GlobalWorkerOptions.workerSrc = 'lib/pdf.js/pdf.worker.js';

	// create a container div to hold all pages
	var container = document.createElement('div');
	container.style.overflow = 'auto';
	document.getElementById(aCanvasId).parentNode.appendChild(container);

	var loadingTask = pdfjsLib.getDocument({data: pdfData});
	loadingTask.promise.then(function(pdf) {
		var numPages = pdf.numPages;
		for(var pageNumber = 1; pageNumber <= numPages; pageNumber++) {
			var canvasElement = document.createElement('canvas');
			canvasElement.id = aCanvasId + '-page-' + pageNumber;
			canvasElement.style.display = 'block';
			canvasElement.style.marginBottom = '20px';
			container.appendChild(canvasElement);
			
			pdf.getPage(pageNumber).then(function(page) {
				var scale = 1.5;
				var viewport = page.getViewport({scale: scale});
				
				var currentCanvas = document.getElementById(aCanvasId + '-page-' + page.pageNumber);
				var context = currentCanvas.getContext('2d');
				
				currentCanvas.height = viewport.height;
				currentCanvas.width = viewport.width;
				
				var renderContext = {
					canvasContext: context,
					viewport: viewport
				};
				
				var renderTask = page.render(renderContext);
				renderTask.promise.then(function () {
					console.log('Page ' + page.pageNumber + ' rendered');
				}).catch(function (error) {
					console.error('Error rendering page ' + page.pageNumber + ':', error);
				});
			}).catch(function(error) {
				console.error('Error getting page ' + pageNumber + ':', error);
			});
		}
	}).catch(function (reason) {
		UiUtil.DialogError(reason.name, reason.message);
	});
};
UiUtil.DisplayPdf = function(aThePdf, aTheTitle) {
	var pdfData = atob(aThePdf);

	// Loaded via <script> tag, create shortcut to access PDF.js exports.
	var pdfjsLib = window['pdfjs-dist/build/pdf'];

	// The workerSrc property shall be specified.
	pdfjsLib.GlobalWorkerOptions.workerSrc = 'lib/pdf.js/pdf.worker.js';

	// Using DocumentInitParameters object to load binary data.
	var loadingTask = pdfjsLib.getDocument({data: pdfData});
	loadingTask.promise.then(function(pdf) {
		// Fetch the first page
		var pageNumber = 1;
		pdf.getPage(pageNumber).then(function(page) {
			var scale = 1.5;
			var viewport = page.getViewport({scale: scale});

			// Prepare canvas using PDF page dimensions
			var theCanvasId = 'the-canvas-' + UiUtil.GetRandom5();
			UiUtil.DialogNoIconPdf(aTheTitle, "<canvas id='" + theCanvasId + "' onclick='swal.close();'></canvas>", function() {});
			var canvas = document.getElementById(theCanvasId);
			var context = canvas.getContext('2d');
			canvas.height = viewport.height;
			canvas.width = viewport.width;

			// Render PDF page into canvas context
			var renderContext = {
				canvasContext: context,
				viewport: viewport
			};
			var renderTask = page.render(renderContext);
			renderTask.promise.then(function () {
			});
		});
	}, function (reason) {
		UiUtil.DialogError(reason.name, reason.message);
	});
};
UiUtil.FilterMsgDisplay = function(aMsg) {
	if (UiUtil.NotUndefineNotNull(aMsg)) {
		var msgPlace = document.getElementById('filterMsg');
		if (UiUtil.NotUndefineNotNull(msgPlace)) {
			msgPlace.innerText = aMsg;
		}
	}
};
UiUtil.CreateOption = function(aSelectElement, aValue) {
	var theOption = document.createElement('option');
	theOption.text = aValue;
	theOption.value = aValue;
	aSelectElement.add(theOption);
};
UiUtil.CheckAttachmentSize = function(aJsonObject, aCompletedValidationFunc, aAttachmentBase64Name, aRequestParam, aAttachmentFileName, aFormId) {
	var validationResult = "";
	//var attachmentFileName = UiUtil.GetValueByFieldName(aJsonObject, 'Attachment.File Name');
	var attachmentFileName = UiUtil.GetValueByFieldName(aJsonObject, aAttachmentFileName);
	var attachmentInputId = UiUtil.GenElementId(undefined, aAttachmentBase64Name, undefined, aFormId);
	var elemInputUpload = document.getElementById(attachmentInputId);
	if (UiUtil.NotUndefineNotNullNotBlank(elemInputUpload.edited)) {
		UiUtil.ToBase64(attachmentInputId, function(attachmentInBase64) {
			aRequestParam.attachment = attachmentInBase64; // all request param + attachment, then check it's size
			const size = new TextEncoder().encode(JSON.stringify(aRequestParam)).length;
			if (size > UiUtil.MAX_UPLOAD_SIZE) {
				validationResult = "The attachment is too large, maximum size is 2MB!";
				//var attachmentFileNameId = 'wt_AttachmentdotFile_Name';
				var attachmentFileNameId = UiUtil.GenElementId(undefined, aAttachmentFileName, undefined, aFormId);
				var elemFileName = document.getElementById(attachmentFileNameId);
				if (UiUtil.IsUndefineOrNullOrBlank(attachmentFileName)) {
					UiUtil.OnRemoveUpload(attachmentInputId, attachmentFileNameId, false);
				} else {
					elemFileName.innerText = attachmentFileName; // since invalid attachment, revert back it's name to the original one
					elemInputUpload.value = '';
				}
				delete elemInputUpload.edited; // treat upload like its not edited
			}
			if (UiUtil.NotUndefineNotNullNotBlank(aCompletedValidationFunc)) {
				aCompletedValidationFunc(validationResult);
			}
		}, function() {
			if (UiUtil.NotUndefineNotNullNotBlank(aCompletedValidationFunc)) {
				aCompletedValidationFunc(validationResult);
			}
			UiUtil.DialogError('Error', 'Fail to determine the size of the attachment');
		});
	} else {
		if (UiUtil.NotUndefineNotNullNotBlank(aCompletedValidationFunc)) {
			aCompletedValidationFunc(validationResult);
		}
	}
};
UiUtil.DialogWithCustomBody = function(aOption) {
	var aTitle = aOption.title;
	var aOkButtonText = aOption.okButtonText;
	var aCancelButtonText = aOption.cancelButtonText;
	var aOnValidate = aOption.onValidate; // if you want validation, make sure you provide the callback in the validation function
	var aOnOk = aOption.onOk;
	var aOnCancel = aOption.onCancel; 
	var aOnFailValidation = aOption.onFailValidation;
	var aBodyName = aOption.divBodyName;
	var aCreateBody = aOption.createBody;
	var aJsonObject = aOption.jsonObject;
	var aCloneObject = aOption.cloneObject;
	var aMoreFormatting = aOption.moreFormatting;

	if (!aCloneObject) { // will not clone for recursive calls
		aCloneObject = JSON.parse(JSON.stringify(aJsonObject));
		aOption.cloneObject = aCloneObject;
	}

	var divWithPeriod = document.createElement('div');
	divWithPeriod.setAttribute('id', aBodyName);
	divWithPeriod.setAttribute('style', 'text-align:left;margin-top:15px');
	var bodyContent = divWithPeriod;

	var jsFunc = function() {
		document.querySelector('.swal2-container h2').style.margin = '0'; 
		document.querySelector('.swal2-popup').style.padding = '2.5em';
		document.querySelector('.swal2-popup').style.paddingLeft = '1em';
		document.querySelector('.swal2-popup').style.paddingRight = '1em';
		if (UiUtil.NotUndefineNotNullNotBlank(aMoreFormatting)) {
			aMoreFormatting();
		}
		if (UiUtil.NotUndefineNotNullNotBlank(aCreateBody)) {
			aCreateBody(aOption.cloneObject);
		}
	};

	UiUtil.DialogTwoButton(aTitle, bodyContent, undefined, function() 
		{
			UiUtil.PopulateJsonFromDialog(aBodyName, aOption.cloneObject, function() { // callback, populate without the attachment, if invalid, it'll retain user input data
				if (UiUtil.GotErrorFieldShown(aBodyName)) {
					const failMsg = "Cannot proceed until all field error is corrected!";
					UiUtil.DialogError("Error", failMsg, function() {
						UiUtil.DialogWithCustomBody(aOption);
					});
				} else {
					if (UiUtil.NotUndefineNotNullNotBlank(aOnValidate)) {
						aOnValidate(aOption.cloneObject, function(aFailMsg) {
							if (UiUtil.NotUndefineNotNullNotBlank(aFailMsg)) {
								if (UiUtil.NotUndefineNotNullNotBlank(aOnFailValidation)) {
									aOnFailValidation();
								}
								//UiUtil.PopulateJsonFromDialog(aBodyName, aJsonObject); // no callback, populate without the attachment, if invalid, it'll retain user input data
								UiUtil.RemoveDialogNicEdit();
								UiUtil.DialogError("Error", aFailMsg, function() {
									UiUtil.DialogWithCustomBody(aOption);
								});
							} else {
								UiUtil.RemoveDialogNicEdit();
								if (UiUtil.NotUndefineNotNullNotBlank(aOnOk)) {
										aOnOk(aOption.cloneObject, function(aFailMsg) {
											if (UiUtil.NotUndefineNotNullNotBlank(aFailMsg)) {
												UiUtil.RemoveDialogNicEdit();
												UiUtil.DialogError("Error", aFailMsg, function() {
													UiUtil.DialogWithCustomBody(aOption);
												});
											} else {
												UiUtil.RemoveDialogNicEdit();
												UiUtil.DialogWithCustomBody(aOption);
											}
										});
								}
							}
						});
					} else {
						UiUtil.RemoveDialogNicEdit();
						if (UiUtil.NotUndefineNotNullNotBlank(aOnOk)) {
								aOnOk(aOption.cloneObject, function(aFailMsg) {
									if (UiUtil.NotUndefineNotNullNotBlank(aFailMsg)) {
										UiUtil.RemoveDialogNicEdit();
										UiUtil.DialogError("Error", aFailMsg, function() {
											UiUtil.DialogWithCustomBody(aOption);
										});
									} else {
										UiUtil.RemoveDialogNicEdit();
										UiUtil.DialogWithCustomBody(aOption);
									}
								});
						}
					}
				}
			}); 
		}
		, function() {
			UiUtil.RemoveDialogNicEdit();
			if (UiUtil.NotUndefineNotNullNotBlank(aOnCancel))
				aOnCancel();
		}
		, jsFunc
		, aOkButtonText
		, aCancelButtonText
	);
	$(".swal2-container h2").css("margin-bottom", "0px");
};
UiUtil.PopupCalendarPeriodOkOnly = function(aOption) {
	var aTitle = aOption.title;
	var aContent = aOption.content;
	var aOnDateSelected = aOption.onDateSelected;

	var jsFunc = function() {
		document.querySelector('.swal2-container h2').style.margin = '0'; 
		document.querySelector('.swal2-popup').style.padding = '2.5em';
	};

	UiUtil.DialogOk("question", aTitle, aContent, function() {
		var newDateFrom = UiUtil.DisplayDateToDate(UiUtil.GetStrDateFrom());
		var newDateEnd = UiUtil.DisplayDateToDate(UiUtil.GetStrDateEnd());
		if (newDateFrom > newDateEnd) {
			UiUtil.DialogError("Error", "'Start or To' date must be later then 'End or From' date!", function() {
				UiUtil.PopupCalendarPeriod(aOption);
			});
		} else {
			if (UiUtil.NotUndefineNotNullNotBlank(aOnDateSelected))
				aOnDateSelected(newDateFrom, newDateEnd);
		}
	});
};
UiUtil.FindNearestElementByClass = function(startElement, className) { // check if can be remove and use FindNearetElementWithClass
	if (startElement.classList.contains(className)) {
		return startElement;
	}

	let parent = startElement.closest(`.${className}`);
	let child = startElement.querySelector(`.${className}`);
	let siblings = Array.from(startElement.parentElement?.children || []);
	let sibling = siblings
		.filter(el => el !== startElement)
		.find(el => {
			return el.classList.contains(className) || 
					 el.querySelector(`.${className}`);
		});

	let found = [parent, child, sibling].filter(Boolean);
	if (found.length === 0) {
		return null;
	}
	return found.reduce((nearest, current) => {
		if (!nearest) return current;
		
		let nearestRect = nearest.getBoundingClientRect();
		let currentRect = current.getBoundingClientRect();
		let startRect = startElement.getBoundingClientRect();
		
		let nearestDistance = Math.hypot(
			nearestRect.left - startRect.left,
			nearestRect.top - startRect.top
		);
		let currentDistance = Math.hypot(
			currentRect.left - startRect.left,
			currentRect.top - startRect.top
		);
		
		return currentDistance < nearestDistance ? current : nearest;
	});
};
UiUtil.FindNearestElementByTag = function(startElement, tagName) {
	tagName = tagName.toLowerCase();
	if (startElement.tagName.toLowerCase() === tagName) {
		return startElement;
	}
	const canvases = document.getElementsByTagName(tagName);
	if (!canvases.length) return null;
	const startRect = startElement.getBoundingClientRect();
	return Array.from(canvases).reduce((nearest, current) => {
		if (!nearest) return current;
		
		const currentRect = current.getBoundingClientRect();
		const nearestRect = nearest.getBoundingClientRect();
		
		const currentDistance = Math.hypot(
			currentRect.left - startRect.left,
			currentRect.top - startRect.top
		);
		const nearestDistance = Math.hypot(
			nearestRect.left - startRect.left,
			nearestRect.top - startRect.top
		);
		
		return currentDistance < nearestDistance ? current : nearest;
	});
};
UiUtil.DialogNoIconPdf = function(titleHtml, msgHtml, jsAction) {
	UiUtil.DialogPdf("", titleHtml, msgHtml, jsAction);
};
UiUtil.DialogPdf = function(strIcon, titleHtml, msgHtml, jsAction) {
	if (UiUtil.IsUndefineOrNullOrBlank(titleHtml)) {
		titleHtml = "Error";
	}
	if (UiUtil.IsUndefineOrNullOrBlank(msgHtml)) {
		//msgHtml = "Let us know what filter is needed at: <a href='mailto:stems.my@shujutech.biz?Subject='Dialog%20Error,%20No%20Title%20And%20Msg'>stems.my@shujutech.biz</a>";
		msgHtml = "Contact us for support at: <a href='mailto:stems.my@shujutech.biz?Subject='Dialog%20Error,%20No%20Title%20And%20Msg'>stems.my@shujutech.biz</a>";
	}

	msgHtml = UiUtil.DialogStr2Html(msgHtml);
	swal({
		title: titleHtml
		, html: msgHtml
		, type: strIcon
		, showConfirmButton: false 
		, showCancelButton: false 
		, cancelButtonText: ''
		, focusConfirm: true
		, allowOutsideClick: false
	}).then((value) => {
		if (UiUtil.NotUndefineNotNullNotBlank(jsAction)) {
			jsAction();
		}
	});
};
UiUtil.RemoveMasterField = function(aMasterObj, aFieldName2Remove) {
	delete aMasterObj.data[aFieldName2Remove];
};
UiUtil.RemoveFqnField = function(aMasterObj, aFqnParentField, aFieldName) {
	var parentVar = UiUtil.GetVarByFieldName(aMasterObj, aFqnParentField);
	delete parentVar.data[aFieldName];
};
UiUtil.FqnNotUndefineNotNullNotBlank = function(aObj, aFqnPath) {
	const propertyChain = aFqnPath.split('.');
	let currentObject = aObj;
	for (var property of propertyChain) {
		if (/\[\d+\]/.test(property)) {
			const noBracket = property.replace(/\[.*?\]/g, '');
			const testArray = currentObject?.[noBracket];
			if (Array.isArray(testArray)) {
				property = noBracket;
			} else {
				console.log("The property: " + property + ", is not array type")
				return false;
			}
		} 
		currentObject = currentObject?.[property];
		if (UiUtil.IsUndefineOrNullOrBlank(currentObject)) {
			return false;  
		}
	}
	return true;
};
UiUtil.IsValueInCsv = function(aCsv, aEach) {
	if (typeof aCsv !== 'string' || typeof aEach !== 'string') {
		return false;
	}
	const csvValues = aCsv.split(',').map(value => value.trim());
	return csvValues.includes(aEach.trim());
};
UiUtil.AppendNote = function(divNote, number, note) {
	const idNoteMsg = document.getElementById(divNote);
	if (idNoteMsg.hasChildNodes()) {
		const newChild = document.createElement('div');
		newChild.style.clear = 'both';
		newChild.style.float = 'left';
		newChild.style.marginTop = '5px';
		newChild.innerHTML = `<span class="bulletnum">${number}. </span><span>${note}</span>`;
		idNoteMsg.appendChild(newChild);
	} else {
		const newChild = document.createElement('div');
		newChild.style.clear = 'both';
		newChild.style.float = 'left';
		newChild.style.marginTop = '10px';
		newChild.innerHTML = `<span class="bulletnum">${number}. </span><span>${note}</span>`;
		idNoteMsg.appendChild(newChild);
	}
};
UiUtil.XhrHttpJsonJsonNoDialogError = function(aWaitMsg, aApiUrl, aJsonData, aSuccessCallback, aErrorCallback, aFinalCallback) {
	UiUtil.XhrHttpJson(aWaitMsg, aApiUrl, "application/json", aJsonData, false, true, aSuccessCallback, aErrorCallback, aFinalCallback);
};
UiUtil.XhrHttpJsonJson = function(aWaitMsg, aApiUrl, aJsonData, aSuccessCallback, aErrorCallback, aFinalCallback) {
	UiUtil.XhrHttpJson(aWaitMsg, aApiUrl, "application/json", aJsonData, true, true, aSuccessCallback, aErrorCallback, aFinalCallback);
};
UiUtil.XhrHttpJsonHtml = function(aWaitMsg, aApiUrl, aJsonData, aSuccessCallback, aErrorCallback, aFinalCallback) {
	UiUtil.XhrHttpJson(aWaitMsg, aApiUrl, "text/html", aJsonData, true, true, aSuccessCallback, aErrorCallback, aFinalCallback);
};
UiUtil.XhrHttpSilent = function(aWaitMsg, aApiUrl, aJsonData, aSuccessCallback, aErrorCallback, aFinalCallback) {
	UiUtil.XhrHttpJson(aWaitMsg, aApiUrl, "application/json", aJsonData, true, false, aSuccessCallback, aErrorCallback, aFinalCallback);
};
UiUtil.XhrHttpJsonBase64 = function(aWaitMsg, aApiUrl, aJsonData, aSuccessCallback, aErrorCallback, aFinalCallback) {
	UiUtil.XhrHttpJson(aWaitMsg, aApiUrl, "text/plain", aJsonData, true, true, aSuccessCallback, aErrorCallback, aFinalCallback);
};
UiUtil.XhrHttpJson = function(aWaitMsg, aApiUrl, aReplyType, aJsonData, aUseDialogError, aShowDialog, aSuccessCallback, aErrorCallback, aFinalCallback) {
	if (aShowDialog) UiUtil.DialogWaitStart(aWaitMsg);
	const contextPath = UiUtil.GetContextPath();
	const apiPath = "/" + contextPath + "/" + aApiUrl;
	const apiUrl = UiUtil.NormalizeUrlPath(window.location.origin + "/" + apiPath);

	const xhr = new XMLHttpRequest();
	xhr.open('POST', apiUrl, true); // true for asynchronous request
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.setRequestHeader('Accept', aReplyType);
	xhr.onload = function() {
		if (xhr.status >= 200 && xhr.status < 300) { // success!
			try {
				if (UiUtil.NotUndefineNotNullNotBlank(xhr.responseText)) {
					var responseData = undefined;
					if (aReplyType === "application/json") {  // handle each different reply type
						responseData = JSON.parse(xhr.responseText); 
					} else if (aReplyType === "text/plain") {
						var respond = xhr.responseText; 
						var fileName = UiUtil.GetFileName(respond, "success", xhr); 
						var contentType = xhr.getResponseHeader("content-type") || "";
						var link; 
						if (contentType.indexOf("zip") !== -1) {
							link = "data:application/zip;base64," + respond;
						} else {
							link = "data:application/octet-stream;base64," + respond;
						}
						if (UiUtil.NotUndefineNotNullNotBlank(fileName)) {
							var aref = document.createElement("a");
							document.body.appendChild(aref);
							aref.style = "display: none";
							aref.href = link;
							aref.download = fileName;
							aref.click();
							window.URL.revokeObjectURL(link);
						} else {
							window.location = link;
						}
					} else { // no reply type
						responseData = xhr.responseText; 
					}
				} else {
					// do nothing if xhr.responseText contain nothing
				}

				if (aShowDialog) UiUtil.DialogWaitStop();
				if (aSuccessCallback) aSuccessCallback(responseData);
			} catch (error) { // Handle JSON parsing errors
				if (UiUtil.HandleHtmlResponse(xhr, error) == false) {
					console.error("Error parsing JSON response:", error);
					xhr.onerror = function() {};
					if (aShowDialog) UiUtil.DialogAndBlinkError(aUseDialogError, { status: 500, responseText: 'Fail to JSON parse the response' }, aErrorCallback, aFinalCallback);
				}
			}
		} else { // error!
			console.error("Request failed with status:", xhr.status);
			if (aShowDialog) UiUtil.DialogAndBlinkError(aUseDialogError, xhr, aErrorCallback, aFinalCallback);
		}
	};

	xhr.onerror = function() { // Network errors, CORS issues, etc.
		console.error("Network error occurred.");
		if (aShowDialog) UiUtil.DialogAndBlinkError(aUseDialogError, xhr, aErrorCallback, aFinalCallback);
	};

	xhr.send(JSON.stringify(aJsonData)); // Convert the JSON object to a string.
};
UiUtil.XhrHttpJsonBlob = function(aWaitMsg, aApiUrl, aJsonData, aSuccessCallback, aErrorCallback, aFinalCallback) {
	UiUtil.DialogWaitStart(aWaitMsg);
	const contextPath = UiUtil.GetContextPath();
	const apiPath = "/" + contextPath + "/" + aApiUrl;
	const apiUrl = UiUtil.NormalizeUrlPath(window.location.origin + "/" + apiPath);
	const xhr = new XMLHttpRequest();

	xhr.open('POST', apiUrl, true); 
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.responseType = 'blob';
	xhr.onload = function() {
		if (xhr.status === 200) {
			const blob = xhr.response;
			const downloadUrl = window.URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = downloadUrl;
			const contentDisposition = xhr.getResponseHeader('Content-Disposition');
			let filename = 'downloaded-file.bin';
			if (contentDisposition) {
				const match = contentDisposition.match(/filename="?([^"]+)"?/);
				if (match && match[1]) {
					filename = match[1];
				}
			}
			
			link.download = filename;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			window.URL.revokeObjectURL(downloadUrl);
			if (aSuccessCallback) {
				aSuccessCallback();
			} else {
				UiUtil.DialogWaitStop();
			}
		} else {
			const xhrCustom  = { status: 500, responseText: "Fail to perform HTTP stream operation!" };
			if (xhr.getResponseHeader('Content-Type')?.includes('application/json')) {
				const errorBlob = xhr.response;
				const reader = new FileReader();
				reader.onload = function() {
					xhrCustom.status = 400;
					xhrCustom.responseText = JSON.parse(reader.result);
					UiUtil.DialogAndBlinkError(true, xhrCustom, aErrorCallback, aFinalCallback);
				};
				reader.readAsText(errorBlob);
			} else if (xhr.getResponseHeader('Content-Type')?.includes('application/octet-stream')) {
				const errorBlob = xhr.response;
				const reader = new FileReader();
				reader.onload = function() {
					xhrCustom.status = 400;
					xhrCustom.responseText = reader.result;
					UiUtil.DialogAndBlinkError(true, xhrCustom, aErrorCallback, aFinalCallback);
				};
				reader.readAsText(errorBlob);
			}
		}
	};
	xhr.onerror = function() {
		console.error('Request failed');
		UiUtil.DialogAndBlinkError(aUseDialogError, { status: 500, responseText: "Request failed"}, aErrorCallback, aFinalCallback);
	};
	xhr.send(JSON.stringify(aJsonData));
};
UiUtil.DialogAndBlinkError = function(aUseDialogError, aXhr, aFailFunc, aFinalFunc) {
	if (aUseDialogError) {
		var afterAck = function(respond) {
			if (aFailFunc) {
				aFailFunc(aXhr);
			}
			if (aFinalFunc) {
				aFinalFunc(aXhr);
			}
			UiUtil.DialogWaitStop();
		};
		const reportTo = ", please report to <a href='mailto:stems.my@shujutech.biz'>stems.my@shujutech.biz</a>";
		//const responseText = aXhr.status === 400 ? "Bad Request: " + aXhr.responseText : aXhr.status === 500 ? "Server Error: " + aXhr.responseText + reportTo : aXhr.responseText.trim() !== '' ? aXhr.responseText + reportTo : 'An internal error occurred' + reportTo;
		const responseText = aXhr.status === 400 ? "" + aXhr.responseText : aXhr.status === 500 ? "Server Error: " + aXhr.responseText + reportTo : aXhr.responseText.trim() !== '' ? aXhr.responseText + reportTo : 'An internal error occurred' + reportTo;
		UiUtil.DisplayMsg('error', responseText);
		UiUtil.DialogError("Error", responseText, afterAck);	
	} else {
		UiUtil.DialogWaitStop();
		if (aFailFunc) {
			aFailFunc(aXhr);
		}
		if (aFinalFunc) {
			aFinalFunc(aXhr);
		}
	}
};
UiUtil.ShowFieldError = function(aFieldElement, aErrorMsg) {
	const errorElement = UiUtil.FindErrorElement(aFieldElement);
	const imgElement = errorElement.img;
	const spanElement = errorElement.span;
	if (imgElement) {
		imgElement.style.display = 'inline-block';
	}
	if (spanElement) {
		spanElement.style.display = 'inline-block';
		spanElement.innerHTML = aErrorMsg;
	}
};
UiUtil.HideFieldError = function(aFieldElement) {
	const errorElement = UiUtil.FindErrorElement(aFieldElement);
	const imgElement = errorElement.img;
	const spanElement = errorElement.span;
	if (imgElement) {
		imgElement.style.display = 'none';
	}
	if (spanElement) {
		spanElement.style.display = 'none';
	}
};
UiUtil.FindErrorElement = function(aFieldElement) {
	if (!aFieldElement || typeof aFieldElement !== 'object' || !(aFieldElement instanceof HTMLElement)) {
		console.error("Invalid divArea element provided.");
		return { imgs: [], spans: [] };
	}
	const imgFound = UiUtil.FindNearestUpElementWithClass(aFieldElement, "st-error-img");
	const spanFound = UiUtil.FindNearestUpElementWithClass(aFieldElement, "st-error-msg");
	return { img: imgFound, span: spanFound  };
};
UiUtil.DisableNicEdit = function(aTheId) {
	var editorInstance = nicEditors.findEditor(aTheId);
	if (editorInstance) {
		var contentEditableElement = editorInstance.elm;
		contentEditableElement.setAttribute('contenteditable', false);
	} else {
		console.error("nicEditor instance not found!");
	}
};
UiUtil.FindNearestUpElementWithClass = function(aElement, aClassName) {
	const FindNearestElementWithClassFromSibling = function(aElement, aClassName) {
		if (aElement) {
			const siblings = aElement.parentElement.children;
			for (let cntr = 0; cntr < siblings.length; cntr++) {
				eachSibling = siblings[cntr];
				if (eachSibling.classList.contains(aClassName)) {
					return eachSibling;
				}
			}
			// not in any sibling, find in every sibling children
			for (let cntr = 0; cntr < siblings.length; cntr++) {
				eachSibling = siblings[cntr];
				return FindNearestElementWithClassFromChildren(eachSibling, aClassName);
			}
		}
		return;
	};

	const FindNearestElementWithClassFromChildren = function(aElement, aClassName) {
		const children = aElement.children;
		for (let cntr = 0; cntr < children.length; cntr++) {
			if (children[cntr].classList.contains(aClassName)) {
				return children[cntr];
			}
		}
		// not in any children, find in each children sibling
		for (let cntr = 0; cntr < children.length; cntr++) {
			return FindNearestElementWithClassFromSibling(children[cntr], aClassName);
		}
	};

	const FindNearestElementWithClassTraverseUp = function(aElement, aClassName) {
		if (aElement.tagName === 'BODY') return;
		let currentElement = aElement.parentElement; // First, traverse up the DOM tree to find the nearest ancestor
		if (currentElement) {
			const foundElement = FindNearestElementWithClassFromSibling(currentElement, aClassName);
			if (foundElement) {
				return foundElement;
			} else {
				return FindNearestElementWithClassTraverseUp(currentElement, aClassName);
			}
		}
	};

	const nearestSibling = FindNearestElementWithClassFromSibling(aElement, aClassName);
	if (nearestSibling) {
		return nearestSibling;
	} else {
		const nearestUp = FindNearestElementWithClassTraverseUp(aElement, aClassName);
		const nearestDown = undefined;
		if (nearestUp && !nearestDown) {
			return nearestUp;
		} 
		if (!nearestUp && nearestDown) {
			return nearestDown;
		} 
		if (nearestUp && nearestDown) {
			if (depthUp <= depthDown) {
				return nearestUp;
			} else {
				return nearestDown;
			}
		}
	}
};
UiUtil.GotErrorFieldShown = function(aDivFieldAreaId) {
	const divArea = document.getElementById(aDivFieldAreaId);
	if (divArea) {
		const allErrorMsgs = divArea.querySelectorAll('.st-error-msg');
		const visibleErrorMsgs = Array.from(allErrorMsgs).filter((element) => {
			const style = window.getComputedStyle(element);
			return style.display !== 'none' && style.visibility !== 'hidden';
		});
		return visibleErrorMsgs.length > 0;
	} else {
		return false;
	}
};
UiUtil.BlankNicIfEmpty = function(aNicId) {
	var editor = nicEditors.findEditor(aNicId);
	if (editor) {
		var content = editor.getContent();
		var plainText = content.replace(/<[^>]*>/g, '').trim();
		if (plainText === '') {
			editor.setContent('');
		}
	}
};
UiUtil.ExtractNumbers = function(str) {
	return str.match(/\d+(\.\d+)?/g) ? str.match(/\d+(\.\d+)?/g).join('') : '';
};
UiUtil.ClearLocalStorageExcept = function(keysToKeep) {
	const keysToRemove = [];
	for (let cntr = 0; cntr < localStorage.length; cntr++) {
		const key = localStorage.key(cntr);
		if (!keysToKeep.includes(key)) {
			keysToRemove.push(key);
		}
	}
	for (const key of keysToRemove) {
		localStorage.removeItem(key);
	}
};
UiUtil.PutTimeAndTimezone2Date = function(aStrDate2PutTime, aTimeWithTimezone) {
	if (UiUtil.NotUndefineNotNullNotBlank(aStrDate2PutTime)) {
		const dateType = UiUtil.DisplayDateToDate(aStrDate2PutTime);
		const result = UiUtil.DateForDisplay(dateType) + " " + aTimeWithTimezone;
		return result;
	} else {
		return null;
	}
};
UiUtil.GetContextPath = function() {
	const pathname = window.location.pathname;
	const parts = pathname.split('/');
	// 跳过第一个空字符串（因为路径以斜杠开头）
	if (parts.length > 2) { // 至少有三个部分：空字符串、上下文路径、其他内容
		return parts[1]; // 返回上下文路径部分
	}
	return ''; // 不存在上下文路径
};
UiUtil.NormalizeUrlPath = function(urlPath) {
	const protocolMatch = urlPath.match(/^[a-z]+:\/\/|^\/\//);
	const protocol = protocolMatch ? protocolMatch[0] : '';
	const pathWithoutProtocol = protocol ? urlPath.slice(protocol.length) : urlPath;
	const normalizedPath = pathWithoutProtocol.replace(/\/{2,}/g, '/');
	return protocol + normalizedPath;
};
UiUtil.GetLastDayOfMonth = function getLastDayOfMonth(aMonth, aYear) {
	const monthNames = {
		jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
		jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11
	};

	const monthLower = aMonth.toLowerCase();
	if (!monthNames.hasOwnProperty(monthLower)) {
		throw new Error('Invalid month abbreviation');
	}

	const monthIndex = monthNames[monthLower];
	const lastDay = new Date(aYear, monthIndex + 1, 0).getDate();
	
	return lastDay;
};
UiUtil.CompareJSONStrings = function(aJsonLeft, aJsonRight) {
	function isNumeric(value) {
		return !isNaN(value) && value !== null && value !== '';
	}
	function compareValues(val1, val2) {
		if (typeof val1 === 'string' && isNumeric(val1)) val1 = Number(val1);
		if (typeof val2 === 'string' && isNumeric(val2)) val2 = Number(val2);
		if (typeof val1 === 'object' && val1 !== null && typeof val2 === 'object' && val2 !== null) {
			return compareObjects(val1, val2);
		}
		return val1 === val2;
	}
	function compareObjects(obj1, obj2) {
		const keys1 = Object.keys(obj1);
		const keys2 = Object.keys(obj2);
		if (keys1.length !== keys2.length) {
			return false;
		}
		for (const key of keys1) {
			if (!obj2.hasOwnProperty(key)) {
				return false;
			}
			if (!compareValues(obj1[key], obj2[key])) { 
				return false;
			}
		}
		return true;
	}
	const objLeft = typeof aJsonLeft === 'string' ? JSON.parse(aJsonLeft) : aJsonLeft;
	const objRight = typeof aJsonRight === 'string' ? JSON.parse(aJsonRight) : aJsonRight;
	const result = compareObjects(objLeft, objRight);
	return result;
};
UiUtil.RenameWidgetLabel = function(aInputId, aNewLabel) {
	const inputEl = document.getElementById(aInputId);
	if (!inputEl) return;
	const fieldContainer = inputEl.closest('.st-eachfield');
	if (!fieldContainer) return;
	const labelEl = fieldContainer.querySelector('.st-label-area label.st-label-txt');
	if (labelEl) {
		labelEl.innerHTML = aNewLabel;
	}
};

