const gulp = require('gulp');
const fileInclude = require('gulp-file-include');
const sass = require('gulp-sass')(require('sass'));
const server = require('gulp-server-livereload');
const clean = require('gulp-clean');
const fs = require('fs');
const sourceMaps = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const webpack = require('webpack-stream');

const plumbConfig = (title = 'HTML') => {
    return {
        errorHandler: notify.onError({
            title,
            message: 'Error <%= error.message %>',
            sound: false
        })
    }
}

function includeFiles() {
    return gulp.src('./src/pages/*.html')
        //получение уведомлений об ошибках html
        .pipe(plumber(plumbConfig()))
        //через prefix @@ подключение html файла
        .pipe(fileInclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('./dist/pages'));
}

function scss() {
    //*.scss любое название файла с расширением scss
    //мы смотрим только те файлы scss что лежат в корне
    //потому что нам не нужно собирать отдельно 
    //отдельные css файлы компоненты только главный в котором
    //подюключаются хедер и футер
    return gulp.src('./src/styles/*.scss')
        //получение уведомлений об ошибках css
        .pipe(plumber(plumbConfig('CSS')))
        .pipe(sourceMaps.init())
        .pipe(sass())
        //отображение названия scss файла источника в браузере на стилях
        .pipe(sourceMaps.write())
        .pipe(gulp.dest('./dist/css/'))
}

function copyImages() {
    // ** = любое название папки 
    // * = любое название файла с любым расширением 
    return gulp.src('./src/img/**/*')
        .pipe(gulp.dest('./dist/img/'))
}

function copyFonts() {
    // ** = любое название папки 
    // * = любое название файла с любым расширением 
    return gulp.src('./src/fonts/**/*')
        .pipe(gulp.dest('./dist/fonts/'))
}

function copyFiles() {
    // ** = любое название папки 
    // * = любое название файла с любым расширением 
    return gulp.src('./src/files/**/*')
        .pipe(gulp.dest('./dist/files/'))
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

function js() {
    return gulp.src('./src/js/*.js')
    .pipe(plumber(plumbConfig('JS')))
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(gulp.dest('./dist/js'))
}

function jsInComponents() {
    return gulp.src('./src/components/*.js')
    .pipe(plumber(plumbConfig('JS')))
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(gulp.dest('./dist/js'))
}

//нам нужно следить за изменениями в во всех папках и всех
//scss файлах
function watch() {
    gulp.watch('./src/scss/**/*.scss', gulp.parallel('scss'));
    gulp.watch('./src/**/*.html', gulp.parallel('includeFiles'));
    gulp.watch('./src/**/*', gulp.parallel('copyImages'));
    gulp.watch('./src/js/**/*.js', gulp.parallel('js'));
}


exports.watch = watch;
exports.cleanDist = cleanDist;
exports.startServer = startServer;
exports.copyImages = copyImages;
exports.scss = scss;
exports.includeFiles = includeFiles;
exports.js = js;
exports.jsInComponents = jsInComponents;
exports.default = gulp.parallel(
    clean,
    includeFiles,
    scss,
    copyImages,
    copyFonts,
    copyFiles,
    js,
    jsInComponents,
    startServer,
    watch
);