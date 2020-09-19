// requires
var gulp = require('gulp');
// var minifyHTML = require('gulp-minify-html'); // Minify HTML
var clean = require('gulp-rimraf'); // delete folder contents
var del = require('del'); // new delete
var minifyCSS = require('gulp-clean-css'); // Minify the CSS
var stripDebug = require('gulp-strip-debug'); // Remove debugging stuffs
var concat = require('gulp-concat'); // Join all files together to save space
var uglify = require('gulp-uglify'); // Minify JavaScript
var rename = require('gulp-rename');
var imagemin = require('imagemin');
var imageminPngquant = require('imagemin-pngquant');
var imageResize = require('gulp-image-resize');
var exec = require('child_process').exec;
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
gulp.task('build-ng2', buildNg2Tasks, () => buildNg2(false))
gulp.task('build-ng2-sdk', buildNg2Tasks, () => buildNg2(true))
gulp.task('rename', renameExe);
gulp.task('default', defaultTask);
gulp.task('resize-sprite', resizeSprite);

const jsFiles = [
	'libs/jquery.min',
	'libs/lodash.min',
	'libs/pixi.min',
	'libs/gsap/TweenMax2.min',
	// gsap/TweenMax3.min
	'libs/gsap/PixiPlugin-v2.min',
	// gsap/PixiPlugin-v3.min
	'libs/gsap/SplitText.min',
	'libs/gsap/Draggable.min',
	'libs/gsap/ThrowPropsPlugin.min',
	'libs/autobahn-2.min',
	// libs/gsap/ThrowPropsPlugin.min
	// libs/gsap/DrawSVGPlugin.min
	// libs/gsap/EaselPlugin.min
	'build/beginWrap',
	'values/enums',
	'values/constants',
	'util/util',
	'util/query',
	'core/alias',
	'core/login',
	'core/create',
	'core/ng',
	'core/expanse',
	'core/pix',
	'core/my',
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
	'combat/timers',
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
	'skills/WLK',
	'skills/ENC',
	'skills/TMP',
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
].map((file) => './js/' + file + '.js')
const cssFiles = ['main'].map((file) => './css/' + file + '.css')

//////////////////////////////////////////////
function minifyCss() {
	gulp.src(cssFiles)
		.pipe(concat('ngo.css'))
		.pipe(gulp.dest('./css'))
		.pipe(minifyCSS())
		.pipe(rename('ngo.min.css'))
		.pipe(gulp.dest('./css'))
}
function minifyJs() {
	return gulp.src(jsFiles)
		.pipe(concat('ngo.js'))
		.pipe(gulp.dest('./js'))
		//.pipe(uglify()) // needs update?
		.pipe(rename('ngo.min.js'))
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
		// console.info("Images minified with quant: " + img)
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
			// console.info("Images minified with quant: " + img)
		});
	});
}
function cleanNg2() {
	console.info("Cleaning out ng2 build directory...");
	return del([ './build-ng2/**/*']);
}
function buildNg2(isSdk) {
	let sdk = isSdk ? '-sdk' : ''
	// move app files
	console.info("Copying core files...")
	gulp.src([
		'./index.html',
		'./package.json',
		'./greenworks.js',
		'./steam_appid.txt',
		'./nwjs'+ sdk + '/**/*'
	]).pipe(gulp.dest('./build-ng2'))
		.on('end', renameExe)

	// greenworks & steam libs
	gulp.src(['./lib/*']).pipe(gulp.dest('./build-ng2/lib'))
	// js
	console.info("Copying javascript...")
	gulp.src(['./js/ngo.min.js']).pipe(gulp.dest('./build-ng2/js'))

	// css
	console.info("Copying css...");
	gulp.src(['./css/cursor/*']).pipe(gulp.dest('./build-ng2/css/cursor'));
	gulp.src(['./css/fonts/*']).pipe(gulp.dest('./build-ng2/css/fonts'));
	gulp.src(['./css/libs/*']).pipe(gulp.dest('./build-ng2/css/libs'));
	gulp.src(['./css/ngo.min.css']).pipe(gulp.dest('./build-ng2/css'));

	// fonts
	console.info("Copying fonts...")
	gulp.src(['./fonts/*']).pipe(gulp.dest('./build-ng2/fonts'));

	// sound & music
	// console.info("Copying sound and music...");
	gulp.src(['./sound/*']).pipe(gulp.dest('./build-ng2/sound'));
	gulp.src(['./music/*']).pipe(gulp.dest('./build-ng2/music'));

	console.info("Copying images...");
	// images
	gulp.src(['./images/**/*']).pipe(gulp.dest('./build-ng2/images'));

	console.info("Copying mobs...");
	// mobs
	gulp.src(['./mobs/**/*']).pipe(gulp.dest('./build-ng2/mobs'));

}
function defaultTask() {
	gulp.run('minify-css', 'minify-ng2-js');
}
function renameExe() {
	const from = 'nw.exe'
	const to = 'nevergrind-online.exe'
	console.log('renaming from ' + from + ' to ' + to)
	gulp.src("./build-ng2/" + from)
		.pipe(clean())
		.pipe(rename(to))
		.pipe(gulp.dest("./build-ng2"))
		.on('end', createBinFile)
}
function createBinFile() {
	console.info('Creating bin file...')
	const path = 'C:/xampp/htdocs/ng2/build-ng2/'
	const fullPath = 'C:/xampp/htdocs/ng2/nwjs-sdk/nwjc '+ path +'js/ngo.min.js '+ path +'ngo.bin'
	exec(fullPath, (error, stdout, stderr) => {
		console.info('bin file created!')
		console.info('Deleting old data...!')
		// force allows deleting outside of current working directory
		del([
			'./css/ngo.css',
			'./css/ngo.min.css',
			'./js/ngo.js',
			'./js/ngo.min.js',
			'./build-ng2/js',
			'C:/Users/maelf/AppData/Local/nevergrind-online'
		], { force: true })
		// delete old local build folder in user folder (gets rid of old nw.js data)
	});
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
			// console.info("Spritemap minified with quant: " + img)
		});
	});
}