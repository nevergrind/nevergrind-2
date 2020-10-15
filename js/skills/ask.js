var ask;
!function($, _, TweenMax, Power0, Power1, Power2, Power3, Power4, undefined) {
	ask = {
		askId: 0,
		getAskImg,
		addChild,
		removeImg,
		removeDungeonImg,
		removeBattleImg,
		sizeOffset,
		bottomY,
		centerY,
		autoAttack,
		explosion,
	}
	let val, el
	const explosionDefaults = {
		targetMob: true,
		sizeStart: 80,
		sizeEnd: 400,
		duration: .8,
		contrastStart: 1.5,
		contrastEnd: 1,
		brightnessStart: 1.5,
		brightnessEnd: 1.5,
		ease: Power4.easeOut,
	}
	///////////////////////////////////////////
	function addChild(img) {
		if (ng.view === 'battle') battle.layer.stage.addChild(img)
		else dungeon.layer.stage.addChild(img)
	}
	function explosion(o, config = {}) {
		config = {
			...explosionDefaults,
			...config
		}
		const img = ask.getAskImg(o, config)
		ask.addChild(img)
		img.width = config.sizeStart
		img.height = config.sizeStart

		TweenMax.to(img, config.duration, {
			startAt: { pixi: {
				contrast: config.contrastStart,
				brightness: config.brightnessStart,
			}},
			rotation: PI,
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
			- (mobs.images[mobs[index].img].yFloor * mobs[index].size)
			+ ask.sizeOffset(mobs[index].size)
	}
	function centerY(index) {
		return ask.bottomY(index) - (mobs[index].clickAliveH * mobs[index].size)
	}
	function getAskImg(o, config = { targetMob: true }) {
		const img = PIXI.Sprite.from(`images/ask/${o.key}.png`)
		img.id = 'ask-' + ask.askId++
		img.anchor.set(.5)
		if (config.targetMob) {
			img.x = mob.centerX[o.index]
			img.y = ask.centerY(o.index)
		}
		else {
			img.x = 960
			img.y = 800
		}
		img.zIndex = 200
		return img
	}
	function autoAttack(o) {
		const isPrimary = !o.key.includes('Secondary')
		const img = ask.getAskImg(o)
		img.width = 0
		img.height = 0
		
		battle.layer.stage.addChild(img)
		if (o.key.includes('Hand-to-hand')) {
			img.x = mob.centerX[o.index] + _.random(-50, 50)
			img.y = ask.centerY(o.index) + _.random(-50, 50)
			autoAttackPunch(img)
		}
		else {
			img.y = ask.centerY(o.index) + _.random(-25, 50)
			if (o.key.includes('Piercing')) autoAttackPierce(isPrimary, img)
			else autoAttackSlash(isPrimary, img)
		}
	}
	function autoAttackSlash(isPrimary, img) {
		if (isPrimary) setPrimaryStart()
		else setSecondaryStart()
		TweenMax.to(img, .2, {
			pixi: { width: 200, height: 200 },
			ease: Power2.easeIn,
			onComplete: finishSlash
		})
		function finishSlash() {
			if (isPrimary) setPrimaryMid()
			else setSecondaryMid()
			TweenMax.to(img, .2, {
				pixi: { width: 0, height: 0 },
				ease: Power2.easeOut,
				onComplete: ask.removeImg(),
				onCompleteParams: [ img.id ]
			})
		}
		function setPrimaryStart() {
			img.anchor.set(1, 0)
			img.x += 100
			img.y -= 100
		}
		function setPrimaryMid() {
			img.anchor.set(0, 1)
			img.x -= 200
			img.y += 200
		}
		function setSecondaryStart() {
			img.anchor.set(0, 0)
			img.x -= 100
			img.y -= 100
		}
		function setSecondaryMid() {
			img.anchor.set(1, 1)
			img.x += 200
			img.y += 200
		}
	}
	function autoAttackPierce(isPrimary, img) {
		if (isPrimary) setPrimaryStart()
		else setSecondaryStart()
		TweenMax.to(img, .2, {
			pixi: { width: 200, height: 200 },
			ease: Power2.easeIn,
			onComplete: finishSlash
		})
		function finishSlash() {
			if (isPrimary) setPrimaryMid()
			else setSecondaryMid()
			TweenMax.to(img, .2, {
				pixi: { width: 0, height: 0 },
				ease: Power2.easeOut,
				onComplete: ask.removeImg(),
				onCompleteParams: [ img.id ]
			})
		}
		function setPrimaryStart() {
			img.anchor.set(1, .5)
			img.x += 100
		}
		function setPrimaryMid() {
			img.anchor.set(0, .5)
			img.x -= 200
		}
		function setSecondaryStart() {
			img.anchor.set(0, .5)
			img.x -= 100
		}
		function setSecondaryMid() {
			img.anchor.set(1, .5)
			img.x += 200
		}
	}
	function autoAttackPunch(img) {
		img.width = 75
		img.height = 75
		TweenMax.to(img, .1, {
			pixi: { width: 150, height: 150 },
			rotation: .25 * PI,
			ease: Power1.easeOut,
			onComplete: () => {
				TweenMax.to(img, .1, {
					pixi: { width: 75, height: 75 },
					rotation: .5 * PI,
					ease: Power1.easeIn,
					onComplete: ask.removeImg(),
					onCompleteParams: [ img.id ]
				})
			}
		})
	}
	function removeImg() {
		return ng.view === 'battle' ? removeBattleImg : removeDungeonImg
	}
	function removeDungeonImg(askId) {
		console.info('removeDungeonImg', askId)
		el = pix.getId(dungeon.layer, askId)
		dungeon.layer.stage.removeChild(el)
	}
	function removeBattleImg(askId) {
		console.info('removeBattleImg', askId)
		el = pix.getId(battle.layer, askId)
		battle.layer.stage.removeChild(el)
	}
}($, _, TweenMax, Power0, Power1, Power2, Power3, Power4);