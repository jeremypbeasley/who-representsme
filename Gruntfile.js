module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    stylus: {
      options: {
        'compress': false,
        'include css': true
      },
      compile: {
        files: {
          'public/master.css': '_resources/_styles/master.styl',
        }
      }
    },
    concat: {
      dist: {
        src: [
          'node_modules/jquery/dist/jquery.min.js',
          'node_modules/lodash/lodash.min.js',
          'node_modules/typedjs/dist/typed.min.js',
          '_resources/_scripts/ui.js',
          '_resources/_scripts/main.js'
        ],
        dest: 'public/master.js',
      }
    },
    watch: {
      scripts: {
        files: ['_resources/_scripts/*.js', 'Gruntfile.js', '_resources/_styles/*.styl'],
        tasks: ['concat', 'stylus'],
        options: {
          spawn: false
        },
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.registerTask('default', ['concat', 'stylus', 'watch']);
};
