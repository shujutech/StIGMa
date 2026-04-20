var UiUtil; // to suppress NB error fuss

UiGrid.PositionCheckBox = 0;
UiGrid.PositionDesc = 3;
UiGrid.GridHeight = 5;
UiGrid.ProcessAll = "processAll";
UiGrid.UserSelected = "selected";
UiGrid.Next = "next";
UiGrid.Prev = "prev";
UiGrid.Seek = "seek";
UiGrid.First  = "first";

UiGrid.prototype.positionOid = 1;
UiGrid.prototype.positionClasz = 2;
UiGrid.prototype.positionOid2 = undefined;
UiGrid.prototype.positionClasz2 = undefined;
UiGrid.prototype.rawObj = {};
UiGrid.prototype.editableGrid = {};
UiGrid.prototype.allRowSelected = false;
UiGrid.prototype.tblSelectedRow = [];
UiGrid.prototype.tblRemovedRow = [];
UiGrid.prototype.onTblSelectedRow = undefined;
UiGrid.prototype.onRowCheckboxClick = undefined;
UiGrid.prototype.modifySelectedObj = undefined;
UiGrid.prototype.modifyUnselectedObj = undefined;

UiGrid.MsiaSgpConfig = {
	enableSort: false,
	decimal_point: '.',
	thousands_separator: ','
};
function UiGrid(aGridName, aOtherParam) {
	if (UiUtil.NotUndefineNotNullNotBlank(aOtherParam)) {
		if (UiUtil.IsUndefineOrNullOrBlank(aOtherParam.enableSort)) aOtherParam.enableSort = false;
		this.editableGrid = new EditableGrid(aGridName, aOtherParam);
	} else {
		this.editableGrid = new EditableGrid(aGridName, { enableSort: false });
	}
	return this;
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
	return result;
};
UiGrid.deleteRows = function(rowObjArray) {
	var result;
	for (var i = 0; i < rowObjArray.length; i++) {
		var rIndex = rowObjArray[i].sectionRowIndex;
		result = rowObjArray[i].rowIndex;
		rowObjArray[i].parentNode.deleteRow(rIndex);
	}
	return result;
};
UiGrid.rowClick = function(myTD, tbl, idxSel){
	$('.rowSelected').removeClass('rowSelected');
	$(myTD).addClass('rowSelected');
	setTimeout(function() {$('#' + tbl.id + ' tr').eq(idxSel).dblclick();} , 1);	
};
UiGrid.selectRow = function(aGrid, ridx) {
	var tbl = aGrid.getTable();
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
		UiGrid.selectRow(aGrid, ridx);
		var requestParam = {jsn: JSON.stringify(jsn)};
		UiUtil.BeAction(requestParam, 'delete', aTheUrl, function(jsonObject) {
			if (UiUtil.NotUndefineNotNull(aGrid.refreshFromBe)) {
				aGrid.refreshFromBe();
			}
		});
	};
}; 
UiGrid.CheckRow = function(aGrid, aRowIdx) {
	UiGrid.CheckUncheckRow(aGrid, aRowIdx, true);
}; 
UiGrid.UncheckRow = function(aGrid, aRowIdx) {
	UiGrid.CheckUncheckRow(aGrid, aRowIdx, false);
}; 
UiGrid.CheckUncheckRow = function(aGrid, aRowIdx, aValue) {
	if (UiUtil.NotUndefineNotNullNotBlank(aGrid.editableGrid.table) && aGrid.editableGrid.table.rows[aRowIdx]) {
		var cell = aGrid.editableGrid.table.rows[aRowIdx].cells[UiGrid.PositionCheckBox];
		var checkbox = cell.getElementsByTagName('input')[0];
		if (checkbox) {
			checkbox.checked = aValue;
		}
	}
};
UiGrid.IsRowChecked = function(aGrid, aRowIdx) {
	var result = false;
	if (UiUtil.NotUndefineNotNullNotBlank(aGrid.editableGrid.table)) {
		result = aGrid.editableGrid.table.rows[aRowIdx].cells[UiGrid.PositionCheckBox].getElementsByTagName('input')[0].checked;
	}
	return result;
};
UiGrid.IsAllRowChecked = function(aGrid) {
	var result = false;
	if (UiUtil.NotUndefineNotNullNotBlank(aGrid.editableGrid.table)) {
		result = aGrid.editableGrid.table.rows[0].cells[UiGrid.PositionCheckBox].getElementsByTagName('input')[0].checked;
	}
	return result;
};
UiGrid.getAllCheckRow = function(aGrid) {
	var row;
	var result = [];
	if (UiUtil.NotUndefineNotNullNotBlank(aGrid.editableGrid.table)) {
		for(var cntrRow = 1; row = aGrid.editableGrid.table.rows[cntrRow]; cntrRow++) { 
			var aryInput = row.cells[UiGrid.PositionCheckBox].getElementsByTagName('input');
			if (aryInput.length > 0) {
				if (aryInput[0].checked) {
					result.push(cntrRow);
				}
			}
		}
	}
	return result;
};
UiGrid.getFirstCheckRow = function(aGrid) {
	var row;
	var idxToEdit;
	if (UiUtil.NotUndefineNotNullNotBlank(aGrid.editableGrid.table)) {
		for(var cntrRow = 1; row = aGrid.editableGrid.table.rows[cntrRow]; cntrRow++) { 
			var aryInput = row.cells[UiGrid.PositionCheckBox].getElementsByTagName('input');
			if (aryInput.length > 0) {
				if (aryInput[0].checked) {
					idxToEdit = cntrRow;
					break;
				}
			}
		}
	}
	return idxToEdit;
};
UiGrid.CheckAtRow = function(aGrid, aIdx, aValue) {
	var row;
	row = aGrid.editableGrid.table.rows[aIdx];
	var aryInput = row.cells[UiGrid.PositionCheckBox].getElementsByTagName('input');
	if (aryInput.length > 0) {
		//aryInput[0].checked = aValue;
		var checkbox = aryInput[0];	
		checkbox.checked = aValue;
		var event = new Event('change', { bubbles: true });
		checkbox.dispatchEvent(event);
	}
};
UiGrid.CheckAllRow = function(aGrid, aValue) {
	var row;
	if (UiUtil.NotUndefineNotNullNotBlank(aGrid.editableGrid.table)) {
		for(var cntrRow = 0; row = aGrid.editableGrid.table.rows[cntrRow]; cntrRow++) { 
			var aryInput = row.cells[UiGrid.PositionCheckBox].getElementsByTagName('input');
			if (aryInput.length > 0) {
				//aryInput[0].checked = aValue;
				var checkbox = aryInput[0];	
				checkbox.checked = aValue;
				var event = new Event('change', { bubbles: true });
				checkbox.dispatchEvent(event);
			}
		}
	}
};
UiGrid.CheckTotalRow = function(aGrid) {
	var row;
	var cntrChecked = 0;
	for(var cntrRow = 0; row = aGrid.editableGrid.table.rows[cntrRow]; cntrRow++) { 
		var aryInput = row.cells[UiGrid.PositionCheckBox].getElementsByTagName('input');
		if (aryInput.length > 0) {
			if (aryInput[0].checked) {
				cntrChecked++;
			}
		}
	}
	return cntrChecked;
};
UiGrid.onEdit = function(aGrid) {
	var idxToEdit = UiGrid.getFirstCheckRow(aGrid);
	if (idxToEdit === undefined) {
		UiUtil.DialogError("Error", "There is no record selected, please tick the checkbox at the table first!", UiUtil.DoNothing);
	} else {
		$($(aGrid.editableGrid.table)[0].rows[idxToEdit]).dblclick();
	}
};
UiGrid.onDelete = function(aGrid, aTheUrl, sendDelRq, cancelDelRq) {
	var tbl = aGrid.editableGrid.table;
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
	aGrid.editableGrid.load({"metadata":headerMeta, "data":bodyData});
	if (aWantedCol[0].type === 'checkbox') {
		aGrid.editableGrid.setHeaderRenderer(aWantedCol[0].name, new RenderHdrCbx(aGrid));
	}
	aGrid.editableGrid.setCellRenderer(aWantedCol[0].name, new RenderBdyCbx(aGrid));
	for(var cntr = 1; cntr < headerMeta.length; cntr++) {
		if (aWantedCol[cntr].type === "html") {
			aGrid.editableGrid.setCellRenderer(aWantedCol[cntr].name, new CellRenderer({
				render: function(cell, value) { 
					cell.innerHTML = value; 
					cell.style.textAlign = "center"; 
				}
			})); 
		} else if (aWantedCol[cntr].type === 'checkbox') {
			aGrid.editableGrid.setCellRenderer(aWantedCol[cntr].name, new RenderBdyCbx(aGrid, aWantedCol[cntr].editable, "UiUtil.DoNothing()"));
		} else {
			aGrid.editableGrid.setCellRenderer(headerMeta[cntr].name, new CellRenderer({
			render: function(cell, value) { 
				cell.innerHTML = value ? $('<div/>').html(value).text() : ""; }
			})); 
		} 
	}
	aGrid.editableGrid.renderGrid(aGridDiv, "stdGrid", aTableId);
	UiGrid.SetCellId(aGrid, bodyData, aWantedCol);
	UiGrid.UpdateSelectedRow(aGrid);
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
			defCol.datatype = aWantedCol[cntr].type;
			if (UiUtil.NotUndefineNotNullNotBlank(aWantedCol[cntr].editable) && aWantedCol[cntr].editable === true) {
				defCol.editable = true;
			} else {
				defCol.editable = false;
			}
			defHeader.push(defCol);
		}
	}
	return defHeader;
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
			var colName = aWantedCol[cntrCol].label;
			var colPath = aWantedCol[cntrCol].path;
			if (UiUtil.NotUndefineNotNullNotBlank(objRow.data) && UiUtil.NotUndefineNotNull(colPath)) {
				var objWanted = UiUtil.GetVarByJsonPath(objRow, colPath);
				if (aWantedCol[cntrCol].funcGetField !== undefined) { // get the custom wanted object if told so
					objWanted = aWantedCol[cntrCol].funcGetField(objRow);
				} 

				if (UiUtil.NotUndefineNotNullNotBlank(objWanted)) {
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
				// ignore col with no path, e.g checkbox column chose
			}
		}
		data.push(row);
	}
	return data;
};
UiGrid.DefineGridHeader = function(aryResult, aType, aField, aPath, aFuncGetField, aFuncFormat, aEditable) {
	var result = {};
	result.name = aField;
	result.label = aField;
	result.path = aPath;
	result.type = aType;
	result.funcFormat = aFuncFormat;
	result.funcGetField = aFuncGetField;
	if (UiUtil.NotUndefineNotNullNotBlank(aEditable) && aEditable === true) {
		result.editable = true;
	} else {
		result.editable = false;
	} 
	aryResult.push(result);

	return result;
};
UiGrid.SetCellId = function(aGrid, aBodyData, aWantedCol) {
	var cellRow;
	var cellCol;
	var cellPath;
	var tableName = aGrid.editableGrid.table.id.substring(3); // should this be substring(0, 3) instead? See also UiUtil.GetFieldId()
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
			var theCell = aGrid.editableGrid.getCell(cellRow, cellCol);
			var cellFqn = tableName + "[" + cntrRow + "]" + "." + cellPath;
			var theId = UiUtil.GenElementId(undefined, cellFqn);
			if (UiUtil.NotUndefineNotNullNotBlank(theCell)) {
				theCell.setAttribute("id", theId);
				var selControl = $(aGrid.editableGrid.getCell(cellRow, cellCol)).find("select")[0];
				if (UiUtil.NotUndefineNotNullNotBlank(selControl)) selControl.setAttribute("id", "sel_" + theId);
				var inpControl = $(aGrid.editableGrid.getCell(cellRow, cellCol)).find("input")[0];
				if (UiUtil.NotUndefineNotNullNotBlank(selControl)) inpControl.setAttribute("id", "inp_" + theId);
			}
		}
	}
};
UiGrid.applyRowSelectedStyle = function(aEvent, aGrid) {
	$(aGrid.editableGrid.table).find('.rowSelected').removeClass('rowSelected');
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
UiGrid.Flatten2Relational = function(aObj2Flatten, aName, aFlattenUpTo) {
	function isNotEmptyObj(variable) {
		if (Array.isArray(variable)) {
			return variable.length > 0;
		} else if (typeof variable === 'object' && variable !== null) {
			return Object.keys(variable).length > 0;
		} else {
			return true;
		}
	}

	// check if the pass in object contains only primitive field, if so then flattening process have ended and resulted in the flattened row
	function onlyHavePrimitiveField(aObj2Check) {
		var result = true;
		if ('data' in aObj2Check) {
			var obj2Check = aObj2Check.data;
			for (var prop in obj2Check) {
				var theField = obj2Check[prop];
				if (prop === 'data' || prop === 'dataset') {
					if (typeof(theField) === 'object') {
						if (isNotEmptyObj(theField)) {
							result = false;
							break;
						}
					}
				} else if (UiUtil.NotUndefineNotNull(theField.data)) {
					theField = theField.data;
				} else if (UiUtil.NotUndefineNotNull(theField.dataset)) {
					theField = theField.dataset;
				}
				if (typeof(theField) === 'object') {
					if (isNotEmptyObj(theField)) {
						result = false;
						break;
					}
				}
			}
		}
		return result;
	};

	// recursively process the object until a flatten row can be produce
	function flattenRecurse(aObj2Recurse, aParentName, eachRow, aAccumParentName, aRecurseDepth) {
		var stopRecurse = false;

		if (aParentName !== '') {
			if (UiUtil.NotUndefineNotNullNotBlank(aAccumParentName)) {
				aAccumParentName = aAccumParentName + '-' + aParentName;
			} else {
				aAccumParentName = aParentName;
			}
		}

		// handle primitive
		for (var prop in aObj2Recurse) {
			if (prop === 'objectId') {
				if (UiUtil.NotUndefineNotNullNotBlank(aAccumParentName)) {
					eachRow[aAccumParentName + '-objectId'] = aObj2Recurse.objectId;
				} else {
					eachRow['objectId'] = aObj2Recurse.objectId;
				}
			} else if (prop === 'clasz') {
				if (UiUtil.NotUndefineNotNullNotBlank(aAccumParentName)) {
					eachRow[aAccumParentName + '-clasz'] = aObj2Recurse.clasz;
				} else {
					eachRow['clasz'] = aObj2Recurse.clasz;
				}
			} if (prop === 'data') {
				var newDataPrimitive = aObj2Recurse['data'];
				if (typeof(newDataPrimitive) !== 'object') {
					eachRow[aAccumParentName] = {};
					eachRow[aAccumParentName].data = newDataPrimitive;
				}
			}
		}

		if (aObj2Recurse.hasOwnProperty('data') || aObj2Recurse.hasOwnProperty('dataset')) {
			const dataOrDatasetKey = 'data' in aObj2Recurse ? 'data' : 'dataset'
			const newDataObj = aObj2Recurse[dataOrDatasetKey];
			if (typeof(newDataObj) === 'object') {
				if (Array.isArray(newDataObj) === false) {
					// do non array dataset or array data
					for(var newPropKey in newDataObj) {
						var newPropData = newDataObj[newPropKey];
						if (typeof(newPropData) === 'object' && ((Array.isArray(newPropData.dataset) || Array.isArray(newPropData.data)) === false)) {
							flattenRecurse(newPropData, newPropKey, eachRow, aAccumParentName, aRecurseDepth);
						}
					} 
					// do array dataset or array data
					for(var newPropKey in newDataObj) {
						var newPropData = newDataObj[newPropKey];
						if (typeof(newPropData) === 'object' && ((Array.isArray(newPropData.dataset) || Array.isArray(newPropData.data)))) {
							flattenRecurse(newPropData, newPropKey, eachRow, aAccumParentName, aRecurseDepth);
						}
					} 
				}

				if (Array.isArray(newDataObj) === true) {
					aRecurseDepth++;
					for(var cntr = 0; cntr < newDataObj.length; cntr++) {
						var newPropData = newDataObj[cntr];
						flattenRecurse(newPropData, '', eachRow, aAccumParentName, aRecurseDepth);
						if (onlyHavePrimitiveField(newPropData)) {
							var cloneRow = jQuery.extend(true, {}, eachRow);
							if (UiUtil.NotUndefineNotNullNotBlank(aFlattenUpTo)) {
								if (aFlattenUpTo(cloneRow)) {
									rowList.push(cloneRow);
									eachRow = {};
								}
							} else {
								rowList.push(cloneRow);
								eachRow = {};
							}
						}
					} 
				}
			} else {
				// do nothing
			}
		}
	}

	var rowList = [];
	var row = {};
	flattenRecurse(aObj2Flatten, '', row, aName, 0);

	var finalResult = {};
	finalResult.dataset = [];
	for(var cntr = 0; cntr < rowList.length; cntr++) {
		var asDataObj = {};
		asDataObj.data = rowList[cntr];
		if (UiUtil.NotUndefineNotNullNotBlank(aName)) {
			asDataObj.objectId = asDataObj.data[aName + '-objectId'];
			asDataObj.clasz = asDataObj.data[aName + '-clasz'];
		} else {
			asDataObj.objectId = asDataObj.data['objectId'];
			asDataObj.clasz = asDataObj.data['clasz'];
		}
		finalResult.dataset.push(asDataObj);
	}

	return finalResult;
};
UiGrid.ForEachRow = function(aGrid, aFunc) {
	var rowCount = aGrid.editableGrid.getRowCount();
	for(var cntr = 0; cntr < rowCount; cntr++) {
		aFunc(aGrid.editableGrid.getRow(cntr));
	}
};
UiGrid.GetGridHeight = function(aGrid) {
	if (UiUtil.NotUndefineNotNullNotBlank(aGrid.GridHeight)) {
		return aGrid.GridHeight;
	} else {
		return UiGrid.GridHeight;
	}
};
UiGrid.RowIsVisuallyCheck = function(aGrid, aRow) {
	const theCell = aRow.cells[0];
	const checkbox = theCell.querySelector('input[type="checkbox"]'); 
	if (checkbox) {
		return checkbox.checked; 
	}
	return false; 
};
UiGrid.RowIsCheck = function(aGrid, aCheckRowPosition) {
	return UiGrid.RowIsCheckOrUncheck(aGrid, true, aCheckRowPosition);
};
UiGrid.RowIsUnCheck = function(aGrid, aCheckRowPosition) {
	UiGrid.RowIsCheckOrUncheck(aGrid, false, aCheckRowPosition);
};
UiGrid.CreateSelectedObj = function(aGrid, aCheckRowPosition) {
	var colNameOid1 = aGrid.editableGrid.table.rows[0].cells[aGrid.positionOid].innerText;
	var colNameClasz1 = aGrid.editableGrid.table.rows[0].cells[aGrid.positionClasz].innerText;

	// handle 2nd oid, clasz if given, else only do 1 oid, clasz
	var colNameOid2;
	var colNameClasz2;
	if (aGrid.positionOid2 !== undefined && aGrid.positionClasz2 !== undefined) {
		colNameOid2 = aGrid.editableGrid.table.rows[0].cells[aGrid.positionOid2].innerText;
		colNameClasz2 = aGrid.editableGrid.table.rows[0].cells[aGrid.positionClasz2].innerText;
	}

	// get the oid and clasz for tracking in selected list an removed list
	var strOid = aGrid.editableGrid.table.rows[aCheckRowPosition].cells[aGrid.positionOid].innerText;
	var strClasz = aGrid.editableGrid.table.rows[aCheckRowPosition].cells[aGrid.positionClasz].innerText;

	// handle 2nd oid and clasz 
	var colValueOid2;
	var colValueClasz2;
	if (aGrid.positionOid2 !== undefined && aGrid.positionClasz2 !== undefined) {
		colValueOid2 = aGrid.editableGrid.table.rows[aCheckRowPosition].cells[aGrid.positionOid2].innerText;
		colValueClasz2 = aGrid.editableGrid.table.rows[aCheckRowPosition].cells[aGrid.positionClasz2].innerText;
	}

	// create the object to store oid and clasz
	var selectedObj = {};
	selectedObj[colNameOid1] = strOid;
	selectedObj[colNameClasz1] = strClasz;

	// handle 2nd oid and clasz 
	if (aGrid.positionOid2 !== undefined && aGrid.positionClasz2 !== undefined) {
		selectedObj[colNameOid2] = colValueOid2;
		selectedObj[colNameClasz2] = colValueClasz2;
	}

	if (UiUtil.NotUndefineNotNullNotBlank(aGrid.modifySelectedObj)) {
		var chosenRow = aGrid.editableGrid.table.rows[aCheckRowPosition];
		aGrid.modifySelectedObj(selectedObj, chosenRow);
	}

	return selectedObj;
};
UiGrid.RowIsCheckOrUncheck = function(aGrid, aRowIsCheck, aCheckRowPosition) {
	// get selected object with oid and clasz values
	var selectedObj = UiGrid.CreateSelectedObj(aGrid, aCheckRowPosition);

	// now place and remove into selected list or removed list respectively according if row is check or uncheck
	if (aRowIsCheck) {
		// place into selected row list if its not in
		var listItemPosition = UiGrid.ExistInList(aGrid.tblSelectedRow, selectedObj);
		if (UiUtil.IsUndefineOrNullOrBlank(listItemPosition)) {  // if not in select list
			aGrid.tblSelectedRow.push(selectedObj); // add to selected list
		}

		// remove from removed row list if its in
		listItemPosition = UiGrid.ExistInList(aGrid.tblRemovedRow, selectedObj);
		if (UiUtil.NotUndefineNotNullNotBlank(listItemPosition)) { // if its in remove list
			aGrid.tblRemovedRow.splice(listItemPosition, 1); // remove from remove list
		}
	} else {
		// place into grid removed row list if its not in
		var listItemPosition = UiGrid.ExistInList(aGrid.tblRemovedRow, selectedObj);
		if (UiUtil.IsUndefineOrNullOrBlank(listItemPosition)) {  // if not in removed list
			aGrid.tblRemovedRow.push(selectedObj); // add to removed list
		}

		// remove from selected row list if its in
		listItemPosition = UiGrid.ExistInList(aGrid.tblSelectedRow, selectedObj);
		if (UiUtil.NotUndefineNotNullNotBlank(listItemPosition)) { // if its in selected list
			aGrid.tblSelectedRow.splice(listItemPosition, 1); // remove from selected list

			if (UiUtil.NotUndefineNotNullNotBlank(aGrid.modifyUnselectedObj)) {
				var chosenRow = aGrid.editableGrid.table.rows[aCheckRowPosition];
				aGrid.modifyUnselectedObj(selectedObj, chosenRow);
			}
		}
	}
	return selectedObj;
};
UiGrid.HideRepeatCells = function(aGrid, columnNumbers) {
	const table = aGrid.editableGrid.table;
	const rows = table.getElementsByTagName('tr');
	for (let cntr = 1; cntr < rows.length; cntr++) {
		const currentRow = rows[cntr];
		const previousRow = rows[cntr - 1];
		for (let cntrCol = 0; cntrCol < columnNumbers.length; cntrCol++) {
			const columnNumber = columnNumbers[cntrCol];
			const currentCell = currentRow.cells[columnNumber - 1];
			const previousCell = previousRow.cells[columnNumber - 1];
			const currentCombination = columnNumbers.map((columnNumber) => currentRow.cells[columnNumber - 1].textContent).join('');
			const previousCombination = columnNumbers.map((columnNumber) => previousRow.cells[columnNumber - 1].textContent).join('');
			if (currentCombination === previousCombination) {
				currentCell.style.color = 'transparent'; 
				currentCell.style.borderTop = 'none'; 
				previousCell.style.borderTop = 'none'; 	
				previousCell.style.borderBottom = 'none'; 	
			}
			if (UiUtil.IsUndefineOrNullOrBlank(currentCombination)) {
				previousCell.style.borderBottom = 'none'; 	
			}
		}
	}
};


//
// EditableGrid table HEADER renderer
//
RenderHdrCbx = function(aGrid) { 
	this.headerUiGrid = aGrid; // related to below headerRenderer = 
	this.editableGrid = aGrid.editableGrid; 
	return this;
}; 
RenderHdrCbx.prototype = new CellRenderer();
RenderHdrCbx.prototype.grid;
RenderHdrCbx.prototype.editableGrid;
RenderHdrCbx.prototype.render = function(cell, value) {
	var cbx = document.createElement('input');
	cbx.headerRenderer = this; // with this instant of RenderHdrCbx, we can access the grid prototype variable
	cbx.setAttribute('type', 'checkbox');
	cbx.setAttribute('onchange', 'RenderHdrCbx.HeaderCbxClick(this)');
	cbx.checked = false;
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

		var userChoice = aryInput[0].checked;
		//tbl.selectAll = userChoice;
		aCaller.headerRenderer.headerUiGrid.allRowSelected = userChoice;
		aCaller.headerRenderer.headerUiGrid.tblSelectedRow.length = 0;
		aCaller.headerRenderer.headerUiGrid.tblRemovedRow.length = 0;
		if (UiUtil.NotUndefineNotNullNotBlank(tbl.afterHeaderCbxClick)) {
			tbl.afterHeaderCbxClick(userChoice);
		}
	}
	if (UiUtil.NotUndefineNotNullNotBlank(aCaller.headerRenderer.headerUiGrid.onRowCheckboxClick)) {
		var rowIndex = aCaller.parentNode.parentNode.rowIndex;
		var theRow = aCaller.headerRenderer.headerUiGrid.editableGrid.table.rows[rowIndex];
		aCaller.headerRenderer.headerUiGrid.onRowCheckboxClick(theRow);
	}
};


