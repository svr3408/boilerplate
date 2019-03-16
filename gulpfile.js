const { src, dest, series, parallel, watch } = require("gulp");
const autoprefixer = require("autoprefixer");
const browserSync = require("browser-sync").create();
const cssnano = require("cssnano");
const del = require("del");
const fileinclude = require("gulp-file-include");
const imagemin = require("gulp-imagemin");
const postcss = require("gulp-postcss");
const postcssImport = require("postcss-import");
const postcssNesting = require("postcss-nesting");
const postcssNormalize = require("postcss-normalize");
const rollup = require("rollup");
const { terser } = require("rollup-plugin-terser");

const paths = {
  source: "./src/",
  dest: "./dest/"
};

function serve(cb) {
  browserSync.init({
    server: {
      baseDir: paths.dest
    }
  });

  watch(paths.dest + "*.*").on("change", browserSync.reload);
  cb();
}

function html() {
  return src(paths.source + "index.html")
    .pipe(fileinclude())
    .pipe(dest(paths.dest));
}

function css() {
  return src(paths.source + "style.css")
    .pipe(
      postcss([
        postcssImport(),
        postcssNesting(),
        postcssNormalize(),
        autoprefixer(),
        cssnano()
      ])
    )
    .pipe(dest(paths.dest));
}

function images() {
  return src(paths.source + "images/*.*")
    .pipe(imagemin())
    .pipe(dest(paths.dest + "images"));
}

function js() {
  return rollup
    .rollup({
      input: paths.source + "main.js",
      plugins: [terser()]
    })
    .then(bundle => {
      return bundle.write({
        file: paths.dest + "main.js",
        format: "cjs",
        sourcemap: true
      });
    });
}

function watcher() {
  watch(paths.source + "**/*.html", html);
  watch(paths.source + "**/*.css", css);
  watch(paths.source + "*.js", js);
  watch(paths.source + "images/*.*", images);
}

function clean(cb) {
  del(paths.dest + "**/*", { force: true });
  cb();
}

exports.default = series(
  clean,
  parallel(css, html, images, js),
  parallel(watcher, serve)
);
