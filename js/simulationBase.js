//global variables
var size = 20;
var ngrazers = 20;
var nalivegrazers = ngrazers;
var t = 0;
var speed = 250;
var playiv;
var grid = [];
var grazers = [];
table = document.getElementById("table");

 
function makeName() {
	var text = "";
	var consonants = "bcdfghjklmnpqrstvwxyz";
	var vowels = "aeiou"
	for( var i=0; i < 4; i++ )
		if (i % 2 == 0) {
			text += consonants.charAt(Math.floor(Math.random() * consonants.length));
		} else {
			text += vowels.charAt(Math.floor(Math.random() * vowels.length));
		}
	return text;
}
	
function Tile() {
	this.grass = 128;
	this.water = 100;
	this.neighbours = [];
	this.grazers = [];
	
	this.addNeighbour = function(newNeighbour) {
		this.neighbours.push(newNeighbour);
	}
	
	this.addGrazer = function(newGrazer) {
		this.grazers.push(newGrazer);
	}
	
	this.removeGrazer = function(grazer) {
		var index = this.grazers.indexOf(grazer);
		if (index > -1) { this.grazers.splice(index, 1); }
	}
}

function Grazer(mode) {
	this.id;
	this.name = makeName();
	this.parent;
	this.generation;
	this.sex = Math.random() >= 0.5;
	this.timeOfBirth = t;
	this.timeOfDeath;
	this.timeOfMate = t;
	this.location;
	this.alive = true;
	this.pregnant = false;
	this.carriesChild;
	this.energy;
	this.survivalMode = false;
	
	// TRAITS
	this.exploring;
	this.protective;
	this.sexual;
	this.opportunistic;
	this.greedy;
	
	if (mode == 'primordial') {
		this.parent = '';
		this.generation = 1;
		this.energy = 10.0;
		
		this.location = grid[Math.floor((Math.random() * size))][Math.floor((Math.random() * size))];
		this.location.addGrazer(this);
		
		this.exploring = Math.random();
		this.protective = Math.random();
		this.sexual = Math.random();
		this.opportunistic = Math.random();
		this.greedy = Math.random();
	}
	
	//
	// PROPERTIES
	//
	this.age = function() {
		if(this.alive) {
			return t - this.timeOfBirth;
		} else {
			return this.timeOfDeath - this.timeOfBirth;
		}
	}
	
	this.childOf = function() {
		if (this.parent != '') {
			return ", child of " + this.parent;
		} else {
			return ""
		}
	}
	
	//
	// BASIC FUNCTIONS
	//
	this.eat = function() {
		var food = Math.min(this.location.grass, 20);
		this.location.grass -= food;
		this.energy += food / 10;
		if (this.pregnant) { 
			this.energy -= (1 - this.protective);
			this.carriesChild.energy += (1 - this.protective);
		}
	}
	
	this.moveTo = function(newLocation) {
		newLocation.addGrazer(this);
		this.location.removeGrazer(this);
		this.location = newLocation;
		this.energy -= 1 + (this.energy / 50);
	}
	this.move = function() {
		var newLocation = this.location.neighbours[Math.floor(Math.random() * this.location.neighbours.length)];
		this.moveTo(newLocation);
	}
	
	this.giveBirth = function() {
		if (t - this.timeOfMate < 100) { return; }
		child = this.carriesChild;
		child.id = grazers.length;
		child.timeOfBirth = t;
		grazers[child.id] = child;
		this.pregnant = false;
		this.carriesChild = [];
		child.location = this.location;
		child.location.addGrazer(child);
		nalivegrazers++;
	}
	
	this.checkDeath = function() {
		if (this.energy < 0.0) {
			this.alive = false;
			this.timeOfDeath = t;
			nalivegrazers--;
		}
	}
	
	this.wantsToMateWith = function(partner) {
		if (!this.alive) { return false; }
		if (this.age() < 1000) { return false; }
		if (this.pregnant) { return false; }
		if (this.survivalMode) { return false; }
		if (this.sex == partner.sex ) { return false; }
		if (t - this.timeOfMate < 10) { return false; }
		return true;
	}
	
	this.reproduce = function() {
		if (this.age() < 1000) { return; }
		if (this.location.grazers.length == 1) { return; }
		
		var potentialPartner;
		var partner;
		var i;
		var len = this.location.grazers.length;
		for (i = 0; i < len; i++) {
			potentialPartner = this.location.grazers[i];
			if (potentialPartner == this) { continue; }
			if (!potentialPartner.wantsToMateWith(this)) { continue; }
			if (!this.wantsToMateWith(potentialPartner)) { continue; }
			partner = potentialPartner;
			break;
		}
		
		if (typeof partner == 'undefined' || !partner) { return; }
		
		var kid = new Grazer('sexual');
		kid.parent = this.name + ' and ' + partner.name;
		kid.generation = Math.max(this.generation, partner.generation) + 1;
		kid.energy = 0;
		
		kid.exploring = Math.max(0.0, Math.min(1.0, ((this.exploring + partner.exploring) / 2) + Math.random() * 0.1 - 0.05));
		kid.protective = Math.max(0.0, Math.min(1.0, ((this.protective + partner.protective) / 2) + Math.random() * 0.1 - 0.05));
		kid.sexual = Math.max(0.0, Math.min(1.0, ((this.sexual + partner.sexual) / 2) + Math.random() * 0.1 - 0.05));
		kid.opportunistic = Math.max(0.0, Math.min(1.0, ((this.opportunistic + partner.opportunistic) / 2) + Math.random() * 0.1 - 0.05));
		kid.greedy = Math.max(0.0, Math.min(1.0, ((this.greedy + partner.greedy) / 2) + Math.random() * 0.1 - 0.05));
		
		if (this.sex) {
			this.pregnant = true;
			this.carriesChild = kid;
		} else {
			partner.pregnant = true;
			partner.carriesChild = kid;
		}
		
		this.timeOfMate = t;
		partner.timeOfMate = t;
	}
	
	this.getFoodNearbyLocation = function() {
		var locs = [];
		var max = 0;
		for (var i = 0; i < this.location.neighbours.length; i++) {
			if (this.location.neighbours[i].grass > max) {
				locs = [];
				locs.push(this.location.neighbours[i]);
				max = this.location.neighbours[i].grass;
			} else if (this.location.neighbours[i].grass == max) {
				locs.push(this.location.neighbours[i]);
			}
		}
		return locs[Math.floor(Math.random() * locs.length)];;
	}
	
	this.doTurn = function() {
		var energy01 = this.energy / (50 + this.energy); 	
		var food01 = this.location.grass / 255;				// Food in location between 0 and 1, linear
		
		//if (foodNearby.grass / 255; > food01) { tendencyMoveToFood = this.opportunistic; }
		
		if (this.pregnant) { this.giveBirth(); }
		
		if (this.survivalMode) {
			if (food01 > this.protective) { 
				this.eat(); 
			} else {
				var foodNearbyLocation = this.getFoodNearbyLocation();
				if (foodNearbyLocation.grass / 255 > food01) {
					this.moveTo(foodNearbyLocation);
				} else {
					if (this.exploring > Math.random()) {
						this.move();
					} else {
						this.eat();
					}
				}
			}
			if (this.energy / (60 + this.energy) > this.protective) { this.survivalMode = false; } // Energy between 0 and 1, softsign function
		} else {
			var tendencyExplore = Math.random() * this.exploring;
			var tendencyFeed = Math.random() * this.greedy;
			var tendencyMate = Math.random() * this.sexual;
			var tendencyFindFood = Math.random() * this.opportunistic;
			var tendencyNothing = Math.random() * this.protective;
			if (tendencyExplore > tendencyFeed && tendencyExplore > tendencyMate && tendencyExplore > tendencyFindFood && tendencyExplore > tendencyNothing) {
				this.move();
			} else if (tendencyFeed > tendencyExplore && tendencyFeed > tendencyMate && tendencyFeed > tendencyFindFood && tendencyFeed > tendencyNothing) {
				this.eat();
			} else if (tendencyMate > tendencyExplore && tendencyMate > tendencyFeed && tendencyMate > tendencyFindFood && tendencyMate > tendencyNothing) {
				this.reproduce();
				this.move();
			} else if (tendencyFindFood > tendencyExplore && tendencyFindFood > tendencyFeed && tendencyFindFood > tendencyMate && tendencyFindFood > tendencyNothing) {
				this.moveTo(this.getFoodNearbyLocation());
			}
			if (this.energy / (50 + this.energy) < this.protective) { this.survivalMode = true; } // Energy between 0 and 1, softsign function
		}
		
		this.energy -= 0.25 + (0.005 * this.energy);
		this.checkDeath();
	}
}
 
