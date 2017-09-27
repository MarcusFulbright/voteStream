/*jshint node:true */
'use strict';

module.exports = function (grunt) {

	// load all grunt tasks
	require('load-grunt-tasks')(grunt);

	grunt.initConfig({

		config: {
			app: 'app',
			dist: 'release',
			tmp: '.tmp'
		},

		sass: {
			dev: {
				options: {
					style: 'expanded'
				},
				files: {
					'<%= config.app %>/styles/css/barcamp.css':'<%= config.app %>/styles/scss/barcamp.scss'
				}
			},
			dist: {
				options: {
					style: 'compress'
				},
				files: {
					'<%= config.app %>/styles/css/barcamp.css':'<%= config.app %>/styles/scss/barcamp.scss'
				}
			}
		},

		watch: {
			scss: {
				files: ['<%= config.app %>/styles/scss/{,**/}*.scss'],
					tasks: ['sass:dev']
				}
		},

		clean: {
			dist: {
				files: [{
					dot: true,
					src: [
						'.tmp',
						'<%= config.dist %>/*',
						'!<%= config.dist %>/.git*'
					]
				}]
			},
			tmp: {
				files: {
					src: '.tmp'
				}
			}
		},

		copy: {
			dist: {
				files: [{
					expand: true,
					dot: true,
					cwd: '<%= config.app %>',
					dest: '<%= config.dist %>',
					src: [
						'**/*.{ico,png,txt,webp,gif,png,jpeg,jpg,html,css}',
						'scripts/vendor/*.js'
					]
				}]
			}
		},

		concat: {
			dist: {
				src: [
					'<%= config.app %>/scripts/{,**/}*.js',
					'!<%= config.app %>/scripts/vendor/*'
				],
				dest: '<%= config.tmp %>/scripts/app.js'
			}
		},

		ngAnnotate: {
			dist: {
				files: [
					{
						src: '<%= config.tmp %>/scripts/app.js',
						dest: '<%= config.tmp %>/scripts/app.js'
					}
				]
			}
		},

		// uglifyEs: {
		// 	dist: {
		// 		src: '<%= config.tmp %>/scripts/app.js',
		// 		dest: '<%= config.dist %>/scripts/app.min.js'
		// 	}
		// },

		// uglify: {
		// 	dist: {
		// 		src: '<%= config.tmp %>/scripts/app.js',
		// 		dest: '<%= config.dist %>/scripts/app.min.js'
		// 	}
		// },

		useminPrepare: {
			html: 'index.html'
		},

		usemin: {
			html: '<%= config.dist %>/index.html'
		},

		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			all: [
				'Gruntfile.js',
				'<%= config.app %>/scripts/{,*/}*.js',
				'!<%= config.app %>/scripts/vendor/*',
				'test/spec/{,*/}*.js'
			]
		}

	});

	grunt.registerTask('dev', [
		'sass:dev',
		'watch'
	]);

	grunt.registerTask('prod', [
		'clean:dist',
		// 'sass:dist', Commit your changes to the css to deploy updates
		'copy:dist',
		'useminPrepare',
		'concat',
		'ngAnnotate',
		// 'uglifyEs',
		'usemin',
		'clean:tmp'
	]);

	grunt.registerTask('default', [
		'prod'
	]);

	grunt.registerTask('heroku', [
		'prod'
	]);
};
