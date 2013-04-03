Automate_Event_Display
================
Written by Alex Muench

Tested and works in IE9, Chrome, Firefox, iPhone, and Android devices

Small javascript code that reads events from an XML file.  Changes text fields or images on a website based on time-of-day and day-of-the-week.  Can be set to change info on a specific time zone, or on user's local time.  A calendar of scheduled events for one day can also be generated.

Project began as a way for WVFI Radio (http://wvfi.nd.edu) to display what show was currently on the air.  Limited to a University-hosted web space without any SQL databases, this script was designed to fetch show info from XML sheet, and displays title, show description, and show image.  Widget also generates a calendar on the schedule page

Package consists of following components:
	1) Javascript file, to be place in header of website
	2) Blank XML template, configured specifically for current setup in Javascript file
	3) Working example (will not work if opened locally unless Firefox is used due to security presets on other browsers)
	