//
// EditableGrid table BODY renderer
//
RenderBdyCbx = function(aGrid, aCanEdit, aOnClick) { 
	this.bodyUiGrid = aGrid;
	this.editableGrid = aGrid.editableGrid; 
	if (UiUtil.NotUndefineNotNullNotBlank(aCanEdit)) {
		this.canEdit = aCanEdit;
	} else {
		this.canEdit = true;
	}
	if (UiUtil.NotUndefineNotNullNotBlank(aOnClick)) {
		this.onClick = aOnClick;
	}
	return this;
}; 
RenderBdyCbx.prototype = new CellRenderer();
RenderBdyCbx.prototype.grid;
RenderBdyCbx.prototype.editableGrid;
RenderBdyCbx.prototype.render = function(cell, value) {
	var cbx = document.createElement('input');
	cbx.bodyRenderer = this; // with this instant of RenderHdrCbx, we can access the grid prototype variable
	cbx.setAttribute('type', 'checkbox');
	if (UiUtil.NotUndefineNotNullNotBlank(this.onClick)) {
		cbx.setAttribute('onchange', this.onClick);
	} else {
		cbx.setAttribute('onchange', 'RenderBdyCbx.BodyCbxClick(this)');
	}
	cbx.checked = value;
	if (UiUtil.NotUndefineNotNull(this.canEdit) && this.canEdit === false) {
		cbx.setAttribute('disabled', true);
	}

	cell.appendChild(cbx);
	$(cell).find('a').html('');
	$(cell).css('text-align', 'center');
	$(cell).css('width', '40px');
}; 
RenderBdyCbx.BodyCbxClick = function(aCaller) {
	var isCheck = aCaller.checked;
	var rowIndex = aCaller.parentNode.parentNode.rowIndex;

	//aCaller.bodyRenderer.bodyUiGrid.uncheckHeaderCheckbox();

	if (isCheck) {
		// add into selected list and remove from remove list
		var selectedObj = UiGrid.RowIsCheck(aCaller.bodyRenderer.bodyUiGrid, rowIndex);
		if (UiUtil.NotUndefineNotNullNotBlank(aCaller.bodyRenderer.bodyUiGrid.onTblSelectedRow)) {
			var theRow = aCaller.bodyRenderer.bodyUiGrid.editableGrid.table.rows[rowIndex];
			aCaller.bodyRenderer.bodyUiGrid.onTblSelectedRow(theRow, selectedObj);
		} 
	} else {
		// add into remove list and remove from select list
		UiGrid.RowIsUnCheck(aCaller.bodyRenderer.bodyUiGrid, rowIndex);
	}
	if (UiUtil.NotUndefineNotNullNotBlank(aCaller.bodyRenderer.bodyUiGrid.onRowCheckboxClick)) {
		var theRow = aCaller.bodyRenderer.bodyUiGrid.editableGrid.table.rows[rowIndex];
		aCaller.bodyRenderer.bodyUiGrid.onRowCheckboxClick(theRow);
	}
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
	UiGrid.PopulateComboboxWithName(cmb, aValue.option, aValue.data.Descr.data);
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
	return result;
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
UiUtil.IsKeyField =  function(aFieldName) {
	const strFieldName = aFieldName.toLowerCase();
	return strFieldName.includes("clasz") || strFieldName.includes("objectid") || strFieldName.includes("oid");
};
UiGrid.NotInList = function(aSelectedList, aSelectedObj) {
	return UiGrid.ExistInList(aSelectedList, aSelectedObj);
};
UiGrid.ExistInList = function(aSelectedList, aSelectedObj) {
	var result = undefined;
	var selectedObjKey = {};
	for(var eachKey in aSelectedObj) {
		if (UiUtil.IsKeyField(eachKey)) {
			selectedObjKey[eachKey] = aSelectedObj[eachKey];
		}
	}
	const strSelectedObjKey = JSON.stringify(selectedObjKey);
	if (UiUtil.NotUndefineNotNullNotBlank(aSelectedList)) {
		for(var cntr = 0; cntr < aSelectedList.length; cntr++) { 
			var selectedItem = aSelectedList[cntr];
			var selectedItemKey = {};
			for(var eachKey in aSelectedObj) { // setup to compare only oid and clasz, any other additonal field is ignore
				if (UiUtil.IsKeyField(eachKey)) {
					selectedItemKey[eachKey] = selectedItem[eachKey];
				}
			}
			if (JSON.stringify(selectedItemKey) === strSelectedObjKey) {
				result = cntr;
				break;
			}
		}
	}
	return result;
};
UiGrid.UpdateSelectedRow = function(aGrid) {
	UiGrid.AccumSelectedRow(aGrid, aGrid.tblSelectedRow, undefined, undefined, undefined, undefined, undefined, aGrid.tblRemovedRow, function() { 
		if (aGrid.allRowSelected === true) {
			UiGrid.CheckAllRow(aGrid, true);
			for(var cntrRow = 1; row = aGrid.editableGrid.table.rows[cntrRow]; cntrRow++) {
				var selectedObj = UiGrid.CreateSelectedObj(aGrid, cntrRow); // get selected object with oid and clasz values
				var listItemPosition = UiGrid.ExistInList(aGrid.tblRemovedRow, selectedObj);
				if (listItemPosition !== undefined) { 
					UiGrid.CheckAtRow(aGrid, cntrRow, false); 
				}
			}
		}
	});
};
UiGrid.AccumSelectedRow = function(aGrid, aSelectedList, aPositionOid2, aPositionClasz2, onAddedSelection, onUpdateSelection, onRemoveSelection, aRemoveList, aOnFinalFunc) {
	UiGrid.ProcessSelectedRow(aGrid, aSelectedList, aPositionOid2, aPositionClasz2
	, function(aSelectedList, aSelectedObj, aTheRow) { // aOnAccum
		if (UiUtil.NotUndefineNotNullNotBlank(onAddedSelection)) {
			onAddedSelection(aSelectedObj, aTheRow);
		}

		var listItemPosition = UiGrid.ExistInList(aSelectedList, aSelectedObj);
		if (UiUtil.IsUndefineOrNullOrBlank(listItemPosition)) {  // if not in select list
			aSelectedList.push(aSelectedObj); // add to list
		}
	}, function(aSelectedList, aSelectedPosition, aTheRow) { // aOnRemove
		if (UiUtil.NotUndefineNotNullNotBlank(onRemoveSelection)) {
			onRemoveSelection(aSelectedList[aSelectedPosition], aTheRow);
		}

		// not checked but in select list, if not in remove list, add into it
		var selectedObj = aSelectedList[aSelectedPosition];

		if (UiUtil.NotUndefineNotNullNotBlank(aRemoveList)) {
			var listItemPosition = UiGrid.ExistInList(aRemoveList, selectedObj);
			if (UiUtil.IsUndefineOrNullOrBlank(listItemPosition)) {  // if not in remove list
				aRemoveList.push(selectedObj); // add into remove list
			}
		}

		var listItemPosition = UiGrid.ExistInList(aSelectedList, selectedObj);
		if (UiUtil.NotUndefineNotNullNotBlank(listItemPosition)) {  // if is in select list
			aSelectedList.splice(listItemPosition, 1); // remove from select list
		}
	}, function(aCntrRow) { // aOnNeedCheck
		UiGrid.CheckAtRow(aGrid, aCntrRow, true); // checked the table row if table contain obj in aSelectedList
	}, function(aSelectedList, aSelectedObj, aTheRow, selectedCntr) { // aOnUpdate
		if (UiUtil.NotUndefineNotNullNotBlank(onUpdateSelection)) {
			onUpdateSelection(aSelectedList[selectedCntr], aTheRow); 
		}

		// checked and in the select list, if in remove list, remove it
		if (UiUtil.NotUndefineNotNullNotBlank(aRemoveList)) {
			var selectedObj = aSelectedList[selectedCntr];
			var listItemPosition = UiGrid.ExistInList(aRemoveList, selectedObj);
			if (UiUtil.NotUndefineNotNullNotBlank(listItemPosition)) { // if already in remove list
				aRemoveList.splice(listItemPosition, 1); // remove from select list
			}
		}
	}, aOnFinalFunc);
};
UiGrid.ProcessSelectedRow = function(aGrid, aSelectedList, aPositionOid2, aPositionClasz2, aOnAccum, aOnRemove, aOnNeedCheck, aOnUpdate, aOnFinalFunc) {
	if (UiUtil.IsUndefineOrNullOrBlank(aGrid) || UiUtil.IsUndefineOrNullOrBlank(aGrid.editableGrid.table)) {
		return; // somehow is not ready, so ignore it
	}

	if (UiUtil.NotUndefineNotNullNotBlank(aGrid.editableGrid.table)) {
		if (UiUtil.IsUndefineOrNull(aGrid.editableGrid.table._st_isNewTable)) {
			aGrid.editableGrid.table._st_isNewTable = true;
		}
	}

	var row;
	var result = [];

	var colNameOid1 = aGrid.editableGrid.table.rows[0].cells[aGrid.positionOid].innerText;
	var colNameClasz1 = aGrid.editableGrid.table.rows[0].cells[aGrid.positionClasz].innerText;

	// handle 2nd oid, clasz if given, else only do 1 oid, clasz
	var colNameOid2;
	var colNameClasz2;
	if (aPositionOid2 !== undefined && aPositionClasz2 !== undefined) {
		colNameOid2 = aGrid.editableGrid.table.rows[0].cells[aPositionOid2].innerText;
		colNameClasz2 = aGrid.editableGrid.table.rows[0].cells[aPositionClasz2].innerText;
	}

	if (UiUtil.NotUndefineNotNullNotBlank(aGrid.editableGrid.table)) {
		for(var cntrRow = 1; row = aGrid.editableGrid.table.rows[cntrRow]; cntrRow++) {
			var aryInput = row.cells[UiGrid.PositionCheckBox].getElementsByTagName('input');
			if (aryInput.length > 0) { // if grid got row?
				// get the oid and clasz for the usual position at col 1 and 2
				var theRow = aGrid.editableGrid.table.rows[cntrRow];
				var strOid = aGrid.editableGrid.table.rows[cntrRow].cells[aGrid.positionOid].innerText;
				var strClasz = aGrid.editableGrid.table.rows[cntrRow].cells[aGrid.positionClasz].innerText;
				// handle 2nd oid, clasz if given, else only do 1 oid, clasz
				if (aPositionOid2 !== undefined && aPositionClasz2 !== undefined) {
					var colValueOid2 = aGrid.editableGrid.table.rows[cntrRow].cells[aPositionOid2].innerText;
					var colValueClasz2 = aGrid.editableGrid.table.rows[cntrRow].cells[aPositionClasz2].innerText;
				}

				var selectedObj = {};
				selectedObj[colNameOid1] = strOid;
				selectedObj[colNameClasz1] = strClasz;
				if (aPositionOid2 !== undefined && aPositionClasz2 !== undefined) {
					selectedObj[colNameOid2] = colValueOid2;
					selectedObj[colNameClasz2] = colValueClasz2;
				}

				if (aGrid.editableGrid.table._st_isNewTable) {
					var listItemPosition = UiGrid.ExistInList(aSelectedList, selectedObj);
					if (listItemPosition !== undefined) { // handle when new table, check the row if is in the select list
						if (aryInput[0].checked === false) { // exist in list but not check, so check it
							aOnNeedCheck(cntrRow);
						}
					} else { 
						// do nothing
					}
				} else {
					if (aryInput[0].checked) { // row checked
						var selectedCntr = UiGrid.NotInList(aSelectedList, selectedObj);
						if (selectedCntr === undefined) { // check but not in selected list, so add it
							aOnAccum(aSelectedList, selectedObj, theRow);
						} else { // checked and in the select list
							aOnUpdate(aSelectedList, selectedObj, theRow, selectedCntr);
						}
					} else { // row NOT checked
						var listItemPosition = UiGrid.ExistInList(aSelectedList, selectedObj);
						if (listItemPosition !== undefined) { // not checked but in list, remove from list
							aOnRemove(aSelectedList, listItemPosition, theRow);
						} else { // not checked and NOT in list
							// do nothing
						}
					}
				}

			}
		} 
		aGrid.editableGrid.table._st_isNewTable = false;

		// finally do something
		if (UiUtil.NotUndefineNotNullNotBlank(aOnFinalFunc)) { 
			aOnFinalFunc();
		}
	}
	return result;
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
	return theData;
};
UiGrid.GetTotalCheckedRow = function() {

};
UiGrid.ForEachCheckedRow = function(aGrid, aAccumSelectedOid) {
};
UiGrid.GetBriefDataFromCell = function(aRow, aFieldName) {
	var theCol = $(aRow).find("[id$=" + aFieldName + "]");
	var theValue = $(theCol).text();
	return theValue;
};
UiGrid.GetBriefEmailFromRow = function(aRow, aFieldName) {
	var theCol = $(aRow).find("[id$=" + aFieldName + "]");
	var theValue = $(theCol).find("input").val();
	return theValue;
};
UiGrid.GetBriefTextFromRow = function(aRow, aFieldName) {
	var theCol = $(aRow).find("[id$=" + aFieldName + "]");
	var theValue = $(theCol).text();
	return theValue;
};
UiGrid.GetBriefEmailAddresses = function(payslipRunGrid, selectedPayslip, aColShortName) {
	return UiGrid.GetBriefData(payslipRunGrid, selectedPayslip, aColShortName, true);
};
UiGrid.GetBriefForEmailType = function(payslipRunGrid, aColShortName) {
	return UiGrid.GetBriefData(payslipRunGrid, undefined, aColShortName, true);
};
UiGrid.GetBriefForTextType = function(payslipRunGrid, aColShortName) {
	return UiGrid.GetBriefData(payslipRunGrid, undefined, aColShortName, false);
};
UiGrid.GetBriefDataFromGrid = function(payslipRunGrid, selectedPayslip, aColShortName) { // deprecated, use GetBriefForTextType when upgraded to latest UiGrid
	return UiGrid.GetBriefData(payslipRunGrid, selectedPayslip, aColShortName, false);
};
UiGrid.GetBriefData = function(aGrid, selectedPayslip, aColShortName, aFromCbx) {
	var emailBriefList = "";
	if (UiGrid.IsAllRowChecked(aGrid) === true) { 
		if (UiUtil.NotUndefineNotNullNotBlank(aGrid.rawObj)) {
			var rowList = aGrid.getTable().rows;
			for(var cntrGrid = 0; cntrGrid < rowList.length; cntrGrid++) {
				var eachGridRow = rowList[cntrGrid];
				var strEmailAddr;
				if (aFromCbx) {
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
		if (UiUtil.NotUndefineNotNullNotBlank(selectedPayslip)) { // deprecated
			for(var cntr = 0; cntr < selectedPayslip.length; cntr++) {
				var strEmailAddr = selectedPayslip[cntr][aColShortName];
				if (UiUtil.NotUndefineNotNullNotBlank(strEmailAddr)) {
					if (emailBriefList.length > 0) emailBriefList += ", ";
					emailBriefList += strEmailAddr;
				}
			}
		} else {
			for(var cntr = 0; cntr < aGrid.tblSelectedRow.length; cntr++) {
				var strEmailAddr = aGrid.tblSelectedRow[cntr][aColShortName];
				if (UiUtil.NotUndefineNotNullNotBlank(strEmailAddr)) {
					if (emailBriefList.length > 0) emailBriefList += ", ";
					emailBriefList += strEmailAddr;
				}
			}
		}
	} 
	if (emailBriefList.length > 90) emailBriefList = emailBriefList.substr(0, 90) + "...";
	return emailBriefList;
};
UiGrid.GetBriefColValue = function(aGrid, idPos) {
	var colBriefList = "";
	if (UiUtil.NotUndefineNotNullNotBlank(aGrid.rawObj)) {
		var rowList = aGrid.getTable().rows;
		for(var cntrRow = 1; cntrRow < rowList.length; cntrRow++) {
			if (UiGrid.IsRowChecked(aGrid, cntrRow)) {
				var eachGridRow = rowList[cntrRow];
				var allTd = $(eachGridRow).find("td");
				var eachTd = allTd[idPos];
				if (colBriefList.length > 0) colBriefList += ", ";
				colBriefList += $(eachTd).text();
			}
		}
	}

	if (colBriefList.length > 90) colBriefList = colBriefList.substr(0, 90) + "...";
	return colBriefList;
};
UiGrid.ClearTable = function(aGrid) {
	if (UiUtil.IsUndefineOrNullOrBlank(aGrid)) return;
	if (UiUtil.IsUndefineOrNullOrBlank(aGrid.editableGrid.table)) return;
	if (UiUtil.IsUndefineOrNullOrBlank(aGrid.editableGrid.table.rows)) return;
	if (UiUtil.IsUndefineOrNullOrBlank(aGrid.rawObj)) return;
	if (UiUtil.NotUndefineNotNullNotBlank(aGrid.rawObj.dataset)) {
		aGrid.rawObj.dataset.length = 0;
	}
	const maxRow = aGrid.editableGrid.getRowCount() - 1;
	for(var cntr = maxRow; cntr >= 0; cntr--) {
		aGrid.editableGrid.removeRow(cntr); 
	}
};
UiGrid.prototype.getRow = function(aRowNum) {
	return this.editableGrid.getRow(aRowNum);
};
UiGrid.prototype.getEditableGrid = function() {
	return this.editableGrid;
};
UiGrid.prototype.getTable = function() {
	return this.editableGrid.table;
};
UiGrid.prototype.resetGrid = function() {
	this.rawObj = {};
	this.allRowSelected = false;
	this.tblSelectedRow = [];
	this.tblRemovedRow = [];
	UiGrid.CheckAllRow(this, false);
};
UiGrid.prototype.uncheckGrid = function() {
	this.allRowSelected = false;
	this.tblSelectedRow = [];
	this.tblRemovedRow = [];
	UiGrid.CheckAllRow(this, false);
};
UiGrid.prototype.clearTable = function() {
	UiGrid.ClearTable(this);
}
UiGrid.prototype.getIndexOfRowSelected = function() {
		const rows = this.editableGrid.table.rows;
		const index = Array.from(rows).findIndex(row => 
				row.classList.contains("rowSelected")
		);
		return index - 1; // returns -1 if not found
}
UiGrid.prototype.uncheckHeaderCheckbox = function() {
	this.allRowSelected = false;
	const table = this.editableGrid.table;
	if (!table) return;
	const headerCheckbox = table.querySelector("thead th.editablegrid-Chose input[type='checkbox']");
	if (headerCheckbox && headerCheckbox.checked) {
		headerCheckbox.checked = false;
	}
}
UiGrid.prototype.forEachColCell = function(headerText, func2Do) {
	const tableElement = this.editableGrid.table;
	if (!tableElement) return;
	const headers = tableElement.querySelectorAll("thead th"); // find the index of the column with the given header text
	let columnIndex = -1;
	headers.forEach((th, index) => {
		if (th.textContent.trim() === headerText.trim()) {
			columnIndex = index;
		}
	});
	if (columnIndex === -1) {
		console.warn(`Header "${headerText}" not found.`);
		return;
	}
	const rows = tableElement.querySelectorAll("tbody tr");
	rows.forEach(row => { // loop through each body row and extract the first control element's ID
		const cell = row.cells[columnIndex];
		if (!cell) return;
		const control = cell.querySelector("input, select, textarea, button"); // look for the first control element (input, select, textarea, button, etc.)
		if (control) {
			if (func2Do) {
				func2Do(control);
			}
		} else {
			console.log("(no control found in cell)");
		}
	});
}

