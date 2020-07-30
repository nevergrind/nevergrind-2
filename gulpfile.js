// requires
var gulp = require('gulp');
// var minifyHTML = require('gulp-minify-html'); // Minify HTML
var clean = require('gulp-rimraf'); // delete folder contents
var del = require('del'); // new clean
var cleanCSS = require('gulp-clean-css'); // Minify the CSS
var stripDebug = require('gulp-strip-debug'); // Remove debugging stuffs
var concat = require('gulp-concat'); // Join all JS files together to save space
var uglify = require('gulp-uglify'); // Minify JavaScript
var rename = require('gulp-rename');
var imagemin = require('imagemin');
var imageminPngquant = require('imagemin-pngquant');
var imageResize = require('gulp-image-resize');
// variables
const buildNg2Tasks = ['minify-css', 'minify-ng2-js', 'clean-ng2'];
//const buildNg2Tasks = ['minify-css', 'minify-ng2-js'];
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


const jsFiles = [
	'build/beginWrap',
	'core/alias',
	'core/login',
	'core/create',
	'core/ng',
	'core/env',
	'core/pix',
	'core/my',
	'core/dom',
	'core/audio',
	'core/game',
	'core/title',
	'core/context',
	'core/events',
	'core/socket',
	'chat/chat',
	'chat/party',
	'chat/guild',
	'chat/friend',
	'chat/whisper',
	'chat/ignore',
	'chat/broadcast',
	'chat/who',
	'components/toast',
	'components/modal',
	'components/button',
	'components/popover',
	'components/tooltip',
	'components/dropdown',
	'mission/quests',
	'mission/mission',
	'mission/zones',
	'ui/bar',
	'combat/combat',
	'combat/battle',
	'combat/spell',
	'combat/buffs',
	'mob/mob',
	'mob/mobs',
	'mob/mob-types',
	'mob/mob-images',
	'mob/mob-data',
	'mob/mob-effects',
	'skills/animate-skill',
	'skills/WAR',
	'skills/CRU',
	'skills/SHD',
	'skills/MNK',
	'skills/ROG',
	'skills/RNG',
	'skills/DRU',
	'skills/CLR',
	'skills/SHM',
	'skills/BRD',
	'skills/NEC',
	'skills/ENC',
	'skills/SUM',
	'skills/WIZ',
	'items/item',
	'items/amulets',
	'items/belts',
	'items/boots',
	'items/bows',
	'items/bracers',
	'items/charms',
	'items/chests',
	'items/cloaks',
	'items/gloves',
	'items/helms',
	'items/legs',
	'items/focus',
	'items/oneHandBlunts',
	'items/oneHandSlashers',
	'items/piercers',
	'items/rings',
	'items/shields',
	'items/shoulders',
	'items/staves',
	'items/twoHandBlunts',
	'items/twoHandSlashers',
	'town/town',
	'town/trade',
	'town/tavern',
	'town/academy',
	'core/cache',
	'core/router',
	'core/dungeon',
	'core/skills',
	'core/zone',
	'core/stats',
	'core/css',
	'core/init',
	'core/loading',
	'build/endWrap',
].map(function(file) {
	return './js/' + file + '.js';
});

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
	return gulp.src(jsFiles)
		.pipe(concat('nevergrind-online.js'))
		.pipe(gulp.dest('./js'))
		//.pipe(stripDebug()) // watch out for this for nwjs - can't see console statements
		//.pipe(uglify()) // needs update?
		.pipe(rename('nevergrind-online.min.js'))
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
	// we don't want to clean this file though so we negate the pattern
	// here we use a globbing pattern to match everything inside the `mobile` folder
	return del([ './build-ng2/**/*']);
	/*return gulp.src("./build-ng2/!*", {
		read: false
	}).pipe(clean());*/
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

	// greenworks & steam libs
	gulp.src(['./lib/*']).pipe(gulp.dest('./build-ng2/lib'));
	// js
	console.info("Copying javascript...");
	gulp.src([
		'./js/libs/**/*'
	]).pipe(gulp.dest('./build-ng2/js/libs'));
	gulp.src([
		'./js/nevergrind-online.min.js'
	]).pipe(gulp.dest('./build-ng2/js'));

	// css
	console.info("Copying css...");
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
	console.info("Copying sound and music...");
	gulp.src([
		'./sound/*'
	]).pipe(gulp.dest('./build-ng2/sound'));
	gulp.src([
		'./music/*'
	]).pipe(gulp.dest('./build-ng2/music'));

	console.info("Copying images...");
	// images
	gulp.src([
		'./images/**/*'
	]).pipe(gulp.dest('./build-ng2/images'));

	console.info("Copying mobs...");
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
	var to = 'nevergrind-online.exe';
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