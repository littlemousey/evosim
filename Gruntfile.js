module.exports = function(grunt) {
    grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';',
		banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %> */'
		},
	  dist: {
		src: ['js/*.js'],
		dest: '_js/evo.js',
		}
    },
	browserSync: {
    bsFiles: {
        src : ['css/*.css', '_js/*.js']
		},
    options: {
        server: {
            baseDir: ".",
			index: "evo.html"
			}
		}
	}
  });

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-browser-sync');
	grunt.registerTask('default', ['concat', 'browserSync']);
	grunt.registerTask('compile', ['concat']);
	
};