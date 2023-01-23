import gulp from "gulp";
import plumber from "gulp-plumber";
import less from "gulp-less";
import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import browser from "browser-sync";
import htmlmin from "gulp-htmlmin";
import csso from "postcss-csso";
import rename from "gulp-rename";
import terser from "gulp-terser";
import squoosh from "gulp-libsquoosh";
import svgo from "gulp-svgmin";
import { deleteAsync } from "del";
import svgstore from "gulp-svgstore";

// Styles

export const styles = () => {
  return gulp
    .src("source/less/style.less", { sourcemaps: true })
    .pipe(plumber())
    .pipe(less())
    .pipe(postcss([autoprefixer(), csso()]))
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css", { sourcemaps: "." }))
    .pipe(browser.stream());
};

// HTML

const html = () => {
  return gulp
    .src("source/*.html")
    .pipe(htmlmin({ collapseWhitespace: false }))
    .pipe(gulp.dest("build"));
};

// Script

const script = () => {
  return gulp.src("source/js/*.js")
  .pipe(terser())
  .pipe(gulp.dest("build/js"));
};

// Images

const optimazeImages = () => {
  return gulp
    .src("source/img/**/*.{jpg,png}")
    .pipe(squoosh())
    .pipe(gulp.dest("build/img"));
};

const copyImages = () => {
  return gulp.src("source/img/**/*.{jpg,png}")
  .pipe(gulp.dest("build/img"));
};

// WebP

const createWebp = () => {
  return gulp
    .src("source/img/**/*.{jpg,png}")
    .pipe(
      squoosh({
        webp: {},
      })
    )
    .pipe(gulp.dest("build/img"));
};

// svg

const svg = () => {
  return gulp.src("source/img/*.svg").pipe(svgo()).pipe(gulp.dest("build/img"));
};

const sprite = () => {
  return gulp
    .src("source/img/icons/*.svg")
    .pipe(svgo())
    .pipe(
      svgstore({
        inLineSvg: true,
      })
    )
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"));
};

// Copy

const copy = (done) => {
  gulp
    .src(
      [
        "source/fonts/lato/*.{woff2,woff}",
        "source/fonts/oswald/*.{woff2,woff}",
        "source/*.ico",
        "source/*.webmanifest",
        "source/img/favicons/*.{svg,png}",
      ],
      {
        base: "source",
      }
    )
    .pipe(gulp.dest("build"));
  done();
};

// Clean

const clean = () => {
  return deleteAsync("build");
};

// Server

function server(done) {
  browser.init({
    server: {
      baseDir: "build",
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

//Reload

const reload = (done) => {
  browser.reload();
  done;
};

// Watcher

const watcher = () => {
  gulp.watch("source/less/**/*.less", gulp.series(styles));
  gulp.watch("source/js/script.js", gulp.series(script));
  gulp.watch("source/*.html").on("change", browser.reload);
};

// Build

export const build = gulp.series(
  clean,
  copy,
  optimazeImages,
  svg,
  gulp.parallel(styles, html, script, sprite, createWebp)
);

export default gulp.series(
  clean,
  copy,
  copyImages,
  svg,
  gulp.parallel(styles, html, script, sprite, createWebp),
  gulp.series(server, watcher)
);
