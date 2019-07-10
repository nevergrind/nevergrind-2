// core.js
var ng = {
	id: 0,
	getId: function() {
		ng.id++;
		if (ng.id > 999999999) {
			ng.id = 1;
		}
		return ng.id;
	},
	events: function(){
		$(window).focus(function(){
			/*document.title = g.defaultTitle;
			ng.titleFlashing = false;*/
		});
		// should be delegating no drag start
		$("body").on('dragstart', 'img', function(e) {
			e.preventDefault();
		});
		$("#enter-world").on(env.click, function(){
			town.go();
		});

		$(window).on('resize orientationchange focus', function() {
			// env.resizeWindow();
			// debounce resize
			clearTimeout(ng.resizeTimer);
			ng.resizeTimer = setTimeout(function(){
				if (chat.initialized) {
					chat.scrollBottom();
				}
				if (ng.view === 'battle') {
					for (var i=0; i<mob.max; i++) {
						mob.sizeMob(i);
					}
				}
			}, 50);
		}).on('load', function(){
			env.resizeWindow();
		});
	},
	disconnect: function(msg) {
		ng.view = 'disconnected';
		// turn off all events
		$(document).add('*').off();
		$("main > *").css('display', 'none');
		var e = document.getElementById('scene-error');
		e.style.display = 'block';
		e.innerHTML = msg || 'You have been disconnected from the server';
		setTimeout(function() {
			location.reload();
		}, 12000);
	},
	resizeTimer: 0,
	races: [
		'Barbarian',
		'Dark Elf',
		'Dwarf',
		'Erudite',
		'Gnome',
		'Half Elf',
		'Halfling',
		'High Elf',
		'Human',
		'Ogre',
		'Troll',
		'Wood Elf'
	],
	jobs: [
		'Bard',
		'Cleric',
		'Druid',
		'Enchanter',
		'Magician',
		'Monk',
		'Necromancer',
		'Paladin',
		'Ranger',
		'Rogue',
		'Shadowknight',
		'Shaman',
		'Warrior',
		'Wizard'
	],
	jobShort: {
		Bard: 'BRD',
		Cleric: 'CLR',
		Druid: 'DRU',
		Enchanter: 'ENC',
		Magician: 'MAG',
		Monk: 'MNK',
		Necromancer: 'NEC',
		Paladin: 'PLD',
		Ranger: 'RNG',
		Rogue: 'ROG',
		Shadowknight: 'SHD',
		Shaman: 'SHM',
		Warrior: 'WAR',
		Wizard: 'WIZ'
	},
	toJobShort: function(key){
		return ng.jobShort[key];
	},
	jobLong: {
		BRD: 'Bard',
		CLR: 'Cleric',
		DRU: 'Druid',
		ENC: 'Enchanter',
		MAG: 'Magician',
		MNK: 'Monk',
		NEC: 'Necromancer',
		PLD: 'Paladin',
		RNG: 'Ranger',
		ROG: 'Rogue',
		SHD: 'Shadowknight',
		SHM: 'Shaman',
		WAR: 'Warrior',
		WIZ: 'Wizard'
	},
	toJobLong: function(key){
		return ng.jobLong[key];
	},
	getJobShortKeys: function() {
		return Object.keys(ng.jobLong);
	},
	copy: function(o){
		return JSON.parse(JSON.stringify(o));
	},
	loadMsg:
		"<div class='text-shadow text-center now-loading'>Loading... <i class='fa fa-cog fa-spin load-cog'></i></div>",
	attrs: ['str', 'sta', 'agi', 'dex', 'wis', 'intel', 'cha'],
	resists: ['bleed', 'poison', 'arcane', 'lightning', 'fire', 'cold'],
	dungeon: ['traps', 'treasure', 'scout', 'pulling'],
	gameDuration: 0,
	delay: .5,
	modalSpeed: .5,
	friends: [],
	ignore: [],
	joinedGame: false,
	searchingGame: false,
	defaultTitle: 'Nevergrind 2',
	titleFlashing: false,
	name: "",
	password: "",
	view: "title",
	resizeX: 1,
	resizeY: 1,
	chatOn: false,
	lastKey: 0,
	lockOverlay: document.getElementById("lock-overlay"),
	startTime: Date.now(),
	locked: 0,
	loadAttempts: 0,
	isModalOpen: false,
	setScene: function(scene){
		// remove defaults and set via js
		$(".scene").removeClass('none')
			.css('display', 'none');
		document.getElementById('scene-' + scene).style.display = 'block';
		ng.view = scene;
	},
	camel: function(str){
		str = str.split("-");
		for (var i=1, len=str.length; i<len; i++){
			str[i] = str[i].charAt(0).toUpperCase() + str[i].substr(1);
		}
		return str.join("");
	},
	lock: function(hide){
		ng.lockOverlay.style.display = "block";
		ng.lockOverlay.style.opacity = hide ? 0 : 1;
		ng.locked = 1;
	},
	unlock: function(){
		ng.lockOverlay.style.display = "none";
		ng.locked = 0;
	},
	unlockFade: function(d){
		if (!d){
			d = 1;
		}
		TweenMax.to(ng.lockOverlay, d, {
			startAt: {
				opacity: 1,
			},
			ease: Power3.easeIn,
			opacity: 0,
			onComplete: function(){
				ng.lockOverlay.style.display = 'none';
			}
		});
	},
	checkPlayerData: function(){
		// ignore list
		var ignore = localStorage.getItem('ignore');
		if (ignore !== null){
			ng.ignore = JSON.parse(ignore);
		} else {
			var foo = []; 
			localStorage.setItem('ignore', JSON.stringify(foo));
		}
	},
	TDC: function(){
		return new TweenMax.delayedCall(0, '');
	},
	TM: function(o){
		o = o || {};
		return new TimelineMax(o);
	},
	config: {
		audio: {
			musicVolume: 10,
			soundVolume: 50
		}
	},
	geo: {},
	keepAlive: function(){
		$.ajax({
			type: 'GET',
			url: app.url + "server/session/keep-alive.php"
		}).always(function() {
			setTimeout(ng.keepAlive, 180000);
		});
	},
	msg: function(msg, d){
		dom.msg.innerHTML = msg;
		if (d === undefined || d < 2){
			d = 2;
		}
		TweenMax.to(dom.msg, d, {
			overwrite: 1,
			startAt: {
				visibility: 'visible',
				alpha: 1
			},
			onComplete: function(){
				TweenMax.to(this.target, .2, {
					alpha: 0,
					onComplete: function(){
						TweenMax.set(this.target, {
							visibility: 'hidden',
						});
					}
				});
			}
		});
	},
	split: function(id, msg, d){
		if (d === undefined){
			d = .01;
		}
		var e = document.getElementById(id);
		e.innerHTML = msg;
		var split = new SplitText(e, {
				type: "words,chars"
			});
		TweenMax.staggerFromTo(split.chars, d, {
			immediateRender: true,
			alpha: 0
		}, {
			delay: .1,
			alpha: 1
		}, .01);
	},
	logout: function(){
		if (ng.locked) return;
		ng.lock();
		// socket.removePlayer(my.account);
		$.ajax({
			type: 'GET',
			url: app.url + 'server/account/logout.php'
		}).done(function() {
			ng.msg("Logout successful");
			localStorage.removeItem('email');
			localStorage.removeItem('token');
			location.reload();
		}).fail(function() {
			ng.msg("Logout failed.");
		});
	},
	goCreateCharacter: function(){
		ng.lock(1);
		var z = '#scene-title-select-character',
			prom = 0,
			allDone = function(){
				if (++prom === 2){
					ng.unlock();
					// init create screen and show
					TweenMax.set(z, {
						display: 'none',
						opacity: 1
					});
					create.setRandomGender();
					create.setRandomRace();
					TweenMax.to('#scene-title-create-character', .6, {
						startAt: {
							display: 'block',
							y: 20,
							opacity: 0
						},
						y: 0,
						opacity: 1,
						onComplete: function(){
                            $("#create-character-name").focus();
							ng.unlock();
						}
					});
				}
			};
		// hide
		TweenMax.to(z, .6, {
			y: 20,
			opacity: 0,
			onComplete: function(){
				allDone();
			}
		});
		
		$.ajax({
			type: 'GET',
			url: app.url + 'server/create/getStatMap.php'
		}).done(function(r){
			var r = r.statMap;
			ng.races.forEach(function(v){
				create.raceAttrs[v] = r[v].attrs;
				create.possibleJobs[v] = r[v].jobs;
			});
			// job stats
			ng.jobs.forEach(function(v){
				create.jobAttrs[v] = r.jobs[v];
			});
            $("#create-character-name").val('');
			allDone();
		});
	},
	initGame: function(){
		$.ajax({
			type: 'GET',
			url: app.url + 'server/init-game.php'
		}).done(function(r){
			console.info('init-game', r.account, r);
			app.initialized = 1;
			if (r.account) {
				app.account = my.account = r.account; // for global reference
				document.getElementById('logout').textContent = 'Logout ' + r.account;
				ng.displayAllCharacters(r.characterData);
				ng.checkPlayerData();
				$("#login-modal").remove();
			}
			else {
				notLoggedIn();
			}
			document.getElementById('version').textContent = 'Version ' + app.version;

			var h = location.hash;
			if (app.isLocal) {
				// initial hashtag routing
				if (h === '#town' ||
					h === '#battle' ||
					h === '#dungeon') {
					town.go();
				}
			}

			if (r.resetSession === null) {
				sessionStorage.clear();
			}
		});
	},
	playerCardClicks: 0,
	displayAllCharacters: function(r){
		var s = '';
		r.forEach(function(d){
			// #ch-card-list
			s +=
				'<div data-row="'+ d.row +'" '+
				'data-name="'+ d.name +'" '+
				'class="btn btn-lg ch-card center select-player-card">'+
				'<div class="ch-card-name">'+ d.name +'</div>'+
				'<div class="ch-card-details">'+ d.level +' '+ d.race +' '+ ng.toJobLong(d.job) +'</div>'+
				'</div>';
		});
		document.getElementById('ch-card-list').innerHTML = s;
		$(".select-player-card:first").trigger(env.click);
	}
};

ng.init = (function(){
	$.ajaxSetup({
		type: 'POST',
		timeout: 3000
	});
	TweenLite.defaultEase = Quad.easeOut;
})();