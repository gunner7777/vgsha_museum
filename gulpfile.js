const gulp = require("gulp");
const concat = require("gulp-concat");
const sass = require("gulp-sass");
const autoprefixer = require("autoprefixer");
const postcss = require("gulp-postcss");
const cleanCSS = require("gulp-clean-css");
const sourcemaps = require("gulp-sourcemaps");
const del = require("del");
const pug = require("gulp-pug");
const rename = require("gulp-rename");
const browserSync = require("browser-sync").create();
const babel = require("gulp-babel");
const uglify = require("gulp-uglify");
const imagemin = require("gulp-imagemin");

sass.compiler = require("node-sass");

/* files path */
const normalizeCss = "./node_modules/normalize.css/normalize.css";
const scssIn = "./src/sass/**/*.scss";
const stylePath = [normalizeCss, scssIn];
const scssOut = "./build/css";
const jsIn = "./src/js/*.js";
const jsOut = "./build/js";
const pugIn = "src/pages/*.pug";
const pugWatch = "src/pages/**/*.pug";
const pugOut = "./build";
const imageIn = "./src/images/*";
const imageOut = "./build/images";
const delDir = "build/*";

function styles() {
  return gulp
    .src(stylePath)
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(postcss([autoprefixer()]))
    .pipe(cleanCSS({ level: 2 }))
    .pipe(concat("style.min.css"))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(scssOut))
    .pipe(browserSync.stream());
}

function scripts() {
  return gulp
    .src(jsIn)
    .pipe(concat("scripts.min.js"))
    .pipe(
      babel({
        presets: ["@babel/preset-env"],
      })
    )
    .pipe(uglify())
    .pipe(gulp.dest(jsOut));
}

function html() {
  return (
    gulp
      .src(pugIn)
      .pipe(
        pug({
          pretty: true,
        })
      )
      //.pipe(rename("index.html"))
      .pipe(gulp.dest(pugOut))
      .pipe(browserSync.stream())
  );
}

function imageMin() {
  return gulp
    .src(imageIn)
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
    .pipe(gulp.dest(imageOut));
}

function clean() {
  return del(delDir);
}

function watch() {
  browserSync.init({
    server: {
      baseDir: "./build",
    },
  });

  gulp.watch(scssIn, styles);
  gulp.watch(jsIn, scripts);
  gulp.watch(pugWatch, html);
}

gulp.task("styles", styles);
gulp.task("scripts", scripts);
gulp.task("clean", clean);
gulp.task("html", html);
gulp.task("imageMin", imageMin);
gulp.task("watch", watch);

gulp.task(
  "build",
  gulp.series(clean, gulp.parallel(styles, html, scripts, imageMin))
);
gulp.task("dev", gulp.series("build", "watch"));
