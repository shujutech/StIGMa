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

For a quick start and understanding how it works, download the project and open "sample-output.html" file in your browser, immediately a more advance HTML UI sample screen is displayed.

![image](https://user-images.githubusercontent.com/13131400/110580089-e31dd400-81a2-11eb-9ccf-aa2781effcc1.png)


# Features

Capable of translate JSON stucture name/value pair to the following:

- Textbox
- Combobox, Dropdown
- Datetime popup
- Date popup
- Array of objects (slider to create, update and delete each object)
- Currency amount
- Full telephone information with country code, access code etc
- HTML free text area
- Data masks for number, currency etc 
- Grid of rows
- Create your own, more...


# Full Flow From Your Data Model to HTML UI

We're able to directly convert your data model from a relational database such as Postgres, MariaDb or MySQL into HTML UI for CRUD or as a foundation to the UI you intent to build. Check the full stack with StIGMa, StORMi at http://shujutech.mywire.org/corporation?goto=ormj


# License

StIGMa is bundle with 3rd party software that're all open source and free to use. For us, the software is absolutely FREE and anyone can use, modify, change or remove anything from the code. We will not be liable for any consequences due to the use of this software and is not responsible for either this or any other 3rd party software bundled here. As far we know, all software provided here is open source and free for use.


# Contact Us

For any further support, please contact me at shujutech@gmail.com



