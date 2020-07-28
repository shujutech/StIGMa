var UiUtil; // to suppress NB error fuss

UiGrid.PositionCheckBox = 0;
UiGrid.PositionOid = 1;
UiGrid.PositionClasz = 2;
UiGrid.PositionDesc = 3;

UiGrid.prototype.tblDataOriginal = {};
UiGrid.prototype.tblData2Edit = {};

UiGrid.MsiaSgpConfig = {
	enableSort: false,
	decimal_point: '.',
	thousands_separator: ','
};
UiGrid.GridHeight = 5;
function UiGrid(gridParam) { // the param is pass to EditableGrid, not sure what's is used for
	//alert("The UiGrid is a collection of static functions, it cannot be prototyped!");
	return(new EditableGrid(gridParam));
};
UiGrid.getJsonObj = function(chosenId, aryObj) {
	var result;
	for(var cntr = 0; cntr < aryObj.length; cntr++) {
		var tmp = aryObj[cntr];
		if (tmp.ObjectId === chosenId) {
			result = tmp;
			break;
		}
	}
	return(result);
};
UiGrid.deleteRows = function(rowObjArray) {
	var result;
	for (var i = 0; i < rowObjArray.length; i++) {
		var rIndex = rowObjArray[i].sectionRowIndex;
		result = rowObjArray[i].rowIndex;
		rowObjArray[i].parentNode.deleteRow(rIndex);
	}
	return(result);
};
UiGrid.rowClick = function(myTD, tbl, idxSel){
	$('.rowSelected').removeClass('rowSelected');
	$(myTD).addClass('rowSelected');
	setTimeout(function() {$('#' + tbl.id + ' tr').eq(idxSel).dblclick();} , 1);	
};
UiGrid.selectRow = function(tbl, ridx) {
	var rec = tbl.rows[ridx];
	if (typeof rec !== 'undefined') {
		UiGrid.rowClick(rec, tbl, ridx);
	} else {
		var tidx = ridx - 1;
		rec = tbl.rows[tidx];
		if (tidx > 0) {
			UiGrid.rowClick(rec, tbl, tidx);
		} else {
			//divEditArea.emptyUiForm('editArea');
		}
	}
}; 
UiGrid.sendDeleteRequest = function(aGrid, tbl, aTheUrl, rwi, jsn) {
	return function() {
		var ridx = UiGrid.deleteRows(rwi);
		UiGrid.selectRow(tbl, ridx);
		var requestParam = {jsn: JSON.stringify(jsn)};
		UiUtil.BeAction(requestParam, 'delete', aTheUrl, function(jsonObject) {
			if (UiUtil.NotUndefineNotNull(aGrid.refreshFromBe)) {
				aGrid.refreshFromBe();
			}
		});
	};
}; 
UiGrid.IsRowChecked = function(aGrid, aRowIdx) {
	var result = false;
	if (UiUtil.NotUndefineNotNullNotBlank(aGrid.table)) {
		result = aGrid.table.rows[aRowIdx].cells[UiGrid.PositionCheckBox].getElementsByTagName('input')[0].checked;
	}
	return(result);
};
UiGrid.IsAllRowChecked = function(aGrid) {
	var result = false;
	if (UiUtil.NotUndefineNotNullNotBlank(aGrid.table)) {
		result = aGrid.table.rows[0].cells[UiGrid.PositionCheckBox].getElementsByTagName('input')[0].checked;
	}
	return(result);
};
UiGrid.getAllCheckRow = function(aGrid) {
	var row;
	var result = [];
	for(var cntrRow = 1; row = aGrid.table.rows[cntrRow]; cntrRow++) { 
		var aryInput = row.cells[UiGrid.PositionCheckBox].getElementsByTagName('input');
		if (aryInput.length > 0) {
			if (aryInput[0].checked) {
				result.push(cntrRow);
			}
		}
	}
	return(result);
};
UiGrid.getFirstCheckRow = function(aGrid) {
	var row;
	var idxToEdit;
	for(var cntrRow = 1; row = aGrid.table.rows[cntrRow]; cntrRow++) { 
		var aryInput = row.cells[UiGrid.PositionCheckBox].getElementsByTagName('input');
		if (aryInput.length > 0) {
			if (aryInput[0].checked) {
				idxToEdit = cntrRow;
				break;
			}
		}
	}
	return(idxToEdit);
};
UiGrid.CheckAtRow = function(aGrid, aIdx, aValue) {
	var row;
	row = aGrid.table.rows[aIdx];
	var aryInput = row.cells[UiGrid.PositionCheckBox].getElementsByTagName('input');
	if (aryInput.length > 0) {
		aryInput[0].checked = aValue;
	}
};
UiGrid.CheckAllRow = function(aGrid, aValue) {
	var row;
	for(var cntrRow = 0; row = aGrid.table.rows[cntrRow]; cntrRow++) { 
		var aryInput = row.cells[UiGrid.PositionCheckBox].getElementsByTagName('input');
		if (aryInput.length > 0) {
			aryInput[0].checked = aValue;
		}
	}
};
UiGrid.CheckTotalRow = function(aGrid) {
	var row;
	var cntrChecked = 0;
	for(var cntrRow = 0; row = aGrid.table.rows[cntrRow]; cntrRow++) { 
		var aryInput = row.cells[UiGrid.PositionCheckBox].getElementsByTagName('input');
		if (aryInput.length > 0) {
			if (aryInput[0].checked) {
				cntrChecked++;
			}
		}
	}
	return(cntrChecked);
};
UiGrid.onEdit = function(aGrid) {
	var idxToEdit = UiGrid.getFirstCheckRow(aGrid);
	if (idxToEdit === undefined) {
		UiUtil.DialogError("Error", "There is no record selected, please tick the checkbox at the table first!", UiUtil.DoNothing);
	} else {
		$($(aGrid.table)[0].rows[idxToEdit]).dblclick();
	}
};
UiGrid.onDelete = function(aGrid, aTheUrl, sendDelRq, cancelDelRq) {
	var tbl = aGrid.table;
	var row;
	var jsn = [];
	var rwi = [];
	var desc = '';
	for(var cntrRow = 1; row = tbl.rows[cntrRow]; cntrRow++) { 
		var aryInput = row.cells[UiGrid.PositionCheckBox].getElementsByTagName('input');
		if (aryInput.length > 0) {
			if (aryInput[0].checked) {
				var obj = {};
				obj.Class = $(row.cells[2]).text();
				obj.ObjectId = $(row.cells[1]).text();
				jsn.push(obj);
				rwi.push(row);
				if (desc !== '') desc += ', ';
				desc += row.cells[UiGrid.PositionDesc].innerHTML;
			}
		}
	}
	if (rwi.length > 0) {
		if (desc.length > 30) {
			desc = desc.substr(0, 30) + '...';
		}
		if (sendDelRq === undefined) {
			sendDelRq = UiGrid.sendDeleteRequest(aGrid, tbl, aTheUrl, rwi, jsn);
		} 
		if (cancelDelRq === undefined) {
			cancelDelRq = function() {UiUtil.DoNothing();};
		} 
		var confirmMsg = 'Confirm to delete record of: ' + desc + ', total record to delete: ' + rwi.length + '?';
		UiUtil.DialogOkCancel('Confirmation', confirmMsg, "question", sendDelRq, cancelDelRq);
	} else {
		UiUtil.DialogError("Error", "There is no record selected, please tick the checkbox at the table first!", UiUtil.DoNothing);
	}
}; 
UiGrid.PopulateGrid = function(aGrid, aWantedCol, aGridDiv, aJson, aTableId) {
	var headerMeta = UiGrid.CreateGridHeader(aGrid, aWantedCol);
	var bodyData = UiGrid.CreateGridBody(aJson.dataset, aWantedCol);
	aGrid.load({"metadata":headerMeta, "data":bodyData});
	if (aWantedCol[0].type === 'checkbox') {
		aGrid.setHeaderRenderer(aWantedCol[0].name, new RenderHdrCbx(aGrid));
	}
	aGrid.setCellRenderer(aWantedCol[0].name, new RenderBdyCbx(aGrid));
	for(var cntr = 1; cntr < headerMeta.length; cntr++) {
		if (UiUtil.NotUndefineNotNullNotBlank(aWantedCol[cntr].editable)) {
			aGrid.setCellRenderer(aWantedCol[cntr].name, new RenderEditable(aGrid));
		} else {
			aGrid.setCellRenderer(headerMeta[cntr].name, new CellRenderer({
			render: function(cell, value) { 
				cell.innerHTML = value ? $('<div/>').html(value).text() : ""; }
			})); 
		}

		if (aWantedCol[cntr].type === "html") {
			aGrid.setCellRenderer(aWantedCol[cntr].name, new CellRenderer({
				render: function(cell, value) { 
					cell.innerHTML = value; 
					cell.style.textAlign = "center"; 
				}
			})); 
		}
	}
	aGrid.renderGrid(aGridDiv, "stdGrid", aTableId);
	UiGrid.SetCellId(aGrid, bodyData, aWantedCol);
	//aGrid.tblDataOriginal = jQuery.extend(true, [], aGrid.data);
};
UiGrid.CreateGridHeader = function(aGrid, aWantedCol) {
	var defHeader = [];
	for(var cntr = 0; cntr < aWantedCol.length; cntr++) {
		var defCol = {};
		if (aWantedCol[cntr].type === 'checkbox') {
			defCol.name = aWantedCol[cntr].name;
			defCol.datatype = 'boolean';
			defCol.editable = true;
			defHeader.push(defCol);
		} else {
			var colName = aWantedCol[cntr].label;
			defCol.name = colName;
			defCol.label = colName;
			//defCol.datatype = 'string';
			defCol.datatype = aWantedCol[cntr].type;
			if (UiUtil.NotUndefineNotNullNotBlank(aWantedCol[cntr].editable)) {
				defCol.editable = true;
			} else {
				defCol.editable = false;
			}
			defHeader.push(defCol);
		}
	}
	return(defHeader);
};
UiGrid.CreateGridBody = function(aDataList, aWantedCol) {
	var data = [];
	for(var cntrRow = 0; cntrRow < aDataList.length; cntrRow++) {
		var row = {};
		row.id = cntrRow;
		row.values = {};
		var objRow = aDataList[cntrRow];
		if (UiUtil.NotUndefineNotNull(objRow.delete)) continue;
		for(var cntrCol = 0; cntrCol < aWantedCol.length; cntrCol++) {
			if (aWantedCol[cntrCol].type === 'checkbox') {
				// do nothing
			} else {
				var colName = aWantedCol[cntrCol].label;
				var colPath = aWantedCol[cntrCol].path;
				if (objRow.data !== undefined) {
					var objWanted = UiUtil.GetVarByJsonPath(objRow, colPath);
					if (aWantedCol[cntrCol].funcGetField !== undefined) { // get the custom wanted object if told so
						objWanted = aWantedCol[cntrCol].funcGetField(objRow);
					} 

					if (objWanted !== undefined) {
						var dataFormatted = undefined;
						if (aWantedCol[cntrCol].funcFormat !== undefined) { // format the wanted object if told to
							dataFormatted = aWantedCol[cntrCol].funcFormat(objWanted.data);
						}
						if ((objWanted.data === undefined || jQuery.isEmptyObject(objWanted.data)) && jQuery.isNumeric(objWanted.data) === false) {
							row.values[colName] = '';
						} else {
							if (dataFormatted !== undefined) {
								row.values[colName] = dataFormatted;
							} else {
								row.values[colName] = objWanted.data;
							}
						}
					} else {
						row.values[colName] = '';
					}
				} else {
					UiUtil.DisplayMsg('error', 'There is no field with the name: ' + colPath);
				}
			}
		}
		data.push(row);
	}
	return(data);
};
UiGrid.DefineGridHeader = function(aryResult, aType, aField, aPath, aFuncGetField, aFuncFormat, aEditable) {
	var result = {};
	if (aType.toLowerCase() === 'checkbox') {
		result.name= aField;
		result.type = 'checkbox';
		aryResult.push(result);
	} else {
		result.name = aField;
		result.label = aField;
		result.path = aPath;
		result.type = aType;
		result.funcFormat = aFuncFormat;
		result.funcGetField = aFuncGetField;
		if (UiUtil.NotUndefineNotNullNotBlank(aEditable)) {
			result.editable = true;
		}
		aryResult.push(result);
	}
	return(result);
};
UiGrid.SetCellId = function(aEditable, aBodyData, aWantedCol) {
	var cellRow;
	var cellCol;
	var cellPath;
	var tableName = aEditable.table.id.substring(3);
	for(var cntrRow = 0; cntrRow < aBodyData.length; cntrRow++) {
		cellRow = cntrRow;
		var eachRow = aBodyData[cntrRow];
		for(var eachColName in eachRow.values) {
			for(var cntrCol = 0; cntrCol < aWantedCol.length; cntrCol++) {
				if (aWantedCol[cntrCol].name === eachColName) {
					cellCol = cntrCol;
					cellPath = aWantedCol[cntrCol].path;
					break;
				}
			}
			var theCell = aEditable.getCell(cellRow, cellCol);
			var cellFqn = tableName + "[" + cntrRow + "]" + "." + cellPath;
			var theId = UiUtil.GenElementId(undefined, cellFqn);
			if (UiUtil.NotUndefineNotNullNotBlank(theCell)) {
				theCell.setAttribute("id", theId);
				var selControl = $(aEditable.getCell(cellRow, cellCol)).find("select")[0];
				if (UiUtil.NotUndefineNotNullNotBlank(selControl)) selControl.setAttribute("id", "sel_" + theId);
				var inpControl = $(aEditable.getCell(cellRow, cellCol)).find("input")[0];
				if (UiUtil.NotUndefineNotNullNotBlank(selControl)) inpControl.setAttribute("id", "inp_" + theId);
			}
		}
	}
};
UiGrid.applyRowSelectedStyle = function(aEvent, aGrid) {
	$(aGrid.table).find('.rowSelected').removeClass('rowSelected');
	if ($(aEvent.target).is('td')) {
		$(aEvent.target.parentNode).addClass('rowSelected');
	} else if ($(aEvent.target).is('tr')) {
		$(aEvent.target).addClass('rowSelected');
	}
};
UiGrid.hideCol = function(aTableId, aColPosition) {
	$('#' + aTableId + ' ' + 'th:nth-of-type(' + aColPosition + ')').css('display', 'none');
	$('#' + aTableId + ' ' + 'td:nth-of-type(' + aColPosition + ')').css('display', 'none');
};
UiGrid.Flatten2Relational = function(data, aName, aFlattenUpTo) {
	function flattenRecurse(aObj, aParentName, eachRow, aAccumParentName) {
		if (aParentName !== '') {
			aAccumParentName = aAccumParentName + '-' + aParentName;
		}

		if (UiUtil.NotUndefineNotNullNotBlank(aFlattenUpTo)) {
			for(var cntr = 0; cntr <aFlattenUpTo.length; cntr++) {
				if (aFlattenUpTo[cntr] === aAccumParentName) return;
			}
		}

		// handle primitive
		for(var prop in aObj) {
			if (prop === 'data') {
				var newObj = aObj['data'];
				if (typeof(newObj) !== 'object') {
					//eachRow[aParentName] = aObj;
					eachRow[aAccumParentName] = aObj;
				}
			}
		}

		// handle data 
		for(var prop in aObj) {
			if (prop === 'objectId') {
				eachRow[aAccumParentName + '-objectId'] = aObj.objectId;
			} else if (prop === 'clasz') {
				eachRow[aAccumParentName + '-clasz'] = aObj.clasz;
			} else if (prop === 'data') {
				var newObj = aObj['data'];
				if (typeof(newObj) === 'object') {
					for(var newProp in newObj) {
						flattenRecurse(newObj[newProp], newProp, eachRow, aAccumParentName);
					}
				}
			}
		}
 
		// handle dataset
		var cloneMasterRow = jQuery.extend(true, {}, eachRow); // preserving the row at this state 
		for(var prop in aObj) {
			if (prop === 'dataset') {
				var newObj = aObj['dataset'];
				for(var cntr = 0; cntr < newObj.length; cntr++) {
					var cloneRow = eachRow;
					if (cntr !== 0) {
						cloneRow = jQuery.extend(true, {}, cloneMasterRow);
					}
					flattenRecurse(newObj[cntr], '', cloneRow, aAccumParentName);
					if (cntr !== 0) {
						result.push(cloneRow); 
					}
				}
			}
		}
	}

	var result = [];
	var row = {};
	result.push(row);
	flattenRecurse(data, '', row, aName);

	var result1 = {};
	result1.dataset = [];
	for(var cntr = 0; cntr < result.length; cntr++) {
		var asObj = {};
		asObj.data = result[cntr];
		asObj.objectId = asObj.data[aName + '-objectId'];
		asObj.clasz = asObj.data[aName + '-clasz'];
		result1.dataset.push(asObj);
	}

	return(result1);
};
UiGrid.ForEachRow = function(aGrid, aFunc) {
	var rowCount = aGrid.getRowCount();
	for(var cntr = 0; cntr < rowCount; cntr++) {
		aFunc(aGrid.getRow(cntr));
	}
};
UiGrid.GetGridHeight = function(aGrid) {
	if (UiUtil.NotUndefineNotNullNotBlank(aGrid.GridHeight)) {
		return(aGrid.GridHeight);
	} else {
		return(UiGrid.GridHeight);
	}
};
/*
UiGrid.ReflectGridChanges = function(aUiGrid, changedObject, aSortFieldName, aSortFieldType) {
	var useBeRefresh = undefined;
	var gridHeight = UiGrid.GetGridHeight(aUiGrid);
	var gridObjectList = UiUtil.GetAryByJsonPath(aUiGrid.rawObj);
	var updatedIndex = null;

	//var changedObject = UiUtil.GetPrevObj(aChangedObjectName);
	if (UiUtil.NotUndefineNotNull(changedObject)) {
		var coObjectId = changedObject.objectId;
		var coClasz = changedObject.clasz;
		var coFieldValue = UiUtil.GetValueByJsonPath(changedObject, aSortFieldName);

		var gridRowCount = gridObjectList.length;
		for(var cntr = 0; cntr < gridRowCount; cntr++) {
			var gdObjectId = UiUtil.GetValueByJsonPath(gridObjectList[cntr], "objectId");
			var gdClasz = UiUtil.GetValueByJsonPath(gridObjectList[cntr], "clasz");
			if (gdObjectId === coObjectId && gdClasz === coClasz) {
				updatedIndex = cntr;
				break;
			}
		}

		if (updatedIndex !== null) {
			gridObjectList[updatedIndex] = changedObject;
		} else { // this is new object, so insert
			var compare;
			if (aSortFieldType === "date") {
				compare = function(left, right) {
					var leftValue = UiUtil.GetValueByJsonPath(left, aSortFieldName);
					var rightValue = UiUtil.GetValueByJsonPath(right, aSortFieldName);
					leftValue = Date.parse(leftValue);
					rightValue = Date.parse(rightValue);
					if (leftValue < rightValue) return -1;
					if (leftValue > rightValue) return 1;
					return 0;
				};
			} else {
				compare = function(left, right) {
					var leftValue = UiUtil.GetValueByJsonPath(left, aSortFieldName);
					var rightValue = UiUtil.GetValueByJsonPath(right, aSortFieldName);
					if (leftValue < rightValue) return -1;
					if (leftValue > rightValue) return 1;
					return 0;
				};
			}
			gridObjectList.push(changedObject); // insert into gridObjectList
			gridObjectList.sort(compare);

			var smallestGridRow = UiUtil.GetValueByJsonPath(gridObjectList[0], aSortFieldName);
			smallestGridRow = smallestGridRow.substring(0, 0);

			var sortedSmallestRow = UiUtil.GetValueByJsonPath(gridObjectList[0], aSortFieldName);
			sortedSmallestRow = sortedSmallestRow.substring(0, 0);

			if (gridObjectList.length > gridHeight) {
				if(sortedSmallestRow < smallestGridRow ) { // check if first row can be in this grid
					UiUtil.RemoveArrayElement(gridObjectList, 0); // first row not qualify to be in the grid, remove the first row
				} else { 
					UiUtil.RemoveArrayElement(gridObjectList, gridObjectList.length - 1); // first row is qualify to be in grid, remove last row
				}
			} else {
				useBeRefresh = coFieldValue.substr(0, coFieldValue.length - 1); // tell challer to use backend refresh to point to the new record set
			}
		}
		//UiUtil.StorePrevObj(aListName, aUiGrid.rawObj);
		//UiUtil.StoreObj(aChangedObjectName, undefined);
		return(useBeRefresh);
	}
};
*/

