// ng.js
var ng;
(function($, TweenMax, SplitText, undefined) {
	ng = {
		// defaults are defined in getDefaultOptions
		config: {
			display: 'Full Screen',
			musicVolume: 100,
			soundVolume: 100,
			fastDestroy: false,
			showNetwork: true,
			hotkey: {
				characterStats: 'c',
				inventory: 'i',
				bank: 'b',
			}
		},
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
		id: 0,
		resizeTimer: new delayedCall(0, ''),
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
		lockOverlay: getElementById("lock-overlay"),
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
		getExitTime,
		getDefaultOptions,
		msg,
		init,
		lock,
		splitText,
		getId,
		events,
		unlock,
		reloadGame,
		logout,
		processStatMap,
		dimRetAttr,
		dimRetSkill,
		setScene,
		initGame,
		toJobLong,
		toJobShort,
		disconnect,
		checkPlayerData,
		goCreateCharacter,
		displayAllCharacters,
		toPercentWidth,
		toPercentHeight,
	}
	var msgTimer = delayedCall(0, '')
	///////////////////////////////
	function init() {
		$.ajaxSetup({
			type: 'POST',
			timeout: 4000
		});
		TweenLite.defaultEase = Power2.easeOut;
		for (var i=1; i<=ng.maxLevel; i++) {
			ng.levels.push(i+'');
		}
		ng.processStatMap(ng.statMap)
	}
	function getExitTime() {
		if (ng.view === 'battle') return 5
		else return 1
	}
	function getDefaultOptions() {
		return {
			display: 'Full Screen',
			musicVolume: 100,
			soundVolume: 100,
			fastDestroy: false,
			showNetwork: true,
			hotkey: {
				characterStats: 'c',
				inventory: 'i',
				bank: 'b',
			}
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
		var e = getElementById('scene-error')
		e.style.display = 'block'
		e.innerHTML = msg || 'You have been disconnected<br>from the server'
		delayedCall(12, reloadGame)
	}
	function reloadGame() {
		querySelector('#body').innerHTML = ''
		setTimeout(function() {
			location.reload()
		})
	}
	function toJobShort(key) {
		return ng.jobShort[key];
	}
	function toJobLong(key) {
		return ng.jobLong[key];
	}
	function setScene(scene) {
		$("#scene-title").remove()
		// remove defaults and set via js
		$(".scene").removeClass('none')
			.css('display', 'none');
		getElementById('scene-' + scene).style.display = 'block';
		ng.view = scene;
	}
	function lock(hide) {
		ng.lockOverlay.style.display = 'block';
		ng.lockOverlay.style.opacity = hide ? 0 : 1
		ng.locked = 1;
	}
	function unlock() {
		ng.lockOverlay.style.display = "none";
		ng.locked = 0;
	}

	function checkPlayerData() {
		// ignore list
		var ignore = localStorage.getItem('ignore');
		if (ignore !== null){
			ng.ignore = JSON.parse(ignore);
		}
		else {
			var foo = [];
			localStorage.setItem('ignore', JSON.stringify(foo));
		}
	}

	function keepAlive() {
		game.session.timer.kill()
		$.get(app.url + 'session/keep-alive.php').always(handleKeepAliveAlways);
	}
	function handleKeepAliveAlways() {
		if (ng.view === 'title') {
			game.session.timer = delayedCall(170, keepAlive);
		}
	}

	function msg(msg, d) {
		dom.msg.innerHTML = msg;
		TweenMax.killTweensOf(dom.msg)
		TweenMax.set(dom.msg, {
			overwrite: 1,
			scale: 1,
		})
		if (d === 0) return
		if (d === void 0 || d < 1 ){ d = 1 }
		msgTimer.kill()
		msgTimer = delayedCall(d, msgComplete)
	}
	function msgComplete() {
		TweenMax.to(dom.msg, .2, {
			scale: 0,
			ease: Power2.easeOut
		})
	}

	function splitText(id, msg, fadeDuration = .01, staggerDuration = .01) {
		var e = querySelector('#'+ id);
		e.textContent = msg;
		var split = new SplitText(e, {
				type: "words,chars"
			});
		TweenMax.staggerFromTo(split.chars, fadeDuration, {
			immediateRender: true,
			alpha: 0
		}, {
			delay: .1,
			alpha: 1
		}, staggerDuration);
	}
	function logout() {
		if (ng.locked || app.isApp) return;
		ng.lock();
		// socket.removePlayer(my.account);
		$.get(app.url + 'account/logout.php').done(function() {
			ng.msg("Logout successful");
			localStorage.removeItem('email');
			localStorage.removeItem('token');
			setTimeout(reloadGame, 250);
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
		var skillBonus = 0
		var bonusPerPoint = 7
		var multiplier = .9
		var i = 0

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
		if (app.isApp) {
			ng.lock();
			ng.msg('Communicating with Steam...', 1)
			// app login, check for steam ticket
			var greenworks = require('./greenworks');
			var steam = {
				screenName: '',
				steamId: '',
				handle: 0
			}

			if (greenworks.initAPI()) {
				greenworks.init()
				var details = greenworks.getSteamId()
				ng.msg('Verifying Steam Credentials...')

				steam.screenName = details.screenName
				steam.steamId = details.steamId
				greenworks.getAuthSessionTicket(function (data) {
					steam.handle = data.handle;
					$.ajax({
						type: 'POST',
						url: app.url + 'init-game.php',
						data: {
							version: app.version,
							screenName: steam.screenName,
							steamId: steam.steamId,
							channel: my.channel,
							ticket: data.ticket.toString('hex')
						}
					}).done(function(data) {
						greenworks.cancelAuthTicket(steam.handle)
						handleInitGame(data)
						ng.unlock()
					}).fail(function(data) {
						console.warn(data.responseText)
						data.responseText && ng.msg(data.responseText, 0)
					});
				});
			}
			else {
				ng.msg('Unable to initialize the Steam API! Contact us @maelfyn on Twitter or on the Neverworks Discord.', 50)
			}


		}
		else {
			$.post(app.url + 'init-game.php', {
				version: app.version
			}).done(handleInitGame)
				.fail(function(err) {
					ng.msg(err.responseText, 0)
				});
		}
	}
	function handleInitGame(r) {
		console.info('init-game', r)
		bar.updateDynamicStyles()
		if (r.id) {
			my.accountId = r.id
			if (!app.isApp) {
				getElementById('logout').textContent = localStorage.getItem('account')
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
			TweenMax.set('#scene-title', {
				opacity: 0,
				visibility: 'visible',
				display: 'flex'
			})
			TweenMax.to('#scene-title', .2, {
				opacity: 1
			})
		}
		app.initialized = 1
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
		getElementById('ch-card-list').innerHTML = s;
		$(".select-player-card:first").trigger('click');
	}
	function toPercentWidth(pixels) {
		return pixels / 1920 * 100
	}
	function toPercentHeight(pixels) {
		return pixels / 1080 * 100
	}
	// private ///////////////////////////////////////////////////////
})($, TweenMax, SplitText);