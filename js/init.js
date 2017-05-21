function go() {
	life();
	if (t % 1 == 0) { ta() };     
}
 
function play() {
	timerOn = true;
	playiv = setInterval(go, speed);
	//timer doesn't work properly when restarted, needs more debugging (window.setInterval or putting setInterval in a variable doesn't help)
	setInterval(countTimer, 1000);
}
 
function stop() {
	clearInterval(playiv);
	timerOn = false;

}