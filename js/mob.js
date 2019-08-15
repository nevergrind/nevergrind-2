var mob;
(function() {
	mob = {
		test: 0, // used to enable test mode to show all animations looping
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
		resetIdle,
		idle,
		hit,
		attack,
		special,
		death,
		blur,
		brightness,
		contrast,
		grayscale,
		invert,
		saturate,
		sepia,
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
		mob.imageKeys = _.keys(mobs.images);
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
				mobs[i].dom[e] = getById('mob-'+ e +'-' + i);
			});
		}
	}
	function setMob(i, mobKey) {
		// m.size = m.size;
		mobs[i].type = mobKey;
		// combine/assign image object props to mobs[index]
		mobs[i] = Object.assign(mobs[i], mobs.images[mobKey]);
		// delete mobs[i].cache;
		sizeMob(i);
		mob.resetIdle(i);
		mob.idle(i);
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
			bottom: m.barAliveBottom * m.size
		});
		// shadow
		m.dom.shadow.style.display = 'block';
		m.dom.shadow.style.width = ~~((m.shadowWidth * m.size) * 1.5) + 'px';
		m.dom.shadow.style.height = (m.shadowHeight * m.size) + 'px';
		m.dom.shadow.style.left = ((m.shadowWidth * m.size ) * -.5) + 'px';
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
		mobs[i].frame = ~~mobs[i].frame;
		if (mobs[i].frame !== mobs[i].lastFrame) {
			mobs[i].dom.img.src = 'mobs/' + mobs[i].type + '/' + mobs[i].frame + '.png';
			mobs[i].lastFrame = mobs[i].frame;
		}
	}
	function resetIdle(i) {
		mobs[i].animationActive = 0;
		mob.idle(mobs[i].index, 1);
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
		});
		if (skip) return;
		mob.test && TweenMax.delayedCall(.25, mob.hit, [ mobs[i].index ]);
	}
	function hit(i) {
		if (mobs[i].animationActive) return;
		mobs[i].animationActive = 1;

		TweenMax.to(mobs[i], mobs[i].speed * frame.hit.diff, {
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
		mob.resetIdle(m.index);
		if (mob.test){
			TweenMax.delayedCall(.5, mob.attack, [ m.index, 'primary' ]);
		}
	}
	function attack(i, force) {
		if (mobs[i].animationActive) return;
		mobs[i].animationActive = 1;
		var attackType = force === 'primary' || force === 'secondary' ?
			force : (Math.round(rand()) ? 'primary' : 'secondary');
		if (!mobs[i].enableSecondary) {
			attackType = 'primary';
		}

		TweenMax.to(mobs[i], mobs[i].speed * frame[attackType].diff, {
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
		});
	}
	function attackComplete(m, force) {
		mob.resetIdle(m.index);
		if (mob.test){
			if (force === 'primary'){
				TweenMax.delayedCall(.5, mob.attack, [ m.index, 'secondary' ]);
			}
			else if (force === 'death'){
				TweenMax.delayedCall(.5, mob.death, [ m.index ]);
			}
			else {
				TweenMax.delayedCall(.5, mob.special, [ m.index ]);
			}
		}
	}
	function special(i) {
		if (mobs[i].animationActive) return;
		if (!mobs[i].enableSpecial) {
			mob.attack(mobs[i].index, 'death');
		}
		else {
			mobs[i].animationActive = 1;

			TweenMax.to(mobs[i], mobs[i].speed * frame.special.diff, {
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
			});
		}
	}
	function specialComplete(m) {
		mob.resetIdle(m.index);
		if (mob.test) {
			TweenMax.delayedCall(.5, mob.death, [ m.index ]);
		}
	}
	function death(i) {
		if (mobs[i].deathState) return;
		mobs[i].deathState = 1;
		mobs[i].hp = 0;
		mob.setClickBox(mobs[i]);
		mobs[i].animationActive = 1;
		var d = mobs[i].speed * frame.death.diff;

		TweenMax.to(mobs[i].dom.details, d, {
			bottom: mobs[i].barDeathBottom * mobs[i].size,
			ease: Quart.easeIn
		});
		TweenMax.to(mobs[i], d, {
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
	}
	function deathComplete(m) {
		var filters = {
				opacity: 'opacity(100%)',
				brightness: "brightness(100%)"
			};
		var e = m.dom.wrap;

		var tl = new TimelineMax({
			onUpdate: function () {
				test.filters.death(e, filters);
			}
		});
		tl.to(filters, 2, {
			opacity: 'opacity(0%)',
			brightness: "brightness(0%)",
			ease: Linear.easeIn,
			onComplete: deathCompleteFade,
			onCompleteParams: [m, e]
		});
	}
	function deathCompleteFade(m, e) {
		if (mob.test) {
			m.hp = 1;
			sizeMob(m.index);
			mob.idle(m.index);
		}
		TweenMax.delayedCall(.1, deathCompleteFadeReset, [ m, e ]);
	}
	function deathCompleteFadeReset(m, e) {
		m.deathState = 0;
		m.animationActive = 0;
		e.style.filter = 'opacity(100%) brightness(100%)';
	}
	function blur() {
		var e = getById('sprite'),
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
		var e = getById('sprite'),
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
		var e = getById('sprite'),
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
		var e = getById('sprite'),
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
		var e = getById('sprite'),
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
		var e = getById('sprite'),
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
		var e = getById('sprite'),
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

})();