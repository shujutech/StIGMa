
function Obj2StJson(aObj)  {
  function Obj2StJsonRecursive(aObj) {
    var stObj = {};
    for(var key in aObj) {
    	var newKey = UiUtil.CamelCaseToTitleCase(key);
    	if (typeof aObj[key] !== "object") {
			if (UiUtil.NotUndefineNotNull(aObj[key])) {
				stObj[newKey] = { "data" : aObj[key]};	
			} else {
				stObj[newKey] = { "data" : ""};
				}       
			  } else {
			  	if (UiUtil.NotUndefineNotNull(aObj[key])) {
			  		stObj[newKey] = { "data" : Obj2StJsonRecursive(aObj[key])};
			} else {
				stObj[newKey] = { "data" : ""};
				}           	         
			  }
			}
			return(stObj);
  	}
  
	var stObj = {"data" : Obj2StJsonRecursive(aObj)};    
	console.log(JSON.stringify(stObj));  
	return(stObj);
};
  