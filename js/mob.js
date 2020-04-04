var mob;
(function() {
	mob = {
		imageKeysLen: 0,
		index: 0,
		cache: {},
		imageKeys: [],
		initialized: 0,
		max: 9,
		element: {},
		animationActive: 0,
		frame: 1,
		deathState: 0,
		getRandomMobKey,
		init,
		// configs, resets (active animations) and idles mobs in one call for start of combat
		setMob,
		// size only
		sizeMob,
		setClickBox,
		blur,
		brightness,
		contrast,
		grayscale,
		invert,
		saturate,
		sepia,
		modifyMobStatsByClass,
	};
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
	//////////////////////////////////////////////////
	function getRandomMobKey() {
		var i = ~~(rand() * mob.imageKeysLen);
		return mob.imageKeys[i];
	}
	function init() {
		mob.imageKeys = Object.keys(mobs.images);
		mob.imageKeysLen = mob.imageKeys.length;
		battle.show();
		// init mob/dom connections
		for (var i=0; i<mob.max; i++){
			mobs[i] = {
				hp: 1,
				index: i,
				frame: 0,
				lastFrame: 0,
				animationActive: 0,
				size: i < 5 ? 1 : .85,
				deathState: 0,
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
	function setMob(i, mobKey) {
		// m.size = m.size;
		mobs[i].type = mobKey
		// combine/assign image object props to mobs[index]
		mobs[i] = _.assign(mobs[i], mobs.images[mobKey])
		// delete mobs[i].cache;
		sizeMob(i)
		TweenMax.set(mobs[i].dom.details, {
			opacity: 1
		})
		resetIdle(i)
		idle(i)
	}
	function sizeMob(index) {
		var m = mobs[index];
		if (!m.type) return;
		// set dom
		var w = ~~(m.size * (mobs.images[m.type].width));

		m.box = battle.getBox(m.index);
		// wrapper
		// name
		m.dom.name.innerHTML = m.type.replace(/-/g, ' ');
		//m.dom.name.innerHTML = 'Miranda Bear';
		m.dom.details.style.display = 'block';
		// img
		m.dom.img.style.left = (w * -.5) + 'px';
		m.dom.img.style.width = w + 'px';
		m.dom.img.style.bottom = (mobs.images[m.type].yFloor * m.size) + 'px';
		m.dom.img.src = 'mobs/' + m.type + '/1.png';
		// details
		TweenMax.set(m.dom.details, {
			y: 0,
			bottom: m.barAliveBottom * m.size
		});
		// shadow
		m.dom.shadow.style.display = 'block';
		m.dom.shadow.style.width = ~~((m.shadowWidth * m.size) * 1.5) + 'px';
		m.dom.shadow.style.height = (m.shadowHeight * m.size) + 'px';
		// m.dom.shadow.style.left = ((m.shadowWidth * m.size ) * -.5) + 'px';
		m.dom.shadow.style.bottom = ((m.shadowBottom - (m.shadowHeight * .3))* m.size) + 'px';
		// test stuff below
		// center dot
		m.dom.center.style.left = (m.box.cx - 11) + 'px';
		m.dom.center.style.bottom = (m.box.cy - 11) + 'px';
		mob.setClickBox(m);
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
			mobs[i].dom.img.src = 'mobs/' + mobs[i].type + '/' + mobs[i].frame + '.png'
			mobs[i].lastFrame = mobs[i].frame
		}
	}

	function resetIdle(i) {
		mobs[i].animationActive = 0
		idle(mobs[i].index, 1)
	}

	function idle(i, skip) {
		TweenMax.to(mobs[i], mobs[i].speed * frame.idle.diff * 2, {
			startAt: {
				frame: frame.idle.start
			},
			frame: frame.idle.end,
			yoyo: true,
			repeat: -1,
			repeatDelay: mobs[i].speed,
			ease: Sine.easeOut,
			onUpdate: setSrc,
			onUpdateParams: [mobs[i].index],
		})
		if (skip) return
		ng.test && delayedCall(.25, hit, [ mobs[i].index ])
	}

	function hit(i) {
		if (mobs[i].animationActive) return;
		mobs[i].animationActive = 1;
		var speed = mobs[i].speed * frame.hit.diff

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
		if (ng.test){
			delayedCall(1, attack, [ m.index, 'primary' ]);
		}
	}

	function attack(i, force) {
		if (mobs[i].animationActive) return
		mobs[i].animationActive = 1
		var attackType = force === 'primary' || force === 'secondary' ?
			force : (_.round(rand()) ? 'primary' : 'secondary')
		var speed = mobs[i].speed * frame[attackType].diff;
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
		if (ng.test){
			if (force === 'primary'){
				delayedCall(1, attack, [ m.index, 'secondary' ])
			}
			else if (force === 'death'){
				delayedCall(1, death, [ m.index ])
			}
			else {
				delayedCall(1, special, [ m.index ])
			}
		}
	}

	function special(i) {
		if (mobs[i].animationActive) return
		if (!mobs[i].enableSpecial) {
			attack(mobs[i].index, 'death')
		}
		else {
			mobs[i].animationActive = 1
			var speed = mobs[i].speed * frame.special.diff

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
		if (ng.test) {
			delayedCall(1, death, [ m.index ])
		}
	}
	function death(i) {
		if (mobs[i].deathState) return
		mobs[i].deathState = 1
		mobs[i].hp = 0
		mob.setClickBox(mobs[i])
		mobs[i].animationActive = 1
		var speed = mobs[i].speed * frame.death.diff

		TweenMax.to(mobs[i].dom.details, speed, {
			y: mobs[i].barDeathBottom * mobs[i].size,
			ease: Quart.easeIn
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
			onComplete: deathComplete,
			onCompleteParams: [mobs[i]]
		});
		TweenMax.to(mobs[i].dom.details, speed / 2, {
			opacity: 0
		})
	}
	function deathComplete(m) {
		var filters = {
			opacity: 'opacity(100%)',
			brightness: "brightness(100%)"
		}
		var e = m.dom.wrap

		var tl = new TimelineMax({
			onUpdate: function () {
				test.filters.death(e, filters);
			}
		})
		tl.to(filters, 2, {
			opacity: 'opacity(0%)',
			brightness: "brightness(0%)",
			ease: Linear.easeIn,
			onComplete: deathCompleteFade,
			onCompleteParams: [m, e]
		})
	}
	function deathCompleteFade(m, e) {
		if (ng.test) {
			m.hp = 1;
			TweenMax.set(mobs[m.index].dom.details, {
				opacity: 1
			})
			sizeMob(m.index);
			idle(m.index);
		}
		delayedCall(.1, deathCompleteFadeReset, [ m, e ]);
	}
	function deathCompleteFadeReset(m, e) {
		m.deathState = 0;
		m.animationActive = 0;
		e.style.filter = 'opacity(100%) brightness(100%)';
	}
	function blur() {
		var e = getElementById('sprite'),
			type = 'blur',
			filters = {
				blur: type + '(0px)'
			};

		TweenMax.to(filters, 1.5, {
			blur: type + '(5px)',
			yoyo: true,
			repeat: -1,
			onUpdate: mob.filters.effect,
			onUpdateParams: [e, filters, type]
		});
	}
	function brightness() {
		var e = getElementById('sprite'),
			type = 'brightness',
			filters = {
				brightness: type + '(0%)'
			};

		TweenMax.to(filters, 1.5, {
			brightness: type + '(100%)',
			yoyo: true,
			repeat: -1,
			onUpdate: mob.filters.effect,
			onUpdateParams: [e, filters, type]
		});
	}
	function contrast() {
		var e = getElementById('sprite'),
			type = 'contrast',
			filters = {
				contrast: type + '(0%)'
			};

		TweenMax.to(filters, 1.5, {
			contrast: type + '(200%)',
			yoyo: true,
			repeat: -1,
			onUpdate: mob.filters.effect,
			onUpdateParams: [e, filters, type]
		});
	}
	function grayscale() {
		var e = getElementById('sprite'),
			type = 'grayscale',
			filters = {
				grayscale: type + '(0%)'
			};

		TweenMax.to(filters, 1.5, {
			grayscale: type + '(100%)',
			yoyo: true,
			repeat: -1,
			onUpdate: mob.filters.effect,
			onUpdateParams: [e, filters, type]
		});
	}
	function invert() {
		var e = getElementById('sprite'),
			type = 'invert',
			filters = {
				invert: type + '(0%)'
			};

		TweenMax.to(filters, 1.5, {
			invert: type + '(400%)',
			yoyo: true,
			repeat: -1,
			onUpdate: mob.filters.effect,
			onUpdateParams: [e, filters, type]
		});
	}
	function saturate() {
		var e = getElementById('sprite'),
			type = 'saturate',
			filters = {
				saturate: type + '(0%)'
			};

		TweenMax.to(filters, 1.5, {
			saturate: type + '(500%)',
			yoyo: true,
			repeat: -1,
			onUpdate: mob.filters.effect,
			onUpdateParams: [e, filters, type]
		});
	}
	function sepia() {
		var e = getElementById('sprite'),
			type = 'sepia',
			filters = {
				sepia: type + '(0%)'
			};

		TweenMax.to(filters, 1.5, {
			sepia: type + '(100%)',
			yoyo: true,
			repeat: -1,
			onUpdate: mob.filters.effect,
			onUpdateParams: [e, filters, type]
		});
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
		else if (mob.job === 'PAL') {
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

})();