function life() {
	t++;
	var g, i, j;
	var len = grazers.length;
	for (i = 0; i < len; i++) {
		g = grazers[i];
		if (g.alive) { g.doTurn(); }
	}
	for (i = 0; i < size; i++) {
		for (j = 0; j < size; j++) {
			grid[i][j].grass += (0.6 + 0.4 * (Math.sin((t / 1000) * Math.PI)));
			if (grid[i][j].grass > 255.0) { grid[i][j].grass = 255.0; }
			if (grid[i][j].grass < 0.0) { grid[i][j].grass = 0.0; }
		}
	}
}
 
function emptygrid() {
	grid = new Array(size);
	var i, j;
	for (i = 0; i < size; i++) {
		grid[i] = new Array(size);
		for (j = 0; j < size; j++) {
			grid[i][j] = new Tile();
			if (i > 0) {
				grid[i][j].addNeighbour(grid[i-1][j]);
				grid[i-1][j].addNeighbour(grid[i][j]);
			}
			if (j > 0) {
				grid[i][j].addNeighbour(grid[i][j-1]);
				grid[i][j-1].addNeighbour(grid[i][j]);
			}
		}
	}
}
 
function showGrazerInfo(cell) {
	var a = JSON.parse(cell.id);
	var x = a[0];
	var y = a[1];
	var info = '';
	var g, i;
	var len = grid[x][y].grazers.length;
	for (i = 0; i < len; i++) {
		g = grid[x][y].grazers[i];
		if (g.alive) {
			info += g.name + ", age " + g.age() + g.childOf() + ", of generation " + g.generation + ", id " + g.id + "<br>";
		} else {
			info += g.name + ", died on " + g.timeOfDeath + " at the age of " + g.age() + "<br>";
		}
	}
	document.getElementById("grazerInfo").innerHTML = info;
}
 
