var gulp = require('gulp');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var nodemon = require('gulp-nodemon');

var jsFiles = ['*.js', 'src/**/*.js'];

gulp.task('style', function() {
    return gulp.src(jsFiles)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish', {
        verbose: true
    }))
    .pipe(jscs());
});

gulp.task('inject', function() {
    var wiredep = require('wiredep').stream;
    var inject = require('gulp-inject');
    var options = {
        bowerJson: require('./bower.json'),
        directory: './public/lib',
        ignorePath: '../../public'
    };

    var injectSrc = gulp.src(['./src/View/*.js', './src/Controllers/*.js', './src/Services/*.js'], {read: false});
    var injectOptions = {
        ignorePath: '/public'
    };

    return gulp.src('./src/View/*.html')
    .pipe(wiredep(options))
    .pipe(inject(injectSrc, injectOptions))
    .pipe(gulp.dest('./src/View'));
});

gulp.task('serve', ['inject'], function() {
    var options = {
        script: 'app.js',
        delayTime: 1,
        env: {
            'PORT' : 5000
        },
        watch: jsFiles
    };

    return nodemon(options)
    .on('restart', function(ev) {
        console.log('Restarting...');
    });
});
