# StIGMa

StIGMA translate JSON real world objects into another JSON structure that is then fed into the following StIGMA web page generator. Translate your real world objects at http://shujutech.mywire.org/corporation?goto=json2web (make sure browser popup is enable for this site)


Thereafter follow the below instructions below to embed the dynamically generated web page or alternatively you can copy the div tag with "screenDiv" id into your own web page for modifications and customizations.


Usage:
 
 After downloading the zip, extract and place into your web project, put the following js in your project HTML 

		<link rel="stylesheet" href="lib/bootstrap.min.css" property="">
		<link rel="stylesheet" href="js/editablegrid-master/editablegrid.css" property=""> 
		<link rel="stylesheet" href="lib/datePicker-master/css/datepicker.css" property="">
		<link rel='stylesheet' href='js/font-awesome-4.2.0/css/font-awesome.css' type='text/css' media='screen' property=""> 
		<link rel="stylesheet" href="css/st-common.css" property="">  
		<link rel="stylesheet" href="font/font-montserrat.css" property="">

		<script type="text/javascript" src="lib/jquery-3.3.1.min.js"></script>
		<script src="lib/bootstrap.bundle.min.js" type="text/javascript"></script>
		<script type="text/javascript" src="lib/datePicker-master/js/datepicker.js"></script>
		<script type="text/javascript" src="lib/nicEdit/nicEdit.js"></script>
		<script type="text/javascript" src="lib/jQuery-Mask-Plugin-master/dist/jquery.mask.min.js"></script>
		<script type="text/javascript" src="lib/datePicker-master/js/datepicker.js"></script>
		<script type="text/javascript" src="lib/sweetalert2.all.min.js"></script>

		<script type='text/javascript' src='js/editablegrid-master/editablegrid.js'></script>
		<script type='text/javascript' src='js/editablegrid-master/editablegrid_charts.js'></script>
		<script type='text/javascript' src='js/editablegrid-master/editablegrid_charts_ofc.js'></script>
		<script type='text/javascript' src='js/editablegrid-master/editablegrid_editors.js'></script>
		<script type='text/javascript' src='js/editablegrid-master/editablegrid_renderers.js'></script>
		<script type='text/javascript' src='js/editablegrid-master/editablegrid_utils.js'></script>
		<script type='text/javascript' src='js/editablegrid-master/editablegrid_validators.js'></script>

		<script type="text/javascript" src="lib/UiUtil.js"></script>
		<script type="text/javascript" src="lib/UiForm.js"></script>   
		<script type="text/javascript" src="lib/UiGrid.js"></script>   
		<script type="text/javascript" src="lib/Js2StJson.js"></script>
    
To generate the HTML file in accordance to its JSON input, insert the following lines and assign strForDisplay with the JSON string translated from StIGMA engine. This function is executed upon HTML page got loaded.

		<div id="screenDiv" style="margin: 20px"></div>
		<script>
			(function() {
				var strForDisplay = <the JSON string translated from the StIGMA engine>
				var objForDisplay = JSON.parse(strForDisplay);
				var screenLayout = new UiForm("screenLayout");
				screenLayout.displayObject("screenDiv", objForDisplay, "Product Description");
				screenLayout.scrollAndFocus();
			})();
		</script>, 


# Quick Start

For a quick start and understanding how it works, download the project and open "sample-output.html" file in your browser, immediately a more advance html UI sample screen is displayed.



# Full Flow From Your Data Model to HTML UI

We're able to directly convert your data model from a relational database such as Postgres, MariaDb or MySQL into HTML UI for CRUD or as a foundation to the UI you intent to build. Check the full stack with StIGMa, StORMi at http://shujutech.mywire.org/corporation?goto=ormj



# Contact Us

For any further support, please contact me at shujutech@gmail.com



