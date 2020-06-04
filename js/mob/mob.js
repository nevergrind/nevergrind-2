var mob;
(function(TweenMax, $, _, Object, Linear, window, PIXI, Sine, Power2, undefined) {
	mob = {
		txData: [],
		enableMobHeartbeat: true,
		imageKeysLen: 0,
		index: 0,
		cache: {},
		textures: {},
		imageKeys: [],
		initialized: 0,
		max: 9,
		maxLevel: 50,
		element: {},
		centerX: [192,576,960,1344,1728,384,768,1152,1536],
		bottomY: [220,220,220,220,220,320,320,320,320],
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
		animateAttack,
		special,
		death,
		killAttacks,
		missChance,
	};
	var percent, row, val, mostHatedRow, mostHatedValue, index, mobDamages, len, el, chance
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
	let mobRow = -1
	let newHate = 0
	const hoverIcon = "url('css/cursor/pointer.cur'), auto"

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
		newHate = o.damage * o.hate
		console.info('updateHate mob', o.index, mobs[o.index].hate)
		mobs[o.index].hate[o.row] += newHate
		if (mobs[o.index].hate[o.row] < 0) mobs[o.index].hate[o.row] = 0
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
				frame: 1,
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
			})
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
		console.info('configMobType results', results)
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
		console.info('mobConfig', i, mobConfig)
		cache.preloadMob(mobConfig.img)
		// combine/assign image object props to mobs[index]
		mobs[i] = {
			...mobs[i],
			...mobs.images[mobConfig.img],
			...mobConfig,
		}
		// start attack cycle
		timers.mobAttack[i].kill()
		timers.mobAttack[i] = delayedCall(Math.random() * 1.5 + 1.5, mob.attack, [i])
		mobs[i].hate = {}
		party.presence.forEach(member => {
			mobs[i].hate[member.row] = 0
		})

		// delete mobs[i].cache;
		sizeMob(i)
		resetIdle(i, true)
		idle(i)
	}
	function sizeOffset(size) {
		val = 0
		if (size >= 1) val = 16
		else if (size > .9) val = 12
		else if (size > .8) val = 8
		else if (size > .7) val = 4
		else val = 0
		return val
	}
	function sizeMob(i) {
		var m = mobs[i]
		if (!m.img) return
		// set dom
		let images = mobs.images[m.img]
		let width = ~~(m.size * (images.width))
		let height = ~~(m.size * (images.height))
		let x = mob.centerX[i]
		// botttom - row offset - image size offset for transparency at bottom - more size offset?
		let y = 1080 - mob.bottomY[i] - (images.yFloor * m.size) + sizeOffset(m.size)
		// mob sprite
		mobs[i].sprite = PIXI.Sprite.from('mobs/'+ m.img +'/1.png')
		mobs[i].sprite.anchor.set(.5, 1)
		mobs[i].sprite.index = i
		mobs[i].sprite.x = x
		mobs[i].sprite.y = y
		mobs[i].sprite.width = width
		mobs[i].sprite.height = height
		mobs[i].sprite.interactive = true
		mobs[i].sprite.buttonMode = true
		mobs[i].sprite.zIndex = 100 - i

		// mob shadow
		/*mobs[i].shadow = PIXI.Sprite.from('mobs/'+ m.img +'/1.png')
		mobs[i].shadow.anchor.set(.5, 1)
		mobs[i].shadow.x = x
		mobs[i].shadow.y = y
		mobs[i].shadow.width = width
		mobs[i].shadow.height = height
		mobs[i].shadow.zIndex = 90 - i
		TweenMax.set(mobs[i].shadow, {
			pixi: {
				brightness: 0,
				alpha: .2
			}
		})*/
		setClickBox(m, i)
		//mobs[i].sprite.hitArea = new PIXI.Rectangle(c.x, c.y, c.w, c.h)
		battle.layer.stage.addChild(mobs[i].sprite)

		// shadow
		//TODO: change to percentages and use shadowBottom
		let el = querySelector('#mob-shadow-' + i)
		el.style.display = 'block'
        el.style.width = (m.shadowWidth * m.size) * 100 / 1920 + '%'
        el.style.height = (m.shadowHeight * m.size) * 100 / 1080 + '%'
        el.style.bottom = '0%'

		TweenMax.set(querySelector('#mob-details-' + i), {
			y: 0,
			bottom: m.barAliveBottom * m.size
		})
		querySelector('#mob-name-' + i).textContent = mobs[i].name
		// name
		el = querySelector('#mob-name-' + i)
		el.innerHTML = m.name;
		el.classList.add(combat.getDiffClass(m.level))
		// health
		drawMobBar(index)
	}
	function setClickBox(m, i) {
		// alive box
		let el = querySelector('#mob-alive-' + i)
		el.style.left = ((m.clickAliveW  * m.size) * -.5) + 'px';
		el.style.bottom = (m.clickAliveY  * m.size) + 'px';
		el.style.width = (m.clickAliveW  * m.size) + 'px';
		el.style.height = (m.clickAliveH * m.size) + 'px';
		el.style.display = m.hp ? 'block' : 'none';

		// dead box
		el = querySelector('#mob-dead-' + i)
		el.style.left = ((m.clickDeadW * m.size) * -.5) + 'px';
		el.style.bottom = (m.clickDeadY * m.size) + 'px';
		el.style.width = (m.clickDeadW * m.size) + 'px';
		el.style.height = (m.clickDeadH * m.size) + 'px';
		el.style.display = m.hp ? 'none' : 'block';
	}
	function drawMobBar(index, drawInstant) {
		percent = bar.getRatio('hp', mobs[index])
		// info('drawMobBar', index, percent)
		TweenMax.to('#mob-health-' + index, drawInstant ? 0 : .15, {
			x: '-' + percent + '%'
		})
		if (index === my.target) {
			el = querySelector('#mob-target-percent')
			if (el !== null) el.innerHTML = ceil(100 - percent) + '%'
			TweenMax.to('#mob-target-hp', drawInstant ? 0 : .15, {
				x: '-' + percent + '%'
			})
		}
	}
	function setSrc(i) {
		mobs[i].frame = ~~mobs[i].frame
		if (mobs[i].frame !== mobs[i].lastFrame) {
			mobs[i].sprite.texture = mob.textures[mobs[i].img][mobs[i].frame]
			mobs[i].lastFrame = mobs[i].frame
		}
	}
	function resetIdle(i) {
		mobs[i].isAnimationActive = false
		idle(mobs[i].index)
	}

	function idle(i) {
		if (ng.view !== 'battle') return
		mobs[i].animation = TweenMax.to(mobs[i], mobs[i].frameSpeed * frame.idle.diff * 2, {
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
	}

	function hit(i) {
		if (ng.view !== 'battle') return
		if (mobs[i].isAnimationActive) return;
		mobs[i].isAnimationActive = true;
		var speed = mobs[i].frameSpeed * frame.hit.diff

		mobs[i].animation = TweenMax.to(mobs[i], speed, {
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
			onComplete: () => { resetIdle(mobs[i].index) },
		});
	}
	function getMobTargetRow(slot) {
		mostHatedRow = []
		mostHatedValue = null
		for (row in mobs[slot].hate) {
			row *= 1
			val = mobs[slot].hate[row]
			index = party.getIndexByRow(row)
			console.info(row, index, val)
			if (party.presence[index].hp > 0) {
				if (mostHatedValue === null) {
					// first one is always added
					mostHatedValue = val
					mostHatedRow.push(row)
				}
				else {
					if (val === mostHatedValue) {
						// tie
						mostHatedRow.push(row)
					}
					else if (val > mostHatedValue) {
						// exceeds - new array with only that row
						mostHatedValue = val
						mostHatedRow = [row]
					}
				}
			}
		}
		// set the host row
		len = mostHatedRow.length
		if (!len) {
			mostHatedRow = -1
		}
		else if (len === 1) {
			mostHatedRow = mostHatedRow[0]
		}
		else if (len > 1) {
			// party members tied for hate - pick a random target among them
			index = _.random(0, mostHatedRow.length - 1)
			mostHatedRow = mostHatedRow[index]
		}
		return mostHatedRow *= 1
	}

	function getMobDamage(i, row) {
		return {
			row: row,
			damage: _.random(ceil(mobs[i].level * .33), mobs[i].attack),
			damageType: 'physical'
		}
	}

	function attack(i) {
		timers.mobAttack[i].kill()
		if (!mobs[i].name) return

		if (party.presence[0].isLeader) {
			// only party leader should trigger attacks
			if (party.isSomeoneAlive()) {
				mobRow = getMobTargetRow(i)
				if (mobRow > -1) {
					// party.getIndexByRow(mostHatedRow)
					console.info('mob', i, 'attacking!', '=> targeting', mobRow, party.presence[party.getIndexByRow(mobRow)].hp)
					mobDamages = [getMobDamage(i, mobRow)]
					if (Math.random() * 100 < mobs[i].doubleAttack) {
						mobDamages.push(getMobDamage(i, mobRow))
					}
					combat.txDamageHero(i, mobDamages)
				}
			}
		}
		// keep it going for all in case some else takes over leader
		timers.mobAttack[i] = delayedCall(mobs[i].speed, mob.attack, [i])
	}
	function animateAttack(i, isSecondary) {
		// animate
		if (mobs[i].isAnimationActive) return

		mobs[i].isAnimationActive = true
		var attackType = isSecondary ? 'secondary' : 'primary'
		var speed = mobs[i].frameSpeed * frame[attackType].diff;
		if (!mobs[i].enableSecondary) {
			attackType = 'primary'
		}

		mobs[i].animation = TweenMax.to(mobs[i], speed, {
			startAt: {
				frame: frame[attackType].start
			},
			overwrite: 1,
			frame: frame[attackType].end,
			ease: Linear.easeNone,
			onUpdate: setSrc,
			onUpdateParams: [mobs[i].index],
			onComplete: () => { resetIdle(mobs[i].index) },
		})
	}

	function special(i) {
		if (mobs[i].isAnimationActive) return
		if (!mobs[i].enableSpecial) {
			attack(mobs[i].index, 'death')
		}
		else {
			mobs[i].isAnimationActive = true
			var speed = mobs[i].frameSpeed * frame.special.diff

			mobs[i].animation = TweenMax.to(mobs[i], speed, {
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
				onComplete: () => { resetIdle(mobs[i].index) },
			})
		}
	}
	function death(i) {
		if (mobs[i].isDead) return
		mobs[i].isDead = true
		mobs[i].name = ''
		mobs[i].hp = 0
		mob.setClickBox(mobs[i], i)
		mobs[i].isAnimationActive = true
		var speed = mobs[i].frameSpeed * frame.death.diff
		let el = querySelector('#mob-details-' + i)
		TweenMax.to(el, speed, {
			y: mobs[i].barDeathBottom * mobs[i].size,
			ease: Power4.easeIn
		});
		mobs[i].animation = TweenMax.to(mobs[i], speed, {
			startAt: {
				frame: frame.death.start
			},
			overwrite: 1,
			frame: frame.death.end,
			ease: Linear.easeNone,
			onUpdate: setSrc,
			onUpdateParams: [mobs[i].index],
		});
		TweenMax.to([mobs[i].sprite, mobs[i].shadow], 3, {
			startAt: {
				alpha: 1,
				pixi: {
					saturate: 4,
					brightness: 2,
				}
			},
			alpha: 0,
			pixi: {
				saturate: 1,
				brightness: 0,
			},
			ease: Power2.easeIn
		})
		TweenMax.to(mobs[i].dom.details, speed / 2, {
			opacity: 0
		})
		TweenMax.to(mobs[i].dom.wrap, speed + 2, {
			startAt: { filter: 'opacity(1) brightness(3)'},
			filter: 'opacity(0) brightness(0)',
			ease: Linear.easeIn,
		})
	}
	function setMobSkill(config, val) {
		// adjusts value based on what it is at max level
		return config.level * val / mob.maxLevel
	}
	function modifyMobStatsByClass(config) {
		//if (typeof config.job === 'undefined') config.job = 'WAR'
		// base resources
		config.hp = ~~((25 + ((config.level - 1) * 220) * config.hp) * party.presence.length)
		//config.mpMax = config.mp = ~~(10 + ((config.level - 1) * 15) * config.mp)
		//config.spMax = config.sp = ~~(10 + ((config.level - 1) * 15) * config.sp)
		config.attack = ~~(3 + (config.level * 1.66))
		config.dodge = 0
		config.parry = 0
		config.riposte = 0
		config.doubleAttack = 0
		// class modifications
		if (config.job === 'WAR') {
			config.hp = ~~(config.hp * 1.2)
			config.attack = ~~(config.attack * 1.1)
			if (config.level >= 6) config.dodge = setMobSkill(config, 7.5)
			if (config.level >= 10) config.parry = setMobSkill(config, 12.5)
			if (config.level >= 15) config.doubleAttack = setMobSkill(config, 25)
			if (config.level >= 25) config.riposte = setMobSkill(config, 12.5)
			config.skills = [
				'Furious Slam',
				'Pummel',
				'Enrage',
			];
		}
		else if (config.job === 'CRU') {
			config.hp = ~~(config.hp * 1.1)
			config.attack = ~~(config.attack * 1.1);
			if (config.level >= 10) config.dodge = setMobSkill(config, 7.5)
			if (config.level >= 17) config.parry = setMobSkill(config, 12.5)
			if (config.level >= 20) config.doubleAttack = setMobSkill(config, 33)
			if (config.level >= 30) config.riposte = setMobSkill(config, 10)
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
			if (config.level >= 10) config.dodge = setMobSkill(config, 7.5)
			if (config.level >= 17) config.parry = setMobSkill(config, 10)
			if (config.level >= 20) config.doubleAttack = setMobSkill(config, 33)
			if (config.level >= 30) config.riposte = setMobSkill(config, 12.5)
			config.skills = [
				'Bash',
				'Engulfing Darkness',
				'Fear',
				'Venom Bolt',
			];
		}
		else if (config.job === 'MNK') {
			config.attack = ~~(config.attack * 1.15);
			config.dodge = setMobSkill(config, 7.5)
			if (config.level >= 12) config.parry = setMobSkill(config, 7.5)
			if (config.level >= 15) config.doubleAttack = setMobSkill(config, 40)
			if (config.level >= 35) config.riposte = setMobSkill(config, 10)
			config.skills = [
				'Shadow Kick',
				'Dragon Punch',
			];
		}
		else if (config.job === 'ROG') {
			config.attack = ~~(config.attack * 1.15);
			if (config.level >= 4) config.dodge = setMobSkill(config, 10)
			if (config.level >= 17) config.parry = setMobSkill(config, 7.5)
			if (config.level >= 16) config.doubleAttack = setMobSkill(config, 40)
			if (config.level >= 30) config.riposte = setMobSkill(config, 7.5)
			config.skills = [
				'Backstab',
				'Widow Strike'
			];
		}
		else if (config.job === 'RNG') {
			config.attack = ~~(config.attack * 1.15);
			if (config.level >= 8) config.dodge = setMobSkill(config, 7.5)
			if (config.level >= 18) config.parry = setMobSkill(config, 10)
			if (config.level >= 20) config.doubleAttack = setMobSkill(config, 40)
			if (config.level >= 35) config.riposte = setMobSkill(config, 7.5)
			config.skills = [
				'Light Healing',
				'Faerie Flame',
				'Ignite',
				'Charged Bolts',
			];
		}
		else if (config.job === 'BRD') {
			config.attack = ~~(config.attack * 1.05);
			if (config.level >= 10) config.dodge = setMobSkill(config, 10)
			if (config.level >= 17) config.doubleAttack = setMobSkill(config, 12)
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
			if (config.level >= 15) config.dodge = setMobSkill(config, 5)
			config.skills = [
				'Regrowth',
				'Lightning Blast',
				'Starfire',
				'Drifting Death',
			];
		}
		else if (config.job === 'CLR') {
			if (config.level >= 15) config.dodge = setMobSkill(config, 5)
			config.skills = [
				'Holy Light',
				'Smite',
				'Imbued Force'
			];
		}
		else if (config.job === 'SHM') {
			config.attack = ~~(config.attack * 1.05);
			if (config.level >= 15) config.dodge = setMobSkill(config, 5)
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
			if (config.level >= 22) config.dodge = setMobSkill(config, 5)
			config.skills = [
				'Blood Boil',
				'Engulfing Darkness',
				'Fear',
				'Venom Bolt',
			];
		}
		else if (config.job === 'ENC') {
			config.hp = ~~(config.hp * .9)
			if (config.level >= 22) config.dodge = setMobSkill(config, 5)
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
			if (config.level >= 22) config.dodge = setMobSkill(config, 5)
			config.skills = [
				'Lava Bolt',
				'Frozen Orb',
				'Psionic Storm',
			];
		}
		else if (config.job === 'WIZ') {
			config.hp = ~~(config.hp * .9)
			if (config.level >= 22) config.dodge = setMobSkill(config, 5)
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
						route: 'p->mobTick',
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
			console.info('sending hpTick:', hpTick)
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
			console.info('resource tick B', tick)
		})
	}
	function killAttacks(finishDeath) {
		mobs.forEach((m, i) => {
			timers.mobAttack[i].kill()
			!finishDeath && typeof mobs[i].animation === 'object' && mobs[i].animation.pause()
		})
	}
	function missChance(level) {
		chance = .2
		if (my.level > level) {
			chance += ((my.level - level) / 150)
		}
		else if (my.level < level) {
			chance -= ((level - my.level) / 25)
		}
		if (chance > .5) chance = .5
		else if (chance < .05) chance = .05
		// console.info('missChance', level, chance)
		return chance
	}

})(TweenMax, $, _, Object, Linear, window, PIXI, Sine, Power2);