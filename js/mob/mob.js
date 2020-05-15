var mob;
(function(TweenMax, $, _, Object, undefined) {
	mob = {
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
		resist: {
			blood: 0,
			poison: 0,
			arcane: 0,
			lightning: 0,
			fire: 0,
			ice: 0,
		}
	}
	//////////////////////////////////////////////////
	function getRandomMobKey() {
		var i = ~~(rand() * mob.imageKeysLen)
		return mob.imageKeys[i]
	}
	function configMobType(config) {
		return {
			...mobBaseConfig,
			..._.find(mob.data[zones[mission.id].name], config)
		}
	}
	function preProcessMobData(config) {
		const testHp = ng.isApp ? 25 : 99999
		config.hpMax = config.hp = testHp + ((config.level - 1) * 22.2) * config.hp
		config.mpMax = config.mp = 10 + ((config.level - 1) * 15) * config.mp
		config.spMax = config.sp = 10 + ((config.level - 1) * 15) * config.sp
	}
	function init() {
		mob.imageKeys = Object.keys(mobs.images);
		mob.imageKeysLen = mob.imageKeys.length;
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
			};
			['wrap',
			'center',
			'alive',
			'dead',
			'img',
			'details',
			'name',
			'shadow',
			'bar'].forEach(function(e){
				mobs[i].dom[e] = getElementById('mob-'+ e +'-' + i);
			});
		}
	}
	function setMob(i, mobConfig) {
		// TODO: modifyMobStatsByClass job based adjustments
		preProcessMobData(mobConfig)
		info('mobConfig', mobConfig)
		cache.preloadMob(mobConfig.img)
		// combine/assign image object props to mobs[index]
		mobs[i] = {
			...mobs[i],
			...mobs.images[mobConfig.img],
			...mobConfig,
		}
		// delete mobs[i].cache;
		sizeMob(i)
		TweenMax.set(mobs[i].dom.details, {
			opacity: 1
		})
		resetIdle(i, true)
		idle(i)
	}
	function sizeMob(index) {
		var m = mobs[index];
		if (!m.img) return;
		// set dom
		var w = ~~(m.size * (mobs.images[m.img].width));

		m.box = battle.getBox(m.index);
		// wrapper
		// name
		m.dom.name.innerHTML = m.name;
		m.dom.details.style.display = 'block';
		// img
		m.dom.img.style.left = (w * -.5) + 'px'
		m.dom.img.style.width = w + 'px'
		m.dom.img.style.bottom = (mobs.images[m.img].yFloor * m.size) + 'px'
		m.dom.img.src = 'mobs/' + m.img + '/1.png';
		// details
		TweenMax.set(m.dom.details, {
			y: 0,
			bottom: m.barAliveBottom * m.size
		})
		// health
		drawMobBar(index)
		// shadow
		m.dom.shadow.style.display = 'block';
		m.dom.shadow.style.width = ~~((m.shadowWidth * m.size) * 1.5) + 'px'
		m.dom.shadow.style.height = (m.shadowHeight * m.size) + 'px'
		// m.dom.shadow.style.left = ((m.shadowWidth * m.size ) * -.5) + 'px'
		m.dom.shadow.style.bottom = ((m.shadowBottom - (m.shadowHeight * .3))* m.size) + 'px';
		// test stuff below

		// center dot
		m.dom.center.style.left = (m.box.cx - 11) + 'px';
		m.dom.center.style.bottom = (m.box.cy - 11) + 'px';
		mob.setClickBox(m);
	}
	function drawMobBar(index) {
		percent = (100 - ((mobs[index].hp / mobs[index].hpMax) * 100)) * -1
		info('drawMobBar', index, percent)
		TweenMax.to('#mob-health-' + index, .15, {
			x: percent + '%'
		})
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
		info('hit', i)
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
			}
		})
		delayedCall(.1, deathCompleteFadeReset, [ mob, el ]);
	}
	function deathCompleteFadeReset(m, e) {
		m.isDead = false;
		m.isAnimationActive = false;
		e.style.filter = 'opacity(100%) brightness(100%)';
	}
	function modifyMobStatsByClass(mob) {
	if (mob.job === 'WAR') {
		mob.hp = ~~(mob.hp * 1.2);
		mob.mp = 0;
		mob.atk = ~~(mob.atk * 1.1);
		mob.skills = [
			'Furious Slam',
			'Pummel',
		];
	}
	else if (mob.job === 'CRU') {
		mob.hp = ~~(mob.hp * 1.1);
		mob.mp = 20;
		mob.atk = ~~(mob.atk * 1.1);
		mob.skills = [
			'Ardent Bash',
			'Holy Light',
			'Imbued Force',
			'Divine Barrier',
		];
	}
	else if (mob.job === 'SHD') {
		mob.hp = ~~(mob.hp * 1.2);
		mob.mp = 20;
		mob.atk = ~~(mob.atk * 1.1);
		mob.skills = [
			'Bash',
			'Engulfing Darkness',
			'Fear',
			'Venom Bolt',
		];
	}
	else if (mob.job === 'MNK') {
		mob.mp = 0;
		mob.atk = ~~(mob.atk * 1.15);
		mob.skills = [
			'Shadow Kick',
			'Dragon Punch',
		];
	}
	else if (mob.job === 'ROG') {
		mob.mp = 0;
		mob.atk = ~~(mob.atk * 1.15);
		mob.skills = [
			'Backstab',
			'Widow Strike'
		];
	}
	else if (mob.job === 'RNG') {
		mob.mp = 20;
		mob.atk = ~~(mob.atk * 1.15);
		mob.skills = [
			'Light Healing',
			'Faerie Flame',
			'Ignite',
			'Charged Bolts',
		];
	}
	else if (mob.job === 'BRD') {
		mob.mp = 0;
		mob.atk = ~~(mob.atk * 1.05);
		// cannot dispel bard songs
		mob.skills = [
			'Psalm of Flames', // damage shield, FR boost
			'Psalm of Frost', // damage shield, CR boost
			'Elemental Rhythms', // LR, FR, CR
			'Guardian Rhythms', // BR, PR, AR
			'Chant of Battle', // damage shield, FR boost
			'Hymn of Shielding', // % physical damage reduction
			'Hymn of Soothing', // regen hp, mp
		];
	}
	else if (mob.job === 'DRU') {
		mob.mp = 40;
		mob.skills = [
			'Regrowth',
			'Lightning Blast',
			'Starfire',
			'Drifting Death',
		];
	}
	else if (mob.job === 'CLR') {
		mob.mp = 40;
		mob.skills = [
			'Holy Light',
			'Smite',
			'Imbued Force'
		];
	}
	else if (mob.job === 'SHM') {
		mob.mp = 40;
		mob.atk = ~~(mob.atk * 1.05);
		mob.skills = [
			'Rekindle',
			'Static Shock',
			'Frost Shock',
			'Envenom',
			'Slumber',
		];
	}
	else if (mob.job === 'NEC') {
		mob.hp = ~~(mob.hp * .9);
		mob.mp = 50;
		mob.skills = [
			'Blood Boil',
			'Engulfing Darkness',
			'Fear',
			'Venom Bolt',
		];
	}
	else if (mob.job === 'ENC') {
		mob.hp = ~~(mob.hp * .9);
		mob.mp = 50;
		mob.skills = [
			'Gravity Flux',
			'Runic Shield',
			'Alacrity',
			'Fiery Enchant',
			'Glacial Enchant',
		];
	}
	else if (mob.job === 'SUM') {
		mob.hp = ~~(mob.hp * .9);
		mob.mp = 50;
		mob.skills = [
			'Lava Bolt',
			'Frozen Orb',
			'Psionic Storm',
		];
	}
	else if (mob.job === 'WIZ') {
		mob.hp = ~~(mob.hp * .9);
		mob.mp = 50;
		mob.skills = [
			'Ice Bolt',
			'Arcane Missiles',
			'Lightning Strike',
			'Glacial Spike',
		];
	}
}
	function resourceTick() {
		mobs.forEach((mob, index) => {
			if (mob.name) {
				mobs[index].hp += mob.level
				if (mob.hp > mob.hpMax) mobs[index].hp = mob.hpMax
				mobs[index].mp += 1
				if (mobs[index].mp > mob.mpMax) mobs[index].mp = mob.mpMax
				mobs[index].sp += 1
				if (mobs[index].sp > mob.spMax) mobs[index].sp = mobs[index].spMax
				drawMobBar(index)
			}
		})
	}

})(TweenMax, $, _, Object);