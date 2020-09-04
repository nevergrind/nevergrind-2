var expanse;
!function(TweenMax, Power2, Expo, Linear, PIXI, undefined) {
	expanse = {
		startSkyPhase,
		killAllTweens,
		resizeAll,
		pixiResizeSky,
		phase: 'morning',
		sky: {},
		elements: {},
		stars: {},
		sun: {},
		moon: {},
		cloud1: {},
		cloud2: {},
		tweens: {},
		initialized: false,
		aspectRatio: 0,
	}

	var cloudSpeed = 777
	const phaseDuration = 2000 // 20 minutes?
	expanse.aspectRatio = MaxWidth / MaxHeight
	determineStartingPhase()
	//////////////////////////////

	function determineStartingPhase() {
		var n = new Date().getMinutes();
		if (n < 20) expanse.phase = 'morning'
		else if (n < 40) expanse.phase = 'evening'
		else expanse.phase = 'night'
	}

	function startSkyPhase() {
		// console.warn('//////////////////////////////////////////////////////')
		// console.warn('startSkyPhase', expanse.phase)
		initPixiElements()
		animateSky()
		animateBuildings()
		animateStars()
		animateSun()
		animateMoon()
		animateClouds()
	}
	function changePhase() {
		if (expanse.phase === 'morning') expanse.phase = 'evening'
		else if (expanse.phase === 'evening') expanse.phase = 'night'
		else expanse.phase = 'morning'
	}

	function triggerNextPhase() {
		cloudSpeed = _.random(1000, 2500)
		changePhase()
		startSkyPhase()
	}

	function initPixiElements() {
		if (!expanse.initialized) {
			expanse.initialized = true
			cloudSpeed = _.random(500, 2500)
			//TODO: experimental rain, snow
			/*expanse.elements = new PIXI.Application({
				width: 1920,
				height: 1920,
				transparent: true
			});
			// style
			expanse.elements.view.id = 'pix-elements'
			expanse.elements.view.style.position = 'absolute'
			querySelector('#sky-elements').appendChild(expanse.elements.view)*/
			/*
			TweenMax.to('#sky-rain1', .45, {
				startAt: { y: '-100%' },
				y: '0%',
				repeat: -1,
				ease: Linear.easeNone
			})
			TweenMax.to('#sky-rain2', .45, {
				delay: .15,
				startAt: { x: '-1%', y: '-100%' },
				y: '0%',
				repeat: -1,
				ease: Linear.easeNone
			})
			TweenMax.to('#sky-rain3', .45, {
				delay: .3,
				startAt: { x: '1%', y: '-100%' },
				y: '0%',
				repeat: -1,
				ease: Linear.easeNone
			})
			*/

			expanse.sky = new PIXI.Application({
				width: MaxWidth,
				height: 517,
				transparent: true
			});
			// style
			expanse.sky.view.id = 'pix-sky'
			expanse.sky.view.style.position = 'absolute'
			pixiResizeSky()
			querySelector('#sky-wrap').appendChild(expanse.sky.view)

			expanse.stars = PIXI.Sprite.from('images/env/stars-2.png')
			expanse.sky.stage.addChild(expanse.stars)

			expanse.sun = PIXI.Sprite.from('images/env/sun-6.png')
			expanse.sun.anchor.set(.5)
			expanse.sky.stage.addChild(expanse.sun)

			TweenMax.set(expanse.sun, { pixi: { brightness: 1.2 }})
			/*TweenMax.to(expanse.sun, 1/60, {
				rotation: 360,
				repeat: -1,
				ease: Linear.easeOut
			})*/

			expanse.moon = PIXI.Sprite.from('images/env/moon.png')
			expanse.moon.anchor.set(.5)
			expanse.sky.stage.addChild(expanse.moon)

			expanse.cloud1 = PIXI.Sprite.from('images/env/clouds-1.png')
			expanse.cloud1.anchor.set(0)
			expanse.sky.stage.addChild(expanse.cloud1)

			expanse.cloud2 = PIXI.Sprite.from('images/env/clouds-1.png')
			expanse.cloud2.anchor.set(0)
			expanse.sky.stage.addChild(expanse.cloud2)

			window.onresize = resizeAll
		}
	}

	function animateSky() {
		// sky, stars, building
		if (expanse.phase === 'morning') {
			const skyProps = {
				topR: 0,
				topG: 0,
				topB: 48,
				bottomR: 140,
				bottomG: 130,
				bottomB: 160,
			}
			expanse.tweens.skyProps = TweenMax.to(skyProps, phaseDuration * .4, {
				topR: 0, // 05b
				topG: 80,
				topB: 192,
				bottomR: 180, // aef
				bottomG: 240,
				bottomB: 255,
				onUpdate: setSky,
				onUpdateParams: [skyProps],
			})
		}
		else if (expanse.phase === 'evening') {
			const skyProps = {
				topR: 0, // 05b
				topG: 80,
				topB: 192,
				bottomR: 180, // aef
				bottomG: 240,
				bottomB: 255,
			}
			setSky(skyProps)
			expanse.tweens.skyProps = TweenMax.to(skyProps, phaseDuration * .4, {
				delay: phaseDuration * .6,
				topR: 0, // 05b
				topG: 0,
				topB: 16,
				bottomR: 0, // aef
				bottomG: 0,
				bottomB: 0,
				onUpdate: setSky,
				onUpdateParams: [skyProps],
			})
		}
		else if (expanse.phase === 'night') {
			const skyProps = {
				topR: 0, // 05b
				topG: 0,
				topB: 16,
				bottomR: 0, // aef
				bottomG: 0,
				bottomB: 0,
			}
			setSky(skyProps)
			expanse.tweens.skyProps = TweenMax.to(skyProps, phaseDuration * .2, {
				delay: phaseDuration * .8,
				topR: 0,
				topG: 0,
				topB: 48,
				bottomR: 140,
				bottomG: 130,
				bottomB: 160,
				onUpdate: setSky,
				onUpdateParams: [skyProps],
			})
		}
	}

	function setSky(obj) {
		TweenMax.set('#town-sky', {
			background: 'linear-gradient('+
				'to top,'+
				'rgb('+ obj.bottomR +', ' + obj.bottomG + ', ' + obj.bottomB + '),'+
				'rgb('+ obj.topR +', ' + obj.topG + ', ' + obj.topB + ')' +
			')'
		})
	}

	function animateBuildings() {
		// console.warn('animateBuildings')
		if (expanse.phase === 'morning') {
			expanse.tweens.townWrap = TweenMax.to('#town-building-wrap', phaseDuration * .2, {
				startAt: {
					filter: 'saturate(.66) brightness(.66)'
				},
				filter: 'saturate(1) brightness(1)',
				ease: Power2.easeOut
			})
		}
		else if (expanse.phase === 'evening') {
			TweenMax.set('#town-building-wrap', {
				filter: 'saturate(1) brightness(1)'
			})
			expanse.tweens.townWrap = TweenMax.to('#town-building-wrap', phaseDuration * .4, {
				delay: phaseDuration * .6,
				filter: 'saturate(.7) brightness(.7)',
			})
		}
		else if (expanse.phase === 'night') {
			TweenMax.set('#town-building-wrap', {
				filter: 'saturate(.7) brightness(.7)'
			})
			expanse.tweens.townWrap = TweenMax.to('#town-building-wrap', phaseDuration * .2, {
				delay: phaseDuration * .8,
				filter: 'saturate(.85) brightness(.85)',
			})
		}
	}

	function animateStars() {
		if (expanse.phase === 'morning') {
			expanse.tweens.stars = TweenMax.to(expanse.stars, phaseDuration * .4, {
				startAt: {
					pixi: {
						alpha: 1,
						brightness: 1.25
					},
				},
				pixi: {
					alpha: 0,
					brightness: 1
				},
			})
		}
		else if (expanse.phase === 'evening') {
			TweenMax.set(expanse.stars, {
				pixi: {
					alpha: 0,
					brightness: 1
				},
			})
			expanse.tweens.stars = TweenMax.to(expanse.stars, phaseDuration * .4, {
				delay: phaseDuration * .6,
				pixi: {
					alpha: 1,
					brightness: 2
				},
			})
		}
		else if (expanse.phase === 'night') {
			TweenMax.set(expanse.stars, {
				pixi: {
					alpha: 1,
					brightness: 2
				},
			})
			expanse.tweens.stars = TweenMax.to(expanse.stars, phaseDuration * .2, {
				delay: phaseDuration * .8,
				pixi: {
					alpha: 1,
					brightness: 1.25
				}
			})
		}
	}

	function animateSun() {
		if (expanse.phase === 'morning') {
			expanse.tweens.sunPosition = TweenMax.to(expanse.sun, phaseDuration, {
				startAt: {
					x: MaxWidth * .65,
					y: MaxWidth * .5,
				},
				y: MaxWidth * -.8,
				ease: Power2.easeOut,
				onComplete: triggerNextPhase
			})
			TweenMax.set(expanse.sun, {
				pixi: {
					colorize: 'orange',
					scale: 1.4,
					brightness: 1,
					saturation: 1,
					colorizeAmount: 1,
				}
			})
			expanse.tweens.sunBrightness = TweenMax.to(expanse.sun, phaseDuration * .05, {
				delay: phaseDuration * .05,
				pixi: {
					scale: 1,
					brightness: 1.3,
					saturation: 1.3,
					colorizeAmount: 0,
				},
				ease: Linear.easeOut,
			})
		}
		else if (expanse.phase === 'evening') {
			// do nothing basically
			TweenMax.set(expanse.sun, {
				x: MaxWidth * .65,
				y: MaxWidth * -.8,
			})
			expanse.tweens.sunPosition = delayedCall(phaseDuration, triggerNextPhase)
		}
		else if (expanse.phase === 'night') {
			// do nothing basically
			TweenMax.set(expanse.sun, {
				x: MaxWidth * .65,
				y: MaxWidth * -.8,
			})
			expanse.tweens.sunPosition = delayedCall(phaseDuration, triggerNextPhase)
		}
	}

	function animateMoon() {
		TweenMax.set(expanse.moon, { pixi: { brightness: 1.25 }})
		if (expanse.phase === 'morning') {
			TweenMax.set(expanse.moon, {
				x: MaxWidth * .65,
				y: MaxWidth * -.8,
			})
		}
		else if (expanse.phase === 'evening') {
			TweenMax.set(expanse.moon, {
				x: MaxWidth * .65,
				y: MaxWidth * -.8,
			})
		}
		else if (expanse.phase === 'night') {
			expanse.tweens.moonPosition = TweenMax.to(expanse.moon, phaseDuration, {
				delay: phaseDuration * .25,
				y: MaxWidth * -.8,
				ease: Power2.easeOut,
			})
			TweenMax.set(expanse.moon, {
				x: MaxWidth * .65,
				y: MaxWidth * .5,
				pixi: {
					brightness: 1.25,
					scale: 1.3,
					colorize: 'orange',
					colorizeAmount: 1,
				}
			})
			expanse.tweens.moonBrightness = TweenMax.to(expanse.moon, phaseDuration * .1, {
				delay: phaseDuration * .3,
				pixi: {
					scale: 1,
					colorizeAmount: 0,
				},
				ease: Power2.easeOut,
			})
		}
	}

	function animateClouds() {
		expanse.cloud1.x = 0
		expanse.cloud2.x = MaxWidth
		expanse.tweens.cloud1 = TweenMax.to(expanse.cloud1, cloudSpeed / 2, {
			x: -MaxWidth,
			ease: Linear.easeNone,
			onComplete: function() {
				TweenMax.to(expanse.cloud1, cloudSpeed, {
					startAt: { x: MaxWidth },
					x: -MaxWidth,
					ease: Linear.easeNone,
					repeat: -1
				})
			}
		})

		expanse.tweens.cloud2 = TweenMax.to(expanse.cloud2, cloudSpeed, {
			x: -MaxWidth,
			ease: Linear.easeNone,
			repeat: -1
		})
		if (expanse.phase === 'morning') {
			expanse.tweens.cloudAlpha = TweenMax.to([expanse.cloud1, expanse.cloud2], phaseDuration * .5, {
				startAt: {
					alpha: .6,
					pixi: {
						brightness: .1
					},
				},
				alpha: .85,
				pixi: {
					brightness: 1
				}
			})
		}
		else if (expanse.phase === 'evening') {
			TweenMax.set([expanse.cloud1, expanse.cloud2], {
				alpha: .85,
				pixi: {
					brightness: 1
				},
			})
			expanse.tweens.cloudAlpha = TweenMax.to([expanse.cloud1, expanse.cloud2], phaseDuration * .3, {
				delay: phaseDuration * .3,
				alpha: 0
			})
		}
		else if (expanse.phase === 'night') {
			TweenMax.set([expanse.cloud1, expanse.cloud2], {
				alpha: 0,
				pixi: {
					brightness: .1
				},
			})
			expanse.tweens.cloudAlpha = TweenMax.to([expanse.cloud1, expanse.cloud2], phaseDuration * .2, {
				delay: phaseDuration * .8,
				alpha: .6,
				pixi: {
					brightness: .1
				},
				ease: Linear.easeNone,
			})
		}
	}
	function killAllTweens() {
		for (var key in expanse.tweens) {
			expanse.tweens[key].kill()
		}
	}

	function pixiResizeSky() {
		expanse.sky.view.style.width = window.innerWidth + 'px';
		expanse.sky.view.style.height = ~~(expanse.sky.screen.height / MaxHeight * window.innerHeight) + 'px';
	}
	function resizeAll() {
		pixiResizeSky()
		if (ng.view === 'battle') {
			combat.updateCombatTextLayer()
		}
	}
}(TweenMax, Power2, Expo, Linear, PIXI);