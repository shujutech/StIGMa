if (typeof UiUtil === 'undefined' || UiUtil === null) {
	UiUtil = {}; // to avoid nb warning
}
function Paginator() {};
Paginator.prototype.divId = undefined;
Paginator.prototype.clickCallback = Paginator.doNothing; 
Paginator.prototype.tableOfIndex = undefined;
Paginator.prototype.funcIndexer = Paginator.indexesNum;
Paginator.prototype.selectedPage = '1';
Paginator.prototype.clickPage = '1';
Paginator.prototype.paginatorSize = 10;
Paginator.prototype.startAt = '1';
Paginator.prototype.endAt = '99';
Paginator.prototype.sequenceType= 'num';
Paginator.prototype.pageAction = undefined;
Paginator.prototype.pageGap = 1;
Paginator.prototype.simpleMode = false;
function Paginator(aDivId, aOption) {
	if (typeof aDivId !== "string" || (typeof aOption !== "object" && typeof aDivId !== "undefined")) {
		alert("The Paginator constructor takes two arguments:\n- name (string)\n- config (object)\n\nGot instead " + (typeof aDivId) + " and " + (typeof aOption) + ".");
	}

	$('#' + aDivId).empty();
	this.divId = undefined;
	this.clickCallback = Paginator.doNothing; 
	this.tableOfIndex = undefined;
	this.funcIndexer = Paginator.indexesNum;
	this.sequenceType= 'num';
	this.selectedPage = '1';
	this.clickPage = '1';
	this.startAt = '1';
	this.endAt = '99';
	this.pageGap = 1;
	this.simpleMode = false;

	this.divId = aDivId;
	if (aOption !== undefined) {
		for (var param in aOption) {
			this[param] = aOption[param];
		}
	}
	this.Browser = {
		IE: !!(window.attachEvent && navigator.userAgent.indexOf("Opera") === -1),
		Opera: navigator.userAgent.indexOf("Opera") > -1,
		WebKit: navigator.userAgent.indexOf("AppleWebKit/") > -1,
		Gecko: navigator.userAgent.indexOf("Gecko") > -1 && navigator.userAgent.indexOf("KHTML") === -1,
		MobileSafari: !!navigator.userAgent.match(/Apple.*Mobile.*Safari/)
	};

	if (this.sequenceType === 'alpha') {
		this.startAt = 'A';
		this.endAt = 'Z';
		this.selectedPage = 'A';
		this.clickPage = 'A';
		this.funcIndexer = Paginator.indexesChar;
	} else if (this.sequenceType === 'day') {
		this.funcIndexer = Paginator.indexesDay;
	} else if (this.sequenceType === 'month') {
		if (UiUtil.IsUndefineOrNullOrBlank(this.startAt)) {
			this.selectedPage = 'Jan';
			this.endAt = 'Dec';
		}
		if (UiUtil.IsUndefineOrNullOrBlank(this.selectedPage)) this.selectedPage = this.startAt;
		this.funcIndexer = Paginator.indexesMonth;
	}

	if (this.selectedPage === undefined) {
		this.selectedPage = this.startAt;
		this.clickPage = this.startAt;
	}

	if (this.tableOfIndex === undefined) {
		if (this.simpleMode) {
			Paginator.simpleModePaginator(this, this.divId, this.clickCallback);
		} else {
			this.tableOfIndex = Paginator.generateIndexes(this.divId, this.paginatorSize, this.funcIndexer, 'forward', this.startAt, this.endAt, this.sequenceType, this.pageGap);
			this.displayPaginator();
		}
	}
};
Paginator.prototype.displayPaginator = function() {
	Paginator.updatePaginator(this, this.divId, this.clickCallback, this.paginatorSize, this.funcIndexer, this.sequenceType, this.pageGap);
};
Paginator.prototype.resetPaginator = function() {
	this.selectedPage = null;
	Paginator.updatePaginator(this, this.divId, this.clickCallback, this.paginatorSize, this.funcIndexer, this.sequenceType, this.pageGap);
};
Paginator.prototype.windowToActivePage = function(aPage) {
	this.selectedPage = aPage;
	var selPageIdx = Paginator.getSelectedIndex(this); // is aPage in the window, if yes do nothing, else generate indexes for that window
	if (selPageIdx === undefined) {
		var prevPage = this.funcIndexer.getPreviousPage(this, aPage);
		var indexes = this.funcIndexer(prevPage, this.paginatorSize, 'forward', this.startAt, this.endAt, this.sequenceType, this.pageGap);
		this.tableOfIndex = indexes;
	}
	Paginator.updatePaginator(this, this.divId, this.clickCallback, this.paginatorSize, this.funcIndexer, this.sequenceType, this.pageGap);
};
Paginator.prototype.formatPageAsActive = function(aPage) {
	var pageDiv = document.getElementById(this.divId);
	if (UiUtil.NotUndefineNotNullNotBlank(pageDiv)) {
		var allPage = pageDiv.getElementsByClassName('page-text');
		if (UiUtil.NotUndefineNotNullNotBlank(allPage)) {
			for(var cntr = 0; cntr < allPage.length; cntr++) {
				var eachPage = allPage[cntr];
				if (eachPage.text + "" === aPage + "") {
					eachPage.classList.add('page-current');
				} else {
					eachPage.classList.remove('page-current');
				}
			}
		}
	}
};
Paginator.prototype.formatFirstPageAsActive = function() {
	var firstElement = document.getElementById('page-gofirst');
	if (firstElement) {
		firstElement.click();
		this.windowToActivePage(this.startAt);
	}
};
Paginator.prototype.formatLastPageAsActive = function() {
	var lastElement = document.getElementById('page-golast');
	if (lastElement) {
		lastElement.click();
		this.windowToActivePage(this.endAt);
	}
};
Paginator.prototype.getLastPageForPreviousClick = function() {
	var result;
	if (this.sequenceType === 'month') {
		result = this.endAt;
	} else {
		if (this.startAt > this.endAt) { // descending pages number
			result = this.endAt;
		} else {
			if (this.sequenceType === 'num') {
				result = this.endAt + '99';
			} else if (this.sequenceType === 'alpha') {
				result = this.endAt + '~~~';
			} else if (this.sequenceType === 'day') {
				result = UiUtil.DatePlusDay(UiUtil.DisplayDateToDate(this.endAt), this.pageGap);
			} else {
				console.log('Paginator.getLastPageForPrevisouClick is not define');
			}
		}
	}
	return result;
};
Paginator.prototype.empty = function() {
	$('#' + this.divId).empty();
};
Paginator.createPagiElement = function(interval, func) {
    var pages = [];
    for (var cntr = interval.startPageIndex; cntr < interval.endPageIndex; cntr++) {
        pages.push(typeof func === "function" ? func(cntr) : cntr);
    }
    return pages;
};
Paginator.indexesChar = function(aLast, aPaginatorSize, aDirection, aStartAt, aEndAt) {
	var indexes = [];
	var startAt = aStartAt.charCodeAt(0);
	var endAt = aEndAt.charCodeAt(0);
	if (aDirection === 'backward') {
		if (aLast === undefined) {
			endAt = aEndAt.charCodeAt(0);
		} else {
			endAt = aLast.charCodeAt(0) - 1;
		}
		startAt = endAt - parseInt(aPaginatorSize) + 1;
		if (startAt <= aStartAt.charCodeAt(0)) {
			startAt = aStartAt.charCodeAt(0);
			endAt = startAt + parseInt(aPaginatorSize) - 1;
		}
		for(var cntr = startAt; cntr <= endAt && cntr >= aStartAt.charCodeAt(0); cntr++) {
				indexes.push(String.fromCharCode(cntr));
		}
	} else {
		if (aLast !== '&nbsp;') {
			if (aLast === undefined) {
				startAt = aStartAt.charCodeAt(0);
			} else {
				startAt = aLast.charCodeAt(0) + 1;
			}
			endAt = startAt + parseInt(aPaginatorSize) - 1;
			for(var cntr = startAt; cntr <= endAt && cntr <= aEndAt.charCodeAt(0); cntr++) {
					indexes.push(String.fromCharCode(cntr));
			}
		}
	}
	return indexes;
};
Paginator.indexesNum = function(aLast, aPaginatorSize, aDirection, aStartAt, aEndAt, aSeqType) {
	var indexes = [];
	var startAt = parseInt(aStartAt);
	var endAt = parseInt(aEndAt); 
	var last = Paginator.display2Code(aLast, aSeqType);

	if (parseInt(aStartAt) > parseInt(aEndAt)) { // desceding pages number
		if (aDirection === 'backward') {
			if (last === undefined) {
				endAt = parseInt(aEndAt);
			} else {
				endAt = parseInt(last) + 1;
			}
			startAt = endAt + parseInt(aPaginatorSize) - 1;
			if (startAt >= parseInt(aStartAt)) startAt = parseInt(aStartAt);
			if (startAt - endAt + 1 < aPaginatorSize) {
				endAt = endAt - (aPaginatorSize - (startAt - endAt)) + 1;
			}
			for(var cntr = startAt; cntr >= endAt && cntr >= parseInt(aEndAt); cntr--) {
				indexes.push(Paginator.code2Display(cntr, aSeqType));
			}
		} else {
			if (last === undefined) {
				startAt = parseInt(aStartAt);
			} else {
				startAt = parseInt(last) - 1;
			}
			endAt = startAt - parseInt(aPaginatorSize) - 1;

			for(var cntr = startAt; cntr >= endAt && cntr >= parseInt(aEndAt); cntr--) {
				indexes.push(Paginator.code2Display(cntr, aSeqType));
			}
		}
	} else {
		if (aDirection === 'backward') {
			if (last === undefined) {
				endAt = parseInt(aEndAt);
			} else {
				endAt = parseInt(last) - 1;
			}
			startAt = endAt - parseInt(aPaginatorSize) + 1;
			if (startAt <= parseInt(aStartAt)) startAt = parseInt(aStartAt);
			if (endAt - startAt + 1 < aPaginatorSize) {
				endAt = ((aPaginatorSize - (endAt - startAt)) + endAt) - 1;
			}

			for(var cntr = startAt; cntr <= endAt && cntr <= parseInt(aEndAt); cntr++) {
				indexes.push(Paginator.code2Display(cntr, aSeqType));
			}
		} else {
			if (last === undefined) {
				startAt = parseInt(aStartAt);
			} else {
				startAt = parseInt(last) + 1;
			}
			endAt = startAt + parseInt(aPaginatorSize) - 1;
			for(var cntr = startAt; cntr <= endAt && cntr <= parseInt(aEndAt); cntr++) {
				indexes.push(Paginator.code2Display(cntr, aSeqType));
			}
		}
	}

	return indexes;
};
Paginator.display2Code = function(aCode, aSeqType) {
	var result;
	if (aSeqType === 'num') {
		result = aCode;
	} else if (aSeqType === 'alpha') {
		if (aCode !== undefined) result = String(aCode).charCodeAt();
	} else if (aSeqType === 'day') {
		if (aCode !== undefined && aCode !== '&nbsp;') result = UiUtil.DisplayDateToDate(aCode);
	} else if (aSeqType === 'month') {
		result = aCode; // not use actually
	} else {
		result = aCode;
	}
	return result;
};
Paginator.code2Display = function(aNum, aSeqType) {
	var result;
	if (aSeqType === 'num') {
		result = aNum;
	} else if (aSeqType === 'alpha') {
		result = String.fromCharCode(aNum);
	} else if (aSeqType === 'day') {
		result = UiUtil.DateForDisplay(aNum);
	} else if (aSeqType === 'month') {
		result = aNum; // not use actually
	} else {
		result = aNum;
	}
	return result;
};
Paginator.generateIndexes = function(aPagiDiv, aPaginatorSize, aFuncIndexer, aDirection, aStartAt, aEndAt, aSeqType, aPageGap) {
	var allIndex = $('#' + aPagiDiv).find('a');
	var lastIndex;
	var lastValue;
	if (aDirection === 'backward') {
		for(var cntr = allIndex.length - 1; cntr >=0 ; cntr--) {
			if (allIndex[cntr].sopMarker !== undefined) {
				break;
			}
			var allImg = $(allIndex[cntr]).find('img');
			if (allImg.length === 0) { // not image
				lastIndex = cntr;
			}
		}
		if (lastIndex !== undefined) {
			lastValue = $(allIndex[lastIndex]).html();
		}
	} else {
		for(var cntr = 0; cntr < allIndex.length; cntr++) {
			if (allIndex[cntr].eopMarker !== undefined) {
				break;
			}
			var allImg = $(allIndex[cntr]).find('img');
			if (allImg.length === 0) { // not image
				lastIndex = cntr;
			}
		}
		if (lastIndex !== undefined) {
			lastValue = $(allIndex[lastIndex]).html();
		}
	}
	var indexes = aFuncIndexer(lastValue, aPaginatorSize, aDirection, aStartAt, aEndAt, aSeqType, aPageGap);
	if (indexes.length === 0) {
		indexes = undefined;
	}
	return indexes;
};
Paginator.image = function(imageName) {
	return "lib/paginator/img/" + imageName;
};
Paginator.doNothing = function() {
};
Paginator.getSelectedIndex = function(aPagiObj) {
	var selectedIdx;
	if (aPagiObj.sequenceType === 'month') {
		var selectedMthNum = UiUtil.MthNum(aPagiObj.selectedPage);
		if (UiUtil.MthNum(aPagiObj.startAt) > UiUtil.MthNum(aPagiObj.endAt)) { // descending pages number
			for(var cntr = 0; cntr < aPagiObj.tableOfIndex.length; cntr++) {
				var mthNum = UiUtil.MthNum((aPagiObj.tableOfIndex[cntr]));
				if (mthNum < selectedMthNum) {
					selectedIdx = cntr - 1;
					break;
				} else if (mthNum === selectedMthNum) {
					selectedIdx = cntr;
					break;
				}
			}
		} else {
			for(var cntr = 0; cntr < aPagiObj.tableOfIndex.length; cntr++) {
				var mthNum = UiUtil.MthNum((aPagiObj.tableOfIndex[cntr]));
				if (mthNum > selectedMthNum) {
					selectedIdx = cntr - 1;
					break;
				} else if (mthNum === selectedMthNum) {
					selectedIdx = cntr;
					break;
				}
			}
		}
		if (selectedIdx < 0) selectedIdx = undefined;
		if (selectedIdx !== undefined) {
			if (aPagiObj.tableOfIndex[selectedIdx] + "" !== aPagiObj.selectedPage + "") {
				aPagiObj.selectedPage = aPagiObj.tableOfIndex[selectedIdx];
			}
		}
	} else {
		for(var cntr = 0; cntr < aPagiObj.tableOfIndex.length; cntr++) {
			if (aPagiObj.tableOfIndex[cntr] + "" === aPagiObj.selectedPage + "") {
				selectedIdx = cntr;
				break;
			}
		}
	}
	return(selectedIdx);
};
Paginator.updatePaginator = function(aPagiObj, aPagiDiv, aClickCallback, aPaginatorSize, aFuncIndexer, aSeqType, aPageGap) {
	var paginator = $('#' + aPagiDiv).empty();
	var interval = {startPageIndex: 0, endPageIndex: aPaginatorSize};

	var pages = Paginator.createPagiElement(interval, function(pageIndex) {
		if (aPagiObj.tableOfIndex[pageIndex] + "" === aPagiObj.selectedPage + "") { // use non strict mathing to match whatever datatype, so long same value
			return $("<a>").attr("class", "page-current page-text").html(aPagiObj.tableOfIndex[pageIndex]).click(function(event) {
				if ($(this).text().trim().length === 0) return;
				aPagiObj.selectedPage = aPagiObj.tableOfIndex[pageIndex];
				aPagiObj.clickPage = aPagiObj.tableOfIndex[pageIndex];
				aPagiObj.pageAction = 'seek';
				aClickCallback();
				aPagiObj.displayPaginator();
			});
		} else {
			return $("<a>").attr("class", "page-text").html(aPagiObj.tableOfIndex[pageIndex]).click(function(event) {
				if ($(this).text().trim().length === 0) return;
				aPagiObj.selectedPage = aPagiObj.tableOfIndex[pageIndex];
				aPagiObj.clickPage = aPagiObj.tableOfIndex[pageIndex];
				aPagiObj.pageAction = 'seek';
				aClickCallback();
				aPagiObj.displayPaginator();
			});
		}
	});

	// "first" link
	var link = $("<a>").attr('id', 'page-gofirst').attr('class', 'page-img').html("<img src='" + Paginator.image("gofirst.png") + "'/>&nbsp;").click(function(event) {
		var indexes = aFuncIndexer(undefined, aPaginatorSize, 'forward', aPagiObj.startAt, aPagiObj.endAt, aSeqType, aPageGap);
		if (indexes !== undefined && indexes.length !== 0) {
			aPagiObj.tableOfIndex = indexes;
			aPagiObj.pageAction = 'gofirst';
			aPagiObj.displayPaginator();
			//aClickCallback();
		}
	});
	paginator.append(link);

	// "prev" link
	link = $("<a>").attr('class', 'page-img').html("<img src='" + Paginator.image("prev.png") + "'/>&nbsp;").click(function(event) {
		var indexes = Paginator.generateIndexes(aPagiDiv, aPaginatorSize, aFuncIndexer, 'backward', aPagiObj.startAt, aPagiObj.endAt, aSeqType, aPageGap);
		if (indexes !== undefined && indexes.length !== 0) {
			aPagiObj.tableOfIndex = indexes;
			aPagiObj.pageAction = 'goprev';
			aPagiObj.displayPaginator();
		}
	});
	link[0].sopMarker = true;
	paginator.append(link);

	// pages
	for (var cntr = 0; cntr < pages.length; cntr++) {
		var strA = pages[cntr];
		if (strA.html() === '') {
			strA.html('&nbsp');
		}
		paginator.append(strA).append("");
	}
	paginator.append(pages[pages.length - 1].css('margin-right', '8px'));

	// "next" link
	link = $("<a>").attr('class', 'page-img').html("<img src='" + Paginator.image("next.png") + "'/>&nbsp;").click(function(event) {
		var indexes = Paginator.generateIndexes(aPagiDiv, aPaginatorSize, aFuncIndexer, 'forward', aPagiObj.startAt, aPagiObj.endAt, aSeqType, aPageGap);
		if (indexes !== undefined && indexes.length !== 0) {
			aPagiObj.tableOfIndex = indexes;
			aPagiObj.pageAction = 'gonext';
			aPagiObj.displayPaginator();
		}
	});
	link[0].eopMarker = true;
	paginator.append(link);

	// "last" link
	link = $("<a>").attr('id', 'page-golast').attr('class', 'page-img').html("<img src='" + Paginator.image("golast.png") + "'/>&nbsp;").click(function(event) {
		var gotLast = false;
		var allIndex = $('#' + aPagiDiv).find('a');
		for(var cntr = 0; cntr < allIndex.length; cntr++) {
			var lastValue = $(allIndex[cntr]).html();
			if (lastValue + "" === aPagiObj.endAt + "") {
				gotLast = true;
				break;
			}
		}
		if (gotLast === false) {
			var indexes = aFuncIndexer(undefined, aPaginatorSize, 'backward', aPagiObj.startAt, aPagiObj.endAt, aSeqType, aPageGap);
			if (indexes !== undefined && indexes.length !== 0) {
				aPagiObj.tableOfIndex = indexes;
				aPagiObj.pageAction = 'golast';
				aPagiObj.displayPaginator();
			}
		}
	});
	paginator.append(link);

	// previous page page link
	link = $("<a>").attr('class', 'page-text page-button').css('margin-right', '2px').css('margin-left', '20px').html("Prev").click(function(event) {
		aPagiObj.pageAction = 'prev';
		aClickCallback();
	});
	paginator.append(link);

	// next page page link
	link = $("<a>").attr('class', 'page-text page-button').css('margin-left', '0px').html("Next").click(function(event) { 
		aPagiObj.pageAction = 'next';
		aClickCallback();
	});
	paginator.append(link);
};
Paginator.indexesDay = function(aLast, aPaginatorSize, aDirection, aStartAt, aEndAt, aSeqType, aPageGap) {
	var indexes = [];
	var startAt = UiUtil.DisplayDateToDate(aStartAt);
	var endAt = UiUtil.DisplayDateToDate(aEndAt); 
	var last = Paginator.display2Code(aLast, aSeqType);
	var paginatorSize = parseInt(aPaginatorSize);
	var pageGap = parseInt(aPageGap);

	if (startAt > endAt) { // desceding pages number
		if (aDirection === 'backward') {
			if (last !== undefined) {
				endAt = UiUtil.DatePlusDay(last, pageGap);
			}
			startAt = UiUtil.DatePlusDay(endAt, (paginatorSize - 1 * (pageGap)));
			if (startAt >= UiUtil.DisplayDateToDate(aStartAt)) startAt = UiUtil.DisplayDateToDate(aStartAt);
			if ((UiUtil.DateDiffInDays(startAt, endAt)/pageGap) + 1 < paginatorSize) {
				endAt = UiUtil.DateMinusDay(endAt, (paginatorSize * pageGap));
			}
			for(var cntrDate = startAt; cntrDate >= endAt && cntrDate >= UiUtil.DisplayDateToDate(aEndAt); cntrDate = UiUtil.DateMinusDay(cntrDate, pageGap)) {
				indexes.push(Paginator.code2Display(cntrDate, aSeqType));
			}
		} else {
			if (aLast !== '&nbsp;') {
				if (last === undefined) {
					startAt = UiUtil.DisplayDateToDate(aStartAt);
				} else {
					startAt = UiUtil.DateMinusDay(last,  pageGap);
				}
				endAt = UiUtil.DateMinusDay(UiUtil.DateMinusDay(startAt, paginatorSize * pageGap), pageGap);
				for(var cntrDate = startAt; cntrDate >= endAt && cntrDate >= UiUtil.DisplayDateToDate(aEndAt); cntrDate = UiUtil.DateMinusDay(cntrDate, pageGap)) {
					indexes.push(Paginator.code2Display(cntrDate, aSeqType));
				}
			}
		}
	} else {
		if (aDirection === 'backward') {
			if (last === undefined) {
				endAt = UiUtil.DisplayDateToDate(aEndAt);
			} else {
				endAt = UiUtil.DateMinusDay(last, pageGap);
			}
			startAt = UiUtil.DatePlusDay(UiUtil.DateMinusDay(endAt, paginatorSize * pageGap), pageGap);
			if (startAt <= UiUtil.DisplayDateToDate(aStartAt)) startAt = UiUtil.DisplayDateToDate(aStartAt);
			if ((UiUtil.DateDiffInDays(endAt, startAt)/pageGap) + 1 < paginatorSize) {
				endAt = UiUtil.DateMinusDay((((paginatorSize - (UiUtil.DateDiffInDays(endAt, startAt)/pageGap))*pageGap) + endAt), pageGap);
			}

			for(var cntrDate = startAt; cntrDate <= endAt && cntrDate <= UiUtil.DisplayDateToDate(aEndAt); cntrDate = UiUtil.DatePlusDay(cntrDate, pageGap)) {
				indexes.push(Paginator.code2Display(cntrDate, aSeqType));
			}
		} else {
			if (last === undefined) {
				startAt = UiUtil.DisplayDateToDate(aStartAt);
			} else {
				startAt = UiUtil.DatePlusDay(last, pageGap);
			}
			endAt = UiUtil.DateMinusDay(UiUtil.DatePlusDay(startAt, paginatorSize * pageGap), pageGap);
			for(var cntrDate = startAt; cntrDate <= endAt && cntrDate <= UiUtil.DisplayDateToDate(aEndAt); cntrDate = UiUtil.DatePlusDay(cntrDate, pageGap)) {
				indexes.push(Paginator.code2Display(cntrDate, aSeqType));
			}
		}
	}

	return(indexes);
};
Paginator.indexesDay.getPreviousPage = function(aPagiObj, aPreviousPage) {
	var result;
	if (aPagiObj.startAt > aPagiObj.endAt) { // desceding pages number
		var prevPage = UiUtil.DatePlusDay(UiUtil.DisplayDateToDate(aPreviousPage), aPagiObj.pageGap);
		result = UiUtil.DateForDisplay(prevPage);
	} else {
		var prevPage = UiUtil.DateMinusDay(UiUtil.DisplayDateToDate(aPreviousPage), aPagiObj.pageGap);
		result = UiUtil.DateForDisplay(prevPage);
	}
	return(result);
};
Paginator.indexesNum.getPreviousPage = function(aPagiObj, aCode) {
	var result;
	if (aPagiObj.startAt > aPagiObj.endAt) { // desceding pages number
		result = aCode + 1;
	} else {
		result = aCode - 1;
	}
	return(result);
};
Paginator.indexesChar.getPreviousPage = function(aPagiObj, aCode) {
	var result;
	if (aPagiObj.startAt > aPagiObj.endAt) { // desceding pages number
		result = aCode.charCodeAt(0) + 1;
	} else {
		result = aCode.charCodeAt(0) - 1;
	}
	return(String.fromCharCode(result));
};
Paginator.indexesMonth = function(aPreviousPage, aPaginatorSize, aDirection, aStartAt, aEndAt, aSeqType, aPageGap) {
	var indexes = [];
	var startAt = aStartAt;
	var endAt = aEndAt;
	var previousPage = aPreviousPage;
	var paginatorSize = parseInt(aPaginatorSize);
	var pageGap = parseInt(aPageGap);

	if (UiUtil.MthNum(startAt) > UiUtil.MthNum(endAt)) { // descending pages number
		if (aDirection === 'backward') {
			if (previousPage !== undefined) {
				var endAtNum = UiUtil.MthNum(previousPage) + pageGap;
				endAt = UiUtil.MthAbbrvStartFromOne(endAtNum);
			}

			var startAtNum = (UiUtil.MthNum(endAt) + ((paginatorSize - 1) * (pageGap)));
			if (startAtNum >= UiUtil.MthNum(aStartAt)) {
				startAt = aStartAt;
				endAt = UiUtil.MthAbbrvStartFromOne((UiUtil.MthNum(startAt) - ((paginatorSize - 1) * pageGap)));
				if (UiUtil.MthNum(endAt) <= UiUtil.MthNum(aEndAt)) endAt = aEndAt;
			} else {
				startAt = UiUtil.MthAbbrvStartFromOne(startAtNum);
			}

			for(var cntrMonth = UiUtil.MthNum(startAt); cntrMonth >= UiUtil.MthNum(endAt) - 1 && cntrMonth >= UiUtil.MthNum(aEndAt) - 1; cntrMonth = cntrMonth - pageGap) {
				if (cntrMonth === 0) 
					indexes.push(UiUtil.MthAbbrvStartFromOne(1));
				else
					indexes.push(UiUtil.MthAbbrvStartFromOne(cntrMonth));
			}
		} else {
			if (aPreviousPage !== '&nbsp;') {
				if (previousPage === undefined) {
					startAt = aStartAt;
				} else {
					var previousPageNum = UiUtil.MthNum(previousPage);
					if (previousPageNum === 12) {
						startAt = UiUtil.MthAbbrvStartFromOne(previousPageNum); // do not minus pageGap if already at first page
					} else {
						startAt = UiUtil.MthAbbrvStartFromOne(previousPageNum - pageGap);
					}
				}
				var endAtNum = (UiUtil.MthNum(startAt) - (paginatorSize * pageGap)) + pageGap;
				if (endAtNum < UiUtil.MthNum(aEndAt)) endAtNum = UiUtil.MthNum(aEndAt);
				endAt = UiUtil.MthAbbrvStartFromOne(endAtNum);
				for(var cntrMonth = UiUtil.MthNum(startAt); cntrMonth >= UiUtil.MthNum(endAt) - 1 && cntrMonth >= UiUtil.MthNum(aEndAt) - 1 && cntrMonth > 0; cntrMonth = cntrMonth - pageGap) {
					indexes.push(UiUtil.MthAbbrvStartFromOne(cntrMonth));
				}
			}
		}
	} else {
		if (aDirection === 'backward') {
			if (previousPage === undefined) {
				endAt = aEndAt;
			} else {
				var endAtNum = UiUtil.MthNum(previousPage) - pageGap;
				endAt = UiUtil.MthAbbrvStartFromOne(endAtNum);
			}
			var startAtNum = (UiUtil.MthNum(endAt) - (paginatorSize * pageGap)) + pageGap;
			startAt = UiUtil.MthAbbrvStartFromOne(startAtNum);
			if (UiUtil.MthNum(startAt) <= UiUtil.MthNum(aStartAt)) startAt = aStartAt;
			if (((UiUtil.MthNum(endAt) - UiUtil.MthNum(startAt))/pageGap) + 1 < paginatorSize) {
				var endAtNum = (((paginatorSize - ((UiUtil.MthNum(endAt) - UiUtil.MthNum(startAt))/pageGap))*pageGap) + endAt) - pageGap;
				endAt = UiUtil.MthAbbrvStartFromOne(endAtNum);
			}

			for(var cntrMonth = UiUtil.MthNum(startAt); cntrMonth <= UiUtil.MthNum(endAt) && cntrMonth <= UiUtil.MthNum(aEndAt); cntrMonth = cntrMonth + pageGap) {
				indexes.push(UiUtil.MthAbbrvStartFromOne(cntrMonth));
			}
		} else {
			if (previousPage === undefined) {
				startAt = aStartAt;
			} else {
				var startAtNum = UiUtil.MthNum(previousPage) +  pageGap;
				startAt = UiUtil.MthAbbrvStartFromOne(startAtNum);
			}
			var endAtNum = UiUtil.MthNum(startAt) + (paginatorSize * pageGap) - pageGap;
			endAt = UiUtil.MthAbbrvStartFromOne(endAtNum);
			for(var cntrMonth = UiUtil.MthNum(startAt); cntrMonth <= UiUtil.MthNum(endAt) && cntrMonth <= UiUtil.MthNum(aEndAt); cntrMonth = cntrMonth + pageGap) {
				indexes.push(UiUtil.MthAbbrvStartFromOne(cntrMonth));
			}
		}
	}
	return indexes;
};
Paginator.indexesMonth.getPreviousPage = function(aPagiObj, aCurrentPage) {
	var result;
	var currentPage = UiUtil.MthNum(aCurrentPage);
	if (UiUtil.MthNum(aPagiObj.startAt) > UiUtil.MthNum(aPagiObj.endAt)) { // desceding pages number
		result = currentPage + aPagiObj.pageGap;
		var startAtNum = UiUtil.MthNum(aPagiObj.startAt);
		if (result > startAtNum) result = startAtNum;
	} else {
		result = currentPage - aPagiObj.pageGap;
		var startAtNum = UiUtil.MthNum(aPagiObj.startAt);
		if (result < startAtNum) result = startAtNum;
	}
	return UiUtil.MthAbbrvStartFromOne(result);
};
Paginator.simpleModePaginator = function(aPagiObj, aPagiDiv, aClickCallback) {
	var paginator = $('#' + aPagiDiv).css({'display': 'flex', 'align-items': 'center'}).empty();

	// first page page link
	link = $("<a>").attr('class', 'page-text page-button').css('margin-right', '2px').css('margin-left', '20px').html("<img style='margin-bottom: 3px; margin-right: 3px' src='" + Paginator.image("gofirst.png") + "'/>First").click(function(event) {
		aPagiObj.pageAction = 'first';
		aClickCallback();
	});
	paginator.append(link);

	// previous page page link
	link = $("<a>").attr('class', 'page-text page-button').css('margin-right', '2px').css('margin-left', '0px').html("<img style='margin-bottom: 3px' src='" + Paginator.image("prev.png") + "'/>Prev").click(function(event) {
		aPagiObj.pageAction = 'prev';
		aClickCallback();
	});
	paginator.append(link);

	// ... 
	//link = $("<a>").attr('class', 'page-text page-button').css('margin-right', '2px').css('margin-left', '0px').html("...");
	let dotStyles = {
		'width': '3px',
		'height': '3px',
		'background-color': '#333',
		'border-radius': '50%',
		'margin': '0 5px',
		'margin-right': '2px'
	};
	const dot1 = $("<a>").attr('class', 'page-text').css(dotStyles).css('margin-left', '0px').html("");
	const dot2 = $("<a>").attr('class', 'page-text').css(dotStyles).css('margin-left', '0px').html("");
	const dot3 = $("<a>").attr('class', 'page-text').css(dotStyles).css('margin-left', '0px').html("");
	paginator.append(dot1);
	paginator.append(dot2);
	paginator.append(dot3);

	// next page page link
	link = $("<a>").attr('class', 'page-text page-button').css('margin-left', '0px').html("Next<img style='margin-bottom: 3px' src='" + Paginator.image("next.png") + "'/>").click(function(event) { 
		aPagiObj.pageAction = 'next';
		aClickCallback();
	});
	paginator.append(link);

};
