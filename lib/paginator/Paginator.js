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
	//this.sequenceType= 'alpha';
	this.selectedPage = '1';
	this.clickPage = '1';
	this.startAt = '1';
	this.endAt = '99';

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

	//if (this.funcIndexer === Paginator.indexesChar) {
	if (this.sequenceType === 'alpha') {
		this.startAt = 'A';
		this.endAt = 'Z';
		this.selectedPage = 'A';
		this.clickPage = 'A';
		this.funcIndexer = Paginator.indexesChar;
	}

	if (this.selectedPage === undefined) {
		this.selectedPage = this.startAt;
		this.clickPage = this.startAt;
	}

	if (this.tableOfIndex === undefined) {
		this.tableOfIndex = Paginator.generateIndexes(this.divId, this.paginatorSize, this.funcIndexer, 'forward', this.startAt, this.endAt, this.sequenceType);
		this.displayPaginator();
	}
};
Paginator.prototype.displayPaginator = function() {
	Paginator.updatePaginator(this, this.divId, this.clickCallback, this.paginatorSize, this.funcIndexer, this.sequenceType);
};
Paginator.prototype.windowToActivePage = function(aPage) {
	this.selectedPage = aPage;
	var selPage = Paginator.getSelectedIndex(this); // is aPage in the window, if yes do nothing, else generate indexes for that window
	if (selPage === undefined) {
		var prevPage = this.funcIndexer.decrease(aPage);
		var indexes = this.funcIndexer(prevPage, this.paginatorSize, 'forward', this.startAt, this.endAt, this.sequenceType);
		this.tableOfIndex = indexes;
	}
	Paginator.updatePaginator(this, this.divId, this.clickCallback, this.paginatorSize, this.funcIndexer, this.sequenceType);
};
Paginator.prototype.empty = function() {
	$('#' + this.divId).empty();
};
Paginator.createPagiElement = function(interval, func) {
    var pages = [];
    for (var cntr = interval.startPageIndex; cntr < interval.endPageIndex; cntr++) {
        pages.push(typeof func === "function" ? func(cntr) : cntr);
    }
    return(pages);
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
	return(indexes);
};
Paginator.indexesChar.decrease = function(aCode) {
	var result = aCode.charCodeAt(0) - 1;
	return(String.fromCharCode(result));
};
Paginator.indexesNum = function(aLast, aPaginatorSize, aDirection, aStartAt, aEndAt, aSeqType) {
	var indexes = [];
	var startAt = parseInt(aStartAt);
	var endAt = parseInt(aEndAt); 
	var last = Paginator.display2Code(aLast, aSeqType);

//if (aSeqType !== 'num' && last === 38) last = endAt;
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
				endAt = ((aPaginatorSize - (startAt - endAt)) - endAt) - 1;
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

			//for(var cntr = startAt; cntr <= endAt && cntr >= parseInt(aStartAt); cntr++) {
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

	return(indexes);
};
Paginator.indexesNum.decrease = function(aCode) {
	var result = aCode - 1;
	return(result);
};
Paginator.display2Code = function(aCode, aSeqType) {
	var result;
	if (aSeqType === 'num') {
		result = aCode;
	} else if (aSeqType === 'alpha') {
		if (aCode !== undefined) result = String(aCode).charCodeAt();
	} else {
		result = aCode;
	}
	return(result);
};
Paginator.code2Display = function(aNum, aSeqType) {
	var result;
	if (aSeqType === 'num') {
		result = aNum;
	} else if (aSeqType === 'alpha') {
		result = String.fromCharCode(aNum);
	} else {
		result = aNum;
	}
	return(result);
};
Paginator.generateIndexes = function(aPagiDiv, aPaginatorSize, aFuncIndexer, aDirection, aStartAt, aEndAt, aSeqType) {
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
			//lastValue = parseInt(lastValue) - 1;
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
			//lastValue = parseInt(lastValue) + 1;
		}
	}
	var indexes = aFuncIndexer(lastValue, aPaginatorSize, aDirection, aStartAt, aEndAt, aSeqType);
	if (indexes.length === 0) {
		indexes = undefined;
	}
	return(indexes);
};
Paginator.image = function(imageName) {
	return "js/paginator/img/" + imageName;
};
Paginator.doNothing = function() {
};
Paginator.getSelectedIndex = function(aPagiObj) {
	var selectedIdx;
	for(var cntr = 0; cntr < aPagiObj.tableOfIndex.length; cntr++) {
		if (aPagiObj.tableOfIndex[cntr] + "" === aPagiObj.selectedPage + "") {
			selectedIdx = cntr;
			break;
		}
	}
	return(selectedIdx);
};
Paginator.updatePaginator = function(aPagiObj, aPagiDiv, aClickCallback, aPaginatorSize, aFuncIndexer, aSeqType) {
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
		var indexes = aFuncIndexer(undefined, aPaginatorSize, 'forward', aPagiObj.startAt, aPagiObj.endAt, aSeqType);
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
		var indexes = Paginator.generateIndexes(aPagiDiv, aPaginatorSize, aFuncIndexer, 'backward', aPagiObj.startAt, aPagiObj.endAt, aSeqType);
		if (indexes !== undefined && indexes.length !== 0) {
			aPagiObj.tableOfIndex = indexes;
			aPagiObj.pageAction = 'goprev';
			aPagiObj.displayPaginator();
			//aClickCallback();
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
		var indexes = Paginator.generateIndexes(aPagiDiv, aPaginatorSize, aFuncIndexer, 'forward', aPagiObj.startAt, aPagiObj.endAt, aSeqType);
		if (indexes !== undefined && indexes.length !== 0) {
			aPagiObj.tableOfIndex = indexes;
			aPagiObj.pageAction = 'gonext';
			aPagiObj.displayPaginator();
			//aClickCallback();
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
			var indexes = aFuncIndexer(undefined, aPaginatorSize, 'backward', aPagiObj.startAt, aPagiObj.endAt, aSeqType);
			if (indexes !== undefined && indexes.length !== 0) {
				aPagiObj.tableOfIndex = indexes;
				aPagiObj.pageAction = 'golast';
				aPagiObj.displayPaginator();
				//aClickCallback();
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