RenderHdrCbx = function(aGrid) { this.editableGrid = aGrid; }; // must first instantiate
RenderHdrCbx.prototype = new CellRenderer();
RenderHdrCbx.prototype.grid;
RenderHdrCbx.prototype.editableGrid;
RenderHdrCbx.prototype.render = function(cell, value) {
	var cbx = document.createElement('input');
	cbx.setAttribute('type', 'checkbox');
	cbx.setAttribute('onchange', 'RenderHdrCbx.HeaderCbxClick(this)');
	cell.appendChild(cbx);
	$(cell).find('a').html('');
	$(cell).css('text-align', 'center');
	$(cell).css('width', '40px');
}; 
RenderHdrCbx.HeaderCbxClick = function(aCaller) {
	var tbl = $(aCaller).closest('table')[0];
	var cellIdx = aCaller.parentElement.cellIndex;
	var aryInput = tbl.rows[0].cells[cellIdx].getElementsByTagName('input');
	if (aryInput.length > 0) {
		for(var cntrRow = 1; ; cntrRow++) { 
			var row = tbl.rows[cntrRow];
			if (row !== undefined && row !== null) {
				var userChoice = aryInput[0].checked;
				row.cells[cellIdx].getElementsByTagName('input')[0].checked = userChoice;
			} else {
				break;
			}
		}
		if (UiUtil.NotUndefineNotNullNotBlank(tbl.afterHeaderCbxClick)) {
			var userChoice = aryInput[0].checked;
			tbl.afterHeaderCbxClick(userChoice);
		}
	}
};


