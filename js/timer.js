var totalSeconds = 0;
var hour = 0;
var minute = 0;
var seconds = 0;
var timerOn = false;

 
function countTimer() {
	if (timerOn == true){
		++totalSeconds;
	   	hour = Math.floor(totalSeconds /3600);
	   	minute = Math.floor((totalSeconds - hour*3600)/60);
	   	seconds = totalSeconds - (hour*3600 + minute*60);
	}

	document.getElementById("timer").innerHTML = hour + ":" + minute + ":" + seconds;
}

//at loading page
document.getElementById("timer").innerHTML = hour + ":" + minute + ":" + seconds;