var ask;
!function($, _, TweenMax, Power0, Power1, Power2, Power3, Power4, undefined) {
	ask = {
		askId: 0,
		castingTweens: [],
		castingImgIds: [],
		getImg,
		getNova,
		addChild,
		removeImg,
		removeDungeonImg,
		removeBattleImg,
		sizeOffset,
		bottomY,
		centerY,
		shadowY,
		autoAttack,
		processAnimations,
		// base effects:
		/**
		 * h2h, 1hs, 2hs, 1hb, 2hb, pierce
		*/
		// skill effects:
		explosion, // single frame outward from center
		nova, // frame outward (ground and center) can rotate
		slash, // auto slash single frame
		pierce, // horizontal slash single frame
		castConjuration,
		castAlteration,
		castEvocation,
		lightColumn,
		// buffCircle
		// buffRunes (3 circles that rotate opposite directions)
		// buffDoneImage (rotate, layer other images on it)
		killCastingTweens,
		getCastingKey,
	}
	let val, el
	const fadeIn = {
		startAt: { alpha: 0 },
		alpha: 1
	}
	const fadeOut = {
		startAt: { alpha: 1 },
		alpha: 0
	}
	const explosionDefaults = {
		targetMob: true,
		sizeStart: 80,
		sizeEnd: 400,
		duration: .8,
		contrastStart: 1.5,
		brightnessStart: 1.5,
		rotation: 0,
		contrastEnd: 1,
		brightnessEnd: 1,
		ease: Power4.easeOut,
	}
	const novaDefaults = {
		targetMob: true,
		position: 'bottom',
		loops: 5,
		interval: .033,
		duration: 1,
		contrastStart: 2,
		brightnessStart: 2,
		contrastEnd: 1,
		brightnessEnd: 1,
		width: 'auto',
		rotation: 0,
		zIndex: 30,
		ease: Power4.easeOut,
	}
	const slashDefaults = {
		isPrimary: true,
		size: 200,
		yAdjust: 0,
		duration: .2,
		easeStart: Power2.easeIn,
		easeEnd: Power2.easeOut,
	}
	const pierceDefaults = {
		isPrimary: true,
		size: 200,
		duration: .2,
		easeStart: Power2.easeIn,
		easeEnd: Power2.easeOut,
	}
	const castConjurationDefaults = {
		isPrimary: true,
		sizeStart: 250,
		sizeEnd: 200,
		rotation: 360,
		duration: .5,
		removeDelay: 0,
		ease: Power0.easeOut,
	}
	const castAlterationDefaults = {
		isPrimary: true,
		sizeStart: 300,
		sizeEnd: 200,
		duration: .5,
		removeDelay: 0,
		interval: .1,
		ease: Power0.easeOut,
	}
	const castEvocationDefaults = {
		interval: .1,
		size: 300,
		duration: .5,
		ease: Back.easeInOut,
	}
	const lightColumnDefaults = {
		isPrimary: true,
		loops: 10,
		interval: .1,
		size: 300,
		duration: 1,
		ease: Power2.easeOut,
	}
	///////////////////////////////////////////
	function lightColumn(o, config = {}) {
		config = {
			...lightColumnDefaults,
			...config
		}
		const img = ask.getImg(o)
		ask.addChild(img)
	}
	function killCastingTweens() {
		ask.castingTweens.forEach(t => {
			t.kill()
		})
		ask.castingImgIds.forEach(t => {
			ask.removeImg()(t)
		})
		ask.castingTweens = []
		ask.castingImgIds = []
	}

	function castEvocation(o, config = {}) {
		let rotation = 0
		config = {
			...castEvocationDefaults,
			...config
		}
		ask.castingTweens.push(TweenMax.to(EmptyObject, config.interval, {
			repeat: -1,
			onRepeat: drawEvocationLines,
		}))
		//////////////////////////////////////
		function drawEvocationLines() {
			const img = ask.getImg(o, { targetMob: false })
			ask.castingImgIds.push(img.id)
			img.width = config.size
			img.height = config.size
			TweenMax.set(img, {
				pixi: { contrast: 1.15, brightness: 1.15 }
			})
			img.rotation = util.rotation(rotation)
			ask.addChild(img)
			rotation += 30
			ask.castingTweens.push(TweenMax.to(img, config.duration, {
				pixi: { contrast: 0, brightness: 1 },
				width: 0,
				height: 0,
				ease: config.ease,
				onComplete: ask.removeImg(),
				onCompleteParams: [img.id]
			}))
		}
	}
	function castAlteration(o, config) {
		ask.killCastingTweens()
		config = {
			...castAlterationDefaults,
			...config
		}
		// rotate1
		const img = ask.getImg(o, { targetMob: false })
		ask.castingImgIds.push(img.id)
		img.width = config.sizeStart
		img.height = config.sizeStart
		ask.addChild(img)
		ask.castingTweens.push(TweenMax.to(img, config.duration, {
			pixi: { contrast: 2, brightness: 2, },
			width: config.sizeEnd,
			height: config.sizeEnd,
			yoyo: true,
			repeat: -1,
			ease: config.ease,
		}))
		ask.castingTweens.push(TweenMax.to(img, config.duration, {
			rotation: util.rotation(360),
			repeat: -1,
			ease: config.ease,
		}))

		ask.castingTweens.push(TweenMax.to(EmptyObject, config.interval, {
			repeat: -1,
			onRepeat: drawAlterationLines,
		}))
		let rotation = 0
		//////////////////////////////////////
		function drawAlterationLines() {
			const z = ask.getImg(o, { targetMob: false })
			ask.castingImgIds.push(z.id)
			TweenMax.set(z, {
				pixi: {
					contrast: img._gsColorMatrixFilter.brightness,
					brightness: img._gsColorMatrixFilter.brightness
				},
				width: img._width,
				height: img._width,
			})
			z.rotation = util.rotation(rotation)
			ask.addChild(z)
			rotation += 30
			ask.castingTweens.push(TweenMax.to(z, config.duration, {
				pixi: { contrast: 0, brightness: 0 },
				width: 0,
				height: 0,
				onComplete: ask.removeImg(),
				onCompleteParams: [z.id]
			}))
		}
	}
	function castConjuration(o, config) {
		ask.killCastingTweens()
		config = {
			...castConjurationDefaults,
			...config
		}
		const img = ask.getImg(o, { targetMob: false })
		ask.castingImgIds.push(img.id)
		img.width = config.sizeStart
		img.height = config.sizeStart
		ask.addChild(img)
		ask.castingTweens.push(TweenMax.to(img, config.duration, {
			pixi: { contrast: 2, brightness: 2, },
			width: config.sizeEnd,
			height: config.sizeEnd,
			rotation: util.rotation(config.rotation),
			repeat: -1,
			yoyo: true,
			ease: config.ease,
		}))
		// img 2
		const img2 = ask.getImg(o, {
			targetMob: false
		})
		ask.castingImgIds.push(img2.id)
		img2.width = config.sizeStart
		img2.height = config.sizeStart
		TweenMax.set(img2, {
			pixi: { contrast: 2, brightness: 2, },
		})
		ask.addChild(img2)
		ask.castingTweens.push(TweenMax.to(img2, config.duration, {
			pixi: { contrast: 1, brightness: 1, },
			width: config.sizeEnd,
			height: config.sizeEnd,
			rotation: util.rotation(-config.rotation),
			repeat: -1,
			yoyo: true,
			ease: config.ease,
		}))
		TweenMax.to([img, img2], spell.data.castTime * .2, {
			startAt: { alpha: 0 },
			alpha: 1,
			ease: Power0.easeIn
		})

		ask.castingTweens.push(TweenMax.to(EmptyObject, .1, {
			repeat: -1,
			onRepeat: drawConjurationLines,
		}))
		//////////////////////////////////////
		function drawConjurationLines() {
			const z = ask.getImg(o, { targetMob: false })
			ask.castingImgIds.push(z.id)
			TweenMax.set(z, {
				pixi: {
					contrast: img._gsColorMatrixFilter.brightness,
					brightness: img._gsColorMatrixFilter.brightness
				},
				alpha: .1,
				width: img._width,
				height: img._height,
				zIndex: img._zIndex - 1
			})
			ask.addChild(z)
			ask.castingTweens.push(TweenMax.to(z, config.duration, {
				width: img._width * 1.5,
				height: img._height * 1.5,
				alpha: 0,
				rotation: util.rotation(Math.random() > .5 ? config.rotation : -config.rotation),
				ease: config.ease,
				onComplete: ask.removeImg(),
				onCompleteParams: [z.id]
			}))
		}
	}
	function pierce(o, config) {
		config = {
			...pierceDefaults,
			...config
		}
		const img = ask.getImg(o)
		ask.addChild(img)
		img.width = 0
		img.height = 0
		if (config.isPrimary) setPrimaryStart()
		else setSecondaryStart()
		TweenMax.to(img, config.duration, {
			width: config.size,
			height: config.size,
			ease: config.easeStart,
			onComplete: finishPierce
		})
		//////////////////////////////
		function finishPierce() {
			if (config.isPrimary) setPrimaryMid()
			else setSecondaryMid()
			TweenMax.to(img, config.duration, {
				width: 0,
				height: 0,
				ease: config.easeEnd,
				onComplete: ask.removeImg(),
				onCompleteParams: [ img.id ]
			})
		}
		function setPrimaryStart() {
			img.anchor.set(1, .5)
			img.x += config.size * .5
		}
		function setPrimaryMid() {
			img.anchor.set(0, .5)
			img.x -= config.size
		}
		function setSecondaryStart() {
			img.anchor.set(0, .5)
			img.x -= config.size
		}
		function setSecondaryMid() {
			img.anchor.set(1, .5)
			img.x += config.size
		}
	}
	function slash(o, config) {
		config = {
			...slashDefaults,
			...config
		}
		const img = ask.getImg(o)
		ask.addChild(img)
		img.width = 0
		img.height = 0
		if (config.isPrimary) {
			img.anchor.set(1, 0)
			img.x += config.size * .5
			img.y -= config.size * .5 - config.yAdjust
		}
		else {
			img.anchor.set(0, 0)
			img.x -= config.size * .5
			img.y -= config.size * .5 + config.yAdjust
		}
		TweenMax.to(img, config.duration, {
			width: config.size,
			height: config.size,
			ease: config.easeStart,
			onComplete: finishSlash
		})
		/////////////////////////////
		function finishSlash() {
			if (config.isPrimary) {
				img.anchor.set(0, 1)
				img.x -= config.size
				img.y += config.size
			}
			else {
				img.anchor.set(1, 1)
				img.x += config.size
				img.y += config.size
			}
			TweenMax.to(img, config.duration, {
				width: 0,
				height: 0,
				ease: config.easeEnd,
				onComplete: ask.removeImg(),
				onCompleteParams: [ img.id ]
			})
		}
	}
	function nova(o, config = {}) {
		config = {
			...novaDefaults,
			...config
		}
		for (var i=0; i<config.loops; i++) {
			!function(i) {
				delayedCall(config.interval * i, novaExplode, [o, config])
			}(i)
		}
	}
	function novaExplode(o, config) {
		const img = ask.getNova(o, config)
		ask.addChild(img)
		TweenMax.to(img, config.duration, {
			startAt: { pixi: {
					contrast: config.contrastStart,
					brightness: config.brightnessStart,
				},
				rotation: config.rotation,
				width: 0,
				height: 0,
				alpha: 1,
			},
			pixi: {
				contrast: config.contrastEnd,
				brightness: config.brightnessEnd,
			},
			alpha: 0,
			width: config.width === 'auto' ? mobs[o.index].width : config.width,
			height: mobs[o.index].width * .15,
			ease: config.ease,
			onComplete: ask.removeImg(),
			onCompleteParams: [ img.id ]
		})
	}
	function explosion(o, config = {}) {
		config = {
			...explosionDefaults,
			...config
		}
		const img = ask.getImg(o, config)
		ask.addChild(img)
		img.width = config.sizeStart
		img.height = config.sizeStart

		TweenMax.to(img, config.duration, {
			startAt: { pixi: {
				contrast: config.contrastStart,
				brightness: config.brightnessStart,
			}},
			rotation: util.rotation(config.rotation),
			width: config.sizeEnd,
			height: config.sizeEnd,
			alpha: 0,
			pixi: {
				contrast: config.contrastEnd,
				brightness: config.brightnessEnd,
			},
			ease: config.ease,
			onComplete: ask.removeImg(),
			onCompleteParams: [ img.id ]
		})
	}
	function addChild(img) {
		if (ng.view === 'battle') {
			battle.layer.stage.addChild(img)
		}
		else {
			dungeon.layer.stage.addChild(img)
		}
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
	function bottomY(index) {
		return MaxHeight
			- mob.bottomY[index]
			+ (mobs.images[mobs[index].img].yPadding * mobs[index].size)
			+ ask.sizeOffset(mobs[index].size)
	}
	function shadowY(index) {
		// cringe bottom % from CSS
		return index <= 4
			? MaxHeight - (MaxHeight * .2037) - (mobs[index].shadowHeight * .5)
			: MaxHeight - (MaxHeight * .2963) - (mobs[index].shadowHeight * .5)
	}
	function centerY(index) {
		return ask.bottomY(index) - (mobs[index].clickAliveH * mobs[index].size)
	}
	function getImg(o, config = { targetMob: true }) {
		const img = PIXI.Sprite.from(`images/ask/${o.key}.png`)
		img.id = 'ask-' + ask.askId++
		img.anchor.set(.5)
		if (config.targetMob) {
			img.x = mob.centerX[o.index]
			img.y = ask.centerY(o.index)
		}
		else {
			positionToPlayer(o, img)
		}
		img.zIndex = config.zIndex || 200
		return img
	}
	// image @ feet of target (or center!)
	function getNova(o, config = { targetMob: true }) {
		const img = PIXI.Sprite.from(`images/ask/${o.key}.png`)
		img.id = 'ask-' + ask.askId++
		img.anchor.set(.5)
		// bottom center of mob's feet
		if (config.targetMob) {
			img.x = mob.centerX[o.index]
			if (config.position === 'bottom') img.y = ask.shadowY(o.index)
			else {
				// if not on ground (behind) this will need a zIndex so it appears in front
				img.y = ask.centerY(o.index)
			}
		}
		else {
			positionToPlayer(o, img)
		}
		img.zIndex = config.zIndex
		return img
	}
	function positionToPlayer(o, img) {
		img.x = 960
		img.y = 850
	}
	function autoAttack(o) {
		const isPrimary = !o.key.includes('Secondary')
		// scale animations
		const img = ask.getImg(o)
		img.width = 0
		img.height = 0

		ask.addChild(img)
		if (o.key.includes('Hand-to-hand')) {
			img.x = mob.centerX[o.index] + _.random(-50, 50)
			img.y = ask.centerY(o.index) + _.random(-50, 50)
			autoAttackPunch(img)
		}
		else {
			img.y = ask.centerY(o.index) + _.random(-25, 50)
			if (o.key.includes('Piercing')) autoAttackPierce(isPrimary, img)
			else autoAttackSlash(isPrimary, img, o.key.includes('Two-hand') ? 256 : 200)
		}
	}
	// old function that used frames
	function autoAttackBlunt(o, isPrimary) {
		const bluntFrames = [
			'autoAttackOne-hand Blunt-1',
			'autoAttackOne-hand Blunt-2',
			'autoAttackOne-hand Blunt-3',
		]
		const bluntFramesSecondary = [
			'autoAttackOne-hand BluntSecondary-1',
			'autoAttackOne-hand BluntSecondary-2',
			'autoAttackOne-hand BluntSecondary-3',
		]
		const twoBluntFrames = [
			'autoAttackTwo-hand Blunt-1',
			'autoAttackTwo-hand Blunt-2',
			'autoAttackTwo-hand Blunt-3',
		]
		let img
		let arr
		if (o.key.includes('autoAttackOne-hand Blunt')) {
			arr = isPrimary ? bluntFrames : bluntFramesSecondary
			img = ask.getImg({
				index: o.index,
				key: arr[0]
			})
		}
		else {
			arr = twoBluntFrames
			img = ask.getImg({
				index: o.index,
				key: arr[0]
			})
		}
		ask.addChild(img)
		TweenMax.to(img, .125, {
			width: 256,
			height: 256,
			onComplete: () => {
				img.texture = PIXI.Texture.from('images/ask/' + arr[1] + '.png')
				delayedCall(.125, () => {
					img.texture = PIXI.Texture.from('images/ask/' + arr[2] + '.png')
					delayedCall(.125, () => {
						ask.removeImg()(img.id)
					})
				})
			}
		})
		/////////////////////////////
		function finishSlash() {
			TweenMax.to(img, .2, {
				width: 0,
				height: 0,
				ease: Power2.easeOut,
				onComplete: ask.removeImg(),
				onCompleteParams: [ img.id ]
			})
		}
	}
	function autoAttackSlash(isPrimary, img, size) {
		if (isPrimary) setPrimaryStart()
		else setSecondaryStart()
		let duration = size === 256 ? .25 : .2
		TweenMax.to(img, duration, {
			width: size,
			height: size,
			ease: Power2.easeIn,
			onComplete: finishSlash
		})
		/////////////////////////////
		function finishSlash() {
			if (isPrimary) setPrimaryMid()
			else setSecondaryMid()
			TweenMax.to(img, duration, {
				width: 0,
				height: 0,
				ease: Power2.easeOut,
				onComplete: ask.removeImg(),
				onCompleteParams: [ img.id ]
			})
		}
		function setPrimaryStart() {
			img.anchor.set(1, 0)
			img.x += size * .5
			img.y -= size * .5
		}
		function setPrimaryMid() {
			img.anchor.set(0, 1)
			img.x -= size
			img.y += size
		}
		function setSecondaryStart() {
			img.anchor.set(0, 0)
			img.x -= size * .5
			img.y -= size * .5
		}
		function setSecondaryMid() {
			img.anchor.set(1, 1)
			img.x += size
			img.y += size
		}
	}
	function autoAttackPierce(isPrimary, img) {
		if (isPrimary) setPrimaryStart()
		else setSecondaryStart()
		TweenMax.to(img, .2, {
			width: 256,
			height: 256,
			ease: Power2.easeIn,
			onComplete: finishSlash
		})
		//////////////////////////////
		function finishSlash() {
			if (isPrimary) setPrimaryMid()
			else setSecondaryMid()
			TweenMax.to(img, .2, {
				width: 0,
				height: 0,
				ease: Power2.easeOut,
				onComplete: ask.removeImg(),
				onCompleteParams: [ img.id ]
			})
		}
		function setPrimaryStart() {
			img.anchor.set(1, .5)
			img.x += 128
		}
		function setPrimaryMid() {
			img.anchor.set(0, .5)
			img.x -= 256
		}
		function setSecondaryStart() {
			img.anchor.set(0, .5)
			img.x -= 128
		}
		function setSecondaryMid() {
			img.anchor.set(1, .5)
			img.x += 256
		}
	}
	// autoAttackPiercing
	function autoAttackPunch(img) {
		TweenMax.to(img, .25, {
			startAt: { width: 0, height: 0, },
			width: 150,
			height: 150,
			ease: Power1.easeOut,
			onComplete: ask.removeImg(),
			onCompleteParams: [ img.id ]
		})
		TweenMax.to(img, .25, {
			startAt: { rotation: util.rotation(_.random(0, 360)) },
			rotation: '+=' + util.rotation(45),
			ease: Power0.easeIn,
		})
		TweenMax.to(img, .25, {
			startAt: { alpha: 1 },
			alpha: 0,
			ease: Power3.easeIn,
		})
	}
	function removeImg() {
		return ng.view === 'battle' ? ask.removeBattleImg : ask.removeDungeonImg
	}
	function removeDungeonImg(askId) {
		el = pix.getId(dungeon.layer, askId)
		dungeon.layer.stage.removeChild(el)
	}
	function removeBattleImg(askId) {
		el = pix.getId(battle.layer, askId)
		battle.layer.stage.removeChild(el)
	}
	function processAnimations(o, checkAutoAttacks = false) {
		if (o.key) {
			// console.info('processAnimations', o.key, o)
			if (!o.isDot
				&& typeof ask[o.key] === 'function') {
				ask[o.key](o)
			}
			else if (checkAutoAttacks && o.key.startsWith('autoAttack')) {
				ask.autoAttack(o)
			}
		}
	}
	let askSpellImg = ''
	function getCastingKey(data) {
		if (data.spellType && data.damageType) askSpellImg = 'cast-' + data.spellType + '-' + data.damageType
		else askSpellImg = 'cast-default'
		return askSpellImg
	}
}($, _, TweenMax, Power0, Power1, Power2, Power3, Power4);