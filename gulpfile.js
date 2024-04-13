const gulp = require('gulp');
const fileInclude = require('gulp-file-include');
const sass = require('gulp-sass')(require('sass'));
const server = require('gulp-server-livereload');
const clean = require('gulp-clean');
const fs = require('fs');
const sourceMaps = require('gulp-sourcemaps');

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
    //мы смотрим только те файлы scss что лежат в корне
    //потому что нам не нужно собирать отдельно 
    //отдельные css файлы компоненты только главный в котором
    //подюключаются хедер и футер
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

//нам нужно следить за изменениями в во всех папках и всех
//scss файлах
function watch() {
    gulp.watch('./src/scss/**/*.scss', gulp.parallel('scss'));
    gulp.watch('./src/**/*.html', gulp.parallel('includeFiles'));
    gulp.watch('./src/**/*', gulp.parallel('copyImages'));
}


exports.watch = watch;
exports.cleanDist = cleanDist;
exports.startServer = startServer;
exports.copyImages = copyImages;
exports.scss = scss;
exports.includeFiles = includeFiles;
exports.default = gulp.parallel(
    clean,
    includeFiles,
    scss,
    copyImages,
    startServer,
    watch
);