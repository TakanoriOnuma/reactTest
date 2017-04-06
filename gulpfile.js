var babelify = require('babelify');
var browserify = require('browserify');
var browserSync = require('browser-sync');
var buffer = require('vinyl-buffer');
var gulp = require('gulp');
var node = require('node-dev');
var source = require('vinyl-source-stream');

var watchify = require('watchify');

var paths = {
  src: './src/js/',
  dest: './build/js/',
  files: ['index.js', 'test.js']
};

function errorHandler(err) {
  console.log('Error: ' + err.message);
}

gulp.task('bundle', function() {
  paths.files.forEach(function(entryPoint) {
    // bundle option
    var bundler = watchify(
      browserify({
        cache: {},  // watchifyの差分ビルドを有効化
        entries: [paths.src + entryPoint],
        debug: true,
        packageCache: {}  // watchifyの差分ビルドを有効化
      })
    );
    // bundle function
    function bundled() {
      return bundler
        .transform(babelify)
        .bundle()
        .on('error', errorHandler)
        .pipe(source(entryPoint))
        .pipe(buffer())
        .pipe(gulp.dest(paths.dest))
        .pipe(browserSync.reload({stream: true}));
    }
    bundler.on('update', bundled);
    bundler.on('log', function(message) { console.log(message); });
    return bundled();
  });
});

// 自動ブラウザリロード
gulp.task('browser-sync', function() {
  browserSync({
    proxy: {
      target: 'http://localhost:3000'
    },
    port: 8080
  });
});

// Javascriptへのビルド
// ES6かつJSXなファイル群をbuild/bundle.jsへ変換する
gulp.task('build', function() {
  browserify({entries: ['./index.js']})
    .transform(babelify)
    .bundle()
    .on('error', errorHandler)
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(gulp.dest('./build'))
    .pipe(browserSync.reload({stream: true}));
});

// ローカルサーバーの起動
gulp.task('server', function() {
  node(['./server.js']);
});

// ファイル監視
// ファイルに更新があったらビルドしてブラウザをリロードする
gulp.task('watch', function() {
  gulp.watch('./index.html', ['reload']);
});

gulp.task('reload', function() {
  browserSync.reload();
});

// gulpコマンドで起動したときのデフォルトタスク
gulp.task('default', ['bundle', 'watch', 'browser-sync']);