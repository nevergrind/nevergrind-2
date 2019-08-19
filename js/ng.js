// ng.js
var ng;
(function() {
	ng = {
		id: 0,
		resizeTimer: 0,
		loadMsg:
			"<div id='load-msg' class='text-shadow text-center now-loading'>Loading</div>",
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
		lockOverlay: getById("lock-overlay"),
		startTime: Date.now(),
		locked: 0,
		loadAttempts: 0,
		isModalOpen: false,
		maxLevel: 50,
		levels: [],
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
		config: {
			audio: {
				musicVolume: 10,
				soundVolume: 50
			}
		},
		TM,
		TDC,
		msg,
		init,
		lock,
		split,
		getId,
		events,
		unlock,
		logout,
		dimRetAttr,
		dimRetSkill,
		setScene,
		initGame,
		toJobLong,
		toJobShort,
		disconnect,
		unlockFade,
		checkPlayerData,
		goCreateCharacter,
		displayAllCharacters,
	}
	///////////////////////////////
	function init() {
		$.ajaxSetup({
			type: 'POST',
			timeout: 4000
		});
		TweenLite.defaultEase = Quad.easeOut;
		for (var i=1; i<=ng.maxLevel; i++) {
			ng.levels.push(i+'');
		}
	}
	function getId() {
		ng.id++;
		if (ng.id > 999999999) {
			ng.id = 1;
		}
		return ng.id;
	}
	function events() {
		$("#enter-world").on('click', town.go);
	}
	function disconnect(msg) {
		ng.view = 'disconnected';
		// turn off all events
		$(document).add('*').off();
		$("main > *").css('display', 'none');
		var e = getById('scene-error');
		e.style.display = 'block';
		e.innerHTML = msg || 'You have been disconnected from the server';
		setTimeout(location.reload, 12000);
	}
	function toJobShort(key) {
		return ng.jobShort[key];
	}
	function toJobLong(key) {
		return ng.jobLong[key];
	}
	function setScene(scene) {
		// remove defaults and set via js
		$(".scene").removeClass('none')
			.css('display', 'none');
		getById('scene-' + scene).style.display = 'block';
		ng.view = scene;
	}
	function lock(hide) {
		ng.lockOverlay.style.display = "block";
		ng.lockOverlay.style.opacity = hide ? 0 : 1;
		ng.locked = 1;
	}
	function unlock() {
		ng.lockOverlay.style.display = "none";
		ng.locked = 0;
	}
	function unlockFade(d) {
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
	}
	function checkPlayerData() {
		// ignore list
		var ignore = localStorage.getItem('ignore');
		if (ignore !== null){
			ng.ignore = JSON.parse(ignore);
		} else {
			var foo = [];
			localStorage.setItem('ignore', JSON.stringify(foo));
		}
	}
	function TDC() {
		return new TweenMax.delayedCall(0, '');
	}
	function TM(o) {
		o = o || {};
		return new TimelineMax(o);
	}
	function keepAlive() {
		clearTimeout(game.session.timer);
		$.get(app.url + 'session/keep-alive.php').always(function() {
			if (ng.view === 'title') {
				game.session.timer = setTimeout(keepAlive, 170000);
			}
		});
	}
	function msg(msg, d) {
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
	}
	function split(id, msg, d) {
		if (d === undefined){
			d = .01;
		}
		var e = getById(id);
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
	}
	function logout() {
		if (ng.locked) return;
		ng.lock();
		// socket.removePlayer(my.account);
		$.get(app.url + 'account/logout.php').done(function() {
			ng.msg("Logout successful");
			localStorage.removeItem('email');
			localStorage.removeItem('token');
			location.reload();
		}).fail(function() {
			ng.msg("Logout failed.");
		});
	}
	function dimRetAttr(val) {
		var damBonus = 0;
		var maxBonus = 100;
		var bonusPerPt = 1;
		var multiplier = bonusPerPt / maxBonus;
		var bonuses = [];

		while (val-- > 0) {
			damBonus += bonusPerPt;
			bonuses.push(bonusPerPt.toFixed(2));
			bonusPerPt = (maxBonus - damBonus) * multiplier;
		}
		console.warn('bonuses: ', bonuses.join(', '));
		return Math.floor(damBonus); // 92% damage bonus for 255 strength
	}
	function dimRetSkill(val) {
		var skillBonus = 0;
		var bonusPerPoint = basePoint = 7;
		var multiplier = .9;
		var i = 0;

		while (val-- > 0) {
			skillBonus += bonusPerPoint;
			console.warn(++i, +bonusPerPoint.toFixed(2), 'total: ', Math.round(skillBonus));
			bonusPerPoint = bonusPerPoint * multiplier;
		}
		return Math.round(skillBonus); // 92% damage bonus for 255 strength
	}
	function goCreateCharacter() {
		ng.lock(1);
		var z = '#scene-title-select-character';
		var prom = 0;
		// hide
		TweenMax.to(z, .6, {
			y: 20,
			opacity: 0,
			onComplete: allDone
		});

		$.get(app.url + 'create/get-stat-map.php').done(function(r){
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
		///////////////////////////////////////////////////
		function allDone(){
			if (++prom === 2){
				ng.unlock();
				// init create screen and show
				TweenMax.set(z, {
					display: 'none',
					opacity: 1
				});
				create.form = create.getEmptyForm();
				create.setRandomGender();
				create.setRandomRace();
				TweenMax.to('#scene-title-create-character', .6, {
					startAt: {
						display: 'flex',
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
		}
	}
	function initGame() {
		$.get(app.url + 'init-game.php').done(function(r){
			console.info('init-game', r);
			app.initialized = 1;
			if (r.account) {
				app.account = my.account = r.account; // for global reference
				getById('logout').textContent = 'Logout ' + r.account;
				ng.displayAllCharacters(r.characterData);
				ng.checkPlayerData();
				$("#login-modal").remove();
			}
			else {
				login.notLoggedIn();
			}

			var h = location.hash;
			if (!app.isApp) {
				// initial hashtag routing
				if (h === '#town' ||
					h === '#battle' ||
					h === '#dungeon') {
					town.go();
				}
			}
			keepAlive();
		});
	}
	function displayAllCharacters(r) {
		var s = '';
		r.forEach(function(d){
			// #ch-card-list
			s +=
				'<div data-row="'+ d.row +'" '+
				'data-name="'+ d.name +'" '+
				'class="ch-card center select-player-card text-center">'+
				'<div class="ch-card-name">'+ d.name +'</div>'+
				'<div class="ch-card-details">'+ d.level +' '+ d.race +' '+ ng.toJobLong(d.job) +'</div>'+
				'</div>';
		});
		getById('ch-card-list').innerHTML = s;
		$(".select-player-card:first").trigger('click');
	}
	// private ///////////////////////////////////////////////////////
})();