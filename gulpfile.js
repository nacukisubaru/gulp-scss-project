const gulp = require('gulp');
const fileInclude = require('gulp-file-include');
const sass = require('gulp-sass')(require('sass'));
const server = require('gulp-server-livereload');

function includeFiles() {
    return gulp.src('./src/*.html')
        //через prefix @@ подключение html файла
        .pipe(fileInclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('./dist/'));
}

function scss() {
    //*.scss любое название файла с расширением scss
    return gulp.src('./src/scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./dist/css/'))
}

function copyImages() {
    // ** = любое название папки 
    // * = любое название файла с любым расширением 
    return gulp.src('./src/img/**/*')
        .pipe(gulp.dest('./dist/img/'))
}

function startServer() {
    return gulp.src('./dist/')
        .pipe(server({
            livereload: true,
            open: true
        }))
}

exports.startServer = startServer;
exports.copyImages = copyImages;
exports.scss = scss;
exports.includeFiles = includeFiles;