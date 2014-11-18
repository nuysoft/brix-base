/* global require */
var gulp = require('gulp')
var jshint = require('gulp-jshint')
var rjs = require('gulp-requirejs')

var globs = [
    'src/**/*.js', 'test/*.js', 'gulpfile.js'
]
var watchTasks = ['jshint', 'rjs']

// https://github.com/spenceralger/gulp-jshint
gulp.task('jshint', function() {
    return gulp.src(globs)
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('jshint-stylish'))
})

// https://github.com/RobinThrift/gulp-requirejs
gulp.task('rjs', function() {
    var build = {
        baseUrl: 'src',
        name: 'brix/base',
        out: 'dist/base.js',
        paths: {
            underscore: 'empty:',
            'brix/event': 'empty:'
        }
    }
    rjs(build)
        .pipe(gulp.dest('.')) // pipe it to the output DIR
})

gulp.task('watch', function( /*callback*/ ) {
    gulp.watch(globs, watchTasks)
})

gulp.task('default', watchTasks.concat(['watch']))