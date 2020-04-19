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
	}
	var w, h, x, y
	var cloudSpeed = 777

	const phaseDuration = 2000 // 20 minutes?
	const maxW = 1920
	const maxH = 1080
	const ratio = maxW / maxH
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
		changePhase()
		startSkyPhase()
	}

	function initPixiElements() {
		if (!env.initialized) {
			env.initialized = true
			cloudSpeed = _.random(450, 1000)
			//TODO: experimental rain, snow
			/*pix.elements = new PIXI.Application({
				width: 1920,
				height: 1920,
				transparent: true
			});
			// style
			pix.elements.view.id = 'pix-elements'
			pix.elements.view.style.position = 'absolute'
			querySelector('#sky-elements').appendChild(pix.elements.view)*/
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

			pix.sky = new PIXI.Application({
				width: 1920,
				height: 517,
				transparent: true
			});
			// style
			pix.sky.view.id = 'pix-sky'
			pix.sky.view.style.position = 'absolute'
			querySelector('#sky-wrap').appendChild(pix.sky.view)

			pix.stars = PIXI.Sprite.from('images/env/stars-2.png')
			pix.sky.stage.addChild(pix.stars)

			pix.sun = PIXI.Sprite.from('images/env/sun-6.png')
			pix.sun.anchor.set(.5)
			pix.sky.stage.addChild(pix.sun)

			TweenMax.to(pix.sun, 1/60, {
				rotation: 360,
				repeat: -1,
				ease: Linear.easeOut
			})

			pix.moon = PIXI.Sprite.from('images/env/moon.png')
			pix.moon.anchor.set(.5)
			pix.sky.stage.addChild(pix.moon)

			pix.cloud1 = PIXI.Sprite.from('images/env/clouds-1.png')
			pix.cloud1.anchor.set(0)
			pix.cloud1.x = 0
			pix.sky.stage.addChild(pix.cloud1)

			pix.cloud2 = PIXI.Sprite.from('images/env/clouds-1.png')
			pix.cloud2.anchor.set(0)
			pix.cloud2.x = 1920
			pix.sky.stage.addChild(pix.cloud2)

			TweenMax.to(pix.cloud1, cloudSpeed / 2, {
				x: -1920,
				ease: Linear.easeNone,
				onComplete: function() {
					TweenMax.to(pix.cloud1, cloudSpeed, {
						startAt: { x: 1920 },
						x: -1920,
						ease: Linear.easeNone,
						repeat: -1
					})
				}
			})

			TweenMax.to(pix.cloud2, cloudSpeed, {
				x: -1920,
				ease: Linear.easeNone,
				repeat: -1
			})

			window.onresize = pixiResizeSky
			pixiResizeSky()
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
				filter: 'saturate(.5) brightness(.5)',
			})
		}
		else if (env.phase === 'night') {
			TweenMax.set('#town-building-wrap', {
				filter: 'saturate(.5) brightness(.5)'
			})
			TweenMax.to('#town-building-wrap', phaseDuration * .2, {
				delay: phaseDuration * .8,
				filter: 'saturate(.66) brightness(.66)',
			})
		}
	}

	function animateStars() {
		if (env.phase === 'morning') {
			TweenMax.to(pix.stars, phaseDuration * .4, {
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
			TweenMax.set(pix.stars, {
				pixi: {
					alpha: 0,
					brightness: 1
				},
			})
			TweenMax.to(pix.stars, phaseDuration * .4, {
				delay: phaseDuration * .6,
				pixi: {
					alpha: 1,
					brightness: 2
				},
			})
		}
		else if (env.phase === 'night') {
			TweenMax.set(pix.stars, {
				pixi: {
					alpha: 1,
					brightness: 2
				},
			})
			TweenMax.to(pix.stars, phaseDuration * .2, {
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
			TweenMax.to(pix.sun, phaseDuration, {
				startAt: {
					x: maxW * .65,
					y: maxW * .5
				},
				y: maxW * -.8,
				ease: Power2.easeOut,
				onComplete: triggerNextPhase
			})

			TweenMax.to(pix.sun, 1/60, {
				rotation: 360,
				repeat: -1,
				ease: Linear.easeOut
			})
		}
		else if (env.phase === 'evening') {
			// do nothing basically
			TweenMax.set(pix.sun, {
				x: maxW * .65,
				y: maxW * -.8,
			})
			delayedCall(phaseDuration, triggerNextPhase)
		}
		else if (env.phase === 'night') {
			// do nothing basically
			TweenMax.set(pix.sun, {
				x: maxW * .65,
				y: maxW * -.8,
			})
			delayedCall(phaseDuration, triggerNextPhase)
		}
	}

	function animateMoon() {
		if (env.phase === 'morning') {
			TweenMax.set(pix.moon, {
				x: maxW * .65,
				y: maxW * -.8,
			})
		}
		else if (env.phase === 'evening') {
			TweenMax.set(pix.moon, {
				x: maxW * .65,
				y: maxW * -.8,
			})
		}
		else if (env.phase === 'night') {
			TweenMax.set(pix.moon, {
				x: maxW * .65,
				y: maxW * .5
			})
			TweenMax.to(pix.moon, phaseDuration, {
				delay: phaseDuration / 4,
				y: maxW * -.8,
				ease: Power2.easeOut,
			})
		}
	}

	function animateClouds() {
		if (env.phase === 'morning') {
			TweenMax.to([pix.cloud1, pix.cloud2], phaseDuration / 2, {
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
			TweenMax.set([pix.cloud1, pix.cloud2], {
				alpha: .85,
				pixi: {
					brightness: 1
				},
			})
			TweenMax.to([pix.cloud1, pix.cloud2], phaseDuration * .3, {
				delay: phaseDuration * .3,
				alpha: 0
			})
		}
		else if (env.phase === 'night') {
			TweenMax.set([pix.cloud1, pix.cloud2], {
				alpha: 0,
				pixi: {
					brightness: .1
				},
			})
			TweenMax.to([pix.cloud1, pix.cloud2], phaseDuration * .2, {
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
		// wider than default ratio
		w = window.innerHeight * ratio;
		h = window.innerHeight;
		pix.sky.view.style.width = window.innerWidth + 'px';
		pix.sky.view.style.height = ~~(pix.sky.screen.height / maxH * window.innerHeight) + 'px';
	}
}(TweenMax, Power2, Expo, Linear, PIXI);