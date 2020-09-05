var mob;
(function(TweenMax, $, _, Object, Linear, window, PIXI, Sine, Power2, undefined) {
	mob = {
		getMobResist,
		isAlive,
		isParalyzed,
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
		drawTargetBar,
		resourceTick,
		rxMobResourceTick,
		updateHate,
		// animations
		resetIdle,
		idle,
		hit,
		attack,
		animateAttack,
		special,
		death,
		getMobAttackSpeed,
		killAttacks,
		missChance,
		getMobDamage,
		updateMobName,
		isAnyMobAlive,
		addHateHeal,
		hideMobTargets,
		setFilter,
		setTimeScaleSpeed,
		isPoisoned,
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
		earnedExp: 0,
		earnedGold: 0,
		leveledUp: false,
	};
	var percent, row, val, mostHatedRow, mostHatedValue, index, mobDamages, len, el, chance
	let isSomeoneAlive = false
	let goldChance = 0
	let goldFound = 0
	let exp = 0
	let hpKillVal = 0
	let spKillVal = 0
	let mpKillVal = 0
	var index = 0
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
		speedMod: 1,
		timeScale: 1,
		level: 1,
		armor: 1,
		healing: 1,
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
	let mobSpeed = 1
	let timeScaleSpeed = 1
	let tickData = []
	let hpTick = 0
	let mpTick = 0
	let spTick = 0
	let mobRow = -1
	let i = 0
	let resist = 0
	let resistPenalty = 0

	//////////////////////////////////////////////////
	function getRandomMobKey() {
		var i = ~~(rand() * mob.imageKeysLen)
		return mob.imageKeys[i]
	}
	function addHateHeal(data) {
		if (ng.view === 'battle') {
			// console.info('updateHate addHateHeal', data)
			for (i=0; i<mob.max; i++) {
				// applied to all mobs
				updateHate({
					index: i,
					row: data.row,
					damage: data.hate,
					hate: 1,
				})
			}
		}
	}
	function updateHate(o) {
		if (mobs[o.index].name && mobs[o.index].hp > 0) {
			// console.info('updateHate mob', o.index, o.damage, ~~(o.hate * o.damage), o.key)
			mobs[o.index].hate[o.row] += ~~(o.hate * o.damage)
			if (mobs[o.index].hate[o.row] < 0) mobs[o.index].hate[o.row] = 0
		}
	}
	function init() {
		mob.imageKeys = Object.keys(mobs.images)
		mob.imageKeysLen = mob.imageKeys.length
		battle.show()
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
				hitCount: 0,
				type: 'normal',
				buffs: {},
				buffFlags: {},
				box: {},
				dom: {},
			}
			querySelector('#mob-wrap-' + i).style.display = 'none'
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
					// console.info('pushing by name', mob.name, config.name)
					results.push({
						...mob,
						level: level,
						isDead: false,
					})
				}
				else if (mob.img === config.img) {
					// console.info('pushing by img', mob.img, config.img)
					results.push({
						...mob,
						level: level,
						isDead: false,
					})
				}
			}
		})
		// console.info('configMobType results', results)
		index = _.random(0, results.length - 1)
		return {
			...mobBaseConfig,
			...results[index],
		}
	}
	function getMobGold(config) {
		goldChance = rand()
		goldFound = 0
		if (goldChance > .3) goldFound = 0
		else goldFound = ~~_.random(2, config.level * 2.66)
		return goldFound
	}
	function getMobExp(config) {
		exp = config.level * 3
		index = combat.getDiffIndex(config.level)
		// console.info('getMobExp', index, exp)
		exp = round(exp * battle.earnedExpRatio[index])
		// console.info('getMobExp', exp)
		return exp
	}
	function isAnyMobAlive() {
		return mobs.some(mob => mob.hp > 0)
	}
	function setMob(i, mobConfig, dataFromLeader) {
		mob.earnedExp = 0
		mob.earnedGold = 0
		mob.leveledUp = false
		if (!dataFromLeader) {
			// leader
			mobConfig = {
				...mobConfig,
				...mob.type[mobConfig.img],
				gold: getMobGold(mobConfig)
			}
			modifyMobStatsByClass(mobConfig)
			// console.info('mobConfig omit some props?', mobConfig)

			mob.txData[i] = _.omit(mobConfig, KEYS.MOB_OMIT)
		}
		// console.info('p->goBattle', mobConfig)
		cache.preloadMob(mobConfig.img)
		// combine/assign image object props to mobs[index]
		mobs[i] = {
			...mobs[i],
			...mobs.images[mobConfig.img],
			...mobConfig,
			exp: getMobExp(mobConfig)
		}
		// start attack cycle
		timers.mobAttack[i].kill()
		timers.mobAttack[i] = delayedCall(Math.random() * 2 + 2, mob.attack, [i])
		mobs[i].hate = {}
		party.presence.forEach(member => {
			mobs[i].hate[member.row] = 0
		})

		// delete mobs[i].cache;
		querySelector('#mob-wrap-' + i).style.display = 'block'
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
		let y = MaxHeight - mob.bottomY[i] - (images.yFloor * m.size) + sizeOffset(m.size)
		// mob sprite
		m.sprite = PIXI.Sprite.from('mobs/'+ m.img +'/1.png')
		m.sprite.anchor.set(.5, 1)
		m.sprite.index = i
		m.sprite.x = x
		m.sprite.y = y
		m.sprite.width = width
		m.sprite.height = height
		m.sprite.interactive = true
		m.sprite.buttonMode = true
		m.sprite.zIndex = 100 - i
		TweenMax.set(mobs[i].sprite, filter.default(i))

		// mob shadow
		/*m.shadow = PIXI.Sprite.from('mobs/'+ m.img +'/1.png')
		m.shadow.anchor.set(.5, 1)
		m.shadow.x = x
		m.shadow.y = y
		m.shadow.width = width
		m.shadow.height = height
		m.shadow.zIndex = 90 - i
		TweenMax.set(m.shadow, {
			pixi: {
				brightness: 0,
				alpha: .2
			}
		})*/
		setClickBox(m, i)
		//m.sprite.hitArea = new PIXI.Rectangle(c.x, c.y, c.w, c.h)
		battle.layer.stage.addChild(m.sprite)

		// shadow
		//TODO: change to percentages and use shadowBottom
		let el = querySelector('#mob-shadow-' + i)
		el.style.display = 'block'
        el.style.width = (m.shadowWidth * m.size) * 100 / MaxWidth + '%'
        el.style.height = (m.shadowHeight * m.size) * 100 / MaxHeight + '%'
        el.style.bottom = '0%'

		TweenMax.set(querySelector('#mob-details-' + i), {
			y: 0,
			bottom: m.barAliveBottom * m.size
		})
		// name
		updateMobName(i)
		// health
		drawMobBar(i)
	}
	function updateMobName(i) {
		el = querySelector('#mob-name-' + i)
		el.innerHTML = mobs[i].name;
		el.className = 'mob-name text-shadow3'
		el.classList.add(combat.considerClass[combat.getDiffIndex(mobs[i].level)])
	}
	function setClickBox(m, i) {
		// alive box
		let el = querySelector('#mob-alive-' + i)
		el.style.left = ((m.clickAliveW  * m.size) * -.5) + 'px'
		el.style.bottom = (m.clickAliveY  * m.size) + 'px'
		el.style.width = (m.clickAliveW  * m.size) + 'px'
		el.style.height = (m.clickAliveH * m.size) + 'px'
		el.style.display = m.hp ? 'block' : 'none'

		// dead box
		el = querySelector('#mob-dead-' + i)
		el.style.left = ((m.clickDeadW * m.size) * -.5) + 'px'
		el.style.bottom = (m.clickDeadY * m.size) + 'px'
		el.style.width = (m.clickDeadW * m.size) + 'px'
		el.style.height = (m.clickDeadH * m.size) + 'px'
		el.style.display = m.hp ? 'none' : 'block'
	}
	function drawMobBar(index, drawInstant) {
		percent = bar.getRatio('hp', mobs[index])
		TweenMax.to('#mob-health-' + index, drawInstant ? 0 : .15, {
			x: '-' + percent + '%'
		})
		if (my.targetIsMob && index === my.target) drawTargetBar(percent, drawInstant)
	}
	function drawTargetBar(percent, drawInstant) {
		el = querySelector('#mob-target-percent')
		if (el !== null) el.innerHTML = ceil(100 - percent) + '%'
		TweenMax.to('#mob-target-hp', drawInstant ? 0 : .15, {
			x: '-' + percent + '%'
		})
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
		setTimeScaleSpeed(i)
	}
	function setTimeScaleSpeed(i) {
		// default speed for this mob
		timeScaleSpeed = mobs[i].timeScale
		// things that modify mob speed
		if (mobs[i].buffFlags.chill) timeScaleSpeed -= .2
		// constraints
		if (timeScaleSpeed > 3) timeScaleSpeed = 3
		else if (timeScaleSpeed < .5) timeScaleSpeed = .5
		// console.info('timeScaleSpeed', timeScaleSpeed)
		mobs[i].animation.timeScale(timeScaleSpeed)
	}

	const alphaStasis = { alpha: .5 }
	const alphaDefault = { alpha: 1 }
	const filter = {
		stasis: (i) => timers.mobEffects[i].stasisDuration > 0 ? alphaStasis : alphaDefault,
		freeze: (i) => {
			return { pixi: {
				...filter.stasis(i),
				colorize: '#0ff',
				colorizeAmount: 1,
			}}
		},
		chill: (i) => {
			return { pixi: {
				...filter.stasis(i),
				colorize: '#0ff',
				colorizeAmount: .5,
			}}
		},
		default: (i) => {
			return { pixi: {
				...filter.stasis(i),
				colorize: '#0ff',
				colorizeAmount: 0,
			}}
		}
	}
	function setFilter(i) {
		if (timers.mobEffects[i].freezeDuration) {
			TweenMax.to(mobs[i].sprite, .5, filter.freeze(i))
			// console.info('setFilter FREEZE')
		}
		else if (timers.mobEffects[i].chillDuration) {
			TweenMax.to(mobs[i].sprite, .5, filter.chill(i))
			// console.info('setFilter CHILL')
		}
		else {
			// console.info('setFilter mobEffects setting to default', timers.mobEffects[i].stasisDuration, filter.default(i))
			TweenMax.to(mobs[i].sprite, .5, filter.default(i))
		}
	}
	function getMobAttackSpeed(i) {
		// default speed for this mob
		mobSpeed = mobs[i].speedMod
		// things that modify mob speed
		if (mobs[i].buffFlags.chill) mobSpeed += .2
		if (mobs[i].buffFlags.shiftingEther) mobSpeed += .3
		if (mobs[i].buffFlags.primordialSludge) mobSpeed += .2
		// constraints
		if (mobSpeed > 2) mobSpeed = 2
		else if (mobSpeed < .5) mobSpeed = .5
		// console.info('mobSpeed', mobSpeed)
		return mobs[i].speed * mobSpeed
	}
	function isAlive(i) {
		return mobs[i].name && mobs[i].hp > 0
	}

	function isParalyzed(i) {
		return !!(
			mobs[i].buffFlags.arclight
		)
	}
	function hit(i, bypass, damage) {
		if (ng.view !== 'battle') return
		setTimeScaleSpeed(i)
		if (typeof bypass === 'undefined' && mobs[i].isAnimationActive) return;

		if (!timers.mobEffects[i].freezeDuration &&
			damage > (2 + (mobs[i].level * .75))) {
			if (bypass) mobs[i].animation.pause()
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
				onUpdateParams: [i],
				onComplete: resetIdle,
				onCompleteParams: [i]
			})
		}

	}
	function getMobTargetRow(slot) {
		mostHatedRow = []
		mostHatedValue = null
		for (row in mobs[slot].hate) {
			row *= 1
			val = mobs[slot].hate[row]
			index = party.getIndexByRow(row)
			// console.info(row, index, val)
			if (typeof party.presence[index] === TYPE.OBJECT &&
				party.presence[index].hp > 0) {
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
		if (!len) mostHatedRow = -1
		else if (len === 1) mostHatedRow = mostHatedRow[0]
		else if (len > 1) {
			// party members tied for hate - pick a random target among them
			index = _.random(0, mostHatedRow.length - 1)
			mostHatedRow = mostHatedRow[index]
		}
		return mostHatedRow *= 1
	}

	function getMobDamage(i, row, isPiercing) {
		return {
			row: row,
			damage: _.random(ceil(mobs[i].level * .33), mobs[i].attack),
			isPiercing: isPiercing,
			damageType: 'physical'
		}
	}

	const paralyzeRate = .3
	function attack(i) {
		timers.mobAttack[i].kill()
		if (!mobs[i].name) return

		if (party.presence[0].isLeader) {
			// only party leader should trigger attacks
			if (party.isSomeoneAlive()) {
				mobRow = getMobTargetRow(i)
				if (mobRow > -1) {
					// party.getIndexByRow(mostHatedRow)
					// console.info('mob', i, 'attacking!', '=> targeting', mobRow, party.presence[party.getIndexByRow(mobRow)].hp)
					if (mob.isParalyzed(i) && rand() < paralyzeRate) {
						mobDamages = [{
							row: mobRow,
							isParalyzed: true,
						}]
					}
					else {
						mobDamages = [getMobDamage(i, mobRow)]
						if (Math.random() * 100 < mobs[i].doubleAttack) {
							mobDamages.push(getMobDamage(i, mobRow))
						}
					}
					combat.txDamageHero(i, mobDamages)
				}
			}
		}
		// keep it going for all in case some else takes over leader
		timers.mobAttack[i] = delayedCall(getMobAttackSpeed(i), mob.attack, [i])
	}
	function animateAttack(i, row) {
		isSomeoneAlive = party.isSomeoneAlive()
		let tgt = party.presence.findIndex(p => p.row === row)
		if (tgt > -1) animateMobTarget(i, tgt)
		setTimeScaleSpeed(i)
		if (isSomeoneAlive) {
			mobs[i].animation.pause()
			mobs[i].isAnimationActive = true
			// var attackType = isSecondary ? 'secondary' : 'primary'
			var attackType = 'primary'
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
				onUpdateParams: [i],
				onComplete: resetIdle,
				onCompleteParams: [i]
			})
		}
	}
	function hideMobTargets() {
		querySelectorAll('.mob-target-avatar').forEach(el => {
			el.src = my.avatar
			el.style.background = party.color[0]
		})
	}
	function animateMobTarget(i, tgt) {
		el = querySelector('#mob-target-avatar-' + i)
		el.src = party.presence[tgt].avatar
		el.style.background = party.color[tgt]
	}

	function special(i) {
		if (mobs[i].isAnimationActive) return
		if (party.isSomeoneAlive()) {
			setTimeScaleSpeed(i)
			if (!mobs[i].enableSpecial) attack(mobs[i].index)
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
					onUpdateParams: [i],
					onComplete: resetIdle,
					onCompleteParams: [i]
				})
			}
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
		})
		setTimeScaleSpeed(i)
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
		TweenMax.to(querySelector('#mob-details-' + i), speed / 2, {
			opacity: 0
		})
		TweenMax.to(querySelector('#mob-wrap-' + i), speed + 2, {
			startAt: { filter: 'opacity(1) brightness(3)'},
			filter: 'opacity(0) brightness(0)',
			ease: Linear.easeIn,
		})
		hpKillVal = stats.hpKill()
		if (hpKillVal) {
			combat.updateMyResource('hp', hpKillVal)
		}
		mpKillVal = stats.mpKill()
		if (mpKillVal) {
			combat.updateMyResource('mp', mpKillVal)
		}
		spKillVal = stats.spKill()
		if (spKillVal) {
			combat.updateMyResource('sp', spKillVal)
		}
		mob.earnedGold += battle.addGold(mobs[i].gold)
		mob.earnedExp += battle.addExp(mobs[i].exp)
	}
	function setMobSkill(config, val) {
		// adjusts value based on what it is at max level
		return config.level * val / mob.maxLevel
	}
	function modifyMobStatsByClass(config) {
		//if (typeof config.job === 'undefined') config.job = JOB.WARRIOR
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
		if (config.job === JOB.WARRIOR) {
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
		else if (config.job === JOB.CRUSADER) {
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
		else if (config.job === JOB.SHADOW_KNIGHT) {
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
		else if (config.job === JOB.MONK) {
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
		else if (config.job === JOB.ROGUE) {
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
		else if (config.job === JOB.BARD) {
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
		else if (config.job === JOB.DRUID) {
			if (config.level >= 15) config.dodge = setMobSkill(config, 5)
			config.skills = [
				'Regrowth',
				'Lightning Blast',
				'Starfire',
				'Drifting Death',
			];
		}
		else if (config.job === JOB.CLERIC) {
			if (config.level >= 15) config.dodge = setMobSkill(config, 5)
			config.skills = [
				'Holy Light',
				'Smite',
				'Imbued Force'
			];
		}
		else if (config.job === JOB.SHAMAN) {
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
		else if (config.job === JOB.WARLOCK) {
			config.hp = ~~(config.hp * .9)
			if (config.level >= 22) config.dodge = setMobSkill(config, 5)
			config.skills = [
				'Blood Boil',
				'Engulfing Darkness',
				'Fear',
				'Venom Bolt',
			];
		}
		else if (config.job === JOB.ENCHANTER) {
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
		else if (config.job === JOB.TEMPLAR) {
			config.hp = ~~(config.hp * .9)
			if (config.level >= 22) config.dodge = setMobSkill(config, 5)
			config.skills = [
				'Lava Bolt',
				'Frozen Orb',
				'Psionic Storm',
			];
		}
		else if (config.job === JOB.WIZARD) {
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
		if (mob.enableMobHeartbeat &&
			my.isLeader &&
			party.hasMoreThanOnePlayer()) {
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
	function isPoisoned(mob) {
		return Boolean(
			mob.buffFlags.engulfingDarkness ||
			mob.buffFlags.toxicSpores ||
			mob.buffFlags.subversion ||
			mob.buffFlags.primordialSludge ||
			mob.buffFlags.affliction
		)
	}
	function processMobResourceTick(mob, index) {
		if (mob.name &&
			timers.mobEffects[index].freezeDuration === 0 &&
			!isPoisoned(mobs[index])) {
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
			// console.info('sending hpTick:', hpTick)
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
			// console.info('resource tick B', tick)
		})
	}
	function killAttacks(continueIdling) {
		mobs.forEach((m, i) => {
			timers.mobAttack[i].kill()
			!continueIdling && typeof mobs[i].animation === TYPE.OBJECT && mobs[i].animation.pause()

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
	function getMobResist(d) {
		resist = mobs[d.index].resist[d.damageType]
		// console.info('getMobResist b4', d.index, d.damageType, resist)
		if (d.damageType === 'blood') {
			if (mobs[d.index].buffFlags.curseOfShadows) resist += .2
		}
		else if (d.damageType === 'poison') {
			if (mobs[d.index].buffFlags.curseOfShadows) resist += .2
		}
		else if (d.damageType === 'arcane') {
			if (mobs[d.index].buffFlags.curseOfShadows) resist += .2
			if (mobs[d.index].buffFlags.mindBlitzEffect) resist += .3
		}
		else if (d.damageType === 'lightning') {
			if (mobs[d.index].buffFlags.staticStorm) resist += .25
			if (mobs[d.index].buffFlags.primevalWithering) resist += .2
		}
		else if (d.damageType === 'fire') {
			if (mobs[d.index].buffFlags.primevalWithering) resist += .2
		}
		else if (d.damageType === 'ice') {
			if (mobs[d.index].buffFlags.primevalWithering) resist += .2
		}
		resistPenalty = 0
		if (mobs[d.index].level > my.level) {
			// 20% when 3 levels higher
			resistPenalty = Math.pow(mobs[d.index].level - my.level + 1, 2.16) / 100
		}
		resist -= resistPenalty
		if (resist < .25) resist = .25
		else if (resist > 2) resist = 2 // cannot lower resists beyond -100%
		// console.info('getMobResist after', d.index, d.damageType, resist)
		return resist
	}

})(TweenMax, $, _, Object, Linear, window, PIXI, Sine, Power2);