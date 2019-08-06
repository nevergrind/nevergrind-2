// requires
var gulp = require('gulp');
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
// variables
var buildNg2Tasks = ['minify-css', 'minify-ng2-js', 'clean-ng2'];
// tasks
gulp.task('minify-css', minifyCss);
gulp.task('minify-ng2-js', minifyJs);
gulp.task('minify-png', minifyPng);
gulp.task('resize-png', resizePng);
gulp.task('clean-ng2', [], cleanNg2);
// need build-ng2-sdk task for testing
gulp.task('build-ng2', buildNg2Tasks, function() { buildNg2(false); });
gulp.task('build-ng2-sdk', buildNg2Tasks, function() { buildNg2(true); });
gulp.task('rename', renameExe);
gulp.task('default', defaultTask);
gulp.task('resize-sprite', resizeSprite);

//////////////////////////////////////////////
function minifyCss() {
	var css = [
		'main',
	].map(function(file) {
		return './css/' + file + '.css';
	});
	gulp.src(css)
		.pipe(concat('ng2.css'))
		.pipe(gulp.dest('./css'))
		.pipe(cleanCSS())
		.pipe(rename('ng2.min.css'))
		.pipe(gulp.dest('./css'));
}
function minifyJs() {
	var js = [
		'beginWrap',
		'alias',
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
		'popover',
		'events',
		'socket',
		'chat',
		'party',
		'friend',
		'ignore',
		'toast',
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
		//.pipe(uglify()) // needs update?
		.pipe(rename('nevergrind-2.min.js'))
		.pipe(gulp.dest('./js'));
}
function minifyPng() {
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
}
function resizePng() {
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
}
function cleanNg2() {
	console.info("Cleaning out ng2 build directory...");
	return gulp.src("./build-ng2/*", {
		read: false
	}).pipe(clean());
}
function buildNg2(isSdk) {
	// move app files
	gulp.src([
		'./index.html',
		'./package.json',
		'./greenworks.js',
		'./steam_appid.txt',
		(isSdk ? './nwjs-sdk/**/*' : './nwjs/**/*')
	]).pipe(gulp.dest('./build-ng2'))
		.on('end', renameExe);
	// js
	gulp.src([
		'./js/libs/**/*'
	]).pipe(gulp.dest('./build-ng2/js/libs'));
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
}
function defaultTask() {
	gulp.run('minify-css', 'minify-ng2-js');
}
function renameExe() {
	var from = 'nw.exe';
	var to = 'nevergrind-2.exe';
	console.log('renaming from ' + from + ' to ' + to);
	gulp.src("./build-ng2/" + from)
		.pipe(clean())
		.pipe(rename(to))
		.pipe(gulp.dest("./build-ng2"));
}
function resizeSprite() {
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
}