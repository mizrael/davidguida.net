const gulp = require('gulp'),
    sass = require('gulp-sass')(require('sass')),
    prefix = require('gulp-autoprefixer'),
    cp = require('child_process'),
    browserSync = require('browser-sync'),
    htmlmin = require('gulp-htmlmin'),
    jekyll = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll';

const buildJekyll = (done) => cp.spawn(jekyll, ['build', '--incremental'], { stdio: 'inherit' })
    .on('close', () =>{
        return gulp.src('_site/**/*.html')
        .pipe(htmlmin({ collapseWhitespace: true, minifyCSS: true, minifyJS: true }))
        .pipe(gulp.dest('_site'));
    }),
    rebuildJekyll = gulp.series(buildJekyll, () => {
        browserSync.reload();
    }),
    buildStyle = gulp.series(() => {
        return gulp.src('assets/css/scss/main.scss')
            .pipe(sass({
                outputStyle: 'compressed',
                onError: browserSync.notify
            }))
            .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
            .pipe(gulp.dest('_site/assets/css'))
            .pipe(browserSync.reload({ stream: true }))
            .pipe(gulp.dest('assets/css'));
    }),
    buildAll = gulp.parallel(buildJekyll, buildStyle),
    buildAllAndRun = gulp.series(buildAll, () => {
        browserSync({
            server: {
                baseDir: '_site'
            },
            notify: false
        });
    }),
    watchFiles = () => {
        gulp.watch('assets/css/scss/**/*.scss', buildStyle);
        gulp.watch([
            'assets/js/**/*.js',
            '_config.yml',
            '*.html',
            '_layouts/*.html',
            '_includes/*.html',
            '_pages/*.html',
            '_posts/*',
            '**/*.md'
        ], rebuildJekyll);
    };

exports.default = buildAll;
exports.runAndWatch = gulp.parallel(buildAllAndRun, watchFiles); 
exports.run = buildAllAndRun;
exports.buildStyle = buildStyle;