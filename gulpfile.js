/* global require, console */
var gulp = require('gulp')
var jshint = require('gulp-jshint')
var rjs = require('gulp-requirejs')

var globs = [
    'src/**/*.js', 'test/*.js', 'gulpfile.js'
]
var watchTasks = ['hello', 'jshint', 'rjs']

gulp.task('hello', function() {
    console.log((function() {
        /*
______        _        ______                   
| ___ \      (_)       | ___ \                  
| |_/ / _ __  _ __  __ | |_/ /  __ _  ___   ___ 
| ___ \| '__|| |\ \/ / | ___ \ / _` |/ __| / _ \
| |_/ /| |   | | >  <  | |_/ /| (_| |\__ \|  __/
\____/ |_|   |_|/_/\_\ \____/  \__,_||___/ \___|
        */
    }).toString().split('\n').slice(2, -2).join('\n') + '\n')
})

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
            jquery: 'empty:',
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