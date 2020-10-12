var ask;
!function($, _, TweenMax, Power0, Power1, Power2, Power3, Power4, undefined) {
	ask = {
		askId: 0,
		getAskImg,
		removeImg,
		sizeOffset,
		bottomY,
		centerY,
		autoAttack,
		crossSlash,
	}
	let val, el
	///////////////////////////////////////////
	function crossSlash(index) {
		console.info('crossSlash', index)
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
	function getAskImg(index, name) {
		const img = PIXI.Sprite.from(`images/ask/${name}.png`)
		img.id = 'ask-' + ask.askId++
		img.anchor.set(.5)
		img.x = mob.centerX[index]
		img.y = ask.centerY(index)
		img.zIndex = 200
		return img
	}
	function autoAttack(o) {
		const isPrimary = !o.key.includes('Secondary')
		const img = ask.getAskImg(o.index, o.key)
		img.width = 0
		img.height = 0
		
		battle.layer.stage.addChild(img)
		if (o.key.includes('Hand-to-hand')) {
			img.x = mob.centerX[o.index] + _.random(-50, 50)
			img.y = ask.centerY(o.index) + _.random(-50, 50)
			autoAttackPunch(img)
		}
		else {
			img.x = mob.centerX[o.index]
			img.y = ask.centerY(o.index)
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
				onComplete: ask.removeImg,
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
				onComplete: ask.removeImg,
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
					onComplete: ask.removeImg,
					onCompleteParams: [ img.id ]
				})
			}
		})
	}
	function removeImg(askId) {
		el = pix.getId(battle.layer, askId)
		battle.layer.stage.removeChild(el)
	}
}($, _, TweenMax, Power0, Power1, Power2, Power3, Power4);