var env;
!function(TweenMax, Power2, Expo, Linear, PIXI, undefined) {
	env = {
		startSkyPhase,
		phase: 'morning',
		sky: {},
		elements: {},
		stars: {},
		sun: {},
		moon: {},
		cloud1: {},
		cloud2: {},
		initialized: false,
		aspectRatio: 0,
		resizeAll,
		maxWidth: 1920,
		maxHeight: 1080,
	}

	var cloudSpeed = 777
	const phaseDuration = 2000 // 20 minutes?
	env.aspectRatio = env.maxWidth / env.maxHeight
	determineStartingPhase()
	//////////////////////////////

	function determineStartingPhase() {
		var n = new Date().getMinutes();
		if (n < 20) env.phase = 'morning'
		else if (n < 40) env.phase = 'evening'
		else env.phase = 'night'
	}

	function startSkyPhase() {
		console.warn('//////////////////////////////////////////////////////')
		console.warn('startSkyPhase', env.phase)
		initPixiElements()
		animateSky()
		animateBuildings()
		animateStars()
		animateSun()
		animateMoon()
		animateClouds()
	}
	function changePhase() {
		if (env.phase === 'morning') env.phase = 'evening'
		else if (env.phase === 'evening') env.phase = 'night'
		else env.phase = 'morning'
	}

	function triggerNextPhase() {
		cloudSpeed = _.random(1000, 2500)
		changePhase()
		startSkyPhase()
	}

	function initPixiElements() {
		if (!env.initialized) {
			env.initialized = true
			cloudSpeed = _.random(500, 2500)
			//TODO: experimental rain, snow
			/*env.elements = new PIXI.Application({
				width: 1920,
				height: 1920,
				transparent: true
			});
			// style
			env.elements.view.id = 'pix-elements'
			env.elements.view.style.position = 'absolute'
			querySelector('#sky-elements').appendChild(env.elements.view)*/
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

			env.sky = new PIXI.Application({
				width: 1920,
				height: 517,
				transparent: true
			});
			// style
			env.sky.view.id = 'pix-sky'
			env.sky.view.style.position = 'absolute'
			querySelector('#sky-wrap').appendChild(env.sky.view)

			env.stars = PIXI.Sprite.from('images/env/stars-2.png')
			env.sky.stage.addChild(env.stars)

			env.sun = PIXI.Sprite.from('images/env/sun-6.png')
			env.sun.anchor.set(.5)
			env.sky.stage.addChild(env.sun)

			TweenMax.set(env.sun, { pixi: { brightness: 1.2 }})
			/*TweenMax.to(env.sun, 1/60, {
				rotation: 360,
				repeat: -1,
				ease: Linear.easeOut
			})*/

			env.moon = PIXI.Sprite.from('images/env/moon.png')
			env.moon.anchor.set(.5)
			env.sky.stage.addChild(env.moon)
			TweenMax.set(env.moon, { pixi: { brightness: 1.25 }})

			env.cloud1 = PIXI.Sprite.from('images/env/clouds-1.png')
			env.cloud1.anchor.set(0)
			env.cloud1.x = 0
			env.sky.stage.addChild(env.cloud1)

			env.cloud2 = PIXI.Sprite.from('images/env/clouds-1.png')
			env.cloud2.anchor.set(0)
			env.cloud2.x = 1920
			env.sky.stage.addChild(env.cloud2)

			TweenMax.to(env.cloud1, cloudSpeed / 2, {
				x: -1920,
				ease: Linear.easeNone,
				onComplete: function() {
					TweenMax.to(env.cloud1, cloudSpeed, {
						startAt: { x: 1920 },
						x: -1920,
						ease: Linear.easeNone,
						repeat: -1
					})
				}
			})

			TweenMax.to(env.cloud2, cloudSpeed, {
				x: -1920,
				ease: Linear.easeNone,
				repeat: -1
			})

			window.onresize = resizeAll

		}
	}

	function animateSky() {
		// sky, stars, building
		if (env.phase === 'morning') {
			const skyProps = {
				topR: 0,
				topG: 0,
				topB: 48,
				bottomR: 140,
				bottomG: 130,
				bottomB: 160,
			}
			TweenMax.to(skyProps, phaseDuration * .4, {
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
		else if (env.phase === 'evening') {
			const skyProps = {
				topR: 0, // 05b
				topG: 80,
				topB: 192,
				bottomR: 180, // aef
				bottomG: 240,
				bottomB: 255,
			}
			setSky(skyProps)
			TweenMax.to(skyProps, phaseDuration * .4, {
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
		else if (env.phase === 'night') {
			const skyProps = {
				topR: 0, // 05b
				topG: 0,
				topB: 16,
				bottomR: 0, // aef
				bottomG: 0,
				bottomB: 0,
			}
			setSky(skyProps)
			TweenMax.to(skyProps, phaseDuration * .2, {
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
		// warn('animateBuildings')
		if (env.phase === 'morning') {
			TweenMax.to('#town-building-wrap', phaseDuration * .2, {
				startAt: {
					filter: 'saturate(.66) brightness(.66)'
				},
				filter: 'saturate(1) brightness(1)',
				ease: Power2.easeOut
			})
		}
		else if (env.phase === 'evening') {
			TweenMax.set('#town-building-wrap', {
				filter: 'saturate(1) brightness(1)'
			})
			TweenMax.to('#town-building-wrap', phaseDuration * .4, {
				delay: phaseDuration * .6,
				filter: 'saturate(.7) brightness(.7)',
			})
		}
		else if (env.phase === 'night') {
			TweenMax.set('#town-building-wrap', {
				filter: 'saturate(.7) brightness(.7)'
			})
			TweenMax.to('#town-building-wrap', phaseDuration * .2, {
				delay: phaseDuration * .8,
				filter: 'saturate(.85) brightness(.85)',
			})
		}
	}

	function animateStars() {
		if (env.phase === 'morning') {
			TweenMax.to(env.stars, phaseDuration * .4, {
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
		else if (env.phase === 'evening') {
			TweenMax.set(env.stars, {
				pixi: {
					alpha: 0,
					brightness: 1
				},
			})
			TweenMax.to(env.stars, phaseDuration * .4, {
				delay: phaseDuration * .6,
				pixi: {
					alpha: 1,
					brightness: 2
				},
			})
		}
		else if (env.phase === 'night') {
			TweenMax.set(env.stars, {
				pixi: {
					alpha: 1,
					brightness: 2
				},
			})
			TweenMax.to(env.stars, phaseDuration * .2, {
				delay: phaseDuration * .8,
				pixi: {
					alpha: 1,
					brightness: 1.25
				}
			})
		}
	}

	function animateSun() {
		if (env.phase === 'morning') {
			TweenMax.to(env.sun, phaseDuration, {
				startAt: {
					x: env.maxWidth * .65,
					y: env.maxWidth * .5,
				},
				y: env.maxWidth * -.8,
				ease: Power2.easeOut,
				onComplete: triggerNextPhase
			})
			TweenMax.set(env.sun, {
				pixi: {
					colorize: 'orange',
					scale: 1.4,
					brightness: 1,
					saturation: 1,
					colorizeAmount: 1,
				}
			})
			TweenMax.to(env.sun, phaseDuration * .05, {
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
		else if (env.phase === 'evening') {
			// do nothing basically
			TweenMax.set(env.sun, {
				x: env.maxWidth * .65,
				y: env.maxWidth * -.8,
			})
			delayedCall(phaseDuration, triggerNextPhase)
		}
		else if (env.phase === 'night') {
			// do nothing basically
			TweenMax.set(env.sun, {
				x: env.maxWidth * .65,
				y: env.maxWidth * -.8,
			})
			delayedCall(phaseDuration, triggerNextPhase)
		}
	}

	function animateMoon() {
		if (env.phase === 'morning') {
			TweenMax.set(env.moon, {
				x: env.maxWidth * .65,
				y: env.maxWidth * -.8,
			})
		}
		else if (env.phase === 'evening') {
			TweenMax.set(env.moon, {
				x: env.maxWidth * .65,
				y: env.maxWidth * -.8,
			})
		}
		else if (env.phase === 'night') {
			TweenMax.to(env.moon, phaseDuration, {
				delay: phaseDuration * .25,
				y: env.maxWidth * -.8,
				ease: Power2.easeOut,
			})
			TweenMax.set(env.moon, {
				x: env.maxWidth * .65,
				y: env.maxWidth * .5,
				pixi: {
					brightness: 1.25,
					scale: 1.3,
					colorize: 'orange',
					colorizeAmount: 1,
				}
			})
			TweenMax.to(env.moon, phaseDuration * .1, {
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
		if (env.phase === 'morning') {
			TweenMax.to([env.cloud1, env.cloud2], phaseDuration * .5, {
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
		else if (env.phase === 'evening') {
			TweenMax.set([env.cloud1, env.cloud2], {
				alpha: .85,
				pixi: {
					brightness: 1
				},
			})
			TweenMax.to([env.cloud1, env.cloud2], phaseDuration * .3, {
				delay: phaseDuration * .3,
				alpha: 0
			})
		}
		else if (env.phase === 'night') {
			TweenMax.set([env.cloud1, env.cloud2], {
				alpha: 0,
				pixi: {
					brightness: .1
				},
			})
			TweenMax.to([env.cloud1, env.cloud2], phaseDuration * .2, {
				delay: phaseDuration * .8,
				alpha: .6,
				pixi: {
					brightness: .1
				},
				ease: Linear.easeNone,
			})
		}
	}

	function pixiResizeSky() {
		env.sky.view.style.width = window.innerWidth + 'px';
		env.sky.view.style.height = ~~(env.sky.screen.height / env.maxHeight * window.innerHeight) + 'px';
	}
	function resizeAll() {
		pixiResizeSky()
		if (ng.view === 'battle') {
			combat.updateCombatTextLayer()
		}
	}
}(TweenMax, Power2, Expo, Linear, PIXI);