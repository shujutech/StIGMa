CountryFlagTel.AllCountryFlag = null;
CountryFlagTel.prototype.locationId = '';
CountryFlagTel.prototype.masterDiv = null;
CountryFlagTel.prototype.noDialCode = true;
CountryFlagTel.prototype.defaultCountry = 'my';
CountryFlagTel.prototype.onCountrySelected = function(aCountryName) {};
if (typeof UiUtil === 'undefined' || UiUtil === null) {
	UiUtil = {}; // to avoid nb warning
};
function CountryFlagTel() {
	alert("The CountryFlagTel constructor must have one argument, i.e. the name of the variable");
};
function CountryFlagTel(aLocationId, aNoDialCode, aDefaultCountry) { 
	this.locationId = aLocationId;
	this.noDialCode = aNoDialCode;
	this.defaultCountry = aDefaultCountry;
};

CountryFlagTel.GetFlagDiv = function(aCountryName) {
	var resultDiv = null;
	if (CountryFlagTel.AllCountryFlag === null) {
		console.log("Load all the flags by calling CountryFlagTel.LoadAllFlag() first!");
		/* don't work, the load is asynchronous still
		CountryFlagTel.LoadAllFlag(function() { 
			resultDiv = CountryFlagTel.GetFlagDiv(aCountryName);
		});
		*/
	} else {
		for(var cntr = 0; cntr < CountryFlagTel.AllCountryFlag.length; cntr++) {
			var item = CountryFlagTel.AllCountryFlag[cntr];
			var eachCountry = item.getElementsByClassName("country-name")[0];
			if (eachCountry.textContent.toLowerCase().startsWith(aCountryName.toLowerCase())) {
				resultDiv = item.firstElementChild;
			}
		}
	}
	return(resultDiv);	
};
CountryFlagTel.LoadAllFlag = function(aCompleteFunc) {
	var divHolder = document.createElement("div");
	if (CountryFlagTel.AllCountryFlag === null) {
		CountryFlagTel.AllCountryFlag = [];
	}

	$(divHolder).load('lib/CountryFlagTel/CountryFlagTel.txt #country-flag-tel', function() { // aside this load, others is pure javascript
		var allLi = divHolder.querySelector("#list-of-country").getElementsByTagName("li");
		for(var cntr = 0; cntr < allLi.length; cntr++) {
			var item = allLi[cntr];
			CountryFlagTel.AllCountryFlag.push(item);
		}
		if (UiUtil.NotUndefineNotNullNotBlank(aCompleteFunc)) {
			aCompleteFunc();
		}
	}); 
};


CountryFlagTel.prototype.displayObject = function() {
	this.masterDiv = $('#' + this.locationId);
	this.masterDiv.empty();
	var proto = this;
	this.masterDiv.load('lib/CountryFlagTel/CountryFlagTel.txt #country-flag-tel', function() {
		proto.init(proto);
	}); 
};

CountryFlagTel.prototype.init = function(aThis) {
	var self = aThis;
	var vnoDialCode = aThis.noDialCode;
	$(window).click(function() {
		aThis.masterDiv.find('#list-of-country').css("display", "none");
	});

	aThis.masterDiv.find('#select-country').click(function(evt) {
		evt.stopPropagation();
	});

	aThis.masterDiv.find("#list-of-country li").click(function() {
		var countryName = '';
		if (vnoDialCode) {
			countryName = $(this).find('.country-name').text().trim();
		} else {
			countryName = $(this).text().trim();
		}
		if (self.onCountrySelected(countryName) === false) return;
		self.masterDiv.find('#country-name').val(countryName);


		var elemFlag = self.masterDiv.find('#select-country .selected-flag .iti-flag')[0];
		elemFlag.className = '';
		$(elemFlag).addClass('iti-flag ' + $(this).attr('data-country-code'));

		var elemDialCode = self.masterDiv.find('#select-country .selected-flag .selected-dial-code')[0];
		if (vnoDialCode) {
			$(elemDialCode).text("");
		} else {
			$(elemDialCode).text($(this).find(".dial-code").text());
		}
	});

	aThis.masterDiv.find("#select-country").click(function() {
		self.dropCountryList();
	});

	aThis.clickOnCountry(aThis.defaultCountry);
}; 

CountryFlagTel.prototype.dropCountryList = function () {
	if (this.masterDiv.find('#list-of-country').css("display") === "none") {
		this.masterDiv.find('#list-of-country').css("display", "block");
	} else {
		this.masterDiv.find('#list-of-country').css("display", "none");
	}
};

CountryFlagTel.prototype.clickOnCountry = function(aCountryCode) {
	var chosenIdx = 0;
	var listItems = this.masterDiv.find("#select-country li");
	listItems.each(function(idx, li) {
		if ($(li).attr('data-country-code') === aCountryCode) {
			chosenIdx = idx;
		}
	});
	listItems[chosenIdx].click();
	this.dropCountryList();
	if (this.noDialCode) {
		this.masterDiv.find('#list-of-country .dial-code').css('display', 'none');
		this.masterDiv.find('#select-country .selected-flag .iti-flag').css('margin-left', '10px');
	} 
};

CountryFlagTel.prototype.getCountry = function() {
	return(this.masterDiv.find('#country-name').val());
};

CountryFlagTel.prototype.getCountryElement = function() {
	return(this.masterDiv.find('#country-name'));
};

CountryFlagTel.LoadAllFlag();