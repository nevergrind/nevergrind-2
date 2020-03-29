// ng.js
var ng;
(function() {
	ng = {
		responsiveRatio: 1,
		statMap: {
			// job bonuses
			'jobs': {
				'Bard': [0,2,2,2,0,0,4],
				'Cleric': [0,2,2,0,4,2,0],
				'Druid': [0,2,2,0,4,2,0],
				'Enchanter': [0,0,0,0,2,4,4],
				'Summoner': [0,2,0,0,4,4,0],
				'Monk': [4,2,2,2,0,0,0],
				'Necromancer': [0,2,0,0,4,4,0],
				'Paladin': [2,4,0,2,2,0,0],
				'Ranger': [2,2,2,2,2,0,0],
				'Rogue': [4,0,4,2,0,0,0],
				'Shadow Knight': [4,2,0,2,0,2,0],
				'Shaman': [0,2,2,0,4,2,0],
				'Warrior': [4,4,0,2,0,0,0],
				'Wizard': [0,2,0,0,4,4,0]
			},
			// race base values and possible classes
			'Barbarian': {
				'attrs': [22,20,17,14,14,11,10],
				'jobs': [
					'Monk',
					'Rogue',
					'Shaman',
					'Warrior'
				]
			},
			'Dark Elf': {
				'attrs': [11,13,19,15,17,21,11],
				'jobs': [
					'Cleric',
					'Enchanter',
					'Summoner',
					'Necromancer',
					'Ranger',
					'Rogue',
					'Shadow Knight',
					'Warrior',
					'Wizard'
				]
			},
			'Dwarf': {
				'attrs': [19,19,14,19,17,11,9],
				'jobs': [
					'Cleric',
					'Paladin',
					'Rogue',
					'Warrior'
				]
			},
			'Seraph': {
				'attrs': [11,14,14,14,17,23,14],
				'jobs': [
					'Cleric',
					'Enchanter',
					'Summoner',
					'Necromancer',
					'Paladin',
					'Shadow Knight',
					'Wizard'
				]
			},
			'Gnome': {
				'attrs': [11,14,18,18,13,21,11],
				'jobs': [
					'Cleric',
					'Enchanter',
					'Summoner',
					'Necromancer',
					'Rogue',
					'Shadow Knight',
					'Warrior',
					'Wizard'
				]
			},
			'Half Elf': {
				'attrs': [14,14,19,18,11,15,15],
				'jobs': [
					'Bard',
					'Druid',
					'Monk',
					'Paladin',
					'Ranger',
					'Rogue',
					'Warrior'
				]
			},
			'Halfling': {
				'attrs': [14,15,20,19,16,9,9],
				'jobs': [
					'Cleric',
					'Druid',
					'Monk',
					'Ranger',
					'Rogue',
					'Warrior'
				]
			},
			'High Elf': {
				'attrs': [10,13,18,14,20,19,16],
				'jobs': [
					'Cleric',
					'Enchanter',
					'Summoner',
					'Paladin',
					'Wizard'
				]
			},
			'Human': {
				'attrs': [15,15,15,15,15,15,15],
				'jobs': [
					'Bard',
					'Cleric',
					'Druid',
					'Enchanter',
					'Summoner',
					'Monk',
					'Necromancer',
					'Paladin',
					'Ranger',
					'Rogue',
					'Shadow Knight',
					'Shaman',
					'Warrior',
					'Wizard'
				]
			},
			'Orc': {
				'attrs': [27,22,13,14,13,11,8],
				'jobs': [
					'Monk',
					'Shadow Knight',
					'Shaman',
					'Warrior'
				]
			},
			'Troll': {
				'attrs': [22,24,18,15,11,9,6],
				'jobs': [
					'Rogue',
					'Shadow Knight',
					'Shaman',
					'Warrior'
				]
			},
			'Wood Elf': {
				'attrs': [13,13,20,16,15,15,15],
				'jobs': [
					'Bard',
					'Druid',
					'Ranger',
					'Rogue',
					'Warrior'
				]
			}
		},
		test: true,
		id: 0,
		resizeTimer: new TweenMax.delayedCall(0, ''),
		loadMsg:
			"<div id='load-msg' class='text-shadow text-center now-loading'>Loading</div>",
		attrs: ['str', 'sta', 'agi', 'dex', 'wis', 'intel', 'cha'],
		resists: ['resistBlood', 'resistPoison', 'resistArcane', 'resistLightning', 'resistFire', 'resistIce'],
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
			'Gnome',
			'Half Elf',
			'Halfling',
			'High Elf',
			'Human',
			'Orc',
			'Seraph',
			'Troll',
			'Wood Elf'
		],
		jobs: [
			'Bard',
			'Cleric',
			'Druid',
			'Enchanter',
			'Summoner',
			'Monk',
			'Necromancer',
			'Paladin',
			'Ranger',
			'Rogue',
			'Shadow Knight',
			'Shaman',
			'Warrior',
			'Wizard'
		],
		jobShort: {
			Bard: 'BRD',
			Cleric: 'CLR',
			Druid: 'DRU',
			Enchanter: 'ENC',
			Summoner: 'SUM',
			Monk: 'MNK',
			Necromancer: 'NEC',
			Paladin: 'PLD',
			Ranger: 'RNG',
			Rogue: 'ROG',
			'Shadow Knight': 'SHD',
			Shaman: 'SHM',
			Warrior: 'WAR',
			Wizard: 'WIZ'
		},
		jobLong: {
			BRD: 'Bard',
			CLR: 'Cleric',
			DRU: 'Druid',
			ENC: 'Enchanter',
			SUM: 'Summoner',
			MNK: 'Monk',
			NEC: 'Necromancer',
			PLD: 'Paladin',
			RNG: 'Ranger',
			ROG: 'Rogue',
			SHD: 'Shadow Knight',
			SHM: 'Shaman',
			WAR: 'Warrior',
			WIZ: 'Wizard'
		},
		config: {
			display: 'Full Screen',
			musicVolume: 100,
			soundVolume: 100,
			fastDestroy: false,
		},
		getDefaultOptions,
		msg,
		init,
		lock,
		split,
		getId,
		events,
		unlock,
		logout,
		processStatMap,
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
		ng.processStatMap(ng.statMap)
	}
	function getDefaultOptions() {
		return {
			display: 'Full Screen',
			musicVolume: 100,
			soundVolume: 100
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
		TweenMax.delayedCall(12, function() {
			location.reload();
		})
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

	function keepAlive() {
		game.session.timer.kill()
		$.get(app.url + 'session/keep-alive.php').always(function() {
			if (ng.view === 'title') {
				game.session.timer = TweenMax.delayedCall(170, keepAlive);
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
				rotationX: 90,
			},
			onComplete: function(){
				TweenMax.to(this.target, .2, {
					rotationX: 90,
					onComplete: function(){
						TweenMax.set(this.target, {
							visibility: 'hidden',
						})
					}
				})
			}
		})
		TweenMax.to(dom.msg, .5, {
			rotationX: 0,
		})
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
		if (ng.locked || app.isApp) return;
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
			console.warn(++i, +bonusPerPoint.toFixed(2), 'total: ', _.round(skillBonus));
			bonusPerPoint = bonusPerPoint * multiplier;
		}
		return _.round(skillBonus); // 92% damage bonus for 255 strength
	}
	function processStatMap(r) {
		ng.races.forEach(function(v){
			create.raceAttrs[v] = r[v].attrs;
			create.possibleJobs[v] = r[v].jobs;
		});
		// job stats
		ng.jobs.forEach(function(v){
			create.jobAttrs[v] = r.jobs[v];
		});
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

		$("#create-character-name").val('')
		allDone()
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
				console.info('form', create.form)
				create.setFace();
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
			console.info('init-game', r)
			if (r.id) {
				my.accountId = r.id
				if (!app.isApp) {
					getById('logout').textContent = localStorage.getItem('account')
				}
				ng.displayAllCharacters(r.characterData)
				ng.checkPlayerData()
				$("#login-modal").remove()
			}
			else {
				login.notLoggedIn()
			}
			if (!app.initialized) {
				keepAlive()
				TweenMax.set('#body', {
					opacity: 0,
					display: 'flex'
				})
				TweenMax.to('#body', .2, {
					opacity: 1
				})
			}
			app.initialized = 1
		});
	}
	function displayAllCharacters(r) {
		var s = ''
		r.forEach(function(d){
			var url = my.getAvatarUrl(d);
			//console.info('url', url);
			// #ch-card-list
			s +=
				'<div data-row="'+ d.row +'" '+
				'data-name="'+ d.name +'" '+
				'class="ch-card center select-player-card text-center">'+
					'<img class="avatar-title" src="'+ url +'" style="padding:0 1rem">' +
					'<div style="padding: .2rem .5rem; flex: 1">' +
						'<div class="ch-card-name">'+ _.capitalize(d.name) +'</div>'+
						'<div class="ch-card-level">Level '+ d.level +'</div>'+
						'<div class="ch-card-details">'+ d.race +' '+ ng.toJobLong(d.job) +'</div>'+
					'</div>'+
				'</div>';
		});
		getById('ch-card-list').innerHTML = s;
		$(".select-player-card:first").trigger('click');
	}
	// private ///////////////////////////////////////////////////////
})();