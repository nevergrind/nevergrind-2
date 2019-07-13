
const gulp = require('gulp');
// var minifyHTML = require('gulp-minify-html'); // Minify HTML
var clean = require('gulp-rimraf'); // delete folder contents
var cleanCSS = require('gulp-clean-css'); // Minify the CSS
var stripDebug = require('gulp-strip-debug'); // Remove debugging stuffs
var concat = require('gulp-concat'); // Join all JS files together to save space
var uglify = require('gulp-uglify'); // Minify JavaScript
var rename = require('gulp-rename');
var imagemin = require('imagemin');
var imageminPngquant = require('imagemin-pngquant');
var imageResize = require('gulp-image-resize');

gulp.task('minify-css', function(){
	var css = [
		'main',
		'flex',
		'character-create',
	].map(function(file) {
		return './css/' + file + '.css';
	});
	gulp.src(css)
		.pipe(concat('ng2.css'))
		.pipe(gulp.dest('./css'))
		.pipe(cleanCSS())
		.pipe(rename('ng2.min.css'))
		.pipe(gulp.dest('./css'));
});
gulp.task('minify-ng2-js', function() {
	var js = [
		'beginWrap',
		'login',
		'create',
		'ng',
		'env',
		'my',
		'dom',
		'modal',
		'audio',
		'game',
		'title',
		'context',
		'events',
		'socket',
		'chat',
		'bar',
		'battle',
		'mobs',
		'mob',
		'town',
		'guild',
		'cache',
		'route',
		'mission',
		'dungeon',
		'skills',
		'zone',
		'party',
		'button',
		'test',
		'init',
		'endWrap',
	].map(function(file) {
		return './js/' + file + '.js';
	});
	return gulp.src(js)
		.pipe(concat('nevergrind-2.js'))
		.pipe(gulp.dest('./js'))
		.pipe(stripDebug()) // watch out for this for nwjs - can't see console statements
		.pipe(uglify())
		.pipe(rename('nevergrind-2.min.js'))
		.pipe(gulp.dest('./js'));
});
gulp.task('minify-png', function(){
	var img = 'dragon-fire';
	var source = 'mobs';
	return imagemin(['./mobs/'+ img +'/*'], './mobs/'+ img +'/', {
		use: [imageminPngquant({
			floyd: 1,
			nofs: true, // disable FS
			quality: '90',
			speed: 1
		})]
	}).then(function(){
		console.info("Images minified with quant: " + img)
	});
});
gulp.task('resize-png', function(){
	// add minify-png pipe
	var img = 'toadlok';
	var promise = new Promise(function(resolve) {
		gulp.src('./mobs-huge/' + img + '/*')
			.pipe(imageResize({
				imageMagick: true,
				width: 3000,
				height: 1500
			}))
			.pipe(gulp.dest('./mobs/' + img + '/'))
			.on('end', resolve);
	});

	promise.then(function(data){
		imagemin(['./mobs/'+ img +'/*'], './mobs/'+ img +'/', {
			use: [imageminPngquant({
				floyd: 1,
				nofs: true, // disable FS
				quality: '90',
				speed: 1
			})]
		}).then(function(){
			console.info("Images minified with quant: " + img)
		});
	});
});
gulp.task('clean-ng2', [], function(){
	console.info("Cleaning out ng2 build directory...");
	return gulp.src("./build-ng2/*", {
		read: false
	}).pipe(clean());
});
gulp.task('build-ng2', ['minify-css', 'minify-ng2-js', 'clean-ng2'], function(){
	// move app files
	gulp.src([
		'./index.html',
		'./package.json',
		'./greenworks.js',
		'./steam_appid.txt',
		'./nwjs/**/*'
	]).pipe(gulp.dest('./build-ng2'));
	// js
	gulp.src([
		'./lib/*'
	]).pipe(gulp.dest('./build-ng2/lib'));
	gulp.src([
		'./js/nevergrind-2.min.js'
	]).pipe(gulp.dest('./build-ng2/js'));

	// css
	gulp.src([
		'./css/cursor/*',
	]).pipe(gulp.dest('./build-ng2/css/cursor'));
	gulp.src([
		'./css/fonts/*',
	]).pipe(gulp.dest('./build-ng2/css/fonts'));
	gulp.src([
		'./css/libs/*',
	]).pipe(gulp.dest('./build-ng2/css/libs'));
	gulp.src([
		'./css/ng2.min.css'
	]).pipe(gulp.dest('./build-ng2/css'));

	// fonts
	gulp.src([
		'./fonts/*'
	]).pipe(gulp.dest('./build-ng2/fonts'));

	// sound & music
	gulp.src([
		'./sound/*'
	]).pipe(gulp.dest('./build-ng2/sound'));
	gulp.src([
		'./music/*'
	]).pipe(gulp.dest('./build-ng2/music'));

	// images
	gulp.src([
		'./images/**/*'
	]).pipe(gulp.dest('./build-ng2/images'));

	// mobs
	gulp.src([
		'./mobs/**/*'
	]).pipe(gulp.dest('./build-ng2/mobs'));
});
// renames nw.exe to firmament-wars.exe
gulp.task('rename', function() {
	gulp.src("./build-fw/nw.exe")
		.pipe(clean())
		.pipe(rename("firmament-wars.exe"))
		.pipe(gulp.dest("./build-fw"));
})
gulp.task('default', function(){
	gulp.run('minify-css', 'minify-ng2-js');
});


/*
gulp.task('resize-sprite', function(){
	// add minify-png pipe
	var img = 'dragon',
		h = 2100,
		w = 1500,
		totalHeight = h * 15,
		totalWidth = w * 7;
	var promise = new Promise(function(resolve) {
		gulp.src('./mobs-huge/' + img + '.png')
			.pipe(imageResize({
				imageMagick: true,
				width: totalHeight,
				height: totalWidth
			}))
			.pipe(gulp.dest('./mobs/' + img))
			.on('end', resolve);
	});

	promise.then(function(data){
		imagemin(['./mobs/'+ img], './mobs/'+ img, {
			use: [imageminPngquant({
				floyd: 1,
				nofs: true, // disable FS
				quality: '90',
				speed: 1
			})]
		}).then(function(){
			console.info("Spritemap minified with quant: " + img)
		});
	});
});*/