# evosim
Evolution simulator

First version of an evolution simulator
- Grazers on a field of grassy tiles
- Grazers have five traits (exploring, protective, sexual, oppurtunistic, greedy)
- Grazers can move, eat, reproduce
- Reproducing requires a male and a female grazers; the female grazer becomes pregnant and then gives birth
- The child inherits traits from both parents, plus random variation (mutation ?)
- There is a notion of seasons (sine function for grass growth); current setting leads to mass starvations in winter
- Grid size can be adjusted

Feel free to play around with this, let me know what you think and make !


# How to use the Package.json and Gruntfile.js

In case you don't have Node.js and npm installed yet:
- Download and install Node.js (https://nodejs.org/en/)

In case you don't have grunt yet:
- open command line (global command line, just start it from start menu) and execute the next line:
	npm install -g grunt-cli

Now you have npm and grunt installed globally
- Open the folder of the project (where the Package.json and Gruntfile.js are located) and run "cmd" in the navigation bar of the folder
- run
	npm install
- You can see a node_modules folder added to your project
- run
	grunt
Now, a new window opens with the evosim. Also a new folder is added, _js. When grunt is active, whenever you make a change in the css file, the browser will be updated (automated refresh).
Just press ctrl + c whenever you want to quit grunt.

	