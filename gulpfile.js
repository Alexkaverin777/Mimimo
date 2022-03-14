const { src, dest, watch, parallel, series } = require('gulp');

// import imagemin from 'gulp-imagemin';

const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const broweserSync = require('browser-sync').create();
const uglify = require('gulp-uglify-es').default;
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const babel = require('gulp-babel');
const del = require('del');
const webp = require('gulp-webp');

//Авто обновление страницы
function browesersync() {
    broweserSync.init({
        server: {
            baseDir: 'app/',
        },
    });
}

function clearDist() {
    return del('dist');
}

function images(params) {
    return src('app/img/**/*')
        .pipe(
            imagemin([
                imagemin.gifsicle({ interlaced: true }),
                imagemin.mozjpeg({ quality: 75, progressive: true }),
                imagemin.optipng({ optimizationLevel: 5 }),
                imagemin.svgo({
                    plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
                }),
            ])
        )
        .pipe(dest('dist/img'));
}

function webConverter() {
    return src('app/img/**/*.{png,jpg,jpeg}').pipe(webp()).pipe(dest('app/img'));
}

function scripts() {
    return src([
        'node_modules/jquery/dist/jquery.js',
        'app/js/main.js', //должен быть последним
    ])
        .pipe(
            babel({
                presets: ['@babel/env'],
            })
        )
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(dest('app/js'))
        .pipe(broweserSync.stream());
}

//функция для обработки стилей
function styles() {
    return (
        src('app/scss/style.scss')
            .pipe(sass({ outputStyle: 'compressed' })) //exspandet
            // .pipe(sass().on('error', sass.logError))
            .pipe(concat('style.min.css'))
            .pipe(
                autoprefixer({
                    overrideBrowserslist: ['last 10 version'],
                    grid: true,
                })
            )
            .pipe(dest('app/css'))
            .pipe(broweserSync.stream())
    );
}

function libsCss() {
    return(
        src(['node_modules/reset-css/reset.css'])
            .pipe(sass({ outputStyle: 'compressed' }))
            .pipe(concat('libs.min.css'))
            .pipe(dest('app/css'))
    )
}

function build() {
    return src(
        [
            'app/css/*.css',
            'app/fonts/**/*',
            'app/js/main.min.js',
            'app/*.html',
        ],
        { base: 'app' }
    ).pipe(dest('dist'));
}

function watching() {
    watch(['app/scss/**/*.scss'], styles);
    watch(['app/js/**/*.js', '!app/js/main.min.js'], scripts);
    watch(['app/*.html']).on('change', broweserSync.reload);
}

exports.styles = styles;
exports.watching = watching;
exports.browesersync = browesersync;
exports.scripts = scripts;
exports.images = images;
exports.webConverter = webConverter;
exports.clearDist = clearDist;
exports.libsCss = libsCss;

exports.build = series(clearDist, images, build);
exports.default = parallel(
    styles,
    libsCss,
    scripts,
    webConverter,
    browesersync,
    watching
);

//gulp
//gulp build
