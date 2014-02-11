module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    concat: {
      js : {
        src : [
          'src/ariaMapperHelper.js',
          'src/ariaMapper.js'
        ],
        dest : 'build/jQuery.ariaMapper.js'
      }
    },

    uglify : {
      js: {
        files: {
          'build/jQuery.ariaMapper.min.js' : [ 'build/jQuery.ariaMapper.js' ]
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', [ 'concat:js', 'uglify:js' ]);

};