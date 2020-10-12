!function($, _, TweenMax, Power0, Power1, Power2, Power3, Power4, undefined) {
	ask = {
		...ask,
		crossSlash,
	}
	const crossSlashWidth = 300
	///////////////////////////////////////////
	function crossSlash(o) {
		console.info('crossSlash', o)
		const img = ask.getAskImg(o.index, o.key)
		battle.layer.stage.addChild(img)
		img.width = 0
		img.height = 0
		img.x = mob.centerX[o.index] + (crossSlashWidth * .5)
		img.y = ask.centerY(o.index)
		img.anchor.set(1, .5)
		TweenMax.to(img, .2, {
			pixi: { width: crossSlashWidth, height: crossSlashWidth },
			ease: Power2.easeIn,
			onComplete: () => {
				img.anchor.set(0, .5)
				img.x -= crossSlashWidth
				TweenMax.to(img, .2, {
					pixi: { width: 0, height: 0 },
					ease: Power2.easeOut,
					onComplete: ask.removeImg,
					onCompleteParams: [ img.id ]
				})
			}
		})
	}
}($, _, TweenMax, Power0, Power1, Power2, Power3, Power4);