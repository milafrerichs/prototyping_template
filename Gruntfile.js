'use strict';
var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};
module.exports = function(grunt) {

  var appConfig = {app: 'app'};
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  // Project configuration.
  grunt.initConfig({
    app: appConfig,
    watch: {
      coffee: {
        files: ['<%= app.app %>/scripts/{,*/}*.coffee']
      },
      haml: {
        files: ['<%= app.app %>/{,*/}*.haml'],
        tasks: ['haml:dist']
      },
      livereload: {
                options: {
                    livereload: LIVERELOAD_PORT
                },
                files: [
                    '{.tmp,<%= app.app %>}/*.html',
                    '{.tmp,<%= app.app %>}/styles/{,*/}*.css',
                    '{.tmp,<%= app.app %>}/scripts/{,*/}*.js',
                    '<%= app.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ],
                tasks: ['connect:livereload']
            }
    },
    connect: {
        options: {
            port: 9000,
            // change this to '0.0.0.0' to access the server from outside
            hostname: 'localhost'
        },
        livereload: {
                options: {
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, 'app'),
                            lrSnippet
                        ];
                    }
                }
            }
    },
    haml: {
      options: {
          language: "ruby"
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%= app.app %>',
          src: '{,*/}*.haml',
          dest: '.tmp',
          ext: '.html'
        }]
      },
    },
    coffee: {
      glob_to_multiple: {
            expand: true,
            flatten: true,
            cwd: '<%= app.app %>/scripts',
            src: ['*.coffee'],
            dest: '.tmp/scripts',
            ext: '.js'
          }
    },
    browserify: {
      all: {
        src: '<%= app.app %>/scripts/main.js',
        dest: '<%= app.app %>/scripts/bundle.js',
        options: {
          transform: ['debowerify','decomponentify', 'deamdify', 'deglobalify'],
        },
      },
    },
    concat: {
      basic: {
        src: [''],
        dest: '.tmp/stylesheets/',
      },
    },
    open: {
        server: {
            path: 'http://localhost:<%= connect.options.port %>',
            app: 'Google Chrome'
        }
    },
    clean: {
      server: '.tmp'
    },
    pkg: grunt.file.readJSON('package.json'),
     });

  grunt.registerTask('server', function (target) {
    grunt.task.run([
      'clean:server',
      'connect:livereload',
      'haml:dist',
      'coffee',
      'concat',
      'browserify',
      'open',
      'watch'
    ]);
  });
  // Default task(s).
  grunt.registerTask('default', ['']);

};
