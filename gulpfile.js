const gulp = require('gulp');
const panini = require('panini');
const rimraf = require('rimraf');
const browser = require('browser-sync');
const plumber = require('gulp-plumber');
const sourcemaps = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const source = require("vinyl-source-stream");
const buffer = require("vinyl-buffer");
const uglify = require("gulp-uglify");
const browserify = require("browserify");
const rename = require("gulp-rename");
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');
const watchify = require('watchify');
const babelify = require('babelify');
const htmlmin = require('gulp-htmlmin');
const imagemin = require('gulp-imagemin');
const gulpIf = require('gulp-if');
const replace = require('gulp-replace');
const fs = require('fs');
const merge = require('merge-stream');

let env;

const clean = function CLEAN(done) {
  rimraf('dist', function() {
    rimraf('temp', done);
  });
};

const pages = function PAGES() {
  return gulp.src('src/pages/**/*.html')
    .pipe(panini({
      root: 'src/pages',
      layouts: 'src/layouts',
      partials: 'src/partials',
      helpers: 'src/helpers',
    }))
    //.pipe(htmlmin({collapseWhitespace:true})) // might need to move to different part depending on if i add critical css
    // .pipe(gulpIf(env === 'BUILD', ))
    .pipe(gulp.dest('dist'));
};

const criticalCSS = function CRITICALCSS() {
  const css = fs.readFileSync('./temp/main.min.css', 'utf-8');
  return gulp.src('dist/**/*.html')
    .pipe(htmlmin({collapseWhitespace:true}))
    .pipe(replace('<link rel="stylesheet" href="/temp/main.min.css">', `<style>${css}</style><link rel="preload" href="/stylesheets/other.min.css" as="style" onload="this.rel='stylesheet'"><noscript><link rel="stylesheet" href="/stylesheets/other.min.css"></noscript>`))
    .pipe(gulp.dest('dist'));
}

const server = function SERVER(done) {
  browser.init({
    server: 'dist'
  });
  done();
};

const resetPages = function RESETPAGES(done) {
  panini.refresh(); // removed layouts / partials and other stuff from cache
  done();
};

const copyServiceWorker = function COPYSERVICEWORKER() {
  return gulp.src('src/assets/sw.js')
    //.pipe(copy('./dist'));
    //.dest('/.dist');
    .pipe(gulp.dest('dist/'));
}

const copyFavicons = function COPYFAVICONS() {
  return gulp.src('src/assets/favicons/*.*')
  .pipe(gulp.dest('dist/favicons'));
};

const images = function IMAGES() {
  return gulp.src('src/assets/images/**/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/images'));
}

const styles = function STYLES(done) {
  const DEST = env === 'DEV' ? 'dist/temp' : 'temp';

  if (env === 'DEV') {
    return gulp.src('./src/assets/scss/main.scss')
     .pipe(sourcemaps.init())
     .pipe(sass().on('error',  sass.logError))
     .pipe(plumber())
     .pipe(sourcemaps.init())
     .pipe(autoprefixer({
       browsers: ['ie >=9', '> 1%'],
       cascade: false,
     }))
     .pipe(cssnano({
       zindex:false,
     }))
     .pipe(rename({
       extname: '.min.css'
     }))
     .pipe(sourcemaps.write('.'),{
       includeContent: true,
     })
     .pipe(gulp.dest('dist/temp'));
  } else {

      const critical = gulp.src('./src/assets/scss/critical/main.scss')
       .pipe(sass().on('error',  sass.logError))
       .pipe(plumber())
       .pipe(autoprefixer({
         browsers: ['ie >=9', '> 1%'],
         cascade: false,
       }))
       .pipe(cssnano())
       .pipe(rename({
         extname: '.min.css'
       }))
       .pipe(gulp.dest('temp'));

      const other = gulp.src('./src/assets/scss/other/main.scss')
        .pipe(sass().on('error',  sass.logError))
        .pipe(plumber())
        .pipe(autoprefixer({
          browsers: ['ie >=9', '> 1%'],
          cascade: false,
        }))
        .pipe(cssnano({zindex: false}))
        .pipe(rename({
          basename: 'other',
          extname: '.min.css'
        }))
        .pipe(gulp.dest('dist/stylesheets'));


    return merge(critical, other);
  }


};

// const scriptsWrapper = () => {
//
// }

const scriptsWatch = function SCRIPTSWATCH(done) {
  scripts(true, done);
};

const scriptsBuild = function SCRIPTSBUILD(done) {
  scripts(false, done);
};

const scripts = function SCRIPTS(watch, done) {
  let timesCompiled = 0;
  const b = browserify({
    entries: './src/assets/js/main.js',
    debug: true,
    cache: {},
    packageCache: {},
    plugin: [watchify]
    })
    .transform(babelify.configure({
    presets: ["es2015", "stage-0"],
    plugins:['add-module-exports']
  }))

  const bundle = (callback) => {
    b.bundle()
    .on('error', function(err) {
      console.log(err.message);
      this.emit('end');
    })
    .pipe(plumber())
    .pipe(source('main.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({
      loadMaps:true,
    }))
    .pipe(uglify())
    .pipe(rename({
      extname:'.min.js',
    }))
    .pipe(sourcemaps.write('.'),{
      includeContent:true,
    })
    .pipe(gulp.dest('./dist/js'))
    .on('end', () => {
      if (typeof callback === 'function') callback();
      if (watch === true) {
        if (timesCompiled === 0) {
          timesCompiled = 1;
        } else {
          browser.reload();
        }
      }
    });
  }

  if (watch === true) {
    b.on('update', bundle);
  }
  bundle(done);
};

const setEnv = function SETENV(environment, done) {
  env = environment
  done();
};

const setEnvBuild = function SETENVBUILD(done) {
  setEnv('BUILD', done);
};

const setEnvDev = function SETENVDEV(done) {
  setEnv('DEV', done);
};


const watcher = function WATCHER(done) {
  gulp.watch('src/assets/scss/**/*.scss').on('all',gulp.series(styles, browser.reload));
  gulp.watch('src/**/*.html').on('all', gulp.series(resetPages, pages, browser.reload));
  gulp.watch('src/assets/images/**/*').on('all', gulp.series(images, browser.reload));
  scriptsWatch(done); // this calls done so it can generate the script first before the next step
};



gulp.task('dev', gulp.series(setEnvDev, clean, pages, styles, images, copyFavicons, watcher, server));

gulp.task('build', gulp.series(setEnvBuild, clean, styles, pages, images, copyFavicons, criticalCSS, scriptsBuild));