RenderBdyCbx = function(aGrid) { this.editableGrid = aGrid; }; // must first instantiate
RenderBdyCbx.prototype = new CellRenderer();
RenderBdyCbx.prototype.grid;
RenderBdyCbx.prototype.editableGrid;
RenderBdyCbx.prototype.render = function(cell, value) {
	var cbx = document.createElement('input');
	cbx.setAttribute('type', 'checkbox');
	cbx.setAttribute('onchange', 'RenderBdyCbx.BodyCbxClick(this)');
	cell.appendChild(cbx);
	$(cell).find('a').html('');
	$(cell).css('text-align', 'center');
	$(cell).css('width', '40px');
}; 
RenderBdyCbx.BodyCbxClick = function(aCaller) {
	var tbl = $(aCaller).closest('table')[0];
	var hdrChkbx = tbl.rows[0].cells[0].getElementsByTagName('input');
	hdrChkbx[0].checked = false;
};


RenderEditable = function(aGrid) { this.editableGrid = aGrid; }; // must first instantiate
RenderEditable.prototype = new CellRenderer();
RenderEditable.prototype.grid;
RenderEditable.prototype.editableGrid;
RenderEditable.prototype.render = function(cell, value) {
	var thisGrid = this.editableGrid;
	var thisCell = cell;
	thisGrid.columns[$(thisCell)[0].columnIndex].cellValidators = [];
	$(cell).on('keyup', function() { 
		if (thisGrid.columns[$(thisCell)[0].columnIndex].datatype === 'nombor') {
			var thisInput = $(thisCell).children('input')[0];
			if (UiUtil.NotUndefineNotNull(thisInput)) {
				thisInput.value = thisInput.value.replace(/\D/g, '');
				thisInput.value = UiUtil.NumberWithComma(thisInput.value);
				thisCell.netValue = thisInput.value;
			}
		} else if (thisGrid.columns[$(thisCell)[0].columnIndex].datatype === 'duit') {
			var thisInput = $(thisCell).children('input')[0];
			if (UiUtil.NotUndefineNotNull(thisInput)) {
				thisInput.value = UiUtil.HandleMoney(thisInput.value);
				thisCell.netValue = thisInput.value;
			}
		} else {
			// do nothing
		}
	});

	//var newValue = thisCell.netValue;
	var newValue = value;
	if (UiUtil.NotUndefineNotNullNotBlank(newValue)) {
		if (thisGrid.columns[$(thisCell)[0].columnIndex].datatype === 'duit') {
			var gotDot = ('' + newValue).indexOf('.');
			if (gotDot < 0) {
				newValue += ".00";
			} else {
				var centPart = ('' + newValue).substring(gotDot + 1);
				if (centPart.length === 1) {
					newValue += "0";
				}
			}
		}
		cell.innerHTML = newValue;
	} else {
		cell.innerHTML = "";
	}
}; 
UiGrid.CreateComboboxCountry = function(aName, aValue, aSet) {
	var inputArea = UiGrid.CreateCombobox(aName, undefined);
	var cmb = inputArea.getElementsByTagName("select")[0];
	cmb.setAttribute('style', 'margin-top: 10px');
	UiGrid.PopulateComboboxWithName(cmb, aValue.option, aValue.data);
	aSet.appendChild(inputArea);
};
UiGrid.CreateCombobox = function(displayLabel, aObj2Edit) {
	var input = document.createElement("select");
	input.areaEdit = this;
	input.setAttribute("class", "custom-select");
	if (typeof aObj2Edit !== 'undefined') input.obj2Edit = aObj2Edit;
	input.displayLabel = displayLabel;
	var result = input;
	if (displayLabel !== undefined) {
		result = UiUtil.CreateTextFieldWithLabel(displayLabel, input);
	}
	return(result);
};
UiGrid.PopulateComboboxWithName = function(cmb, jsonObj, chosen) {
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
/*
UiGrid.GetSelection = function(aGrid, aPositionOid1, aPositionClasz1, aPositionOid2, aPositionClasz2) {
	var selectedList = undefined;
	if (UiGrid.IsAllRowChecked(aGrid)) {
		selectedList = []; // mean select all
	} else {
		var allCheckRow = UiGrid.getAllCheckRow(aGrid);
		for(var cntr = 0; cntr < allCheckRow.length; cntr++) {
			var idxChecked = allCheckRow[cntr];

			var colNameOid1 = aGrid.table.rows[0].cells[aPositionOid1].innerText;
			var colNameClasz1 = aGrid.table.rows[0].cells[aPositionClasz1].innerText;
			var colValueOid1 = aGrid.table.rows[idxChecked].cells[aPositionOid1].innerText;
			var colValueClasz1 = aGrid.table.rows[idxChecked].cells[aPositionClasz1].innerText;

			var strObj;
			if (aPositionOid2 !== undefined && aPositionClasz2 !== undefined) {
				var colNameOid2 = aGrid.table.rows[0].cells[aPositionOid2].innerText;
				var colNameClasz2 = aGrid.table.rows[0].cells[aPositionClasz2].innerText;
				var colValueOid2 = aGrid.table.rows[idxChecked].cells[aPositionOid2].innerText;
				var colValueClasz2 = aGrid.table.rows[idxChecked].cells[aPositionClasz2].innerText;
				strObj = '{';
				strObj += '"' + colNameOid1 + '": "' + colValueOid1 + '", "' +  colNameClasz1 + '": "' + colValueClasz1 + '"';
				strObj += ', "' +colNameOid2 + '": "' + colValueOid2 + '", "' +  colNameClasz2 + '": "' + colValueClasz2 + '"';
				strObj += '}';
			} else {
				var strObj = '{"' + colNameOid1 + '": "' + colValueOid1 + '", "' +  colNameClasz1 + '": "' + colValueClasz1 + '"}';
			}

			var selectedObj = JSON.parse(strObj);
			if (selectedList === undefined) selectedList = [];
			selectedList.push(selectedObj);
		}
	}
	return(selectedList);
};
*/


UiGrid.NotInList = function(aSelectedList, aSelectedObj) {
	return(UiGrid.ExistInList(aSelectedList, aSelectedObj));
};
UiGrid.ExistInList = function(aSelectedList, aSelectedObj) {
	var result = undefined;
	for(var cntr = 0; cntr < aSelectedList.length; cntr++) { 
		var selectedItem = aSelectedList[cntr];
		var selectedObj = {};
		for(var eachKey in aSelectedObj) { // setup to compare only oid and clasz, any other additonal field is ignore
			selectedObj[eachKey] = selectedItem[eachKey];
		}

		if (JSON.stringify(selectedObj) === JSON.stringify(aSelectedObj)) {
			result = cntr;
			break;
		}
	}
	return(result);
};
UiGrid.AccumSelectedRow = function(aGrid, aSelectedList, aPositionOid2, aPositionClasz2, onAddedSelection, onUpdateSelection) {
	UiGrid.ProcessSelectedRow(aGrid, aSelectedList, aPositionOid2, aPositionClasz2
	, function(aSelectedList, aSelectedObj, aTheRow) {
		if (UiUtil.NotUndefineNotNullNotBlank(onAddedSelection)) {
			onAddedSelection(aSelectedObj, aTheRow);
		}
		aSelectedList.push(aSelectedObj); // add to list
	}, function(aSelectedList, aSelectedPosition) {
		aSelectedList.splice(aSelectedPosition, 1); // remove from list
	}, function(aCntrRow) {
		UiGrid.CheckAtRow(aGrid, aCntrRow, true); // checked the table row if table contain obj in aSelectedList
	}, function(aSelectedList, aSelectedObj, aTheRow, selectedCntr) {
		if (UiUtil.NotUndefineNotNullNotBlank(onUpdateSelection)) {
			onUpdateSelection(aSelectedList[selectedCntr], aTheRow);
		}
	});
};
UiGrid.ProcessSelectedRow = function(aGrid, aSelectedList, aPositionOid2, aPositionClasz2, aOnAccum, aOnRemove, aOnNeedCheck, aOnUpdate) {
	if (UiUtil.IsUndefineOrNull(aGrid)) {
		return;
	}
	/*
	if (UiGrid.IsAllRowChecked(aGrid)) {
		return;
	}
	*/
	if (UiUtil.IsUndefineOrNull(aGrid.table)) {
		return;
	} else {
		if (UiUtil.IsUndefineOrNull(aGrid.table._st_isNewTable)) {
			aGrid.table._st_isNewTable = true;
		} else {
			aGrid.table._st_isNewTable = false;
		}
	}

	var row;
	var result = [];

	var colNameOid1 = aGrid.table.rows[0].cells[UiGrid.PositionOid].innerText;
	var colNameClasz1 = aGrid.table.rows[0].cells[UiGrid.PositionClasz].innerText;

	// handle 2nd oid, clasz if given, else only do 1 oid, clasz
	var colNameOid2;
	var colNameClasz2;
	if (aPositionOid2 !== undefined && aPositionClasz2 !== undefined) {
		colNameOid2 = aGrid.table.rows[0].cells[aPositionOid2].innerText;
		colNameClasz2 = aGrid.table.rows[0].cells[aPositionClasz2].innerText;
	}

	for(var cntrRow = 1; row = aGrid.table.rows[cntrRow]; cntrRow++) { 
		var aryInput = row.cells[UiGrid.PositionCheckBox].getElementsByTagName('input');
		if (aryInput.length > 0) { // if grid got row?
			// get the oid and clasz for the usual position at col 1 and 2
			var theRow = aGrid.table.rows[cntrRow];
			var strOid = aGrid.table.rows[cntrRow].cells[UiGrid.PositionOid].innerText;
			var strClasz = aGrid.table.rows[cntrRow].cells[UiGrid.PositionClasz].innerText;
			// handle 2nd oid, clasz if given, else only do 1 oid, clasz
			if (aPositionOid2 !== undefined && aPositionClasz2 !== undefined) {
				var colValueOid2 = aGrid.table.rows[cntrRow].cells[aPositionOid2].innerText;
				var colValueClasz2 = aGrid.table.rows[cntrRow].cells[aPositionClasz2].innerText;
			}

			var selectedObj = {};
			selectedObj[colNameOid1] = strOid;
			selectedObj[colNameClasz1] = strClasz;
			if (aPositionOid2 !== undefined && aPositionClasz2 !== undefined) {
				selectedObj[colNameOid2] = colValueOid2;
				selectedObj[colNameClasz2] = colValueClasz2;
			}

			if (aGrid.table._st_isNewTable) {
				// handle when new table (no row checked) due to next, prev
				var listItemPosition = UiGrid.ExistInList(aSelectedList, selectedObj);
				if (listItemPosition !== undefined) { 
					if (aryInput[0].checked === false) { // exist in list but not check, so check it
						aOnNeedCheck(cntrRow);
					}
				} else {
					// do nothing
				}
			} else {
				if (aryInput[0].checked) { // row checked
					var selectedCntr = UiGrid.NotInList(aSelectedList, selectedObj);
					if (selectedCntr === undefined) { // if not selected add to list
						aOnAccum(aSelectedList, selectedObj, theRow);
					} else {
						aOnUpdate(aSelectedList, selectedObj, theRow, selectedCntr);
					}
				} else { // row NOT checked
					var listItemPosition = UiGrid.ExistInList(aSelectedList, selectedObj);
					if (listItemPosition !== undefined) { // if in the list, remove from list
						aOnRemove(aSelectedList, listItemPosition);
					}
				}
			}

		}
	}
	return(result);
};
UiGrid.GetDataUseGrid = function(aDataFromBE, aFieldNameToUse) {
	var beData = aDataFromBE.dataset[0];
	for(var eachFieldName in beData.data) {
		if (eachFieldName === aFieldNameToUse) {
			// do nothing
		} else {
			delete beData[eachFieldName];
		}
	}
	var theData = UiUtil.GetVarByJsonPath(beData, aFieldNameToUse);
	return(theData);
};
UiGrid.GetTotalCheckedRow = function() {

};
UiGrid.ForEachCheckedRow = function(aGrid, aAccumSelectedOid) {
};
UiGrid.GetBriefDataFromCell = function(aRow, aFieldName) {
	var theCol = $(aRow).find("[id$=" + aFieldName + "]");
	var theValue = $(theCol).text();
	return(theValue);
};
UiGrid.GetBriefEmailFromRow = function(aRow, aFieldName) {
	var theCol = $(aRow).find("[id$=" + aFieldName + "]");
	var theValue = $(theCol).find("input").val();
	return(theValue);
};
UiGrid.GetBriefEmailAddresses = function(payslipRunGrid, selectedPayslip, aColShortName) {
	return UiGrid.GetBriefData(payslipRunGrid, selectedPayslip, aColShortName, true);
};
UiGrid.GetBriefDataFromGrid = function(payslipRunGrid, selectedPayslip, aColShortName) {
	return UiGrid.GetBriefData(payslipRunGrid, selectedPayslip, aColShortName, false);
};
UiGrid.GetBriefData = function(payslipRunGrid, selectedPayslip, aColShortName, aFromInput) {
		var emailBriefList = "";
		if (UiGrid.IsAllRowChecked(payslipRunGrid) === true) { 
			if (UiUtil.NotUndefineNotNullNotBlank(payslipRunGrid.rawObj)) {
				var rowList = payslipRunGrid.table.rows;
				for(var cntrGrid = 0; cntrGrid < rowList.length; cntrGrid++) {
					var eachGridRow = rowList[cntrGrid];
					var strEmailAddr;
					if (aFromInput) {
						strEmailAddr = UiGrid.GetBriefEmailFromRow(eachGridRow, aColShortName);
					} else {
						strEmailAddr = UiGrid.GetBriefDataFromCell(eachGridRow, aColShortName);
					}
					if (UiUtil.NotUndefineNotNullNotBlank(strEmailAddr)) {
						if (emailBriefList.length > 0) emailBriefList += ", ";
						emailBriefList += strEmailAddr;
					}
				}
			}
		} else {
			for(var cntr = 0; cntr < selectedPayslip.length; cntr++) {
				var strEmailAddr = selectedPayslip[cntr].emailAddr;
				if (UiUtil.NotUndefineNotNullNotBlank(strEmailAddr)) {
					if (emailBriefList.length > 0) emailBriefList += ", ";
					emailBriefList += strEmailAddr;
				}
			}
		} 
		if (emailBriefList.length > 90) emailBriefList = emailBriefList.substr(0, 90) + "...";
		return(emailBriefList);
};
UiGrid.GetBriefColValue = function(payslipRunGrid, idPos) {
		var colBriefList = "";
		if (UiUtil.NotUndefineNotNullNotBlank(payslipRunGrid.rawObj)) {
			var rowList = payslipRunGrid.table.rows;
			for(var cntrRow = 1; cntrRow < rowList.length; cntrRow++) {
				if (UiGrid.IsRowChecked(payslipRunGrid, cntrRow)) {
					var eachGridRow = rowList[cntrRow];
					var allTd = $(eachGridRow).find("td");
					var eachTd = allTd[idPos];
					if (colBriefList.length > 0) colBriefList += ", ";
					colBriefList += $(eachTd).text();
				}
			}
		}

		if (colBriefList.length > 90) colBriefList = colBriefList.substr(0, 90) + "...";
		return(colBriefList);
};
UiGrid.ClearTable = function(aGrid) {
	if (UiUtil.IsUndefineOrNullOrBlank(aGrid)) return;
	if (UiUtil.IsUndefineOrNullOrBlank(aGrid.table)) return;
	if (UiUtil.IsUndefineOrNullOrBlank(aGrid.table.rows)) return;
	while(aGrid.table.rows.length > 1) {
		aGrid.table.deleteRow(1);
	}
};