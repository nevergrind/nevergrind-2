// ng.js
var ng;
!function($, TweenMax, SplitText, _, undefined) {
	ng = {
		noop,
		flashNgoLogo,
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
		dimRetCrit,
		setScene,
		initGame,
		toJobLong,
		toJobShort,
		disconnect,
		goCreateCharacter,
		toMinSecs,
		toPercent,
		toPercentWidth,
		toPercentHeight,
		html,
		getArticle,
		// defaults are defined in getDefaultOptions
		selectIndex: 0,
		initialized: false,
		config: {
			display: 'Full Screen',
			lang: 'English',
			musicVolume: 100,
			soundVolume: 100,
			fastDestroy: false,
			showNetwork: true,
			selectedRowIndex: 0,
			hotkey: {
				characterStats: 'c',
				inventory: 'i',
				bank: 'b',
				autoAttack: 'a',
			}
		},
		responsiveRatio: 1,
		statMap: {
			// job bonuses
			jobs: {
				[CLASS.BARD]: [0,2,2,2,0,0,4],
				[CLASS.CLERIC]: [0,2,2,0,4,2,0],
				[CLASS.DRUID]: [0,2,2,0,4,2,0],
				[CLASS.ENCHANTER]: [0,0,0,0,2,4,4],
				[CLASS.TEMPLAR]: [0,2,0,0,4,4,0],
				[CLASS.MONK]: [4,2,2,2,0,0,0],
				[CLASS.WARLOCK]: [0,2,0,0,4,4,0],
				[CLASS.CRUSADER]: [2,4,0,2,2,0,0],
				[CLASS.RANGER]: [2,2,2,2,2,0,0],
				[CLASS.ROGUE]: [4,0,4,2,0,0,0],
				[CLASS.SHADOW_KNIGHT]: [4,2,0,2,0,2,0],
				[CLASS.SHAMAN]: [0,2,2,0,4,2,0],
				[CLASS.WARRIOR]: [4,4,0,2,0,0,0],
				[CLASS.WIZARD]: [0,2,0,0,4,4,0]
			},
			// race base values and possible classes
			[RACE.BARBARIAN]: {
				'attrs': [22,20,17,14,14,11,10],
				jobs: [
					CLASS.MONK,
					CLASS.ROGUE,
					CLASS.SHAMAN,
					CLASS.WARRIOR
				]
			},
			[RACE.DARK_ELF]: {
				'attrs': [11,13,19,15,17,21,11],
				jobs: [
					CLASS.CLERIC,
					CLASS.ENCHANTER,
					CLASS.TEMPLAR,
					CLASS.WARLOCK,
					CLASS.RANGER,
					CLASS.ROGUE,
					CLASS.SHADOW_KNIGHT,
					CLASS.WARRIOR,
					CLASS.WIZARD
				]
			},
			[RACE.DWARF]: {
				'attrs': [19,19,14,19,17,11,9],
				jobs: [
					CLASS.CLERIC,
					CLASS.CRUSADER,
					CLASS.ROGUE,
					CLASS.WARRIOR
				]
			},
			[RACE.SERAPH]: {
				'attrs': [11,14,14,14,17,23,14],
				jobs: [
					CLASS.CLERIC,
					CLASS.ENCHANTER,
					CLASS.TEMPLAR,
					CLASS.WARLOCK,
					CLASS.CRUSADER,
					CLASS.SHADOW_KNIGHT,
					CLASS.WIZARD
				]
			},
			[RACE.GNOME]: {
				'attrs': [11,14,18,18,13,21,11],
				jobs: [
					CLASS.CLERIC,
					CLASS.ENCHANTER,
					CLASS.TEMPLAR,
					CLASS.WARLOCK,
					CLASS.ROGUE,
					CLASS.SHADOW_KNIGHT,
					CLASS.WARRIOR,
					CLASS.WIZARD
				]
			},
			[RACE.HALF_ELF]: {
				'attrs': [14,14,19,18,11,15,15],
				jobs: [
					CLASS.BARD,
					CLASS.DRUID,
					CLASS.MONK,
					CLASS.CRUSADER,
					CLASS.RANGER,
					CLASS.ROGUE,
					CLASS.WARRIOR
				]
			},
			[RACE.HALFLING]: {
				'attrs': [14,15,20,19,16,9,9],
				jobs: [
					CLASS.CLERIC,
					CLASS.DRUID,
					CLASS.MONK,
					CLASS.RANGER,
					CLASS.ROGUE,
					CLASS.WARRIOR
				]
			},
			[RACE.HIGH_ELF]: {
				'attrs': [10,13,18,14,20,19,16],
				jobs: [
					CLASS.BARD,
					CLASS.CLERIC,
					CLASS.ENCHANTER,
					CLASS.TEMPLAR,
					CLASS.CRUSADER,
					CLASS.WIZARD
				]
			},
			[RACE.HUMAN]: {
				'attrs': [15,15,15,15,15,15,15],
				jobs: [
					CLASS.BARD,
					CLASS.CLERIC,
					CLASS.DRUID,
					CLASS.ENCHANTER,
					CLASS.TEMPLAR,
					CLASS.MONK,
					CLASS.WARLOCK,
					CLASS.CRUSADER,
					CLASS.RANGER,
					CLASS.ROGUE,
					CLASS.SHADOW_KNIGHT,
					CLASS.SHAMAN,
					CLASS.WARRIOR,
					CLASS.WIZARD
				]
			},
			[RACE.ORC]: {
				'attrs': [27,22,13,14,13,11,8],
				jobs: [
					CLASS.MONK,
					CLASS.SHADOW_KNIGHT,
					CLASS.SHAMAN,
					CLASS.WARRIOR
				]
			},
			[RACE.TROLL]: {
				'attrs': [22,24,18,15,11,9,6],
				jobs: [
					CLASS.ROGUE,
					CLASS.SHADOW_KNIGHT,
					CLASS.SHAMAN,
					CLASS.WARRIOR
				]
			},
			[RACE.WOOD_ELF]: {
				'attrs': [13,13,20,16,15,15,15],
				jobs: [
					CLASS.BARD,
					CLASS.DRUID,
					CLASS.RANGER,
					CLASS.ROGUE,
					CLASS.WARRIOR
				]
			}
		},
		id: 0,
		resizeTimer: new delayedCall(0, ''),
		loadMsg:
			"<div id='load-msg' class='text-shadow text-center now-loading'>Loading</div>",
		attrs: [PROP.STR, PROP.STA, PROP.AGI, PROP.DEX, PROP.WIS, PROP.INTEL, PROP.CHA],
		resists: [PROP.RESIST_BLOOD, PROP.RESIST_POISON, PROP.RESIST_ARCANE, PROP.RESIST_LIGHTNING, PROP.RESIST_FIRE, PROP.RESIST_ICE],
		dungeon: ['traps', 'treasure', 'scout', 'pulling'],
		gameDuration: 0,
		delay: .5,
		modalSpeed: .5,
		friends: [],
		ignore: [],
		joinedGame: false,
		searchingGame: false,
		defaultTitle: 'Nevergrind Online',
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
		clearConsoleTime: Date.now(),
		locked: 0,
		loadAttempts: 0,
		isModalOpen: false,
		maxLevel: 50,
		levels: [],
		races: [
			RACE.BARBARIAN,
			RACE.DARK_ELF,
			RACE.DWARF,
			RACE.GNOME,
			RACE.HALF_ELF,
			RACE.HALFLING,
			RACE.HIGH_ELF,
			RACE.HUMAN,
			RACE.ORC,
			RACE.SERAPH,
			RACE.TROLL,
			RACE.WOOD_ELF
		],
		jobs: [
			CLASS.BARD,
			CLASS.CLERIC,
			CLASS.DRUID,
			CLASS.ENCHANTER,
			CLASS.TEMPLAR,
			CLASS.MONK,
			CLASS.WARLOCK,
			CLASS.CRUSADER,
			CLASS.RANGER,
			CLASS.ROGUE,
			CLASS.SHADOW_KNIGHT,
			CLASS.SHAMAN,
			CLASS.WARRIOR,
			CLASS.WIZARD
		],
		jobShort: {
			[CLASS.BARD]: JOB.BARD,
			[CLASS.CLERIC]: JOB.CLERIC,
			[CLASS.DRUID]: JOB.DRUID,
			[CLASS.ENCHANTER]: JOB.ENCHANTER,
			[CLASS.TEMPLAR]: JOB.TEMPLAR,
			[CLASS.MONK]: JOB.MONK,
			[CLASS.WARLOCK]: JOB.WARLOCK,
			[CLASS.CRUSADER]: JOB.CRUSADER,
			[CLASS.RANGER]: JOB.RANGER,
			[CLASS.ROGUE]: JOB.ROGUE,
			[CLASS.SHADOW_KNIGHT]: JOB.SHADOW_KNIGHT,
			[CLASS.SHAMAN]: JOB.SHAMAN,
			[CLASS.WARRIOR]: JOB.WARRIOR,
			[CLASS.WIZARD]: JOB.WIZARD
		},
		jobLong: {
			BRD: CLASS.BARD,
			CLR: CLASS.CLERIC,
			DRU: CLASS.DRUID,
			ENC: CLASS.ENCHANTER,
			TMP: CLASS.TEMPLAR,
			MNK: CLASS.MONK,
			WLK: CLASS.WARLOCK,
			CRU: CLASS.CRUSADER,
			RNG: CLASS.RANGER,
			ROG: CLASS.ROGUE,
			SHD: CLASS.SHADOW_KNIGHT,
			SHM: CLASS.SHAMAN,
			WAR: CLASS.WARRIOR,
			WIZ: CLASS.WIZARD
		},
	}
	var msgTimer = delayedCall(0, '')
	let characterData = []
	let routedToCharacterPage = false
	const vowels = 'aeiou'
	let steam = {
		screenName: '',
		steamId: '',
		handle: 0
	}

	let index, el

	$('#ch-card-wrap')
		.on('click', '#title-select-up', incrementCharacter)
		.on('click', '#title-select-down', decrementCharacter)
	///////////////////////////////
	function init() {
		if (app.isApp) {
			console.debug = console.log = console.warn = console.info = ng.noop
		}
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
			lang: 'English',
			musicVolume: 100,
			soundVolume: 100,
			fastDestroy: false,
			showNetwork: true,
			selectedRowIndex: 0,
			hotkey: {
				characterStats: 'c',
				inventory: 'i',
				bank: 'b',
				autoAttack: 'a',
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
		$(document).add('*').off()
		$("main > *").css('display', 'none');
		var e = getElementById('scene-error')
		e.style.display = 'block'
		e.innerHTML = msg || 'You have been disconnected<br>from the server'
		delayedCall(12, reloadGame)
	}
	function reloadGame() {
		querySelector('#body').innerHTML = ''
		setTimeout(() => {
			location.reload()
		}, 100)
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
		$(".scene").removeClass('none').css('display', 'none')
		getElementById('scene-' + scene).style.display = 'block'
		ng.view = scene
		if (ng.view === 'dungeon' || ng.view === 'battle') {
			querySelector('#scene-players').style.display = 'block'
		}
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
		clearTimeout(game.session.timer)
		$.get(app.url + 'session/keep-alive.php')
			.always(handleKeepAliveAlways);
	}
	function handleKeepAliveAlways() {
		if (ng.view === 'title') {
			game.session.timer = setTimeout(keepAlive,170000);
		}
	}

	function msg(msg, d) {
		query.el('#msg').innerHTML = msg;
		TweenMax.killTweensOf(query.el('#msg'))
		TweenMax.set(query.el('#msg'), {
			overwrite: 1,
			scale: 1,
		})
		if (d === 0) return
		if (typeof d === 'undefined' || d < 1 ){ d = 2 }
		msgTimer.kill()
		msgTimer = delayedCall(d, msgComplete)
	}
	function msgComplete() {
		TweenMax.to(query.el('#msg'), .2, {
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
		// console.warn('bonuses: ', bonuses.join(', '));
		return floor(damBonus); // 92% damage bonus for 255 strength
	}
	function dimRetSkill(val) {
		var skillBonus = 0
		var bonusPerPoint = 7
		var multiplier = .9
		var i = 0

		while (val-- > 0) {
			skillBonus += bonusPerPoint;
			// console.warn(++i, +bonusPerPoint.toFixed(2), 'total: ', _.round(skillBonus));
			bonusPerPoint = bonusPerPoint * multiplier;
		}
		return round(skillBonus); // 92% damage bonus for 255 strength
	}
	function dimRetCrit(val) {
		var resp = 0
		var dimThreshold = 5
		var bonusPerPoint = .4
		var multiplier = 14/15
		var i = 0

		while (val-- > 0) {
			resp += bonusPerPoint
			i++
			if (i >= dimThreshold) {
				bonusPerPoint = bonusPerPoint * multiplier
				multiplier = multiplier + ((1 - multiplier) * .05)
			}
			// console.warn(i, +bonusPerPoint.toFixed(2), multiplier, 'total: ', resp)
		}
		return resp > 75 ? 75 : resp // 19.49% at 100; 32.39% at 200
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
		var prom = 0;
		// hide
		TweenMax.to('#scene-title-select-character', .6, {
			y: 20,
			opacity: 0,
			onComplete: allDone
		});
		TweenMax.to('#title-gwen', .6, {
			startAt: { x: 0, filter: 'brightness(1) contrast(1)' },
			x: -20,
			filter: 'brightness(10) contrast(5)',
			opacity: 0
		})
		TweenMax.to('#ngo-logo', .6, {
			startAt: { filter: 'brightness(1) contrast(1)' },
			filter: 'brightness(10) contrast(5)',
		})
		TweenMax.to('.ngo-logos', .6, {
			startAt: { y: 0, },
			y: -20,
			opacity: 0
		})

		$("#create-character-name").val('')
		allDone()
		///////////////////////////////////////////////////
		function allDone(){
			if (++prom === 2){
				ng.unlock();
				// init create screen and show
				TweenMax.set('#scene-title-select-character', {
					display: 'none',
					opacity: 1
				});
				create.form = create.getEmptyForm();
				create.setRandomGender()
				create.setRandomRace()
				// console.info('form', create.form)
				create.setFace()
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
			if (!ng.initialized) {
				ng.lock();
				ng.msg('Communicating with Steam...', 1)
				// app login, check for steam ticket
				var greenworks = require('./greenworks');
				if (greenworks.initAPI()) {

					greenworks.init()
					var details = greenworks.getSteamId()
					ng.msg('Verifying Steam Credentials...')

					steam.screenName = details.screenName
					steam.steamId = details.steamId
					// console.info('steam', steam)
					greenworks.getAuthSessionTicket(function (data) {
						steam.handle = data.handle;
						steam.ticket = data.ticket.toString('hex')
						$.post(app.url + 'init-game.php', {
							version: app.version,
							screenName: steam.screenName,
							steamId: steam.steamId,
							channel: my.channel,
							ticket: steam.ticket,
						}).done(function (data) {
							greenworks.cancelAuthTicket(steam.handle)
							handleInitGame(data)
							ng.unlock()
						}).fail(function (data) {
							// console.warn(data.responseText)
							data.responseText && ng.msg(data.responseText, 12)
						});
					});
				}
				else {
					ng.msg('Unable to find your Steam credentials! Are you sure Steam is running? Contact support@nevergrind.com for assistance!', 999)
				}
			}
			else {
				$.post(app.url + 'init-game.php', {
					version: app.version,
					screenName: steam.screenName,
					steamId: steam.steamId,
					channel: my.channel,
					ticket: steam.ticket
				}).done(function (data) {
					handleInitGame(data)
					ng.unlock()
				}).fail(function (data) {
					// console.warn(data.responseText)
					data.responseText && ng.msg(data.responseText, 12)
				})
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
	function flashNgoLogo() {
		TweenMax.to('#ngo-logo-fg', 1.5, {
			startAt: { webkitMaskPositionX: '-40rem', },
			webkitMaskPositionX: '40rem',
			ease: Power2.easeInOut,
			repeat: -1,
			repeatDelay: 3,
		});
	}
	function handleInitGame(r) {
		/*
		$.get('https://nevergrind.com/php/nwjs.php').done((data) => {
			// console.info('nwjs.php data', JSON.parse(data))
		})
		*/
		bar.updateDynamicStyles()
		if (!ng.initialized) {
			ng.initialized = true
			TweenMax.to('#title-gwen', .6, {
				startAt: { filter: 'brightness(10) contrast(5)' },
				delay: .6,
				x: 0,
				filter: 'brightness(1) contrast(1)',
				opacity: 1,
				ease: Power1.easeOut,
			})
			TweenMax.to('#ngo-logo', .6, {
				startAt: { filter: 'brightness(10) contrast(5)' },
				delay: .6,
				filter: 'brightness(1) contrast(1)',
				ease: Power1.easeOut,
			})
			TweenMax.to('.ngo-logos', .6, {
				startAt: { opacity: 0, },
				delay: .6,
				opacity: 1,
				x: '50%',
				scale: 1,
				ease: Power1.easeOut,
			})
			TweenMax.to('#scene-title-select-character', .6, {
				startAt: { y: 20 },
				y: 0,
				delay: .6,
				filter: 'opacity(1)',
				ease: Power1.easeOut,
				onComplete: flashNgoLogo
			})
			TweenMax.staggerTo(new SplitText(query.el('#version')).chars, .5, {
				delay: 5,
				rotationY: 90,
				alpha: 0
			}, .05);
		}
		// console.info('init-game', r)


		if (r.id) {
			my.accountId = r.id
			if (!app.isApp) {
				getElementById('logout').textContent = localStorage.getItem('account')
			}
			displayCharacter(r.characterData)
			checkPlayerData()
			$("#login-modal").remove()
		}
		else login.notLoggedIn()

		if (!app.initialized) {
			app.initialized = 1
			keepAlive()
			TweenMax.to('#scene-title', .5, {
				startAt: {
					filter: 'brightness(0)',
					visibility: 'visible',
					display: 'flex'
				},
				filter: 'brightness(1)',
				ease: Back.easeOut
			})
		}

		/*if (typeof r.characterData === 'object' &&
			!r.characterData.length &&
			!routedToCharacterPage) {
			// go-create-character
			routedToCharacterPage = true
			delayedCall(1.5, () => {
				ng.goCreateCharacter()
				ng.msg('Create your first character.', 5)
			})
		}*/
	}
	function getSelectedRowIndex(r) {
		index = 0
		if (r.length && ng.config.selectedRowIndex) {
			index = _.findIndex(r, {
				row: ng.config.selectedRowIndex
			})
		}
		return typeof index === 'number' ? index : 0
	}
	function displayCharacter(r) {
		characterData = r
		create.selected = 0
		ng.selectIndex = getSelectedRowIndex(r)
		updateCharacterCard()
	}
	function updateCharacterCard() {
		var s = ''
		if (characterData.length) {
			var d = characterData[ng.selectIndex] || characterData[0]
			var url = my.getAvatarUrl(d);
			s += '<div id="title-select-down" class="title-select-col flex-center grad-black">'+
					'<img class="title-select-chevron" src="images/ui/chevron-left.png">' +
				'</div>' +
				'<div id="selected-ch-card" data-row="'+ d.row +'" data-name="'+ d.name +'" class="ch-card center select-player-card text-center">' +
					'<img class="avatar-title" src="'+ url +'" style="padding: 0 .5rem 0 0">' +
					'<div class="flex-column flex-max" style="line-height: 1.2; padding: .2rem .5rem; justify-content: space-around">' +
						'<div class="ch-card-name">'+ _.capitalize(d.name) +'</div>' +
						'<div class="ch-card-level">Level '+ d.level +'</div>' +
						'<div class="ch-card-details">'+ ng.toJobLong(d.job) +'</div>' +
					'</div>' +
					'<img class="title-icon" src="images/ui/job-'+ d.job +'.png" style="">' +
					'<div id="ch-index" class="text-shadow">'+ (ng.selectIndex + 1) +'</div>' +
				'</div>' +
				'<div id="title-select-up" class="title-select-col flex-center">'+
					'<img class="title-select-chevron" src="images/ui/chevron-right.png">' +
				'</div>'
			ng.config.selectedRowIndex = create.selected = d.row
			create.name = d.name
		}
		else {
			s = '<div class="flex-column flex-center flex-max">'+
				'<div>No Character Data Found</div>'+
			'</div>'
		}
		getElementById('ch-card-wrap').innerHTML = s;
		audio.save()
	}
	function incrementCharacter() {
		ng.selectIndex++
		if (ng.selectIndex > characterData.length - 1) {
			ng.selectIndex = 0
		}
		updateCharacterCard()
	}
	function decrementCharacter() {
		ng.selectIndex--
		if (ng.selectIndex < 0) {
			ng.selectIndex = characterData.length - 1
		}
		updateCharacterCard()
	}
	function toMinSecs(seconds) {
		let m = ~~(seconds / 60)
		let minMsg = m === 0
			? ''
			: m === 1 ? '1 minute' : m + ' minutes'
		let s = seconds % 60
		if (m >= 1 && s !== 0) minMsg += ', '
		let secMsg = s === 0
			? ''
			: s === 1 ? '1 second': s + ' seconds'
		return minMsg + secMsg
	}
	function toPercent(decimal) {
		return round(decimal * 100)
	}
	function toPercentWidth(pixels) {
		return pixels / MaxWidth * 100
	}
	function toPercentHeight(pixels) {
		return pixels / MaxHeight * 100
	}
	function html(id, html) {
		el = querySelector(id)
		if (el !== null) el.innerHTML = html
	}
	let article
	function getArticle(index, capitalize) {
		article = ''
		if (mobs[index].type === MOB_TIERS.normal ||
			mobs[index].type === MOB_TIERS.champion ||
			mobs[index].type === MOB_TIERS.conqueror) {
			article = vowels.includes(mobs[index].name[0]) ? 'an' : 'a'
		}
		if (capitalize) article = _.capitalize(article)
		return article

	}
	// do nothing!
	function noop() {}
}($, TweenMax, SplitText, _)