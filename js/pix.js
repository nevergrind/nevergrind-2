var pix
!function(PIXI, _, $, Linear, Power1, Power2, Power3, Power4, window, TweenMax, undefined) {
	pix = {
		sky: {},
		getId,
		animateTownSky,
	}
	var w, h, x, y
	var skyDur = 777

	const maxW = 1920
	const maxH = 1080
	const ratio = maxW / maxH
	//////////////////////////////
	/**
	 * TweenMax Pixi Plugin examples
	 * combineCMF: true - retains previous filter settings
	 * TweenLite.to(image, 1, {pixi:{colorize:"red", colorizeAmount:1}});
	 * TweenLite.to(image, 1, {pixi:{saturation:0}});
	 * TweenLite.to(image, 1, {pixi:{hue:180}});
	 * TweenLite.to(image, 1, {pixi:{brightness:3}});
	 * TweenLite.to(image, 1, {pixi:{contrast:3}});
	 * TweenLite.to(image, 1, {pixi:{blur:20}});
	 * TweenLite.to(image, 1, {pixi:{colorMatrixFilter:null, blur:0}}); (reset)
	 * @param el
	 * @param id
	 * @returns {*|Mixed}
	 */

	function getId(el, id) {
		console.info('getId', el)
		return _.find(el.stage.children, {
			id: id
		})
	}

	function animateTownSky() {
		skyDur = _.random(450, 1000)
		pix.sky = new PIXI.Application({
			width: 1920,
			height: 517,
			transparent: true
		});

		// style
		pix.sky.view.id = 'pix-sky'
		pix.sky.view.style.position = 'absolute'

		querySelector('#town-wrap')
			.insertBefore(pix.sky.view, querySelector('#town-building-wrap'))

		const sun = PIXI.Sprite.from('images/env/sun-5.png')
		sun.anchor.set(.5)
		pix.sky.stage.addChild(sun)

		TweenMax.to(sun, town.sunDuration, {
			startAt: {
				x: maxW * .65,
				y: maxW * .5
			},
			y: maxW * -.8,
			ease: Power2.easeOut
		})

		TweenMax.to(sun, 1/60, {
			rotation: 360,
			repeat: -1,
			ease: Linear.easeOut
		})

		const cloud1 = PIXI.Sprite.from('images/town/town-clouds-1.png')
		cloud1.anchor.set(0)
		cloud1.x = 0
		pix.sky.stage.addChild(cloud1)

		TweenMax.to(cloud1, skyDur / 2, {
			x: -1920,
			ease: Linear.easeNone,
			onComplete: function() {
				TweenMax.to(cloud1, skyDur, {
					startAt: { x: 1920 },
					x: -1920,
					ease: Linear.easeNone,
					repeat: -1
				})
			}
		})

		const cloud2 = PIXI.Sprite.from('images/town/town-clouds-1.png')
		cloud2.anchor.set(0)
		cloud2.x = 1920
		pix.sky.stage.addChild(cloud2);

		TweenMax.to(cloud2, skyDur, {
			x: -1920,
			ease: Linear.easeNone,
			repeat: -1
		})

		TweenMax.to([cloud1, cloud2], skyDur / 2, {
			startAt: {
				alpha: .6,
				pixi: {
					saturation: .1,
					brightness: .1
				},
			},
			alpha: .85,
			pixi: {
				saturation: 1,
				brightness: 1
			},
			ease: Power2.easeOut
		})

		window.onresize = pixiResizeSky
		pixiResizeSky()
	}
	function pixiResizeSky() {
		// wider than default ratio
		w = window.innerHeight * ratio;
		h = window.innerHeight;
		pix.sky.view.style.width = window.innerWidth + 'px';
		pix.sky.view.style.height = ~~(pix.sky.screen.height / maxH * window.innerHeight) + 'px';
	}
}(PIXI, _, $, Linear, Power1, Power2, Power3, Power4, window, TweenMax);