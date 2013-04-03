//global variables
var dayArray = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday");
var dateTime = new Date();
var currentDay = dateTime.getUTCDay();
var currentMinutes;
var eventNumbers = new Array();
var currentEvent;
var dayCutoff = 1139;
//end global variables

//startup code
window.onload = pageInit;
function $(id) { return document.getElementById(id); }

/******LOGIC START******/

//XML load fucnction
function parseXML() 
{ 
xmlHttp = new window.XMLHttpRequest();
xmlHttp.open("GET","eventList.xml",false);
xmlHttp.send(null);
xmlDoc = xmlHttp.responseXML.documentElement;
}

//main function
function pageInit()
{
	parseXML();
	var dayTag = xmlDoc.getElementsByTagName('day');
	generateCurrentTime();
	alert("Current Minutes = " + currentMinutes);
	//adjusts day to eastern time from UTC
	if (currentMinutes > dayCutoff)
	{
		currentDay--;
		if (currentDay < 0)
		{
			currentDay = 6;
		}
	}
	alert("Current Day = " + currentDay);
	//gets list of all events with matching date
	eventNumbers = [];
	for (i=0; i<dayTag.length; i++)
	{
		if (dayTag[i].childNodes[0].nodeValue == dayArray[currentDay])
		{
			eventNumbers.push(i)
		}
	}
	//compares times of all events with correct day, tries to find the right event
	var startTimes = xmlDoc.getElementsByTagName('starttime');
	var endTimes = xmlDoc.getElementsByTagName('endtime');
	var isDefault = true;
	for (j=0; j<eventNumbers.length; j++)
	{
		alert("Testing currentEvent: " + eventNumbers[j] + "||ST:" + startTimes[eventNumbers[j]].childNodes[0].nodeValue + "||ET:" + endTimes[eventNumbers[j]].childNodes[0].nodeValue + "||CT:" + currentMinutes);
		//checks to see if currentMinutes is a value within an events's start and end value
		if (currentMinutes >= startTimes[eventNumbers[j]].childNodes[0].nodeValue && currentMinutes < endTimes[eventNumbers[j]].childNodes[0].nodeValue )
		{
			isDefault = false;
			currentEvent = eventNumbers[j];

		}
	}
	//sets default case if true, matching event if false
	if (!isDefault)
	{
		setCurrent();
	}else{
		setDefault();
	}
}

// Compensates for daylight savings time locally
// A free script from: www.mresoftware.com
function DST(){
	var today = new Date;
	var yr = today.getFullYear();
	var dst_start = new Date("March 14, "+yr+" 02:00:00"); // 2nd Sunday in March can't occur after the 14th 
	var dst_end = new Date("November 07, "+yr+" 02:00:00"); // 1st Sunday in November can't occur after the 7th
	var day = dst_start.getUTCDay(); // day of week of 14th
	dst_start.setDate(14-day); // Calculate 2nd Sunday in March of this year
	day = dst_end.getUTCDay(); // day of the week of 7th
	dst_end.setDate(7-day); // Calculate first Sunday in November of this year
	if (today >= dst_start && today < dst_end){ //does today fall inside of DST period?
		currentMinutes += 60;
		dayCutoff +=60;
	}else{
		currentMinutes += 0;
	}

}

//fetches current time and sets vars
function generateCurrentTime()
{
	dateTime = new Date();
	currentMinutes = dateTime.getUTCHours() * 60;
	currentMinutes += dateTime.getUTCMinutes();
	currentDay = dateTime.getUTCDay();
	currentMinutes -= 300;
	DST();
	if (currentMinutes < 0)
	{
		currentMinutes = 1440 + currentMinutes;
	}
}

//sets Default event case in the HTML, can be modified to include more and/or less
function setDefault(){
	//image
	$("eventPic").setAttribute("src", xmlDoc.getElementsByTagName('dEventPic')[0].childNodes[0].nodeValue);
	//text
	$("eventTitle").innerHTML = xmlDoc.getElementsByTagName('dTitle')[0].childNodes[0].nodeValue;
	$("eventTime").innerHTML = xmlDoc.getElementsByTagName('dEventTime')[0].childNodes[0].nodeValue;
	$("eventInfo").innerHTML = xmlDoc.getElementsByTagName('dInfo')[0].childNodes[0].nodeValue;
}

//sets Current event in the HTML, can be modified to include more and/or less
function setCurrent(){
	//image
	$("eventPic").setAttribute("src", xmlDoc.getElementsByTagName('eventPic')[currentEvent].childNodes[0].nodeValue);
	//text
	$("eventTitle").innerHTML = xmlDoc.getElementsByTagName('eventTitle')[currentEvent].childNodes[0].nodeValue;
	$("eventTime").innerHTML = xmlDoc.getElementsByTagName('eventTime')[currentEvent].childNodes[0].nodeValue;
	$("eventInfo").innerHTML = xmlDoc.getElementsByTagName('eventInfo')[currentEvent].childNodes[0].nodeValue;
}

//generates a schedule for the appropriate day
function generateCalendar(){
	$("calendarTitle").innerHTML = "Calendar for " + dayArray[currentDay];
	$("calendarList").innerHTML = "";
	var lastShowStart = 0;
	var startTimes = xmlDoc.getElementsByTagName('starttime');
	var endTimes = xmlDoc.getElementsByTagName('endtime');
	for (i=0; i<=1440; i++)
	{
		for (j=0; j<eventNumbers.length; j++)
		{
			if (endTimes[eventNumbers[j]].childNodes[0].nodeValue == i)
			{
				$("calendarList").innerHTML += "<li>" + xmlDoc.getElementsByTagName('eventTime')[eventNumbers[j]].childNodes[0].nodeValue + " : " + xmlDoc.getElementsByTagName('eventTitle')[eventNumbers[j]].childNodes[0].nodeValue;
			}
		}
	}
}