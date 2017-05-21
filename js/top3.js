function refreshTop3() {
	var top3 = '';
	var nr = 0;
	var sorted = grazers.sort(function(a, b) { return b.age() - a.age(); })
	var g;
	var len = sorted.length;
	for (g = 0; g < len; g++) {
		if (sorted[g].alive) {
			nr++;
			top3 += nr + '.: ' + sorted[g].name + '-' + sorted[g].generation + ' (' + sorted[g].age() + ')<br>';
			if (nr == 3) { break; }
		}
	}
	document.getElementById("top3").innerHTML = top3;
}