function init() {
	var i, j, row;
	for (i = 0; i < size; i++) {
		row = table.insertRow(i);
		for (j = 0; j < size; j++) {
			cell = row.insertCell(j);
			cell.id = "["+i+","+j+"]";
			cell.addEventListener("mouseover", function(){ showGrazerInfo(this); });
		}
	}
}
 
function addgrazers() {
	var i;
	for (i = 0; i < ngrazers; i++) { 
		grazers.push(new Grazer('primordial'));
		grazers[i].id = i;
	}
}
 
function rgb(grass, water) {
	return 'rgb(' + [(100||0),(Math.round(grass)||0),(water||0)].join(',') + ')';
}
 
function ta() {
	var cell, i, j, g, z, len;
	for (i = 0; i < size; i++) {
		for (j = 0; j < size; j++) {
			cell = document.getElementById("["+i+","+j+"]");
			cell.innerHTML = " ";
			cell.style.backgroundColor = rgb(grid[i][j].grass, grid[i][j].water);
			len = grid[i][j].grazers.length;
			for (z = 0; z < len; z++) {
				g = grid[i][j].grazers[z];
				if (g.alive) {
					cell.innerHTML = g.name + "<br>" + Math.round(g.energy);
					cell.style.fontWeight = 'normal';
					cell.style.fontStyle = 'normal';
					if (g.sex) {
						cell.style.color = 'pink';
						if (g.pregnant) {
							cell.style.fontWeight = 'bold'
						}
					} else {
						cell.style.color = 'blue';
					}
					if (g.age() < 10) { cell.style.backgroundColor = "deepskyblue"; }
					if (g.survivalMode) { cell.style.fontStyle = 'italic'; }
				} else {
					if (t - g.timeOfDeath < 10) { cell.style.backgroundColor = "red"; }
				}
			}
		}
	}
	//document.getElementById("time").innerHTML="year " + Math.floor(t / 365) + ", day " + Math.floor(t % 365) + ", " + nalivegrazers + " alive grazers";
	document.getElementById("time").innerHTML=t + ", " + nalivegrazers + " alive grazers";
	refreshTop3();
}


emptygrid();
init();
addgrazers();
ta();