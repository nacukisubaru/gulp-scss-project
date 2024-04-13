const gulp = require('gulp');
const fileInclude = require('gulp-file-include');
const sass = require('gulp-sass')(require('sass'));
const server = require('gulp-server-livereload');
const clean = require('gulp-clean');
const fs = require('fs');

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

//force = true на случай ошибок
function cleanDist(done) {
    if (fs.existsSync('./dist')) {
        return gulp.src('./dist/')
            .pipe(clean({force: true}));
    }

    return done();
}

exports.cleanDist = cleanDist;
exports.startServer = startServer;
exports.copyImages = copyImages;
exports.scss = scss;
exports.includeFiles = includeFiles;