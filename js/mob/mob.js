var mob;
let mobs = [];
(function(TweenMax, $, _, Object, Linear,  PIXI, Sine, Power2, undefined) {
	mob = {
		getMobTypesByZone,
		getMobResist,
		isAlive,
		getRandomMobKey,
		init,
		initMobData,
		// configs, resets (active animations) and idles mobs in one call for start of combat
		setMob,
		setSrc,
		// size only
		sizeMob,
		setClickBox,
		getMobExp,
		blur,
		getRandomMobByZone,
		drawMobBar,
		drawTargetBar,
		resourceTick,
		rxMobResourceTick,
		resetHate,
		resetAllHate,
		feignHate,
		updateHate,
		// animations
		resetIdle,
		idle,
		animateHit,
		attack,
		animateAttack,
		animateSpecial,
		animateDeath,
		getMobAttackSpeed,
		killAttacks,
		missChance,
		dodgeChance,
		parryChance,
		riposteChance,
		updateMobName,
		isAnyMobAlive,
		addHateHeal,
		hideMobTargets,
		setFilter,
		setTimeScaleSpeed,
		isParalyzed,
		isFeared,
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
		bottomY: [240,240,240,240,240,340,340,340,340],
		earnedExp: 0,
		earnedGold: 0,
		leveledUp: false,
	};
	var percent, row, val, mostHatedRow, mostHatedValue, index, mobDamages, len, el, chance
	let isSomeoneAlive = false
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
	const MOB_BASE_CONFIG = {
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
		tier: MOB_TIERS.normal,
		resist: {
			blood: 1,
			poison: 1,
			arcane: 1,
			lightning: 1,
			fire: 1,
			ice: 1,
		},
		traits: [],
		isDead: false,
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
	function resetHate(i) {
		for (var key in mobs[i].hate) {
			mobs[i].hate[key] = 0
		}
	}
	function resetAllHate() {
		for (i=0; i<mob.max; i++) {
			if (mob.isAlive(i)) {
				for (var key in mobs[i].hate) {
					mobs[i].hate[key] = 0
				}
			}
		}
	}
	function feignHate(row) {
		// feigns to 75% of current value
		for (i=0; i<mob.max; i++) {
			if (mob.isAlive(i)) {
				mobs[i].hate[row] = ~~(mobs[i].hate[row] * .75)
			}
		}
	}
	function updateHate(o) {
		if (mob.isAlive(o.index)) {
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
		initMobData()
		for (var i=0; i<mob.max; i++) {
			querySelector('#mob-wrap-' + i).style.display = 'none'
		}
	}
	function initMobData() {
		// for resetting to dead only
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
				tier: MOB_TIERS.normal,
				buffs: {},
				buffFlags: {},
				box: {},
				dom: {},
				healCount: 0,
				usedLayHands: false,
				usedHarmTouch: false,
				target: my.row,
			}
		}
	}
	function getRandomMobByZone(query, zoneName) {
		if (typeof zoneName === 'undefined') {
			zoneName = zones[mission.id].name
		}
		/**
		 * filters zone's mobData and returns one mob in the level range
		 * tries by name first and then by level
		 * @type {*[]}
		 */
		let results
		if (query.name) {
			results = [
				mob.data[zoneName].find(m => m.name === query.name)
			]
		}
		else {
			results = mob.data[zoneName].filter(m =>
				m.minLevel <= query.level && query.level <= m.maxLevel && !m.questOnly)
		}
		console.info('results', results)
		results.forEach((r, i) => {
			results[i].level = query.level
		})
		return {
			...MOB_BASE_CONFIG,
			...results[_.random(0, results.length - 1)],
		}
	}
	function getMobGold(config) {
		goldFound = 0
		if (rand() > .3) goldFound = 0
		else goldFound = ~~_.random(2, config.level * 2.66)
		return goldFound
	}
	function getMobExp(index) {
		let exp = mobs[index].level * mobs[index].expPerLevel
		let totalPlayers = party.totalPlayers()
		exp = exp * totalPlayers
		if (totalPlayers === 5) exp = exp * 1.1 // 10% exp bonus for a full group

		// adjusted for being too high or low level
		let ratioIndex = combat.getLevelDifferenceIndex(mobs[index].level)
		exp = round(exp * battle.earnedExpRatio[ratioIndex])

		// penalize for party members that are much higher
		if (my.level <= 10) {
			if (party.presence.some(p => p.level > my.level + 4)) {
				exp = 0
			}
		}
		else {
			// level 20+ uses a percentage instead of a fixed penalty
			if (party.presence.some(p => p.level > my.level * 1.5)) {
				exp = 0
			}
		}
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
			// leader gets this
			mobConfig = {
				...mobConfig,
				...mob.type[mobConfig.img],
				gold: getMobGold(mobConfig),
			}
			// mob class
			mobSkills.modifyMobStatsByClass(mobConfig)
			// mob tier
			mobSkills.modifyMobStatsByTier(mobConfig)
			// mob traits

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
		}
		console.info('setMob', _.cloneDeep(mobs[i]))
		// start attack cycle
		timers.mobAttack[i].kill()
		timers.mobAttack[i] = delayedCall(Math.random() * 2 + 2, mob.attack, [i])
		mobs[i].hate = {}
		party.presence.forEach(member => {
			mobs[i].hate[member.row] = 0
		})

		// delete mobs[i].cache;
		TweenMax.set(querySelector('#mob-wrap-' + i), { display: 'block' })
		TweenMax.set(querySelector('#mob-details-' + i), { opacity: 1 })
		mob.sizeMob(i)
		mob.resetIdle(i, true)
		mob.idle(i)
	}

	function sizeMob(i) {
		var m = mobs[i]
		if (!m.img) return
		// set dom
		const scaleByLayer = i <= 4 ? 1 : .925
		let width = ~~((m.size * (mobs.images[m.img].width)) * scaleByLayer)
		let height = ~~((m.size * (mobs.images[m.img].height)) * scaleByLayer)
		let x = mob.centerX[i]
		// botttom - row offset - image size offset for transparency at bottom - more size offset?
		let y = ask.bottomY(i, true)
		const layer = i <= 4 ? ask.MOB_LAYER : ask.MOB_LAYER_BACK
		// mob shadow
		m.shadow = PIXI.Sprite.from('mobs/'+ m.img +'/1.png')
		m.shadow.anchor.set(.5, mobs.images[m.img].anchorY)
		m.shadow.index = i
		m.shadow.x = x
		m.shadow.y = y
		m.shadow.width = width
		m.shadow.height = i<= 4 ? height * .67 : height * .5
		m.shadow.interactive = false
		m.shadow.buttonMode = false
		m.shadow.zIndex = ask.MOB_LAYER_GROUND // layer - i // don't think I want - i at all
		TweenMax.set(mobs[i].shadow, filter.shadow())
		// mob sprite
		m.sprite = PIXI.Sprite.from('mobs/'+ m.img +'/1.png')
		m.sprite.anchor.set(.5, mobs.images[m.img].anchorY)
		m.sprite.index = i
		m.sprite.x = x
		m.sprite.y = y
		m.sprite.width = width
		m.sprite.height = height
		m.sprite.interactive = true
		m.sprite.buttonMode = true
		m.sprite.zIndex = layer // layer - i // don't think I want - i at all
		TweenMax.set(mobs[i].sprite, filter.default(i))

		mob.setClickBox(m, i)
		//m.sprite.hitArea = new PIXI.Rectangle(c.x, c.y, c.w, c.h)
		battle.layer.stage.addChild(m.shadow)
		battle.layer.stage.addChild(m.sprite)

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
		el.classList.add(combat.considerClass[combat.getLevelDifferenceIndex(mobs[i].level)])
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
	let mobHealthBar
	function drawMobBar(index, drawInstant) {
		mobHealthBar = query.el('#mob-health-' + index)
		if (mobHealthBar === null) return
		percent = bar.getRatio(PROP.HP, mobs[index])
		TweenMax.to(mobHealthBar, drawInstant ? 0 : .15, {
			x: '-' + percent + '%'
		})
		if (my.targetIsMob && index === my.target) drawTargetBar(percent, drawInstant, index)
	}
	function drawTargetBar(percent, drawInstant, index) {
		querySelector('#mob-target-percent').innerHTML = ceil(100 - percent) + '%'
		TweenMax.to('#mob-target-hp', drawInstant ? 0 : .15, {
			overwrite: 1,
			x: '-' + percent + '%'
		})
	}
	function setSrc(i) {
		mobs[i].frame = ~~mobs[i].frame
		if (mobs[i].frame !== mobs[i].lastFrame) {
			// if (typeof mob.textures[mobs[i].img] === 'object') {
			mobs[i].shadow.texture = mobs[i].sprite.texture = mob.textures[mobs[i].img][mobs[i].frame]
			mobs[i].lastFrame = mobs[i].frame
		}
	}
	function resetIdle(i) {
		mobs[i].isAnimationActive = false
		idle(mobs[i].index)
	}

	function idle(i) {
		if (ng.view !== 'battle' || mobs[i].isDead) return
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
		},
		shadow: () => {
			return {
				pixi: {
					brightness: 0,
					alpha: .4,
					blur: 5,
					skewX: -50,
				},
			}
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
		if (mobs[i].buffFlags.chill) mobSpeed += buffs.chill.slowPercent
		if (mobs[i].buffFlags.shiftingEther) mobSpeed += buffs.shiftingEther.slowPercent
		if (mobs[i].buffFlags.enthrall) mobSpeed += buffs.enthrall.slowPercent
		if (mobs[i].buffFlags.primordialSludge) mobSpeed += buffs.primordialSludge.slowPercent
		if (mobs[i].buffFlags.consonantChain) mobSpeed += buffs.consonantChain.slowPercent
		// constraints
		if (mobSpeed > 2) mobSpeed = 2
		else if (mobSpeed < .5) mobSpeed = .5
		// console.info('mobSpeed', mobSpeed)
		return mobs[i].speed * mobSpeed
	}
	function isAlive(i) {
		return i >= 0 && i < mob.max && mobs[i].name && mobs[i].hp > 0
	}
	function animateHit(i, bypass, damage) {
		if (ng.view !== 'battle' || mobs[i].isDead) return
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

	function attack(i) {
		timers.mobAttack[i].kill()
		if (!mobs[i].name || mobs[i].isDead) return

		if (party.presence[0].isLeader && party.isSomeoneAlive()) {
			// only party leader should trigger attacks
			mobSkills.decideSkill(i, getMobTargetRow(i))
		}
		// keep it going for all in case some else takes over leader
		timers.mobAttack[i] = delayedCall(getMobAttackSpeed(i), mob.attack, [i])
		//////////////////////////////////////////////////
		function getMobTargetRow(slot) {
			mostHatedRow = []
			mostHatedValue = null
			for (row in mobs[slot].hate) {
				row *= 1
				val = mobs[slot].hate[row]
				index = party.getIndexByRow(row)
				// console.info(row, index, val)
				if (typeof party.presence[index] === 'object' &&
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
	}
	function animateAttack(i, row, isSecondary = false) {
		if (mobs[i].isDead) return
		let tgt = party.presence.findIndex(p => p.row === row)
		if (tgt > -1) setMobTarget(i, tgt, row)
		setTimeScaleSpeed(i)
		if (party.isSomeoneAlive()) {
			mobs[i].animation.pause()
			mobs[i].isAnimationActive = true
			// var attackType = isSecondary ? 'secondary' : 'primary'
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
	function setMobTarget(i, tgt, row) {
		mobs[i].target = row
		el = querySelector('#mob-target-avatar-' + i)
		el.src = party.presence[tgt].avatar
		el.style.background = party.color[tgt]
	}

	function animateSpecial(i) {
		if (mobs[i].isDead) return
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
	function animateDeath(i) {
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
			startAt: { frame: frame.death.start },
			overwrite: 1,
			frame: frame.death.end,
			ease: Linear.easeNone,
			onUpdate: setSrc,
			onUpdateParams: [mobs[i].index],
		})
		setTimeScaleSpeed(i)
		var filter = new PIXI.filters.ColorMatrixFilter()
		filter.sepia()
		TweenMax.to(mobs[i].sprite, 3, {
			startAt: {
				alpha: 1,
				pixi: {
					saturate: 4,
					brightness: 2,
				}
			},
			pixi: {
				colorMatrixFilter: filter,
				saturate: 1,
				contrast: 2,
				brightness: .2,
			},
			ease: Power2.easeIn
		})
		TweenMax.to(querySelector('#mob-details-' + i), speed / 2, { opacity: 0 })
		hpKillVal = stats.hpKill()
		if (hpKillVal) {
			combat.updateMyResource(PROP.HP, hpKillVal)
		}
		mpKillVal = stats.mpKill()
		if (mpKillVal) {
			combat.updateMyResource(PROP.MP, mpKillVal)
		}
		spKillVal = stats.spKill()
		if (spKillVal) {
			combat.updateMyResource(PROP.SP, spKillVal)
		}
		mob.earnedGold += battle.addGold(mobs[i].gold)
		// earn mob exp -
		mob.earnedExp += battle.addExp(mob.getMobExp(i))
	}

	function resourceTick() {
		// TODO: Does this create too much network strain? maybe not?
		if (mob.enableMobHeartbeat && my.isLeader) {
			tickData = []
			mobs.forEach(processMobResourceTick)
			if (tickData.length) {
				socket.publish('party' + my.partyId, {
					route: 'p->mobTick',
					d: tickData
				})
			}
		}
		//////////////////////////////
		function processMobResourceTick(m, index) {
			if (mob.isAlive(index) &&
				timers.mobEffects[index].freezeDuration === 0 &&
				!isPoisoned(index)) {
				// hp
				hpTick = m.level
				if (m.hp + hpTick > m.hpMax) {
					hpTick = m.hpMax - m.hp
				}
				// console.info('sending hpTick:', hpTick)
				tickData.push({
					i: index,
					h: hpTick,
				})
			}
		}
	}
	function rxMobResourceTick(data) {
		data.d.forEach(getMobRegen)
		//////////////////
		function getMobRegen(tick) {
			mobs[tick.i].hp += tick.h
			drawMobBar(tick.i)
		}
	}
	function isParalyzed(index) {
		return timers.mobEffects[index].paralyzeDuration > 0
	}
	function isFeared(index) {
		return timers.mobEffects[index].fearDuration > 0
	}
	function isPoisoned(index) {
		return !!(
			mobs[index].buffFlags.engulfingDarkness ||
			mobs[index].buffFlags.toxicSpores ||
			mobs[index].buffFlags.subversion ||
			mobs[index].buffFlags.primordialSludge ||
			mobs[index].buffFlags.euphonicDirge ||
			mobs[index].buffFlags.ravagingPlague ||
			mobs[index].buffFlags.widowStrike ||
			mobs[index].buffFlags.affliction
		)
	}
	function killAttacks(continueIdling) {
		mobs.forEach((m, i) => {
			timers.mobAttack[i].kill()
			!continueIdling && typeof mobs[i].animation === 'object' && mobs[i].animation.pause()

		})
	}
	function missChance(index) {
		chance = .2
		if (my.level > mobs[index].level) {
			chance += ((my.level - mobs[index].level) / 150)
		}
		else if (my.level < mobs[index].level) {
			chance -= ((mobs[index].level - my.level) / 25)
		}
		if (mobs[index].buffFlags.suppressingVolley) {
			chance += buffs.suppressingVolley.reduceHitRate[skill.RNG.getHighestSuppressingVolleyStack(index)]
		}
		if (mobs[index].buffFlags.sealOfDamnation) {
			chance += buffs.sealOfDamnation.reduceHitRate
		}
		if (chance > .5) chance = .5
		else if (chance < .05) chance = .05
		// console.info('missChance', level, chance)
		return chance
	}
	function dodgeChance(index) {
		chance = mobs[index].dodge
		// console.info('dodgeChance 1', chance)
		if (mobs[index].buffFlags.flashStrike) chance -= buffs.flashStrike.debuffDodge[skill.ROG.getHighestFlashPowder(index)]
		if (chance < 0) chance = 0
		// console.info('dodgeChance 2', chance)
		return chance
	}
	function parryChance(index) {
		chance = mobs[index].parry
		if (chance < 0) chance = 0
		return chance
	}
	function riposteChance(index) {
		chance = mobs[index].riposte
		if (chance < 0) chance = 0
		return chance
	}
	function getMobResist(d) {
		resist = mobs[d.index].resist[d.damageType]
		if (typeof resist === 'undefined') resist = 1
		else {
			// console.info('getMobResist b4', d.index, d.damageType, resist)
			if (d.damageType === DAMAGE_TYPE.BLOOD) {
				if (mobs[d.index].buffFlags.curseOfShadows) resist += buffs.curseOfShadows.reduceBloodResist
			}
			else if (d.damageType === DAMAGE_TYPE.POISON) {
				if (mobs[d.index].buffFlags.curseOfShadows) resist += buffs.curseOfShadows.reducePoisonResist
			}
			else if (d.damageType === DAMAGE_TYPE.ARCANE) {
				if (mobs[d.index].buffFlags.curseOfShadows) resist += buffs.curseOfShadows.reduceArcaneResist
				if (mobs[d.index].buffFlags.mindBlitzEffect) resist += buffs.mindBlitzEffect.reduceArcaneResist
			}
			else if (d.damageType === DAMAGE_TYPE.LIGHTNING) {
				if (mobs[d.index].buffFlags.staticStorm) resist += buffs.staticStorm.reduceLightningResist
				if (mobs[d.index].buffFlags.primevalWithering) resist += buffs.primevalWithering.reduceLightningResist
			}
			else if (d.damageType === DAMAGE_TYPE.FIRE) {
				if (mobs[d.index].buffFlags.primevalWithering) resist += buffs.primevalWithering.reduceFireResist
			}
			else if (d.damageType === DAMAGE_TYPE.ICE) {
				if (mobs[d.index].buffFlags.primevalWithering) resist += buffs.primevalWithering.reduceIceResist
			}
			if (mobs[d.index].buffFlags.righteousRhapsody) {
				resist += buffs.righteousRhapsody.reduceAllResists[skill.BRD.getMaxRighteousRhapsody(d.index)]
			}

			resistPenalty = 0
			if (mobs[d.index].level > my.level) {
				// 20% when 3 levels higher
				resistPenalty = Math.pow(mobs[d.index].level - my.level + 1, 2.16) / 100
			}
			resist -= resistPenalty

			if (resist < .25) resist = .25
			else if (resist > 2) resist = 2 // cannot lower resists beyond -100%
		}
		// console.info('getMobResist after', d.index, d.damageType, resist)
		return resist
	}
	function getMobTypesByZone(acc, m) {
		if (!acc.includes(m.img)) {
			acc.push(m.img)
		}
		return acc
	}

})(TweenMax, $, _, Object, Linear, PIXI, Sine, Power2);