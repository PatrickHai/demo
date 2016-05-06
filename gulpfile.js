var gulp = require('gulp');

// 如果默认情况下我们会执行一个叫develop的task，则这么写，执行gulp命令时，
// 会自动调用develop
gulp.task('default', ['release']);

var uglify = require('gulp-uglify'); // 压缩
var minifyCss = require('gulp-minify-css');
var stripDebug = require('gulp-strip-debug'); // 该插件用来去掉console和debugger语句
var useref = require('gulp-useref');
var gulpif = require('gulp-if');


var paths = {
    js: [ // js目录
        'app/js/*.js'
    ],
    css: [
        'app/css/*.css'
    ],
    fonts: [
        'app/fonts/*'
    ],
    html: [
        'app/*.html'
    ],
    lib: { // 第三方依赖文件
        js: [
            'bower_components/d3/d3.min.js',
            'bower_components/d3-tip/index.js',
            'bower_components/jquery-2.2.3.min/index.js'
        ]
    }
};

var output = "dist/"; // output

/* 部署环境 */
gulp.task('release', function() {

    gulp.src('app/*.js')
        .pipe(stripDebug())
        .pipe(gulp.dest(output));

    gulp.src(paths.fonts)
        .pipe(gulp.dest(output+'/fonts'));

    gulp.src('*.json')
        .pipe(gulp.dest(output));
    
    gulp.src('node_modules/**/*')
        .pipe(gulp.dest(output));
        
    gulp.src(paths.html)
        .pipe(useref())
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(gulp.dest(output));
});