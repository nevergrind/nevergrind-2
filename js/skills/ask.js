var ask;
!function($, _, TweenMax, Power0, Power1, Power2, Power3, Power4, SteppedEase, Expo, Sine, Circ, undefined) {
	ask = {
		// mob sprite layers
		LAYER_MOB_GROUND: 60,
		LAYER_MOB_BACK_ROW: 75,
		LAYER_MOB_FRONT_ROW: 100,
		// effects on back row
		LAYER_BACK_ROW_BACK: 50,
		LAYER_BACK_ROW_FRONT: 80,
		// effects on front row
		LAYER_FRONT_ROW_BACK: 85,
		LAYER_FRONT_ROW_FRONT: 200,
		// player layers
		LAYER_PLAYER_ROW_BACK: 299, // player (front)
		LAYER_PLAYER_ROW_FRONT: 300, // player (front effect)
		LAYER_TEXT: 310,
		askId: 0,
		castingTweens: [],
		castingImgIds: [],
		getAskId,
		behindMobLayer,
		frontMobLayer,
		getImg,
		getNova,
		addChild,
		removeImg,
		centerY,
		centerHeadY,
		bottomY,
		getPlayerBottom,
		getPlayerHead,
		getPlayerCenter,
		autoAttack,
		processAnimations,
		// base effects:
		/**
		 * h2h, 1hs, 2hs, 1hb, 2hb, pierce
		*/
		// particles
		particle,
		particleCircle, // can use cast-swirl-arcane key also
		particleGroup,
		particleSmall,
		// utility bursts
		moonburst,
		starburst,
		sunburst,
		// general use
		explosion, // single frame outward from center
		groundExplosion, // ground explosion that yoyos
		rings, // rings around the target (bg and fg)
		nova, // frame outward (ground and center) can rotate
		lightColumn,
		bloodDrop, // configurable blood!
		slash, // auto slash single frame
		pierce, // horizontal slash single frame
		castConjuration,
		castAlteration,
		castEvocation,
		// buffCircle
		// buffRunes (3 circles that rotate opposite directions)
		// buffDoneImage (rotate, layer other images on it)
		killCastingTweens,
		getCastingKey,
		animateFrames,
		setFrame,
	}

	let coord
	let val, el
	const fadeIn = {
		startAt: { alpha: 0 },
		alpha: 1
	}
	const fadeOut = {
		startAt: { alpha: 1 },
		alpha: 0
	}
	const particleSmallDefaults = {
		targetMob: true,
		loops: 1,
		interval: .0166,
		saturationStart: 1.2,
		saturationEnd: 1,
		brightnessStart: 1.5,
		brightnessEnd: 1,
		xRange: 0,
		yRange: 0,
		xRangeRatio: .5,
		sizeStart: 64,
		sizeEnd: 64,
		duration: .7,
		alpha: 0,
		ease: Sine.easeIn,
	}
	const particleGroupDefaults = {
		targetMob: true,
		loops: 1,
		interval: .0166,
		saturationStart: 1.2,
		saturationEnd: 1,
		brightnessStart: 1.5,
		brightnessEnd: 1,
		xRange: 0,
		yRange: 0,
		sizeStart: 128,
		sizeEnd: 128,
		duration: .7,
		alpha: 0,
		ease: Circ.easeIn,
	}
	const particleCircleDefaults = {
		targetMob: true,
		sizeStart: 0,
		sizeEnd: 350,
		duration: .33,
		saturationStart: 1.2,
		saturationEnd: 1,
		brightnessStart: 1.5,
		brightnessEnd: 1,
		rotation: 0,
		alpha: 1,
		ease: Power1.easeOut,
	}
	const moonburstDefaults = {
		targetMob: true,
		yStart: undefined,
		sizeStart: 50,
		sizeEnd: 250,
		contrastStart: 2,
		brightnessStart: 2,
		contrastEnd: 1,
		brightnessEnd: 1,
		rotation: -135,
		alpha: 0,
		duration: .8,
		frameDuration: .2,
		frameEase: Power0.easeOut,
		ease: Power2.easeOut,
	}
	const sunburstDefaults = {
		targetMob: true,
		sizeStart: 100,
		sizeEnd: 400,
		contrastStart: 2,
		brightnessStart: 2,
		contrastEnd: 1,
		brightnessEnd: 1,
		alpha: 0,
		duration: .6,
		frameDuration: .24,
		frameEase: Power0.easeOut,
		ease: Power2.easeOut,
	}
	const starburstDefaults = {
		targetMob: true,
		sizeStart: 50,
		sizeEnd: 150,
		contrastStart: 2,
		brightnessStart: 2,
		contrastEnd: 1,
		brightnessEnd: 1,
		rotation: 90,
		alpha: 0,
		duration: .2,
		frameDuration: .2,
		frameEase: Sine.easeIn,
		ease: Sine.easeOut,
	}
	const groundExplosionDefaults = {
		targetMob: true,
		sizeStart: 0,
		sizeEnd: 400,
		duration: 1,
		contrastStart: 1,
		brightnessStart: 1,
		contrastEnd: 1,
		brightnessEnd: 1,
		yoyo: true,
		alpha: 1,
		anchorY: 1,
		ease: Power2.easeOut,
	}
	const explosionDefaults = {
		repeat: false,
		targetMob: true,
		autoSize: false,
		sizeStart: 80,
		sizeEnd: 400,
		duration: .8,
		yStart: undefined,
		contrastStart: 1.5,
		brightnessStart: 1.5,
		contrastEnd: 1,
		brightnessEnd: 1,
		rotation: 0,
		startAlpha: 1,
		alpha: 0,
		ease: Power2.easeOut,
	}
	const ringsDefaults = {
		targetMob: true,
		loops: 5,
		alpha: 0,
		interval: .033,
		duration: 1,
		contrastStart: 1.5,
		brightnessStart: 2,
		contrastEnd: 1,
		brightnessEnd: 1,
		width: 'auto',
		height: 'auto',
		rotation: 0,
		zIndex: ask.LAYER_FRONT_ROW_FRONT,
		ease: Power2.easeOut,
	}
	const novaDefaults = {
		targetMob: true,
		position: 'bottom',
		yPosition: 100,
		loops: 5,
		interval: .033,
		duration: 1,
		contrastStart: 2,
		brightnessStart: 2,
		contrastEnd: 1,
		brightnessEnd: 1,
		width: 'auto',
		height: 'auto',
		rotation: 0,
		zIndex: ask.LAYER_FRONT_ROW_BACK,
		ease: Power2.easeOut,
	}
	const slashDefaults = {
		targetMob: true,
		isPrimary: true,
		size: 200,
		yAdjust: 0,
		duration: .2,
		easeStart: Power2.easeIn,
		easeEnd: Power2.easeOut,
	}
	const pierceDefaults = {
		targetMob: true,
		isPrimary: true,
		size: 200,
		duration: .2,
		easeStart: Power2.easeIn,
		easeEnd: Power2.easeOut,
	}
	const castConjurationDefaults = {
		isPrimary: true,
		sizeStart: 200,
		sizeEnd: 150,
		rotation: 360,
		duration: .5,
		removeDelay: 0,
		ease: Power0.easeOut,
	}
	const castAlterationDefaults = {
		isPrimary: true,
		sizeStart: 200,
		sizeEnd: 150,
		duration: .5,
		removeDelay: 0,
		ease: Power0.easeOut,
	}
	const castEvocationDefaults = {
		size: 200,
		duration: .5,
		ease: Back.easeInOut,
	}
	const lightColumnDefaults = {
		targetMob: true,
		isPrimary: true,
		widthStart: 200,
		anchorY: 1,
		widthEnd: 0,
		alpha: 1,
		height: MaxHeight - 200,
		duration: .4,
		ease: Power2.easeOut,
	}
	const BLOOD_DURATION = 60
	///////////////////////////////////////////
	function bloodDrop(index, size) {
		const img = ask.getImg({
			index: index,
			key: 'blood-pool'
		}, {
			targetMob: true,
			zIndex: ask.behindMobLayer({index: index})
		})
		img.width = size
		img.height = size * .25
		img.scale.x *= Math.random() > .5 ? 1 : -1
		ask.addChild(img, true)
		TweenMax.to(img, .15, {
			x: '+=' + (_.random(-100, 100)),
			y: ask.bottomY(index, true) + _.random(-15, 40),
			ease: Power0.easeIn,
			onComplete: () => {
				TweenMax.to(img, BLOOD_DURATION, {
					width: size * 2,
					height: size * .5,
					onComplete: ask.removeImg,
					onCompleteParams: [ img.id, true ]
				})
				TweenMax.to(img, BLOOD_DURATION, {
					alpha: 0,
				})
			}
		})
	}
	function lightColumn(o, config = {}) {
		config = {
			...lightColumnDefaults,
			...config
		}
		const img = ask.getImg(o)
		ask.addChild(img, config.targetMob)

		img.width = config.widthStart
		img.height = config.height
		img.y = ask.bottomY(o.index, config.targetMob)
		img.anchor.set(.5, config.anchorY)
		if (config.glowFilter) {
			img.filters = [new PIXI.filters.GlowFilter(config.glowFilter)]
		}

		TweenMax.to(img, config.duration, {
			ease: config.ease,
			alpha: config.alpha,
			width: config.widthEnd,
			onComplete: ask.removeImg,
			onCompleteParams: [ img.id, config.targetMob ]
		})
	}

	function castingArrayInit(o) {
		if (typeof ask.castingTweens[o.index] === 'undefined') {
			// console.warn('set castingTweens')
			ask.castingTweens[o.index] = []
		}
		if (typeof ask.castingImgIds[o.index] === 'undefined') {
			// console.warn('set castingImgIds')
			ask.castingImgIds[o.index] = []
		}
	}
	function killCastingTweens(data) {
		castingArrayInit(data)
		ask.castingTweens[data.index].forEach(t => {
			t.kill()
		})
		ask.castingImgIds[data.index].forEach(t => {
			ask.removeImg(t, false)
		})
		ask.castingTweens[data.index] = []
		ask.castingImgIds[data.index] = []
	}

	function castEvocation(o, config = {}) {
		ask.killCastingTweens({index: o.index})
		let rotation = 0
		let count = 0
		config = {
			...castEvocationDefaults,
			...config
		}
		ask.castingTweens[o.index].push(TweenMax.to(EmptyObject, .1, {
			repeat: -1,
			onRepeat: drawEvocationLines,
		}))
		//////////////////////////////////////
		function drawEvocationLines() {
			const img = ask.getImg(o, { targetMob: false })
			img.width = config.size
			img.height = config.size
			img.rotation = util.rotation(rotation)
			TweenMax.set(img, {
				pixi: {
					contrast: 1.15,
					brightness: 1.15
				}
			})
			ask.castingImgIds[o.index].push(img.id)
			ask.addChild(img, false)
			rotation += 30
			ask.castingTweens[o.index].push(TweenMax.to(img, config.duration, {
				pixi: { contrast: 0, brightness: 1 },
				width: 0,
				height: 0,
				ease: config.ease,
				onComplete: ask.removeImg,
				onCompleteParams: [img.id, false]
			}))
			if (count++ > 55) {
				ask.killCastingTweens({index: o.index})
			}
		}
	}
	function castAlteration(o, config) {
		let count = 0
		ask.killCastingTweens({index: o.index})
		config = {
			...castAlterationDefaults,
			...config
		}
		// rotate1
		const img = ask.getImg(o, { targetMob: false })
		console.info('castAlteration', o)
		ask.castingImgIds[o.index].push(img.id)
		img.width = config.sizeStart
		img.height = config.sizeStart
		ask.addChild(img, false)
		ask.castingTweens[o.index].push(TweenMax.to(img, config.duration, {
			pixi: { contrast: 2, brightness: 2, },
			width: config.sizeEnd,
			height: config.sizeEnd,
			yoyo: true,
			repeat: -1,
			ease: config.ease,
		}))
		ask.castingTweens[o.index].push(TweenMax.to(img, config.duration, {
			rotation: util.rotation(360),
			repeat: -1,
			ease: config.ease,
		}))

		ask.castingTweens[o.index].push(TweenMax.to(EmptyObject, .1, {
			repeat: -1,
			onRepeat: drawAlterationLines,
		}))
		let rotation = 0
		//////////////////////////////////////
		function drawAlterationLines() {
			const z = ask.getImg(o, { targetMob: false })
			ask.castingImgIds[o.index].push(z.id)
			TweenMax.set(z, {
				pixi: {
					contrast: img._gsColorMatrixFilter.brightness,
					brightness: img._gsColorMatrixFilter.brightness
				},
				width: img._width,
				height: img._width,
			})
			z.rotation = util.rotation(rotation)
			ask.addChild(z, false)
			rotation += 30
			ask.castingTweens[o.index].push(TweenMax.to(z, config.duration, {
				pixi: { contrast: 0, brightness: 0 },
				width: 0,
				height: 0,
				onComplete: ask.removeImg,
				onCompleteParams: [z.id, false]
			}))
			if (count++ > 55) {
				ask.killCastingTweens({index: o.index})
			}
		}
	}
	function castConjuration(o, config) {
		let count = 0
		ask.killCastingTweens({index: o.index})
		config = {
			...castConjurationDefaults,
			...config
		}
		const img = ask.getImg(o, { targetMob: false })
		ask.castingImgIds[o.index].push(img.id)
		img.width = config.sizeStart
		img.height = config.sizeStart
		ask.addChild(img, false)
		ask.castingTweens[o.index].push(TweenMax.to(img, config.duration, {
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
		ask.castingImgIds[o.index].push(img2.id)
		img2.width = config.sizeStart
		img2.height = config.sizeStart
		TweenMax.set(img2, {
			pixi: { contrast: 2, brightness: 2, },
		})
		ask.addChild(img2, false)
		ask.castingTweens[o.index].push(TweenMax.to(img2, config.duration, {
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

		ask.castingTweens[o.index].push(TweenMax.to(EmptyObject, .1, {
			repeat: -1,
			onRepeat: drawConjurationLines,
		}))
		//////////////////////////////////////
		function drawConjurationLines() {
			const z = ask.getImg(o, { targetMob: false })
			ask.castingImgIds[o.index].push(z.id)
			TweenMax.set(z, {
				pixi: {
					contrast: img._gsColorMatrixFilter.brightness,
					brightness: img._gsColorMatrixFilter.brightness
				},
				alpha: .2,
				width: img._width,
				height: img._height,
				zIndex: img._zIndex - 1
			})
			ask.addChild(z, false)
			ask.castingTweens[o.index].push(TweenMax.to(z, config.duration, {
				width: img._width * 1.5,
				height: img._height * 1.5,
				alpha: 0,
				rotation: util.rotation(Math.random() > .5 ? config.rotation : -config.rotation),
				ease: config.ease,
				onComplete: ask.removeImg,
				onCompleteParams: [z.id, false]
			}))
			if (count++ > 55) {
				ask.killCastingTweens({index: o.index})
			}
		}
	}
	function pierce(o, config) {
		config = {
			...pierceDefaults,
			...config
		}
		const img = ask.getImg(o)
		img.width = 0
		img.height = 0
		ask.addChild(img, config.targetMob)
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
				height: config.size,
				ease: config.easeEnd,
				onComplete: ask.removeImg,
				onCompleteParams: [ img.id, config.targetMob ]
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
		img.width = 0
		img.height = 0
		ask.addChild(img, config.targetMob)
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
		return img
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
				onComplete: ask.removeImg,
				onCompleteParams: [ img.id, config.targetMob ]
			})
		}
	}

	/**
	 * get zIndex to make image appear behind target (any position)
	 * @param o
	 * @returns {number}
	 */
	function behindMobLayer(o, targetMob = true) {
		if (targetMob) {
			if (o.index <= 4) return ask.LAYER_FRONT_ROW_BACK
			else return ask.LAYER_BACK_ROW_BACK
		}
		else return ask.LAYER_PLAYER_ROW_BACK
	}
	/**
	 * get zIndex to make image appear in front of target (any position)
	 * @param o
	 * @returns {number}
	 */
	function frontMobLayer(o, targetMob = true) {
		if (targetMob) {
			if (o.index <= 4) return ask.LAYER_FRONT_ROW_FRONT
			else return ask.LAYER_BACK_ROW_FRONT
		}
		else return ask.LAYER_PLAYER_ROW_FRONT
	}
	function rings(o, config = {}) {
		config = {
			...ringsDefaults,
			...config
		}
		for (var i=0; i<config.loops; i++) {
			(i => {
				delayedCall(config.interval * i, ringsExplode, [o, config])
			})(i)
		}
	}
	function ringsExplode(o, config) {
		//bg
		o.key = 'rings-' + o.type + '-bg'
		config.zIndex = ask.behindMobLayer(o, config.targetMob)
		const bg = ask.getNova(o, config)
		ask.addChild(bg, config.targetMob)
		//fg
		o.key = 'rings-' + o.type + '-fg'
		config.zIndex = ask.frontMobLayer(o, config.targetMob)
		const fg = ask.getNova(o, config)
		ask.addChild(fg, config.targetMob)

		if (config.widthStart) {
			// vertical rings config
			fg.width = bg.width = config.widthStart
			fg.height = bg.height = config.height
		}
		else {
			fg.width = bg.width = 0
			fg.height = bg.height = 0
		}
		if (config.xStart) {
			fg.x = bg.x = config.xStart
		}
		if (config.yStart) {
			fg.y = bg.y = config.yStart
		}
		if (config.yAdj) {
			bg.y += config.yAdj
			fg.y += config.yAdj
		}
		let endWidth
		let endHeight
		const yEnd = config.yEnd ? config.yEnd : bg.y
		if (config.targetMob) {
			endWidth = config.width === 'auto' ? mobs[o.index].width : config.width
			endHeight = config.height === 'auto' ? mobs[o.index].width * .15 : config.height
		}
		else {
			endWidth = config.width
			endHeight = config.width * .15
		}
		// bg
		TweenMax.to(bg, config.duration, {
			startAt: { pixi: {
					contrast: config.contrastStart,
					brightness: config.brightnessStart,
				},
			},
			pixi: {
				contrast: config.contrastEnd,
				brightness: config.brightnessEnd,
			},
			alpha: config.alpha,
			y: yEnd,
			width: endWidth,
			height: endHeight,
			ease: config.ease,
			onComplete: ask.removeImg,
			onCompleteParams: [ bg.id, config.targetMob ]
		})
		// fg
		TweenMax.to(fg, config.duration, {
			startAt: { pixi: {
					contrast: config.contrastStart,
					brightness: config.brightnessStart,
				},
			},
			pixi: {
				contrast: config.contrastEnd,
				brightness: config.brightnessEnd,
			},
			alpha: config.alpha,
			y: yEnd,
			width: endWidth,
			height: endHeight,
			ease: config.ease,
			onComplete: ask.removeImg,
			onCompleteParams: [ fg.id, config.targetMob ]
		})
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
		ask.addChild(img, config.targetMob)
		img.width = 0
		img.height = 0
		if (config.xStart) {
			img.x = config.xStart
		}
		if (config.yStart) {
			img.y += config.yStart
		}
		TweenMax.to(img, config.duration, {
			startAt: { pixi: {
					contrast: config.contrastStart,
					brightness: config.brightnessStart,
				},
				rotation: config.rotation,
			},
			pixi: {
				contrast: config.contrastEnd,
				brightness: config.brightnessEnd,
			},
			alpha: 0,
			width: !config.targetMob ? 600 :
				config.width === 'auto' ? mobs[o.index].width : config.width,
			height: !config.targetMob ? 125 :
				config.height === 'auto' ? mobs[o.index].width * .125 : config.height,
			ease: config.ease,
			onComplete: ask.removeImg,
			onCompleteParams: [ img.id, config.targetMob ]
		})
	}

	function particle(o, config = { targetMob: true}) {
		if (!o.key) o.key = 'particle-small-default'
		let p = ask.getImg(o, config)
		ask.addChild(p, config.targetMob)
		return p
	}
	function particleSmall(o, config = {}) {
		config = {
			...particleSmallDefaults,
			...config,
		}
		if (!o.key) o.key = 'particle-small-default'
		for (var i=0; i<config.loops; i++) {
			!function(i) {
				delayedCall(config.interval * i, () => {
					const img = ask.getImg(o, config)
					img.width = config.sizeStart
					img.height = config.sizeStart
					img.scale.x *= Math.random() > .5 ? 1 : -1
					let xRangeEnd = img.x
					if (config.xRange) {
						xRangeEnd =_.random(-config.xRange, config.xRange)
						img.x += xRangeEnd
					}
					if (config.yRange) img.y += _.random(-config.yRange, config.yRange)
					ask.addChild(img, config.targetMob)
					TweenMax.to(img, config.duration, {
						startAt: {
							pixi: {
								saturation: config.saturationStart,
								brightness: config.brightnessStart,
							}
						},
						pixi: {
							saturation: config.saturationEnd,
							brightness: config.brightnessEnd,
						},
						y: config.yEnd ? ('+=' + config.yEnd) : (ask.bottomY(o.index, config.targetMob)),
						width: config.sizeEnd,
						height: config.sizeEnd,
						ease: config.ease,
						onComplete: ask.removeImg,
						onCompleteParams: [ img.id, config.targetMob ]
					})
					TweenMax.to(img, config.duration, {
						x: '+=' + (xRangeEnd * config.xRangeRatio),
						ease: Sine.easeOut,
					})
					delayedImgFade(img, config)
				})
			}(i)
		}
	}
	function particleGroup(o, config = {}) {
		config = {
			...particleGroupDefaults,
			...config,
		}
		if (!o.key) o.key = 'particle-group-default'
		for (var i=0; i<config.loops; i++) {
			!function(i) {
				delayedCall(config.interval * i, () => {
					const img = ask.getImg(o, config)
					img.width = config.sizeStart
					img.height = config.sizeStart
					img.scale.x *= Math.random() > .5 ? 1 : -1
					if (config.xRange) img.x += _.random(-config.xRange, config.xRange)
					if (config.yRange) img.y += _.random(-config.yRange, config.yRange)
					if (typeof config.yStartAdj !== 'undefined') img.y += config.yStartAdj
					ask.addChild(img, config.targetMob)
					TweenMax.to(img, config.duration, {
						startAt: {
							pixi: {
								saturation: config.saturationStart,
								brightness: config.brightnessStart,
							}
						},
						pixi: {
							saturation: config.saturationEnd,
							brightness: config.brightnessEnd,
						},
						y: config.yEnd ? ('+=' + config.yEnd) : (ask.bottomY(o.index, config.targetMob)),
						width: config.sizeEnd,
						height: config.sizeEnd,
						ease: config.ease,
						onComplete: ask.removeImg,
						onCompleteParams: [ img.id, config.targetMob ]
					})
					delayedImgFade(img, config)
				})
			}(i)
		}
	}
	function particleCircle(o, config = {}) {
		config = {
			...particleCircleDefaults,
			...config,
		}
		// console.info('particleCircle', config)
		if (!o.key) o.key = 'particle-circle-default'
		const img = ask.getImg(o, config)
		img.width = config.sizeStart
		img.height = config.sizeStart
		ask.addChild(img, config.targetMob)
		TweenMax.to(img, config.duration, {
			startAt: {
				pixi: {
					saturation: config.saturationStart,
					brightness: config.brightnessStart,
				}
			},
			pixi: {
				saturation: config.saturationEnd,
				brightness: config.brightnessEnd,
			},
			width: config.sizeEnd,
			height: config.sizeEnd,
			ease: config.ease,
			onComplete: ask.removeImg,
			onCompleteParams: [ img.id, config.targetMob ]
		})
		if (config.rotation !== 0) {
			TweenMax.to(img, config.duration, {
				rotation: util.rotation(config.rotation),
				ease: Power0.easeOut,
			})
		}
		delayedImgFade(img, config)
		return img
	}
	function delayedImgFade(img, config) {
		if (config.alpha < 1) {
			delayedCall(config.duration * .66, () => {
				TweenMax.to(img, config.duration * .33, {
					alpha: 0,
					ease: Power0.easeOut,
				})
			})
		}
	}
	function moonburst(o, config = {}) {
		let b = _.clone(o)
		config = {
			...moonburstDefaults,
			...config,
		}
		b.endFrame = 2
		b.key = 'moonburst'
		const img = ask.getImg(b, config)
		img.width = config.sizeStart
		img.height = config.sizeStart
		if (config.yStart) img.y = config.yStart
		ask.addChild(img, config.targetMob)
		TweenMax.to(img, config.duration, {
			startAt: {
				pixi: {
					contrast: config.contrastStart,
					brightness: config.brightnessStart,
				},
			},
			pixi: {
				contrast: config.contrastEnd,
				brightness: config.brightnessEnd,
			},
			width: config.sizeEnd,
			height: config.sizeEnd,
			alpha: config.alpha,
			ease: config.ease,
			onComplete: ask.removeImg,
			onCompleteParams: [ img.id, config.targetMob ]
		})
		animateFrames(b, config, img)
		return img
	}
	function sunburst(o, config = {}) {
		let b = _.clone(o)
		config = {
			...sunburstDefaults,
			...config,
		}
		b.endFrame = 2
		b.key = 'sunburst'
		const img = ask.getImg(b, config)
		img.width = config.sizeStart
		img.height = config.sizeStart
		ask.addChild(img, config.targetMob)
		TweenMax.to(img, config.duration, {
			startAt: {
				pixi: {
					contrast: config.contrastStart,
					brightness: config.brightnessStart,
				},
			},
			pixi: {
				contrast: config.contrastEnd,
				brightness: config.brightnessEnd,
			},
			width: config.sizeEnd,
			height: config.sizeEnd,
			alpha: config.alpha,
			ease: 1,
			onComplete: ask.removeImg,
			onCompleteParams: [ img.id, config.targetMob ]
		})
		animateFrames(b, config, img)
		return img
	}
	function starburst(o, config = {}) {
		let b = _.clone(o)
		config = {
			...starburstDefaults,
			...config,
		}
		b.endFrame = 2
		b.key = 'starburst'
		const img = ask.getImg(b, config)
		img.width = config.sizeStart
		img.height = config.sizeStart
		ask.addChild(img, config.targetMob)
		TweenMax.to(img, config.duration, {
			startAt: {
				pixi: {
					contrast: config.contrastStart,
					brightness: config.brightnessStart,
				},
			},
			pixi: {
				contrast: config.contrastEnd,
				brightness: config.brightnessEnd,
			},
			rotation: util.rotation(config.rotation),
			width: config.sizeEnd,
			height: config.sizeEnd,
			// alpha: config.alpha,
			ease: config.ease,
			onComplete: ask.removeImg,
			onCompleteParams: [ img.id, config.targetMob ]
		})
		// delayedImgFade(img, config)
		animateFrames(b, config, img)
		return img
	}
	function groundExplosion(o, config = {}) {
		// Guardian Heroes style explosion from shadow up - yoyos back down
		config = {
			...groundExplosionDefaults,
			...config,
		}
		const img = ask.getImg(o, config)
		if (config.x) img.x = config.x
		img.y = config.yStart || ask.bottomY(o.index, config.targetMob)
		img.x = config.xAdjust ? img.x + config.xAdjust : img.x
		img.anchor.set(.5, config.anchorY)
		if (config.width) {
			img.width = config.width
			img.height = config.height
		}
		else {
			img.width = config.sizeStart
			img.height = config.sizeStart
		}
		if (typeof config.alphaStart === 'number') {
			img.alpha = config.alphaStart
		}
		if (config.flip) {
			img.scale.x *= -1
		}

		ask.addChild(img, config.targetMob)
		TweenMax.to(img, config.duration, {
			startAt: {
				pixi: {
					contrast: config.contrastStart,
					brightness: config.brightnessStart,
				},
			},
			pixi: {
				contrast: config.contrastEnd,
				brightness: config.brightnessEnd,
			},
			width: config.width ? config.width : config.sizeEnd,
			height: config.height ? config.height : config.sizeEnd,
			yoyo: config.yoyo,
			alpha: config.alpha,
			repeat: config.yoyo ? 1 : 0,
			ease: config.ease,
			onComplete: ask.removeImg,
			onCompleteParams: [ img.id, config.targetMob ]
		})

		animateFrames(o, config, img)
		return img
	}

	function explosion(o, config = {}) {
		config = {
			...explosionDefaults,
			...config,
		}
		const img = ask.getImg(o, config)
		// pre-config
		img.height = img.width = config.sizeStart
		if (config.xStart) img.x = config.xStart
		if (config.yStart) img.y = config.yStart
		if (config.rotationStart) img.rotation = util.rotation(config.rotationStart)
		if (config.flip) {
			img.scale.x *= -1
		}
		if (config.zIndexAdj) img.zIndex += config.zIndexAdj
		// add to canvas
		ask.addChild(img, config.targetMob)
		// tween config
		let explosionObj = {
			startAt: {
				pixi: {
					contrast: config.contrastStart,
					brightness: config.brightnessStart,
				},
				alpha: config.startAlpha
			},
			pixi: {
				contrast: config.contrastEnd,
				brightness: config.brightnessEnd,
			},
			rotation: util.rotation(config.rotation),
			ease: config.ease,
			onComplete: ask.removeImg,
			onCompleteParams: [ img.id, config.targetMob ]
		}
		if (config.autoSize) {
			// some images use their auto size
		}
		else {
			explosionObj.height = explosionObj.width = config.sizeEnd
		}
		if (config.xEnd) explosionObj.x = config.xEnd
		if (config.yEnd) explosionObj.y = config.yEnd
		if (!config.alphaEase) {
			explosionObj.alpha = config.alpha
		}
		else {
			TweenMax.to(img, config.duration, {
				alpha: config.alpha,
				ease: config.alphaEase
			})
		}
		// tween it good
		TweenMax.to(img, config.duration, explosionObj)
		animateFrames(o, config, img)
		return img
	}
	function animateFrames(o, config, img) {
		if (o.endFrame) {
			let state = {
				image: o.key,
				lastFrame: 0,
				frame: 0
			}
			TweenMax.to(state, config.frameDuration, {
				frame: o.endFrame + .99,
				ease: config.frameEase || Power0.easeOut,
				repeat: config.repeat ? -1 : 0,
				onUpdate: setFrame,
				onUpdateParams: [img, state],
			})
		}
	}
	function setFrame(img, state) {
		// console.info('frame', state.frame)
		if (state.frame !== state.lastFrame + 1) {
			state.lastFrame = ~~state.frame
			// console.warn('setFrame', state.lastFrame, img.id)
			if (state.lastFrame === 0) {
				img.texture = PIXI.Texture.from('images/ask/'+ state.image +'.png')
			}
			else {
				img.texture = PIXI.Texture.from('images/ask/'+ state.image + state.lastFrame +'.png')
			}
		}
	}
	function addChild(img, targetMob) { // false is player.layer, true is battle.layer
		if (targetMob) battle.layer.stage.addChild(img)
		else player.layer.stage.addChild(img)
	}
	// positioning
	function bottomY(index, targetMob = true) {
		if (targetMob) {
			return MaxHeight
				- mob.bottomY[index]
				// yPadding not needed because... reasons
		}
		else {
			// player target
			return ask.getPlayerBottom().y
		}
	}
	function centerY(index, targetMob) {
		if (targetMob) {
			return ask.bottomY(index, targetMob) - (mobs[index].imgCy * mobs[index].size)
		}
		else {
			// player target
			return ask.getPlayerCenter(party.getIndexByRow(index)).y
		}
	}
	function centerHeadY(index, targetMob = true) {
		return ask.bottomY(index, targetMob) - ((mobs[index].barAliveBottom * mobs[index].size))
		// return ask.centerY(index, true) - (mobs[index].clickAliveH * .2)
	}
	// get player positions
	function getPlayerHead(index) {
		return {
			x: dungeon.centerX[party.getIndexByRow(index)],
			y: dungeon.headY,
		}
	}
	function getPlayerCenter(index) {
		// possibly expand to multiple party members later
		return {
			x: dungeon.centerX[index],
			y: dungeon.centerY(index),
		}
	}
	function getPlayerBottom(index) {
		return {
			x: dungeon.centerX[party.getIndexByRow(index)],
			y: MaxHeight - 80, // bar in the way
		}
	}
	function positionImgToPlayer(o, img, config) {
		coord = getPlayerCenter(party.getIndexByRow(o.index))
		img.x = coord.x
		// offset from combat bottom
		if (typeof config === 'object' && config.yPosition) {
			img.y = MaxHeight - config.yPosition
		}
		else {
			img.y = coord.y
		}
	}
	function getAskId() {
		return ask.askId++
	}

	function getImg(o, config = { targetMob: true }) {
		const img = PIXI.Sprite.from(`images/ask/${o.key}.png`)
		img.id = 'ask-' + ask.getAskId()
		img.anchor.set(.5)
		if (config.targetMob) {
			img.x = mob.centerX[o.index]
			img.y = ask.centerY(o.index, true)
			if (config.zIndex) {
				img.zIndex = config.zIndex
			}
			else {
				img.zIndex = ask.frontMobLayer(o)
			}
		}
		else {
			positionImgToPlayer(o, img, config)
			img.zIndex = config.zIndex || ask.LAYER_PLAYER_ROW_FRONT
		}
		return img
	}
	// image @ feet of target (or center!)
	function getNova(o, config = { targetMob: true }) {
		const img = PIXI.Sprite.from(`images/ask/${o.key}.png`)
		img.id = 'ask-' + ask.getAskId()
		img.anchor.set(.5)
		// bottom center of mob's feet
		if (config.targetMob) {
			img.x = mob.centerX[o.index]
			if (config.position === 'bottom') {
				// nova
				img.y = ask.bottomY(o.index, config.targetMob)
			}
			else {
				// rings
				// if not on ground (behind) this will need a zIndex so it appears in front
				img.y = ask.centerY(o.index, config.targetMob)
			}
		}
		else {
			positionImgToPlayer(o, img, config)
		}
		img.zIndex = config.zIndex
		return img
	}
	function autoAttack(o) {
		const isPrimary = !o.key.includes('Secondary')
		// scale animations
		const img = ask.getImg(o)
		// console.info('key', o.key)
		img.width = 0
		img.height = 0

		ask.addChild(img, true)
		if (o.key.includes('Hand-to-hand')) {
			img.x = mob.centerX[o.index] + _.random(-50, 50)
			img.y = ask.centerY(o.index, true) + _.random(-50, 50)
			autoAttackPunch(img)
		}
		else {
			img.y = ask.centerY(o.index, true) + _.random(-25, 50)
			if (o.key.includes('Piercing')) {
				autoAttackPierce(isPrimary, img)
			}
			else {
				autoAttackSlash(
					isPrimary,
					img,
					o.key.includes('Two-hand') ? 300 : 200
				)
			}
		}
		audio.playAutoAttack(o)
	}
	// old function that used frames
	function autoAttackBlunt(o, img, size) {
		img.anchor.set(.5, 0)
		img.width = size
		img.x += _.random(-25, 25)
		img.y -= size * .5
		let duration = size === 256 ? .25 : .2
		TweenMax.to(img, duration, {
			height: size,
			ease: Power2.easeIn,
			onComplete: finishBlunt
		})
		/////////////////////////////
		function finishBlunt() {
			img.anchor.set(.5, 1)
			img.y += size
			TweenMax.to(img, duration, {
				height: 0,
				ease: Power2.easeOut,
				onComplete: ask.removeImg,
				onCompleteParams: [ img.id, false ]
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
				onComplete: ask.removeImg,
				onCompleteParams: [ img.id, false ]
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
			onComplete: finishPierce
		})
		//////////////////////////////
		function finishPierce() {
			if (isPrimary) setPrimaryMid()
			else setSecondaryMid()
			TweenMax.to(img, .2, {
				width: 0,
				height: 0,
				ease: Power2.easeOut,
				onComplete: ask.removeImg,
				onCompleteParams: [ img.id, false ]
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
			startAt: {
				width: 250,
				height: 250,
				rotation: util.rotation(_.random(0, 360))
			},
			width: 0,
			height: 0,
			ease: Power1.easeOut,
			onComplete: ask.removeImg,
			onCompleteParams: [ img.id, false ]
		})
	}
	function removeImg(askId, targetMob = true) {
		if (targetMob) {
			battle.layer.stage.removeChild(pix.getId(battle.layer, askId))
		}
		else {
			player.layer.stage.removeChild(pix.getId(player.layer, askId))
		}
	}

	/**
	 * Function that magically invokes skill animation based on camelCase key
	 * @param o
	 * @param checkAutoAttacks
	 */
	function processAnimations(o, checkAutoAttacks = false) {
		if (o.key) {
			if (!o.isDot
				&& typeof ask[o.key] === 'function') {
				// console.info('processAnimations', o.key, o)
				ask[o.key](o)
			}
			else if (checkAutoAttacks && o.key.startsWith('autoAttack')) {
				ask.autoAttack(o)
			}
		}
	}

	let askSpellImg = ''
	function getCastingKey(data) {
		if (!data.damageType) data.damageType = 'arcane'
		if (data.spellType) askSpellImg = 'cast-' + data.spellType + '-' + data.damageType
		else askSpellImg = 'cast-default'
		return askSpellImg
	}
}($, _, TweenMax, Power0, Power1, Power2, Power3, Power4, SteppedEase, Expo, Sine, Circ);