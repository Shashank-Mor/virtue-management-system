'use strict';
// wrapper function that exposes the grunt instance
module.exports = function (grunt) {
  grunt.initConfig({
    
    pkg: grunt.file.readJSON('package.json'),
    // grunt task
    // https://github.com/gruntjs/grunt-contrib-watch
    war: {
        target: {
          options: {
            war_dist_folder: '.',    // Folder where to generate the WAR. /
            war_name: 'virtueAttendanceManagement'       // The name fo the WAR file (.war will be the extension) /
          },
          files: [
            {
              expand: true,
              cwd: 'dist/virtue-attendance-management',
              src: ['**'],
              dest: ''
            }
          ]
        }
      }
   
  });

  grunt.loadNpmTasks('grunt-war');
};