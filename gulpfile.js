// Include gulp
const gulp = require('gulp')
const gutil = require('gulp-util')
const webpackStream = require('webpack-stream')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const path = require('path')
const del = require('del')
const htmlreplace = require('gulp-html-replace')
const bundleHelper = require('./webpack/bundlehelper')
const eslint = require('gulp-eslint')

const htmlReplaceSkeleton = () =>
  gulp.src('src/index.html')
    .pipe(htmlreplace({
      loader: {
        src: null,
        tpl: bundleHelper.createHeader()
      }
    }))
    .pipe(gulp.dest('dist/'))

// Cleanup task
gulp.task('clean', (cb) => {
  del(['./dist/**/*']).then(() => {cb()})
})

// Lint Task
gulp.task('lint', () => gulp.src('src/**/*.{jsx,js}')
  // eslint() attaches the lint output to the "eslint" property
  // of the file object so it can be used by other modules.
  .pipe(eslint())
  // eslint.format() outputs the lint results to the console.
  // Alternatively use eslint.formatEach() (see Docs).
  .pipe(eslint.format())
  // To have the process exit with an error code (1) on
  // lint error, return the stream and pipe to failAfterError last.
  .pipe(eslint.failAfterError())
)

gulp.task('webpack-prod', ['lint'], () => gulp.src('')
  .pipe(webpackStream(require('./webpack/config.prod')))
  .pipe(gulp.dest('dist/assets/')))

gulp.task('webpack-dev', ['lint'], () => gulp.src('')
  .pipe(webpackStream(require('./webpack/config.dev')))
  .pipe(gulp.dest('dist/assets/')))

gulp.task('prepare-index-dev', ['webpack-dev'], htmlReplaceSkeleton)
gulp.task('prepare-index-prod', ['webpack-prod'], htmlReplaceSkeleton)

gulp.task('build', ['clean', 'webpack-prod', 'prepare-index-prod'])
gulp.task('build-dev', ['clean', 'webpack-dev', 'prepare-index-dev'])

gulp.task('webpack-dev-server', ['clean'], () => {
  const config = require('./webpack/config.dev-server')
  const compiler = webpack(config)
  const server = new WebpackDevServer(compiler, {
    hot: true,
    inline: true,
    historyApiFallback: true,
    progress: true,
    contentBase: path.join(__dirname, 'src'),
    publicPath: '/assets/',
    stats: {
      colors: true
    }
  })
  server.listen(8081, '0.0.0.0', (err) => {
    if (err) throw new gutil.PluginError('webpack-dev-server', err)
    // Server listening
    gutil.log('[webpack-dev-server]', 'http://localhost:8081/')
  })
})

gulp.task('default', ['clean', 'lint'], () => {
  console.log('stuffff')
})
