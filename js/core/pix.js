var pix
!function(PIXI, _, $, Linear, Power1, Power2, Power3, Power4, window, TweenMax, Expo, undefined) {
	pix = {
		sky: {},
		getId,
	}
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
	 * TweenLite.to(image, 1, {pixi:{tint:'#f00'}});
	 * @param el
	 * @param id
	 * @returns {*|Mixed}
	 */
	/*
	mobs[2].sprite.filters = [
		new PIXI.filters.GlowFilter({
			distance: 15,
			outerStrength: 2,
			color: 0x00ff00,
			knockout: true
		})
	]
	mobs[2].sprite.filters = [ new PIXI.filters.AdvancedBloomFilter() ]
	mobs[2].sprite.filters = [new PIXI.filters.AsciiFilter(2)]
	mobs[2].sprite.filters = [new PIXI.filters.BevelFilter()]
	mobs[2].sprite.filters = [new PIXI.filters.BlurFilter()]
	mobs[2].sprite.filters = [new PIXI.filters.BulgePinchFilter()]
	mobs[2].sprite.filters = [new PIXI.filters.GlitchFilter({
		slices: 15,
		offset: 10,
		direction: 0,
		fillMode: 2,
		average: true,
		red: [-10, 10],
		green: [-10, 10],
		blue: [-10, -10],
		seed: 0.5
	})]
	mobs[2].sprite.filters = [new PIXI.filters.GlowFilter({
		innerStrength: 15,
		outerStrength: 15
	})]
	mobs[2].sprite.filters = [new PIXI.filters.OutlineFilter(1)]
	mobs[2].sprite.filters = [new PIXI.filters.ReflectionFilter()]
	mobs[2].sprite.filters = [new PIXI.filters.ZoomBlurFilter(
		.1,
		[mobs[2].sprite._width * .5, mobs[2].sprite._height * .5],
		0,
		200
	)]


	mobs[2].sprite.filters = [new PIXI.filters.GlowFilter({ distance: 15, outerStrength: 2 })];
	mobs[2].sprite.filters = [new PIXI.filters.NoiseFilter(.5)]

	mobs[2].sprite.filters = [noiseFilter]
	var filter = new PIXI.filters.ColorMatrixFilter();
	filter.sepia();
	TweenMax.to(image, 2, { pixi: { colorMatrixFilter: filter } });


	//blur on both the x and y axis to a blur amount of 15
	TweenMax.to(image, 2, { pixi: { blurX: 15, blurY: 15 } });

	TweenLite.to(image, 1, {pixi:{colorize:"red", colorizeAmount:1}});

	TweenLite.to(image, 1, {pixi:{saturation:0}});

	TweenLite.to(image, 1, {pixi:{hue:180}});
	combineCMF: true/false

	TweenLite.to(image, 1, {pixi:{colorMatrixFilter:null, blur:0}});

	TweenMax.set(pix.moon, {
		y: 100,
		pixi: {
			saturation: 1,
			brightness: 1,
			colorize: "red",
			colorizeAmount: 1,
		}
	});
	var filter = new PIXI.filters.ColorMatrixFilter();
	filter.sepia();

	colorBunny.tint = `0x${Math.floor(Math.random() * 16777215).toString(16)}`;

	TweenMax.to(bunny3, time, {
		pixi: { tint: 'rgb(0,0,255)' }, repeat: -1, yoyo: true,
	});

	gsap.to(bunny3.scale, {
		x: 2.0, y: 2.0, duration: time, repeat: -1, yoyo: true,
	});

	gsap.to(bunny4, {
		rotation: 2 * Math.PI, duration: time, repeat: -1, yoyo: true,
	});
	TweenMax.set(pix.moon, {
		y: 100,
		pixi: {
			scale: 1.2,
			rotation: 90,
			colorize: 'orange',
			colorizeAmount: 1,
		}
	});
	*/
	function getId(el, id) {
		// example: pix.getId(pix.sky, 'test')
		// console.info('getId', el)
		return _.find(el.stage.children, {
			id: id
		})
	}
}(PIXI, _, $, Linear, Power1, Power2, Power3, Power4, window, TweenMax, Expo);