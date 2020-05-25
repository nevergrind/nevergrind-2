var mob;
(function(TweenMax, $, _, Object, undefined) {
	mob = {
		txData: [],
		enableMobHeartbeat: true,
		imageKeysLen: 0,
		index: 0,
		cache: {},
		imageKeys: [],
		initialized: 0,
		max: 9,
		element: {},
		centerX: [192,576,960,1344,1728,384,768,1152,1536],
		bottomY: [180,180,180,180,180,280,280,280,280],
		getRandomMobKey,
		init,
		// configs, resets (active animations) and idles mobs in one call for start of combat
		setMob,
		// size only
		sizeMob,
		setClickBox,
		blur,
		modifyMobStatsByClass,
		configMobType,
		drawMobBar,
		resourceTick,
		rxMobResourceTick,
		updateHate,
		// animations
		idle,
		hit,
		attack,
		special,
		death,
	};
	var percent, el
	var frame = {
		idle: {
			start: 1,
			end: 5.999,
			diff: 4.999
		},
		hit: {
			start: 6,
			end: 15.999,
			diff: 9.999
		},
		primary: {
			start: 16,
			end: 35.999,
			diff: 19.999
		},
		secondary: {
			start: 36,
			end: 55.999,
			diff: 19.999
		},
		special: {
			start: 56,
			end: 75.999,
			diff: 19.999
		},
		death: {
			start: 76,
			end: 105.999,
			diff: 29.999
		},
	};
	const testAnimations = false
	const mobBaseConfig = {
		hp: 1,
		mp: 1,
		sp: 1,
		speed: 3,
		level: 1,
		armor: 0,
		img: 'orc',
		size: 1,
		name: 'monster',
		type: 'normal',
		resist: {
			blood: 1,
			poison: 1,
			arcane: 1,
			lightning: 1,
			fire: 1,
			ice: 1,
		},
		traits: []
	}
	let mobData = {}
	let tickData = []
	let hpTick = 0
	let mpTick = 0
	let spTick = 0

	const mobElements = ['wrap',
	'center',
	'alive',
	'dead',
	'img',
	'details',
	'name',
	'shadow',
	'bar']
	//////////////////////////////////////////////////
	function getRandomMobKey() {
		var i = ~~(rand() * mob.imageKeysLen)
		return mob.imageKeys[i]
	}
	function updateHate(o) {
		info('updateHate for row', o.row, o)
		mobs[o.index].hate[o.row] += o.damage
	}
	function init() {
		mob.imageKeys = Object.keys(mobs.images)
		mob.imageKeysLen = mob.imageKeys.length
		battle.show();
		// init mob/dom connections
		for (var i=0; i<mob.max; i++){
			mobs[i] = {
				hp: 0,
				index: i,
				frame: 0,
				lastFrame: 0,
				isAnimationActive: false,
				size: i < 5 ? 1 : .85,
				isDead: true,
				speed: 0,
				type: '',
				box: {},
				dom: {}
			}
			mobElements.forEach(function(e){
				mobs[i].dom[e] = getElementById('mob-'+ e +'-' + i);
			});
		}
	}
	function configMobType(config) {
		let results = []
		let level = 1
		let possibleLvls = []
		let i
		mob.data[zones[mission.id].name].forEach(mob => {
			possibleLvls = []
			i = mob.minLevel
			for (; i<=mob.maxLevel; i++) {
				if (i >= config.minLevel &&
					i <= config.maxLevel) {
					// within the config range
					possibleLvls.push(i)
				}
			}
			if (possibleLvls.length) {
				// constrain max level
				level = _.random(possibleLvls[0], possibleLvls[possibleLvls.length - 1])
				if (mob.name === config.name) {
					//info('pushing by name', mob.name, config.name)
					results.push({
						...mob,
						level: level,
						isDead: false,
					})
				}
				else if (mob.img === config.img) {
					//info('pushing by img', mob.img, config.img)
					results.push({
						...mob,
						level: level,
						isDead: false,
					})
				}
			}
		})
		info('configMobType results', results)
		let index = _.random(0, results.length - 1)
		return {
			...mobBaseConfig,
			...results[index],
		}
	}
	function setMob(i, mobConfig) {
		modifyMobStatsByClass(mobConfig)
		mob.txData[i] = _.omit(mobConfig, [
			'maxLevel',
			'minLevel',
		])
		info('mobConfig', i, mobConfig)
		cache.preloadMob(mobConfig.img)
		// combine/assign image object props to mobs[index]
		mobs[i] = {
			...mobs[i],
			...mobs.images[mobConfig.img],
			...mobConfig,
		}
		// start attack cycle
		warn("SETMOB ATTACK", mobs[i].speed)
		timers.mobAttack[i].kill()
		timers.mobAttack[i] = delayedCall(Math.random() * 1.5 + 1.5, mob.attack, [i])
		mobs[i].hate = {}
		party.presence.forEach(member => {
			mobs[i].hate[member.row] = 0
		})


		// delete mobs[i].cache;
		sizeMob(i)
		TweenMax.set(mobs[i].dom.details, {
			opacity: 1
		})
		resetIdle(i, true)
		idle(i)
	}
	function sizeMob(index, setSizeOnly) {
		var m = mobs[index]
		if (!m.img) return
		// set dom
		var w = ~~(m.size * (mobs.images[m.img].width))

		m.box = battle.getBox(m.index);
		// wrapper
		//m.dom.details.style.display = 'block';
		// img
		m.dom.img.style.left = (w * -.5) + 'px'
		m.dom.img.style.width = w + 'px'
		m.dom.img.style.bottom = (mobs.images[m.img].yFloor * m.size) + 'px'
		// details
		TweenMax.set(m.dom.details, {
			y: 0,
			bottom: m.barAliveBottom * m.size
		})
		// shadow
		m.dom.shadow.style.display = 'block'
		m.dom.shadow.style.width = ~~((m.shadowWidth * m.size) * 1.5) + 'px'
		m.dom.shadow.style.height = (m.shadowHeight * m.size) + 'px'
		// m.dom.shadow.style.left = ((m.shadowWidth * m.size ) * -.5) + 'px'
		m.dom.shadow.style.bottom = ((m.shadowBottom - (m.shadowHeight * .3))* m.size) + 'px'
		// test stuff below

		// center dot
		m.dom.center.style.left = (m.box.cx - 11) + 'px';
		m.dom.center.style.bottom = (m.box.cy - 11) + 'px';
		mob.setClickBox(m);
		if (!setSizeOnly) {
			// name
			m.dom.name.innerHTML = m.name;
			m.dom.name.classList.add(combat.getDiffClass(m.level))
			// init frame
			m.dom.img.src = 'mobs/' + m.img + '/1.png';
			// health
			drawMobBar(index)
		}
	}
	function drawMobBar(index, drawInstant) {
		percent = bar.getRatio('hp', mobs[index])
		// info('drawMobBar', index, percent)
		TweenMax.to('#mob-health-' + index, drawInstant ? 0 : .15, {
			x: '-' + percent + '%'
		})
		if (index === my.target) {
			querySelector('#mob-target-percent').innerHTML = ceil(100 - percent) + '%'
			TweenMax.to('#mob-target-hp', drawInstant ? 0 : .15, {
				x: '-' + percent + '%'
			})
		}
	}
	function setClickBox(m) {
		// alive box
		m.dom.alive.style.left = ((m.clickAliveW  * m.size) * -.5) + 'px';
		m.dom.alive.style.bottom = (m.clickAliveY  * m.size) + 'px';
		m.dom.alive.style.width = (m.clickAliveW  * m.size) + 'px';
		m.dom.alive.style.height = (m.clickAliveH * m.size) + 'px';
		m.dom.alive.style.display = m.hp ? 'block' : 'none';
		// dead box
		m.dom.dead.style.left = ((m.clickDeadW * m.size) * -.5) + 'px';
		m.dom.dead.style.bottom = (m.clickDeadY * m.size) + 'px';
		m.dom.dead.style.width = (m.clickDeadW * m.size) + 'px';
		m.dom.dead.style.height = (m.clickDeadH * m.size) + 'px';
		m.dom.dead.style.display = m.hp ? 'none' : 'block';
	}
	function setSrc(i) {
		mobs[i].frame = ~~mobs[i].frame
		if (mobs[i].frame !== mobs[i].lastFrame) {
			mobs[i].dom.img.src = 'mobs/' + mobs[i].img + '/' + mobs[i].frame + '.png'
			mobs[i].lastFrame = mobs[i].frame
		}
	}
	function resetIdle(i, runTests) {
		mobs[i].isAnimationActive = false
		idle(mobs[i].index, runTests)
	}

	function idle(i, runTests) {
		TweenMax.to(mobs[i], mobs[i].frameSpeed * frame.idle.diff * 2, {
			startAt: {
				frame: frame.idle.start
			},
			frame: frame.idle.end,
			yoyo: true,
			repeat: -1,
			repeatDelay: mobs[i].frameSpeed,
			ease: Sine.easeOut,
			onUpdate: setSrc,
			onUpdateParams: [mobs[i].index],
		})
		if (runTests && testAnimations) {
			delayedCall(.25, hit, [ mobs[i].index ])
		}
	}

	function hit(i) {
		//info('hit', i)
		if (mobs[i].isAnimationActive) return;
		mobs[i].isAnimationActive = true;
		var speed = mobs[i].frameSpeed * frame.hit.diff

		TweenMax.to(mobs[i], speed, {
			startAt: {
				frame: frame.hit.start
			},
			overwrite: 1,
			frame: frame.hit.end,
			ease: Linear.easeNone,
			yoyo: true,
			repeat: 1,
			onUpdate: setSrc,
			onUpdateParams: [mobs[i].index],
			onComplete: hitComplete,
			onCompleteParams: [mobs[i]]
		});
	}

	function hitComplete(m) {
		resetIdle(m.index);
		if (testAnimations){
			delayedCall(1, attack, [ m.index, 'primary' ]);
		}
	}

	function attack(i, force) {
		timers.mobAttack[i].kill()
		if (mobs[i].name && party.presence[0].isLeader) {
			// only party leader should trigger attacks
			info('mob attacking!', i)
			timers.mobAttack[i] = delayedCall(mobs[i].speed, mob.attack, [i])
		}
		else return
		// TODO: combat logic needed
		// animate
		if (mobs[i].isAnimationActive) return

		mobs[i].isAnimationActive = true
		var attackType = force === 'primary' || force === 'secondary' ?
			force : (_.round(rand()) ? 'primary' : 'secondary')
		var speed = mobs[i].frameSpeed * frame[attackType].diff;
		if (!mobs[i].enableSecondary) {
			attackType = 'primary'
		}

		TweenMax.to(mobs[i], speed, {
			startAt: {
				frame: frame[attackType].start
			},
			overwrite: 1,
			frame: frame[attackType].end,
			ease: Linear.easeNone,
			onUpdate: setSrc,
			onUpdateParams: [mobs[i].index],
			onComplete: attackComplete,
			onCompleteParams: [mobs[i], force]
		})
	}

	function attackComplete(m, force) {
		resetIdle(m.index)
		if (testAnimations) {
			if (force === 'primary') delayedCall(1, attack, [ m.index, 'secondary' ])
			else if (force === 'death') delayedCall(1, death, [ m.index ])
			else delayedCall(1, special, [ m.index ])
		}
	}

	function special(i) {
		if (mobs[i].isAnimationActive) return
		if (!mobs[i].enableSpecial) {
			attack(mobs[i].index, 'death')
		}
		else {
			mobs[i].isAnimationActive = true
			var speed = mobs[i].frameSpeed * frame.special.diff

			TweenMax.to(mobs[i], speed, {
				startAt: {
					frame: frame.special.start
				},
				overwrite: 1,
				frame: frame.special.end,
				ease: Linear.easeNone,
				yoyo: mobs[i].yoyo,
				repeat: mobs[i].yoyo ? 1 : 0,
				onUpdate: setSrc,
				onUpdateParams: [mobs[i].index],
				onComplete: specialComplete,
				onCompleteParams: [mobs[i]]
			})
		}
	}
	function specialComplete(m) {
		resetIdle(m.index)
		if (testAnimations) delayedCall(1, death, [ m.index ])
	}
	function death(i) {
		if (mobs[i].isDead) return
		mobs[i].isDead = true
		mobs[i].name = ''
		mobs[i].hp = 0
		mob.setClickBox(mobs[i])
		mobs[i].isAnimationActive = true
		var speed = mobs[i].frameSpeed * frame.death.diff

		TweenMax.to(mobs[i].dom.details, speed, {
			y: mobs[i].barDeathBottom * mobs[i].size,
			ease: Power4.easeIn
		});
		TweenMax.to(mobs[i], speed, {
			startAt: {
				frame: frame.death.start
			},
			overwrite: 1,
			frame: frame.death.end,
			ease: Linear.easeNone,
			onUpdate: setSrc,
			onUpdateParams: [mobs[i].index],
		});
		TweenMax.to(mobs[i].dom.details, speed / 2, {
			opacity: 0
		})
		TweenMax.to(mobs[i].dom.wrap, speed + 2, {
			startAt: { filter: 'opacity(1) brightness(3)'},
			filter: 'opacity(0) brightness(0)',
			ease: Linear.easeIn,
			onComplete: deathCompleteFade,
			onCompleteParams: [mobs[i], mobs[i].dom.wrap]
		})
	}
	function deathCompleteFade(mob, el) {
		delayedCall(1, () => {
			if (testAnimations) {
				TweenMax.set(mobs[mob.index].dom.details, {
					opacity: 1
				})
				sizeMob(mob.index);
				idle(mob.index, true);
				delayedCall(.1, deathCompleteFadeReset, [ mob, el ])
			}
		})
	}
	function deathCompleteFadeReset(m, e) {
		m.isDead = false;
		m.isAnimationActive = false;
		e.style.filter = 'opacity(100%) brightness(100%)';
	}
	function setMobDefensiveSkill(config, val) {
		return config.level * val / 50
	}
	function modifyMobStatsByClass(config) {
		//if (typeof config.job === 'undefined') config.job = 'WAR'
		// base resources
		config.hp = ~~(25 + ((config.level - 1) * 220) * config.hp)
		//config.mpMax = config.mp = ~~(10 + ((config.level - 1) * 15) * config.mp)
		//config.spMax = config.sp = ~~(10 + ((config.level - 1) * 15) * config.sp)
		config.attack = ~~(3 + (config.level * 1.66))
		config.dodge = 0
		config.parry = 0
		config.riposte = 0
		// class modifications
		if (config.job === 'WAR') {
			config.hp = ~~(config.hp * 1.2)
			config.attack = ~~(config.attack * 1.1)
			if (config.level >= 6) config.dodge = setMobDefensiveSkill(config, 7.5)
			if (config.level >= 10) config.parry = setMobDefensiveSkill(config, 12.5)
			if (config.level >= 25) config.riposte = setMobDefensiveSkill(config, 12.5)
			config.skills = [
				'Furious Slam',
				'Pummel',
				'Enrage',
			];
		}
		else if (config.job === 'CRU') {
			config.hp = ~~(config.hp * 1.1)
			config.attack = ~~(config.attack * 1.1);
			if (config.level >= 10) config.dodge = setMobDefensiveSkill(config, 7.5)
			if (config.level >= 17) config.parry = setMobDefensiveSkill(config, 12.5)
			if (config.level >= 30) config.riposte = setMobDefensiveSkill(config, 10)
			config.skills = [
				'Ardent Bash',
				'Holy Light',
				'Imbued Force',
				'Divine Barrier',
			];
		}
		else if (config.job === 'SHD') {
			config.hp = ~~(config.hp * 1.2)
			config.attack = ~~(config.attack * 1.1);
			if (config.level >= 10) config.dodge = setMobDefensiveSkill(config, 7.5)
			if (config.level >= 17) config.parry = setMobDefensiveSkill(config, 10)
			if (config.level >= 30) config.riposte = setMobDefensiveSkill(config, 12.5)
			config.skills = [
				'Bash',
				'Engulfing Darkness',
				'Fear',
				'Venom Bolt',
			];
		}
		else if (config.job === 'MNK') {
			config.attack = ~~(config.attack * 1.15);
			config.dodge = setMobDefensiveSkill(config, 7.5)
			if (config.level >= 12) config.parry = setMobDefensiveSkill(config, 7.5)
			if (config.level >= 35) config.riposte = setMobDefensiveSkill(config, 10)
			config.skills = [
				'Shadow Kick',
				'Dragon Punch',
			];
		}
		else if (config.job === 'ROG') {
			config.attack = ~~(config.attack * 1.15);
			if (config.level >= 4) config.dodge = setMobDefensiveSkill(config, 10)
			if (config.level >= 17) config.parry = setMobDefensiveSkill(config, 7.5)
			if (config.level >= 30) config.riposte = setMobDefensiveSkill(config, 7.5)
			config.skills = [
				'Backstab',
				'Widow Strike'
			];
		}
		else if (config.job === 'RNG') {
			config.attack = ~~(config.attack * 1.15);
			if (config.level >= 8) config.dodge = setMobDefensiveSkill(config, 7.5)
			if (config.level >= 18) config.parry = setMobDefensiveSkill(config, 10)
			if (config.level >= 35) config.riposte = setMobDefensiveSkill(config, 7.5)
			config.skills = [
				'Light Healing',
				'Faerie Flame',
				'Ignite',
				'Charged Bolts',
			];
		}
		else if (config.job === 'BRD') {
			config.attack = ~~(config.attack * 1.05);
			if (config.level >= 10) config.dodge = setMobDefensiveSkill(config, 10)
			// cannot dispel bard songs
			config.skills = [
				'Psalm of Flames', // damage shield, FR boost
				'Psalm of Frost', // damage shield, CR boost
				'Elemental Rhythms', // LR, FR, CR
				'Guardian Rhythms', // BR, PR, AR
				'Chant of Battle', // damage shield, FR boost
				'Hymn of Shielding', // % physical damage reduction
				'Hymn of Soothing', // regen hp, mp
			];
		}
		else if (config.job === 'DRU') {
			if (config.level >= 15) config.dodge = setMobDefensiveSkill(config, 5)
			config.skills = [
				'Regrowth',
				'Lightning Blast',
				'Starfire',
				'Drifting Death',
			];
		}
		else if (config.job === 'CLR') {
			if (config.level >= 15) config.dodge = setMobDefensiveSkill(config, 5)
			config.skills = [
				'Holy Light',
				'Smite',
				'Imbued Force'
			];
		}
		else if (config.job === 'SHM') {
			config.attack = ~~(config.attack * 1.05);
			if (config.level >= 15) config.dodge = setMobDefensiveSkill(config, 5)
			config.skills = [
				'Rekindle',
				'Static Shock',
				'Frost Shock',
				'Envenom',
				'Slumber',
			];
		}
		else if (config.job === 'NEC') {
			config.hp = ~~(config.hp * .9)
			if (config.level >= 22) config.dodge = setMobDefensiveSkill(config, 5)
			config.skills = [
				'Blood Boil',
				'Engulfing Darkness',
				'Fear',
				'Venom Bolt',
			];
		}
		else if (config.job === 'ENC') {
			config.hp = ~~(config.hp * .9)
			if (config.level >= 22) config.dodge = setMobDefensiveSkill(config, 5)
			config.skills = [
				'Gravity Flux',
				'Runic Shield',
				'Alacrity',
				'Fiery Enchant',
				'Glacial Enchant',
			];
		}
		else if (config.job === 'SUM') {
			config.hp = ~~(config.hp * .9)
			if (config.level >= 22) config.dodge = setMobDefensiveSkill(config, 5)
			config.skills = [
				'Lava Bolt',
				'Frozen Orb',
				'Psionic Storm',
			];
		}
		else if (config.job === 'WIZ') {
			config.hp = ~~(config.hp * .9)
			if (config.level >= 22) config.dodge = setMobDefensiveSkill(config, 5)
			config.skills = [
				'Ice Bolt',
				'Arcane Missiles',
				'Lightning Strike',
				'Glacial Spike',
			];
		}
		config.hpMax = config.hp
	}

	function resourceTick() {
		//TODO: This code works, but I think it will create unnecessary network strain... explore later?
		if (mob.enableMobHeartbeat) {
			if (my.isLeader && party.hasMoreThanOnePlayer()) {
				tickData = []
				mobs.forEach(processMobResourceTick)
				if (tickData.length) {
					socket.publish('party' + my.partyId, {
						route: 'party->mobTick',
						d: tickData
					}, true)
				}
			}
		}
	}
	function processMobResourceTick(mob, index) {
		if (mob.name) {
			// hp
			hpTick = mob.level
			if (mob.hp + hpTick > mob.hpMax) {
				hpTick = mob.hpMax - mob.hp
			}
			mobs[index].hp += hpTick
			// mp
			mpTick = 1
			if (mob.mp + mpTick > mob.mpMax) {
				mpTick = mob.mpMax - mob.mp
			}
			mobs[index].mp += mpTick
			// sp
			spTick = 1
			if (mob.sp + spTick > mob.spMax) {
				spTick = mob.spMax - mob.sp
			}
			mobs[index].sp += spTick
			info('sending hpTick:', hpTick)
			tickData.push({
				i: index,
				h: hpTick,
				m: mpTick,
				s: spTick,
			})
			drawMobBar(index)
		}
	}
	function rxMobResourceTick(data) {
		data.d.forEach(tick => {
			mobs[tick.i].hp += tick.h
			mobs[tick.i].mp += tick.m
			mobs[tick.i].sp += tick.s
			drawMobBar(tick.i)
			info('resource tick B', tick)
		})
	}

})(TweenMax, $, _, Object);