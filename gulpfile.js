const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer').default;
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const fs = require('fs');

const paths = {
  styles:  { src: 'src/scss/**/*.scss', dest: 'dist/css/' },
  scripts: { src: 'src/js/**/*.js',     dest: 'dist/js/' },
  html:    { src: 'src/*.html',          dest: 'dist/' },
  images:  { src: 'src/assets/images/**/*', dest: 'dist/assets/images/' }
};

function clean(cb) {
  if (fs.existsSync('dist')) fs.rmSync('dist', { recursive: true, force: true });
  cb();
}

function styles() {
  return gulp.src('src/scss/main.scss')
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(autoprefixer({ cascade: false }))
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(concat('style.min.css'))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(browserSync.stream());
}

function scripts() {
  return gulp.src(paths.scripts.src)
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(browserSync.stream());
}

function html() {
  return gulp.src(paths.html.src)
    .pipe(gulp.dest(paths.html.dest))
    .pipe(browserSync.stream());
}

function images() {
  return gulp.src(paths.images.src)
    .pipe(gulp.dest(paths.images.dest));
}

function watch() {
  browserSync.init({ server: { baseDir: './dist' } });
  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.scripts.src, scripts);
  gulp.watch(paths.html.src, html);
  gulp.watch(paths.images.src, images);
}

const build = gulp.series(clean, gulp.parallel(styles, scripts, html, images));
const dev   = gulp.series(build, watch);

exports.clean   = clean;
exports.styles  = styles;
exports.scripts = scripts;
exports.html    = html;
exports.images  = images;
exports.build   = build;
exports.dev     = dev;
exports.default = build;
